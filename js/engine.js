/*
 * Движок БД в браузере: настоящий PostgreSQL (PGlite, WebAssembly).
 * Каждый набор данных живёт в своей схеме: <dataset>_main и <dataset>_alt.
 * Запрос ученика выполняется внутри транзакции, которая всегда откатывается,
 * поэтому DROP/DELETE/UPDATE не ломают данные для следующих проверок.
 */
import { normalizeCell } from './checker.js';

/* Версия 0.3.x; браузерный ES-модуль подтягивает .wasm рядом с собой */
export const PGLITE_URL = 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.3/dist/index.js';

/* Запасные источники, если основной CDN недоступен (пробуются по очереди) */
const PGLITE_SOURCES = [PGLITE_URL, 'https://esm.sh/@electric-sql/pglite@0.3'];

async function loadPglite() {
    const failures = [];
    for (const url of PGLITE_SOURCES) {
        try {
            const mod = await import(url);
            if (mod && mod.PGlite) return mod.PGlite;
            failures.push(`${url}: в модуле нет PGlite`);
        } catch (e) {
            failures.push(`${url}: ${(e && e.message) || e}`);
        }
    }
    throw new Error('не удалось загрузить PGlite. ' + failures.join(' | '));
}

/* Даты оставляем строками, чтобы не зависеть от часовых поясов */
const RAW_PARSERS = { 1082: (v) => v, 1114: (v) => v, 1184: (v) => v };

function cleanError(e) {
    const msg = (e && e.message) || String(e);
    return msg.replace(/^error: /i, '');
}

export async function createEngine(datasets, onStatus = () => {}) {
    onStatus('Загружаю PostgreSQL (WebAssembly), это несколько МБ при первом запуске…');
    const PGlite = await loadPglite();
    const db = new PGlite();
    await db.waitReady;

    onStatus('Создаю таблицы и данные…');
    for (const [name, sets] of Object.entries(datasets)) {
        for (const variant of ['main', 'alt']) {
            const schema = `${name}_${variant}`;
            await db.exec(`CREATE SCHEMA ${schema}; SET search_path TO ${schema};\n${sets[variant]}`);
        }
    }
    await db.exec('SET search_path TO public');

    /* Выполняет запрос, возвращает последнюю таблицу результата */
    async function run(dataset, variant, sql) {
        const schema = `${dataset}_${variant}`;
        try {
            await db.exec('BEGIN');
            await db.exec(`SET LOCAL search_path TO ${schema}`);
            const results = await db.exec(sql, { rowMode: 'array', parsers: RAW_PARSERS });
            const last = [...results].reverse().find((r) => r.fields && r.fields.length > 0);
            if (!last) return { columns: [], rows: [], noResult: true };
            const columns = last.fields.map((f) => f.name);
            const rows = last.rows.map((row) =>
                (Array.isArray(row) ? row : columns.map((c) => row[c])).map(normalizeCell)
            );
            return { columns, rows };
        } catch (e) {
            return { error: cleanError(e) };
        } finally {
            try { await db.exec('ROLLBACK'); } catch (_) { /* транзакции может уже не быть */ }
        }
    }

    onStatus('');
    return { run };
}
