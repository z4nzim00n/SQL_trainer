/* SQL Practice: интерфейс тренажёра. Движок БД: js/engine.js, проверка: js/checker.js */
import { marked } from '../vendor/marked.esm.js';
import { highlightSql } from './highlight.js';
import { runCheck } from './checker.js';
import { createEngine } from './engine.js';

const $ = (id) => document.getElementById(id);

/* ============================================
   STORAGE (всё необязательно: без localStorage работает так же)
   ============================================ */
const store = {
    get(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch (e) { return fallback; }
    },
    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
};

/* ============================================
   STATE
   ============================================ */
let data = null;
let engine = null;
let enginePromise = null;
let activeTask = null;
let activeTaskEl = null;
let leftTab = 'readme';

const solved = store.get('sql-solved', {});
const hintsOpened = store.get('sql-hints', {});
const solutionShown = store.get('sql-solution', {});
const drafts = store.get('sql-drafts', {});

const TABS = [
    { id: 'readme', label: '📋 Условие' },
    { id: 'schema', label: '🗂 Схема' },
    { id: 'theory', label: '💡 Теория' },
    { id: 'hints', label: '🧭 Подсказки' },
    { id: 'solution', label: '✅ Решение' },
];

/* ============================================
   THEME / FONT
   ============================================ */
const themeSelect = $('themeSelect');
const fontSlider = $('fontSlider');
const fontVal = $('fontVal');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeSelect.value = theme;
    store.set('sql-theme', theme);
}
function setFont(val) {
    document.documentElement.style.setProperty('--fs-base', val + 'px');
    fontVal.textContent = val;
    fontSlider.value = val;
    store.set('sql-font', val);
}
themeSelect.addEventListener('change', () => setTheme(themeSelect.value));
fontSlider.addEventListener('input', () => setFont(fontSlider.value));
setTheme(store.get('sql-theme', 'catppuccin'));
setFont(store.get('sql-font', 15));

/* ============================================
   LAYOUT: сайдбар, раскладка, разделитель
   ============================================ */
const sidebar = $('sidebar');
const panelsContainer = $('panelsContainer');
const panelLeft = $('panelLeft');
const panelRight = $('panelRight');
const resizer = $('resizer');
const layoutToggle = $('layoutToggle');
let isVertical = false;
let isResizing = false;

$('sidebarToggle').addEventListener('click', () => sidebar.classList.toggle('collapsed'));

layoutToggle.addEventListener('click', () => {
    isVertical = !isVertical;
    panelsContainer.classList.toggle('vertical', isVertical);
    layoutToggle.textContent = isVertical ? '⬛' : '⬜';
    panelLeft.style.flex = '1 1 0%';
    panelRight.style.flex = '1 1 0%';
});

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    resizer.classList.add('dragging');
    document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
});
window.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const rect = panelsContainer.getBoundingClientRect();
    const share = isVertical
        ? ((e.clientY - rect.top) / rect.height) * 100
        : ((e.clientX - rect.left) / rect.width) * 100;
    if (share > 15 && share < 85) {
        panelLeft.style.flex = `0 0 calc(${share}% - 8px)`;
        panelRight.style.flex = '1 1 0%';
    }
});
window.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    resizer.classList.remove('dragging');
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
});

/* ============================================
   STATUS (левый сайдбар)
   ============================================ */
const navStatus = $('navStatus');
function setNav(msg, kind) {
    if (!msg) { navStatus.hidden = true; return; }
    navStatus.hidden = false;
    navStatus.textContent = msg;
    navStatus.className = 'nav-status' + (kind ? ' ' + kind : '');
}

/* ============================================
   MARKDOWN
   ============================================ */
function renderMd(md) {
    const box = document.createElement('div');
    box.className = 'document';
    box.innerHTML = marked.parse(md, { gfm: true, async: false });
    box.querySelectorAll('pre code').forEach((code) => {
        const lang = code.className || '';
        if (!lang || /language-sql/.test(lang)) code.innerHTML = highlightSql(code.textContent);
    });
    box.querySelectorAll('table').forEach((t) => {
        const wrap = document.createElement('div');
        wrap.className = 'table-wrap';
        t.replaceWith(wrap);
        wrap.appendChild(t);
    });
    return box;
}

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

/* ============================================
   TREE
   ============================================ */
const treeEl = $('tree');

