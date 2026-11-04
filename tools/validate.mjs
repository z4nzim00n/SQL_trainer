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

/* Тот же контракт, что у браузерного движка: run(dataset, variant, sql) */
async function run(dataset, variant, sql) {
    const r = psql(`BEGIN;\nSET LOCAL search_path TO ${dataset}_${variant};\n${sql}\n;\nROLLBACK;`);
    if (r.status !== 0) {
        const m = (r.stderr || '').match(/ERROR:\s*([\s\S]*?)(?:\nLINE|\n?$)/);
        return { error: (m ? m[1] : r.stderr).trim() };
    }
    const table = parseCsv(r.stdout);
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

console.log(failed ? `\nПровалено: ${failed}` : '\nВсё хорошо.');
process.exit(failed ? 1 : 0);
