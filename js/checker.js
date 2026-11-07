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

/* Делит скрипт на отдельные команды (учитывает строки, комментарии и $$-блоки) */
export function splitStatements(sql) {
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
            let depth = 1;
            let j = i + 2;
            while (j < sql.length && depth > 0) {
                if (sql[j] === '/' && sql[j + 1] === '*') { depth++; j += 2; }
                else if (sql[j] === '*' && sql[j + 1] === '/') { depth--; j += 2; }
                else j++;
            }
            cur += sql.slice(i, j);
            i = j;
        } else if (c === "'" || c === '"') {
            const escaped = c === "'" && /(^|[^A-Za-z0-9_])[eE]$/.test(sql.slice(0, i));
            let j = i + 1;
            while (j < sql.length) {
                if (escaped && sql[j] === '\\') { j += 2; continue; }
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
    return out.filter((st) => stripSql(st).trim());
}

/* Убираем комментарии и строковые литералы, чтобы запрещённые слова искались только в самом коде.
   Содержимое двойных кавычек (идентификаторы) сохраняем: его тоже пишет ученик. */
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
            /* комментарии в PostgreSQL могут быть вложенными */
            let depth = 1;
            i += 2;
            while (i < sql.length && depth > 0) {
                if (sql[i] === '/' && sql[i + 1] === '*') { depth++; i += 2; }
                else if (sql[i] === '*' && sql[i + 1] === '/') { depth--; i += 2; }
                else i++;
            }
            out += ' ';
        } else if (c === "'") {
            /* E'...' понимает \' и \\ как escape-последовательности */
            const escaped = /(^|[^A-Za-z0-9_])[eE]$/.test(out);
            i++;
            while (i < sql.length) {
                if (escaped && sql[i] === '\\') { i += 2; continue; }
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
            let ident = '';
            while (i < sql.length) {
                if (sql[i] === '"') {
                    if (sql[i + 1] === '"') { ident += '"'; i += 2; continue; }
                    i++;
                    break;
                }
                ident += sql[i++];
            }
            out += ` "${ident}" `;
        } else if (c === '$') {
            /* $$...$$ или $tag$...$tag$: тело — это код (PL/pgSQL), поэтому чистим только литералы внутри */
            const m = sql.slice(i).match(/^\$[A-Za-z_0-9]*\$/);
            if (m) {
                const end = sql.indexOf(m[0], i + m[0].length);
                if (end < 0) {
                    out += sql.slice(i);
                    break;
                }
                const body = sql.slice(i + m[0].length, end);
                out += m[0] + stripSql(body) + m[0];
                i = end + m[0].length;
            } else {
                out += c;
                i++;
            }
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

/* Позиция закрывающей скобки для открывающей в pos (учитывает вложенность) */
function findClose(text, pos) {
    let depth = 0;
    for (let i = pos; i < text.length; i++) {
        if (text[i] === '(') depth++;
        else if (text[i] === ')' && --depth === 0) return i;
    }
    return -1;
}

/* Делит список выражений по запятым верхнего уровня: "(a, b), c" -> ["a, b", " c"] */
function splitExprList(text) {
    const parts = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '(') depth++;
        else if (text[i] === ')') depth--;
        else if (text[i] === ',' && depth === 0) {
            parts.push(text.slice(start, i));
            start = i + 1;
        }
    }
    parts.push(text.slice(start));
    return parts;
}

/* Ближайшее слово word на верхнем уровне или ';' */
function findTopLevelWord(text, from, word) {
    let depth = 0;
    for (let i = from; i < text.length; i++) {
        const c = text[i];
        if (c === '(') depth++;
        else if (c === ')') depth--;
        else if (depth === 0) {
            if (c === ';') return i;
            if (/[A-Za-z_]/.test(c)) {
                let j = i;
                while (j < text.length && /[A-Za-z0-9_]/.test(text[j])) j++;
                if (text.slice(i, j).toLowerCase() === word) return i;
                i = j - 1;
            }
        }
    }
    return -1;
}

