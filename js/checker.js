/*
 * Общий модуль проверки решений.
 * Работает и в браузере, и в Node: не зависит от DOM и от конкретного движка БД.
 * Движок передаётся снаружи как функция run(dataset, variant, sql).
 */

/* Основной набор данных и скрытый (чуть изменённые данные) */
export const VARIANTS = ['main', 'alt'];

/* Приводим значение ячейки к строке (null остаётся null), чтобы сравнение не зависело от движка */
export function normalizeCell(v) {
    if (v === null || v === undefined) return null;
    if (v instanceof Date) {
        const iso = v.toISOString();
        return iso.endsWith('T00:00:00.000Z') ? iso.slice(0, 10) : iso;
    }
    if (typeof v === 'bigint') return v.toString();
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
}

/* Убираем комментарии и строки, чтобы запрещённые слова искались только в самом коде */
export function stripSql(sql) {
    let out = '';
    let i = 0;
    while (i < sql.length) {
        const c = sql[i];
        const n = sql[i + 1];
        if (c === '-' && n === '-') {
            while (i < sql.length && sql[i] !== '\n') i++;
            out += ' ';
        } else if (c === '/' && n === '*') {
            const end = sql.indexOf('*/', i + 2);
            i = end < 0 ? sql.length : end + 2;
            out += ' ';
        } else if (c === "'") {
            i++;
            while (i < sql.length) {
                if (sql[i] === "'") {
                    if (sql[i + 1] === "'") { i += 2; continue; }
                    i++;
                    break;
                }
                i++;
            }
            out += " '' ";
        } else if (c === '"') {
            i++;
            while (i < sql.length && sql[i] !== '"') i++;
            i++;
            out += ' "" ';
        } else {
            out += c;
            i++;
        }
    }
    return out;
}

function hasWord(text, phrase) {
    const body = phrase
        .trim()
        .split(/\s+/)
        .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('\\s+');
    return new RegExp('(^|[^A-Za-z0-9_])' + body + '($|[^A-Za-z0-9_])', 'i').test(text);
}

/* Запреты и обязательные конструкции из meta.json задания */
export function staticCheck(sql, meta = {}) {
    const text = stripSql(sql);
    const problems = [];
    for (const w of meta.forbidden || []) {
        if (hasWord(text, w)) problems.push(`В задании запрещено использовать: ${w}.`);
    }
    for (const w of meta.required || []) {
        if (!hasWord(text, w)) problems.push(`В задании нужно использовать: ${w}.`);
    }
    return problems;
}

const fmtRow = (row) => '(' + row.map((c) => (c === null ? 'NULL' : c)).join(', ') + ')';
const keyOf = (row) => JSON.stringify(row);

function countRows(rows) {
    const m = new Map();
    for (const r of rows) m.set(keyOf(r), (m.get(keyOf(r)) || 0) + 1);
    return m;
}

function sample(rows, n = 3) {
    const head = rows.slice(0, n).map(fmtRow).join('; ');
    return rows.length > n ? `${head} (и ещё ${rows.length - n})` : head;
}

/* Сравнивает результат ученика с эталонным. Возвращает список различий (пустой = совпало) */
export function compareResults(user, ref, meta = {}) {
    const diffs = [];
    const uc = user.columns.map((c) => c.toLowerCase());
    const rc = ref.columns.map((c) => c.toLowerCase());

    if (uc.length !== rc.length) {
        diffs.push(`Число столбцов: нужно ${rc.length} (${rc.join(', ')}), у тебя ${uc.length} (${uc.join(', ')}).`);
        return diffs;
    }
    if (meta.checkColumns !== false && uc.some((c, i) => c !== rc[i])) {
        diffs.push(`Названия столбцов: нужно ${rc.join(', ')}, у тебя ${uc.join(', ')}.`);
    }

    const um = countRows(user.rows);
    const rm = countRows(ref.rows);
    const missing = [];
    const extra = [];
    for (const [k, n] of rm) {
        for (let i = 0; i < n - (um.get(k) || 0); i++) missing.push(JSON.parse(k));
    }
    for (const [k, n] of um) {
        for (let i = 0; i < n - (rm.get(k) || 0); i++) extra.push(JSON.parse(k));
    }

    if (user.rows.length !== ref.rows.length) {
        diffs.push(`Число строк: нужно ${ref.rows.length}, у тебя ${user.rows.length}.`);
    }
    if (missing.length) diffs.push(`Не хватает строк, например: ${sample(missing)}.`);
    if (extra.length) diffs.push(`Лишние строки, например: ${sample(extra)}.`);

    if (!missing.length && !extra.length && meta.ordered) {
        const i = user.rows.findIndex((r, idx) => keyOf(r) !== keyOf(ref.rows[idx]));
        if (i >= 0) {
            diffs.push(`Строки те же, но порядок другой: строка ${i + 1} должна быть ${fmtRow(ref.rows[i])}, а у тебя ${fmtRow(user.rows[i])}.`);
        }
    }
    return diffs;
}

/*
 * Полная проверка одного решения.
 * run(dataset, variant, sql) -> { error } | { noResult } | { columns, rows }
 */
export async function runCheck({ run, task, sql }) {
    const meta = task.meta || {};
    const dataset = meta.dataset;

    if (!sql || !sql.trim()) {
        return { status: 'error', headline: 'Запрос пустой', details: ['Напиши запрос в редакторе.'], userResult: null };
    }

    const problems = staticCheck(sql, meta);
    let shown = null;

    for (const variant of VARIANTS) {
        const user = await run(dataset, variant, sql);
        if (variant === 'main') shown = user;

        if (user.error) {
            return { status: 'error', headline: 'PostgreSQL вернул ошибку', details: [user.error], userResult: null };
        }
        if (user.noResult) {
            return {
                status: 'fail',
                headline: 'Запрос не вернул таблицу',
                details: ['Нужен запрос SELECT, который возвращает строки.'],
                userResult: null,
            };
        }

        const ref = await run(dataset, variant, task.solution);
        if (ref.error) {
            return { status: 'error', headline: 'Ошибка в эталонном решении задания', details: [ref.error], userResult: shown };
        }

        const diffs = compareResults(user, ref, meta);
        if (diffs.length) {
            const hidden = variant !== 'main';
            const details = hidden
                ? ['Запрос подогнан под конкретные данные. Решение должно работать на любых данных этих таблиц.']
                : [];
            return {
                status: 'fail',
                headline: hidden
                    ? 'На основных данных верно, но на скрытом наборе данных результат отличается'
                    : 'Результат не совпадает с ожидаемым',
                details: details.concat(diffs, problems),
                userResult: shown,
            };
        }
    }

    if (problems.length) {
        return { status: 'fail', headline: 'Результат верный, но нарушено ограничение задания', details: problems, userResult: shown };
    }
    return { status: 'pass', headline: 'Решение верное', details: [], userResult: shown };
}
