#!/usr/bin/env node
/*
 * Проверяет сами задания на настоящем PostgreSQL через psql:
 *   1) каждое эталонное решение проходит свою же проверку;
 *   2) каждое "неверное" решение из meta.json (negative) отклоняется.
 *
 * Запуск (нужны psql и пустая база):
 *   PGHOST=localhost PGUSER=postgres PGDATABASE=trainer_test node tools/validate.mjs
 *
 * Скрипт сам создаёт схемы <dataset>_main и <dataset>_alt и пересоздаёт их при каждом запуске.
 */
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCheck, normalizeCell } from '../js/checker.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'tasks.json'), 'utf8'));
const NULL_MARK = '\u0001NULL\u0001';

function psql(script) {
    const r = spawnSync(
        'psql',
        ['-X', '-q', '--csv', '-v', 'ON_ERROR_STOP=1', '-P', `null=${NULL_MARK}`, '-f', '-'],
        { input: script, encoding: 'utf8' }
    );
    return r;
}

/* Минимальный разбор CSV (кавычки, переносы строк внутри кавычек) */
function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let q = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (q) {
            if (c === '"') {
                if (text[i + 1] === '"') { cell += '"'; i++; } else q = false;
            } else cell += c;
        } else if (c === '"') q = true;
        else if (c === ',') { row.push(cell); cell = ''; }
        else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
        else if (c !== '\r') cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows;
}

/* Подготовка схем */
for (const [name, sets] of Object.entries(data.datasets)) {
    for (const variant of ['main', 'alt']) {
        const schema = `${name}_${variant}`;
        const r = psql(`DROP SCHEMA IF EXISTS ${schema} CASCADE; CREATE SCHEMA ${schema}; SET search_path TO ${schema};\n${sets[variant]}`);
        if (r.status !== 0) {
            console.error(`Не удалось создать схему ${schema}:\n${r.stderr}`);
            process.exit(2);
        }
    }
}

/* Делит скрипт на отдельные команды (учитывает строки, комментарии и $$-блоки) */
function splitStatements(sql) {
    const out = [];
    let cur = '';
    let i = 0;
    while (i < sql.length) {
        const c = sql[i];
        const n = sql[i + 1];
        if (c === '-' && n === '-') {
            const e = sql.indexOf('\n', i);
            const end = e < 0 ? sql.length : e;
            cur += sql.slice(i, end);
            i = end;
        } else if (c === '/' && n === '*') {
            const e = sql.indexOf('*/', i + 2);
            const end = e < 0 ? sql.length : e + 2;
            cur += sql.slice(i, end);
            i = end;
        } else if (c === "'" || c === '"') {
            let j = i + 1;
            while (j < sql.length) {
                if (sql[j] === c) { if (sql[j + 1] === c) { j += 2; continue; } break; }
                j++;
            }
            cur += sql.slice(i, j + 1);
            i = j + 1;
        } else if (c === '$') {
            const m = sql.slice(i).match(/^\$[A-Za-z_0-9]*\$/);
            if (m) {
                const e = sql.indexOf(m[0], i + m[0].length);
                const end = e < 0 ? sql.length : e + m[0].length;
                cur += sql.slice(i, end);
                i = end;
            } else { cur += c; i++; }
        } else if (c === ';') {
            if (cur.trim()) out.push(cur.trim());
            cur = '';
            i++;
        } else { cur += c; i++; }
    }
    if (cur.trim()) out.push(cur.trim());
    return out.filter((st) => st.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, '').trim());
}

const MARK = '@@@RESULT@@@';

/* Тот же контракт, что у браузерного движка: run(dataset, variant, sql); результат = последняя таблица */
async function run(dataset, variant, sql) {
    const stmts = splitStatements(sql).map((st) => `\\echo ${MARK}\n${st};`).join('\n');
    const r = psql(`BEGIN;\nSET LOCAL search_path TO ${dataset}_${variant};\n${stmts}\n\\echo ${MARK}\nROLLBACK;`);
    if (r.status !== 0) {
        const m = (r.stderr || '').match(/ERROR:\s*([\s\S]*?)(?:\nLINE|\n?$)/);
        return { error: (m ? m[1] : r.stderr).trim() };
    }
    const chunks = r.stdout.split(MARK).map((c) => c.replace(/^\r?\n/, '')).filter((c) => c.trim());
    const last = chunks[chunks.length - 1];
    if (!last) return { columns: [], rows: [], noResult: true };
    const table = parseCsv(last);
    if (!table.length) return { columns: [], rows: [], noResult: true };
    const [columns, ...rows] = table;
    return { columns, rows: rows.map((row) => row.map((c) => (c === NULL_MARK ? null : normalizeCell(c)))) };
}

