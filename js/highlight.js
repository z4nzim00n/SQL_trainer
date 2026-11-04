/* Лёгкая подсветка SQL: возвращает HTML-строку. Классы hl-* заданы в css/base.css */

const KEYWORDS = new Set((
    'select from where group by having order limit offset union all intersect except distinct as ' +
    'join inner left right full outer cross natural on using and or not in exists between like ilike ' +
    'is null true false case when then else end asc desc insert into values update set delete create ' +
    'table alter drop with recursive over partition any some cast interval primary key foreign references ' +
    'default check constraint index view begin commit rollback fetch first rows only'
).split(' '));

const TYPES = new Set(
    'int integer bigint smallint numeric decimal real double precision float text varchar char boolean bool date time timestamp timestamptz'.split(' ')
);

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const TOKEN = /(--[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|('(?:[^']|'')*'?)|("(?:[^"]|"")*"?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z_0-9]*)|([\s\S])/g;

export function highlightSql(sql) {
    let out = '';
    let m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(sql)) !== null) {
        const [text, comment, str, ident, num, word] = m;
        if (comment) out += `<span class="hl-comment">${escapeHtml(comment)}</span>`;
        else if (str) out += `<span class="hl-string">${escapeHtml(str)}</span>`;
        else if (ident) out += escapeHtml(ident);
        else if (num) out += `<span class="hl-number">${num}</span>`;
        else if (word) {
            const lower = word.toLowerCase();
            const isCall = sql[TOKEN.lastIndex] === '(';
            if (KEYWORDS.has(lower)) out += `<span class="hl-keyword">${word}</span>`;
            else if (TYPES.has(lower)) out += `<span class="hl-type">${word}</span>`;
            else if (isCall) out += `<span class="hl-func">${word}</span>`;
            else out += word;
        } else out += escapeHtml(text);
    }
    return out;
}