/* Находит INSERT ... VALUES/SELECT и сообщает, если ключевой столбец записан числом */
function directIdProblems(text, rule) {
    const problems = [];
    const table = rule.table.toLowerCase();
    const re = new RegExp(`\\bINSERT\\s+INTO\\s+(?:[a-z_][a-z0-9_]*\\.)?${table}\\b`, 'gi');
    let m;
    while ((m = re.exec(text))) {
        let i = m.index + m[0].length;
        const skip = () => { while (i < text.length && /\s/.test(text[i])) i++; };
        skip();

        let names = rule.columns.map((c) => c.toLowerCase());
        if (text[i] === '(') {
            const close = findClose(text, i);
            if (close < 0) continue;
            names = splitExprList(text.slice(i + 1, close)).map((x) => x.trim().toLowerCase());
            i = close + 1;
            skip();
        }

        const groups = [];
        if (/^values\b/i.test(text.slice(i))) {
            i += 6;
            skip();
            while (text[i] === '(') {
                const close = findClose(text, i);
                if (close < 0) break;
                groups.push(splitExprList(text.slice(i + 1, close)));
                i = close + 1;
                skip();
                if (text[i] !== ',') break;
                i++;
                skip();
            }
        } else if (/^select\b/i.test(text.slice(i))) {
            i += 6;
            const end = findTopLevelWord(text, i, 'from');
            groups.push(splitExprList(text.slice(i, end < 0 ? text.length : end)));
        }

        for (const exprs of groups) {
            for (const col of rule.columns) {
                const idx = names.indexOf(col.toLowerCase());
                if (idx < 0 || idx >= exprs.length) continue;
                if (/^\s*-?\d+\s*$/.test(exprs[idx])) {
                    problems.push(`В задании запрещено указывать ${table}.${col} числом.`);
                }
            }
        }
    }
    return problems;
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
    for (const rule of meta.forbidDirectIds || []) problems.push(...directIdProblems(text, rule));
    if (meta.forbidSetvalLiteral && /\bSETVAL\s*\(\s*(?:''|[a-z_][a-z0-9_.]*)[^,]*,\s*-?\d+/i.test(text)) {
        problems.push('В задании запрещено задавать значение последовательности числом.');
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
        /* meta.orderKeys: порядок важен только по этим столбцам (при равных значениях строки могут идти как угодно) */
        const keyIdx = Array.isArray(meta.orderKeys) && meta.orderKeys.length
            ? meta.orderKeys.map((n) => rc.indexOf(String(n).toLowerCase())).filter((x) => x >= 0)
            : null;
        const rowKey = (r) => (keyIdx && keyIdx.length ? JSON.stringify(keyIdx.map((x) => r[x])) : keyOf(r));
        const i = user.rows.findIndex((r, idx) => rowKey(r) !== rowKey(ref.rows[idx]));
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
    /* Задания на DML/DDL: meta.setup выполняется до решения, meta.verify после него.
       Сравнивается результат verify-запроса (состояние базы после решения). */
    const compose = (body) => [meta.setup, body, meta.verify].filter((x) => x && x.trim()).join('\n;\n');

    if (!sql || !sql.trim()) {
        return { status: 'error', headline: 'Запрос пустой', details: ['Напиши запрос в редакторе.'], userResult: null };
    }

    const problems = staticCheck(sql, meta);
    let shown = null;

    for (const variant of VARIANTS) {
        if (meta.planContains) {
            /* Задания на EXPLAIN: проверяем план запроса ученика, а не фиксированный план эталона */
            const script = [meta.setup, sql].filter((x) => x && x.trim()).join('\n;\n');
            const user = await run(dataset, variant, script);
            if (variant === 'main') shown = user;

            if (user.error) {
                return { status: 'error', headline: 'PostgreSQL вернул ошибку', details: [user.error], userResult: null };
            }
            if (user.noResult) {
                return {
                    status: 'fail',
                    headline: 'Запрос не вернул план',
                    details: ['Оберни свой запрос в EXPLAIN ANALYZE, чтобы увидеть план выполнения.'],
                    userResult: null,
                };
            }
            const plan = user.rows.map((row) => row.map((c) => (c === null ? '' : c)).join(' ')).join('\n');
            if (!plan.includes(meta.planContains)) {
                return {
                    status: 'fail',
                    headline: `В плане нет ${meta.planContains}`,
                    details: ['Проверь, что запрос из задания выполняется с использованием нужного индекса.'],
                    userResult: shown,
                };
            }
            continue;
        }

        const user = await run(dataset, variant, compose(sql));
        if (variant === 'main') shown = user;

        if (user.error) {
            return { status: 'error', headline: 'PostgreSQL вернул ошибку', details: [user.error], userResult: null };
        }
        if (user.noResult) {
            return {
                status: 'fail',
                headline: 'Запрос не вернул таблицу',
                details: [meta.verify ? 'После твоего запроса проверочный запрос ничего не вернул.' : 'Нужен запрос SELECT, который возвращает строки.'],
                userResult: null,
            };
        }

        const ref = await run(dataset, variant, compose(task.solution));
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