function taskLabel(task) {
    const m = task.dir.match(/^ex(\d+)/);
    return (m ? m[1] + '. ' : '') + task.title;
}

function buildTree() {
    treeEl.replaceChildren();
    data.days.forEach((day, di) => {
        const sec = el('div', 'tree-section' + (di === 0 ? ' open' : ''));
        const title = el('div', 'tree-section-title', day.title);
        title.addEventListener('click', () => sec.classList.toggle('open'));
        const body = el('div', 'tree-section-body');

        day.tasks.forEach((task) => {
            const row = el('div', 'tree-task');
            const icon = el('span', 'tree-task-icon', solved[task.id] ? '✅' : '📄');
            row.append(icon, el('span', '', taskLabel(task)));
            row.dataset.id = task.id;
            row.addEventListener('click', () => selectTask(task, row));
            body.appendChild(row);
        });

        sec.append(title, body);
        treeEl.appendChild(sec);
    });
}

function markSolved(task) {
    solved[task.id] = true;
    store.set('sql-solved', solved);
    const row = treeEl.querySelector(`[data-id="${task.id}"] .tree-task-icon`);
    if (row) row.textContent = '✅';
}

/* ============================================
   LEFT PANEL (условие, схема, теория, подсказки, решение)
   ============================================ */
const tabsEl = $('tabs');
const leftBody = $('leftBody');

function buildTabs() {
    tabsEl.replaceChildren();
    for (const t of TABS) {
        const b = el('button', 'tab' + (t.id === leftTab ? ' active' : ''), t.label);
        b.type = 'button';
        b.dataset.tab = t.id;
        b.addEventListener('click', () => {
            leftTab = t.id;
            tabsEl.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x.dataset.tab === leftTab));
            renderLeft();
        });
        tabsEl.appendChild(b);
    }
}

function renderLeft(keepScroll) {
    const top = keepScroll ? leftBody.scrollTop : 0;
    leftBody.replaceChildren();
    if (!activeTask) return;
    const task = activeTask;
    const wrap = el('div');

    if (leftTab === 'readme') wrap.appendChild(renderMd(task.readme));
    else if (leftTab === 'schema') wrap.appendChild(renderMd(data.datasets[task.meta.dataset].schema));
    else if (leftTab === 'theory') wrap.appendChild(renderMd(task.theory));
    else if (leftTab === 'hints') renderHints(wrap, task);
    else if (leftTab === 'solution') renderSolution(wrap, task);

    leftBody.appendChild(wrap);
    leftBody.scrollTop = top;
}

function renderHints(wrap, task) {
    wrap.appendChild(el('p', 'lead', 'Подсказки открываются по одной: от общей идеи к почти готовому ответу. Сначала попробуй решить сам.'));
    const opened = hintsOpened[task.id] || 0;
    task.hints.forEach((h, i) => {
        if (i < opened) {
            const card = el('div', 'step-card');
            card.appendChild(renderMd(`### Подсказка ${i + 1}. ${h.title}\n\n${h.body}`));
            wrap.appendChild(card);
        } else if (i === opened) {
            const box = el('div', 'reveal-box', `Подсказка ${i + 1} из ${task.hints.length}: ${h.title.toLowerCase()}.`);
            const b = el('button', '', 'Показать подсказку');
            b.type = 'button';
            b.addEventListener('click', () => {
                hintsOpened[task.id] = i + 1;
                store.set('sql-hints', hintsOpened);
                renderLeft(true);
            });
            box.appendChild(el('br'));
            box.appendChild(b);
            wrap.appendChild(box);
        }
    });
    if (!task.hints.length) wrap.appendChild(el('p', 'lead', 'Для этого задания подсказок пока нет.'));
}

function renderSolution(wrap, task) {
    if (!solutionShown[task.id]) {
        const box = el('div', 'reveal-box', 'Эталонное решение с комментариями. Загляни сюда, когда попробовал сам и прошёл подсказки.');
        const b = el('button', '', 'Показать решение');
        b.type = 'button';
        b.addEventListener('click', () => {
            solutionShown[task.id] = true;
            store.set('sql-solution', solutionShown);
            renderLeft(true);
        });
        box.appendChild(el('br'));
        box.appendChild(b);
        wrap.appendChild(box);
        return;
    }
    const code = task.solutionCommented || task.solution;
    wrap.appendChild(renderMd('```sql\n' + code + '\n```'));
}

