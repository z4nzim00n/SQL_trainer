#!/usr/bin/env node
/*
 * Собирает tasks.json из папок tasks/ и data/.
 *
 * Запуск:  node tools/build.mjs
 *
 * Структура задания (tasks/dayNN/exNN_name/):
 *   README.md              условие
 *   theory.md              короткая теория без решения
 *   hints.md               подсказки по нарастающей: каждая начинается с "## Заголовок"
 *   solution.sql           эталон (на нём проверяются ответы)
 *   solution_commented.sql эталон с комментариями
 *   meta.json              title, dataset, ordered, forbidden, required, negative[]
 *
 * В папке дня лежит day.json: { "title": "..." }.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (...p) => readFileSync(join(root, ...p), 'utf8');
const dirs = (p) =>
    readdirSync(join(root, p))
        .filter((n) => statSync(join(root, p, n)).isDirectory())
        .sort();

/* Подсказки: "## Заголовок" начинает новую подсказку */
function parseHints(md) {
    const hints = [];
    let cur = null;
    for (const line of md.split('\n')) {
        const m = line.match(/^##\s+(.*)$/);
        if (m) {
            cur = { title: m[1].trim(), body: '' };
            hints.push(cur);
        } else if (cur) {
            cur.body += line + '\n';
        }
    }
    return hints.map((h) => ({ title: h.title, body: h.body.trim() }));
}

/* Наборы данных находятся автоматически: data/<имя>.sql, data/<имя>_alt.sql (необязательно), data/<имя>_schema.md (необязательно) */
const datasets = {};
const dataFiles = readdirSync(join(root, 'data'));
for (const f of dataFiles.sort()) {
    const m = f.match(/^([a-z0-9]+)\.sql$/);
    if (!m) continue;
    const name = m[1];
    const main = read('data', f);
    const altFile = `${name}_alt.sql`;
    const schemaFile = `${name}_schema.md`;
    datasets[name] = {
        main,
        alt: dataFiles.includes(altFile) ? main + '\n' + read('data', altFile) : main,
        schema: dataFiles.includes(schemaFile) ? read('data', schemaFile) : '',
    };
}

const days = [];
for (const dayDir of dirs('tasks')) {
    const dayMeta = JSON.parse(read('tasks', dayDir, 'day.json'));
    const tasks = [];
    for (const taskDir of dirs(join('tasks', dayDir))) {
        const base = join('tasks', dayDir, taskDir);
        const meta = JSON.parse(read(base, 'meta.json'));
        const optional = (f) => (existsSync(join(root, base, f)) ? read(base, f) : '');
        tasks.push({
            id: `${dayDir}/${taskDir.split('_')[0]}`,
            dir: taskDir,
            title: meta.title,
            readme: read(base, 'README.md'),
            theory: read(base, 'theory.md'),
            hints: parseHints(optional('hints.md')),
            solution: read(base, 'solution.sql').trim(),
            solutionCommented: optional('solution_commented.sql').trim(),
            meta,
        });
    }
    days.push({ id: dayDir, title: dayMeta.title, tasks });
}

const out = { version: '0.001', builtAt: new Date().toISOString(), datasets, days };
writeFileSync(join(root, 'tasks.json'), JSON.stringify(out, null, 1));
const count = days.reduce((n, d) => n + d.tasks.length, 0);
console.log(`tasks.json: дней ${days.length}, заданий ${count}`);