let failed = 0;
const ok = (msg) => console.log(`  ✓ ${msg}`);
const bad = (msg) => { failed++; console.log(`  ✗ ${msg}`); };

for (const day of data.days) {
    for (const task of day.tasks) {
        console.log(`${task.id}  ${task.title}`);
        if (task.meta.manual) { ok('ручное задание: автопроверки нет'); continue; }

        const v = await runCheck({ run, task, sql: task.solution });
        if (v.status === 'pass') ok('эталон проходит свою проверку');
        else bad(`эталон НЕ проходит: ${v.headline}: ${v.details.join(' | ')}`);

        if (task.solutionCommented) {
            const vc = await runCheck({ run, task, sql: task.solutionCommented });
            if (vc.status === 'pass') ok('solution_commented проходит проверку');
            else bad(`solution_commented НЕ проходит: ${vc.headline}: ${vc.details.join(' | ')}`);
        }

        for (const [i, pos] of (task.meta.positive || []).entries()) {
            const vp = await runCheck({ run, task, sql: pos.sql });
            if (vp.status === 'pass') ok(`другой верный способ №${i + 1} проходит (${pos.why || ''})`);
            else bad(`другой верный способ №${i + 1} НЕ проходит: ${vp.headline}: ${vp.details.join(' | ')}`);
        }

        for (const [i, neg] of (task.meta.negative || []).entries()) {
            const vn = await runCheck({ run, task, sql: neg.sql });
            if (vn.status === 'fail' || vn.status === 'error') {
                ok(`неверное решение №${i + 1} отклонено (${neg.why || vn.headline})`);
                if (process.argv.includes('--verbose')) console.log(`      → ${vn.headline}\n        ${vn.details.join('\n        ')}`);
            }
            else bad(`неверное решение №${i + 1} ПРОШЛО проверку: ${neg.sql.replace(/\s+/g, ' ')}`);
        }
    }
}

/* Примеры ```sql-run в теории и энциклопедии должны выполняться без ошибок на обоих наборах данных */
console.log('Примеры sql-run');
const blocks = [];
/* ```sql-run выполняется на учебных мини-таблицах (demo), ```sql-pizza на базе пиццерий */
const collect = (where, md) => {
    for (const m of md.matchAll(/```(sql-run|sql-pizza)\n([\s\S]*?)```/g)) blocks.push({ where, sql: m[2].trim(), dataset: m[1] === 'sql-run' ? 'demo' : 'pizza' });
};
for (const a of data.wiki || []) collect(a.id, a.md);
for (const day of data.days) for (const t of day.tasks) { collect(t.id + ' readme', t.readme); collect(t.id + ' theory', t.theory); }
for (const g of Object.values(data.glossary || {})) if (g.sql) blocks.push({ where: 'glossary ' + g.title, sql: g.sql, dataset: 'demo' });
for (const [k, g] of Object.entries(data.glossary || {})) if (g.sql) blocks.push({ where: 'glossary ' + k, sql: g.sql, dataset: 'demo' });
let runOk = 0;
for (const b of blocks) {
    for (const variant of ['main', 'alt']) {
        const r = await run(b.dataset, variant, b.sql);
        if (r.error) bad(`${b.where} (${variant}): ${r.error}\n      ${b.sql.replace(/\s+/g, ' ').slice(0, 140)}`);
        else if (variant === 'main') runOk++;
    }
}
ok(`выполняется примеров: ${runOk} из ${blocks.length}`);

console.log(failed ? `\nПровалено: ${failed}` : '\nВсё хорошо.');
process.exit(failed ? 1 : 0);