/* ============================================
   EDITOR (textarea + подсветка поверх)
   ============================================ */
const editor = $('editor');
const editorHl = $('editorHl');
const runBtn = $('runBtn');
const checkBtn = $('checkBtn');
const resetBtn = $('resetBtn');
const output = $('output');

function paintEditor() {
    editorHl.innerHTML = highlightSql(editor.value) + '\n';
    editorHl.scrollTop = editor.scrollTop;
    editorHl.scrollLeft = editor.scrollLeft;
}

let draftTimer = null;
editor.addEventListener('input', () => {
    paintEditor();
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
        if (!activeTask) return;
        drafts[activeTask.id] = editor.value;
        store.set('sql-drafts', drafts);
    }, 300);
});
editor.addEventListener('scroll', () => {
    editorHl.scrollTop = editor.scrollTop;
    editorHl.scrollLeft = editor.scrollLeft;
});
editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const { selectionStart: s, selectionEnd: en } = editor;
        editor.setRangeText('    ', s, en, 'end');
        editor.dispatchEvent(new Event('input'));
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (!runBtn.disabled) runQuery();
    }
});

resetBtn.addEventListener('click', () => {
    editor.value = '';
    editor.dispatchEvent(new Event('input'));
    editor.focus();
});

function setEditorEnabled(on) {
    const ready = on && !!activeTask;
    editor.disabled = !ready;
    runBtn.disabled = !ready;
    checkBtn.disabled = !ready;
    resetBtn.disabled = !ready;
}

/* ============================================
   OUTPUT: таблица и вердикт
   ============================================ */
const MAX_ROWS = 200;

function resultTable(res) {
    const frag = document.createDocumentFragment();
    const shown = res.rows.slice(0, MAX_ROWS);
    const more = res.rows.length - shown.length;
    frag.appendChild(el('div', 'result-meta',
        `Строк: ${res.rows.length}` + (more > 0 ? ` (показаны первые ${MAX_ROWS})` : '') + `, столбцов: ${res.columns.length}`));
    const wrap = el('div', 'result-table-wrap');
    const table = el('table', 'result-table');
    const head = el('tr');
    res.columns.forEach((c) => head.appendChild(el('th', '', c)));
    const thead = el('thead');
    thead.appendChild(head);
    const tbody = el('tbody');
    shown.forEach((row) => {
        const tr = el('tr');
        row.forEach((cell) => {
            const td = cell === null ? el('td', 'null', 'NULL') : el('td', '', cell);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.append(thead, tbody);
    wrap.appendChild(table);
    frag.appendChild(wrap);
    return frag;
}

function verdictBox(kind, title, lines) {
    const box = el('div', 'verdict ' + kind);
    box.appendChild(el('div', 'verdict-title', title));
    if (lines && lines.length) {
        const ul = el('ul');
        lines.forEach((l) => ul.appendChild(el('li', '', l)));
        box.appendChild(ul);
    }
    return box;
}

function showMessage(text) {
    output.replaceChildren(el('div', 'output-hint', text));
}

let busy = false;
async function withBusy(label, fn) {
    if (busy || !activeTask || !engine) return;
    busy = true;
    runBtn.disabled = checkBtn.disabled = true;
    showMessage(label);
    try { await fn(); } finally {
        busy = false;
        runBtn.disabled = checkBtn.disabled = false;
    }
}

function runQuery() {
    return withBusy('Выполняю…', async () => {
        const sql = editor.value;
        if (!sql.trim()) { showMessage('Запрос пустой.'); return; }
        const res = await engine.run(activeTask.meta.dataset, 'main', sql);
        output.replaceChildren();
        if (res.error) output.appendChild(verdictBox('error', 'PostgreSQL вернул ошибку', [res.error]));
        else if (res.noResult) output.appendChild(el('div', 'output-hint', 'Запрос выполнился, но таблицы с результатом нет (это не SELECT).'));
        else output.appendChild(resultTable(res));
    });
}

function checkQuery() {
    return withBusy('Проверяю на двух наборах данных…', async () => {
        const task = activeTask;
        const v = await runCheck({ run: engine.run, task, sql: editor.value });
        output.replaceChildren();
        output.appendChild(verdictBox(v.status, v.status === 'pass' ? '✅ ' + v.headline : v.headline, v.details));
        if (v.userResult && v.userResult.columns && v.userResult.columns.length) {
            output.appendChild(el('div', 'result-meta', 'Результат твоего запроса:'));
            output.appendChild(resultTable(v.userResult));
        }
        if (v.status === 'pass') markSolved(task);
    });
}

runBtn.addEventListener('click', runQuery);
checkBtn.addEventListener('click', checkQuery);

/* ============================================
   SELECT TASK
   ============================================ */
function selectTask(task, row) {
    if (activeTaskEl) activeTaskEl.classList.remove('active');
    row.classList.add('active');
    activeTaskEl = row;
    activeTask = task;

    $('taskBarTitle').textContent = `${task.id.replace('/', ' · ')}. ${task.title}`;
    renderLeft();

    editor.value = drafts[task.id] || '';
    paintEditor();
    setEditorEnabled(!!engine);
    showMessage(engine ? 'Результат появится здесь. Ctrl+Enter выполняет запрос.' : 'PostgreSQL ещё загружается…');
}

/* ============================================
   SELFTEST (?selftest): прогон эталонов и «неверных» решений в браузере
   ============================================ */
async function runSelfTest() {
    const box = el('div', 'selftest document');
    box.appendChild(el('h2', '', 'Самопроверка заданий в браузере'));
    document.body.appendChild(box);
    const log = (cls, msg) => box.appendChild(el('p', cls, msg));

    try { await enginePromise; } catch (e) {
        log('bad', 'Движок не загрузился: ' + e.message);
        document.title = 'SELFTEST FAIL';
        return;
    }

    let bad = 0;
    const check = (cond, okMsg, badMsg) => { if (cond) log('good', '  ✓ ' + okMsg); else { bad++; log('bad', '  ✗ ' + badMsg); } };

    for (const day of data.days) {
        for (const task of day.tasks) {
            log('head', `${task.id}  ${task.title}`);
            const run = engine.run;
            let v = await runCheck({ run, task, sql: task.solution });
            check(v.status === 'pass', 'эталон проходит', `эталон НЕ проходит: ${v.headline} ${v.details.join(' | ')}`);
            if (task.solutionCommented) {
                v = await runCheck({ run, task, sql: task.solutionCommented });
                check(v.status === 'pass', 'solution_commented проходит', `solution_commented НЕ проходит: ${v.headline}`);
            }
            for (const [i, p] of (task.meta.positive || []).entries()) {
                v = await runCheck({ run, task, sql: p.sql });
                check(v.status === 'pass', `другой верный способ №${i + 1} проходит`, `другой верный способ №${i + 1} НЕ проходит: ${v.headline} ${v.details.join(' | ')}`);
            }
            for (const [i, n] of (task.meta.negative || []).entries()) {
                v = await runCheck({ run, task, sql: n.sql });
                check(v.status !== 'pass', `неверное решение №${i + 1} отклонено`, `неверное решение №${i + 1} ПРОШЛО проверку`);
            }
        }
    }
    log(bad ? 'bad' : 'good', bad ? `Провалено: ${bad}` : 'Всё хорошо.');
    document.title = bad ? 'SELFTEST FAIL' : 'SELFTEST OK';
}

/* ============================================
   START
   ============================================ */
async function start() {
    buildTabs();

    try {
        const res = await fetch('tasks.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        data = await res.json();
    } catch (e) {
        setNav('Не удалось загрузить tasks.json: ' + e.message +
            '. Открой страницу через http (например, python3 -m http.server), а не двойным кликом по файлу.', 'error');
        return;
    }

    buildTree();
    setNav('Загружаю PostgreSQL…');

    enginePromise = createEngine(data.datasets, (msg) => setNav(msg))
        .then((e) => {
            engine = e;
            setNav('');
            setEditorEnabled(true);
            if (activeTask) showMessage('Результат появится здесь. Ctrl+Enter выполняет запрос.');
            return e;
        })
        .catch((err) => {
            console.error(err);
            setNav('Не удалось загрузить PostgreSQL (WebAssembly): ' + (err && err.message) +
                '. Проверь интернет и обнови страницу.', 'error');
            throw err;
        });
    enginePromise.catch(() => {});

    if (new URLSearchParams(location.search).has('selftest')) runSelfTest();
}

start();
