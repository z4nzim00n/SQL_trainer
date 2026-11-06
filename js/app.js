/* SQL Practice: интерфейс тренажёра. Движок БД: js/engine.js, проверка: js/checker.js */
import { marked } from '../vendor/marked.esm.js';
import { highlightSql } from './highlight.js';
import { runCheck } from './checker.js';
import { createEngine } from './engine.js';
import { createSchemaView } from './schema.js';
import { createWiki } from './wiki.js';

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
const panes = [
    { id: 'A', tab: store.get('sql-tabA', 'readme') },
    { id: 'B', tab: store.get('sql-tabB', 'theory') },
];
let split = store.get('sql-split', false);

const solved = store.get('sql-solved', {});
const hintsOpened = store.get('sql-hints', {});
const solutionShown = store.get('sql-solution', {});
const drafts = store.get('sql-drafts', {});

const TABS = [
    { id: 'readme', label: '📋 Задание' },
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
let isVertical = false;
let isResizing = false;

$('sidebarToggle').addEventListener('click', () => sidebar.classList.toggle('collapsed'));

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
function renderMd(md, dataset, noTerms) {
    const box = document.createElement('div');
    box.className = 'document';
    box.innerHTML = marked.parse(md, { gfm: true, async: false });
    box.querySelectorAll('pre code').forEach((code) => {
        const lang = code.className || '';
        if (/language-sql-(run|pizza)/.test(lang)) return;
        if (!lang || /language-sql/.test(lang)) code.innerHTML = highlightSql(code.textContent);
    });
    /* ```sql-run: пример на учебных мини-таблицах (они показываются над примером), ```sql-pizza: на базе пиццерий */
    box.querySelectorAll('pre > code.language-sql-run').forEach((code) => {
        code.closest('pre').replaceWith(exampleBlock(code.textContent.trim(), 'demo', true));
    });
    box.querySelectorAll('pre > code.language-sql-pizza').forEach((code) => {
        code.closest('pre').replaceWith(exampleBlock(code.textContent.trim(), dataset && dataset !== 'demo' ? dataset : 'pizza', false));
    });
    box.querySelectorAll('table').forEach((t) => {
        if (t.closest('.result-table-wrap')) return;
        const wrap = document.createElement('div');
        wrap.className = 'table-wrap';
        t.replaceWith(wrap);
        wrap.appendChild(t);
    });
    if (!noTerms) linkTerms(box);
    return box;
}

/* Слова из словаря (docs/glossary.json) в обратных кавычках становятся кликабельными */
function linkTerms(box) {
    const glossary = (data && data.glossary) || {};
    box.querySelectorAll('code').forEach((code) => {
        if (code.closest('pre')) return;
        const key = code.textContent.trim().toUpperCase();
        if (!glossary[key]) return;
        code.classList.add('term');
        code.title = 'Нажми: что это и пример';
        code.tabIndex = 0;
        const open = () => openTerm(key);
        code.addEventListener('click', open);
        code.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
    });
}

let termOverlay = null;
function closeTerm() {
    if (termOverlay) { termOverlay.remove(); termOverlay = null; }
}
function openTerm(key) {
    const entry = data.glossary[key];
    if (!entry) return;
    closeTerm();
    termOverlay = el('div', 'term-overlay');
    const card = el('div', 'term-card');
    const head = el('div', 'term-head');
    head.appendChild(el('h3', '', entry.title || key));
    const x = el('button', 'term-close', '✕');
    x.type = 'button';
    x.addEventListener('click', closeTerm);
    head.appendChild(x);
    card.appendChild(head);
    card.appendChild(renderMd(entry.text || '', 'pizza', true));
    if (entry.sql) card.appendChild(exampleBlock(entry.sql.trim(), 'demo', true, true));
    termOverlay.appendChild(card);
    termOverlay.addEventListener('click', (e) => { if (e.target === termOverlay) closeTerm(); });
    document.body.appendChild(termOverlay);
}
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTerm(); });

/* Блок примера: исходные мини-таблицы, код, кнопка «Показать пример» и результат */
function exampleBlock(sql, dataset, withTables, autoRun) {
    const ex = el('div', 'example');
    if (withTables) {
        const names = ((data && data.datasets && data.datasets[dataset] && data.datasets[dataset].tables) || [])
            .filter((t) => new RegExp('(^|[^A-Za-z0-9_])' + t + '($|[^A-Za-z0-9_])', 'i').test(sql));
        if (names.length) {
            const box = el('div', 'example-tables');
            box.appendChild(el('div', 'example-tables-title', 'Таблицы для примера'));
            const row = el('div', 'example-tables-row');
            box.appendChild(row);
            ex.appendChild(box);
            const fill = async () => {
                for (const name of names) {
                    const cell = el('div', 'example-table');
                    cell.appendChild(el('div', 'example-table-name', name));
                    const res = await engine.run(dataset, 'main', `SELECT * FROM ${name} ORDER BY 1, 2`);
                    if (res.error) cell.appendChild(el('div', 'output-hint', res.error));
                    else cell.appendChild(resultTable(res, true));
                    row.appendChild(cell);
                }
            };
            if (engine) fill();
            else if (enginePromise) enginePromise.then(fill).catch(() => {});
            else row.appendChild(el('div', 'output-hint', 'Загружаю…'));
        }
    }
    const pre = el('pre');
    const code = el('code');
    code.innerHTML = highlightSql(sql);
    pre.appendChild(code);
    const bar = el('div', 'example-bar');
    const run = el('button', 'btn-primary', '▶ Показать пример');
    run.type = 'button';
    const copy = el('button', '', '⧉ Копировать');
    copy.type = 'button';
    const out = el('div', 'example-out');
    out.hidden = true;
    bar.append(run, copy);
    ex.append(pre, bar, out);

    const doRun = async () => {
        out.hidden = false;
        if (!engine) { out.replaceChildren(el('div', 'output-hint', 'PostgreSQL ещё загружается, попробуй через несколько секунд.')); return; }
        out.replaceChildren(el('div', 'output-hint', 'Выполняю…'));
        const res = await engine.run(dataset || defaultDataset(), 'main', sql);
        out.replaceChildren();
        if (res.error) out.appendChild(verdictBox('error', 'PostgreSQL вернул ошибку', [res.error]));
        else if (res.noResult) out.appendChild(el('div', 'output-hint', 'Запрос выполнился, таблицы с результатом нет.'));
        else { out.appendChild(el('div', 'result-meta', 'Результат:')); out.appendChild(resultTable(res)); }
        run.textContent = '↻ Выполнить ещё раз';
    };
    run.addEventListener('click', doRun);
    copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(sql); copy.textContent = '✓ Скопировано'; }
        catch (e) { copy.textContent = 'Не удалось'; }
        setTimeout(() => { copy.textContent = '⧉ Копировать'; }, 1500);
    });
    if (autoRun) { if (engine) doRun(); else if (enginePromise) enginePromise.then(doRun).catch(() => {}); }
    return ex;
}

function defaultDataset() {
    return data && data.datasets && !data.datasets.pizza ? Object.keys(data.datasets)[0] : 'pizza';
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
    updateProgress();
}

const progressEl = $('progress');
function updateProgress() {
    if (!data) return;
    const all = data.days.flatMap((d) => d.tasks);
    const done = all.filter((t) => solved[t.id]).length;
    progressEl.textContent = `Решено: ${done} из ${all.length}`;
    progressEl.style.setProperty('--p', all.length ? (done / all.length) * 100 + '%' : '0%');
}

function nextTaskOf(task) {
    const all = data.days.flatMap((d) => d.tasks);
    const i = all.findIndex((t) => t.id === task.id);
    return i >= 0 && i + 1 < all.length ? all[i + 1] : null;
}

function openTaskById(id) {
    const row = treeEl.querySelector(`[data-id="${id}"]`);
    if (!row) return;
    const sec = row.closest('.tree-section');
    if (sec) sec.classList.add('open');
    row.click();
}

/* ============================================
   LEFT PANEL (условие, схема, теория, подсказки, решение)
   ============================================ */
for (const p of panes) {
    p.tabsEl = $('tabs' + p.id);
    p.bodyEl = $('body' + p.id);
    p.paneEl = $('pane' + p.id);
}
const paneResizer = $('paneResizer');
const splitBtn = $('splitBtn');

function buildTabs() {
    for (const p of panes) {
        p.tabsEl.replaceChildren();
        for (const t of TABS) {
            const b = el('button', 'tab' + (t.id === p.tab ? ' active' : ''), t.label);
            b.type = 'button';
            b.dataset.tab = t.id;
            b.addEventListener('click', () => {
                p.tab = t.id;
                store.set('sql-tab' + p.id, p.tab);
                p.tabsEl.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x.dataset.tab === p.tab));
                renderPane(p);
            });
            p.tabsEl.appendChild(b);
        }
    }
}

function applySplit() {
    panes[1].paneEl.hidden = !split;
    paneResizer.hidden = !split;
    splitBtn.hidden = split;
    panes[0].paneEl.style.flex = '1 1 0%';
    panes[1].paneEl.style.flex = '1 1 0%';
    store.set('sql-split', split);
    if (split) renderPane(panes[1]);
}
splitBtn.addEventListener('click', () => {
    split = true;
    /* вторая панель по умолчанию показывает то, чего нет в первой */
    if (panes[1].tab === panes[0].tab) {
        panes[1].tab = panes[0].tab === 'theory' ? 'readme' : 'theory';
        store.set('sql-tabB', panes[1].tab);
        buildTabs();
    }
    applySplit();
});
$('unsplitBtn').addEventListener('click', () => { split = false; applySplit(); });

let paneResizing = false;
paneResizer.addEventListener('mousedown', (e) => {
    paneResizing = true;
    paneResizer.classList.add('dragging');
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
});
window.addEventListener('mousemove', (e) => {
    if (!paneResizing) return;
    const rect = panelLeft.getBoundingClientRect();
    const share = ((e.clientY - rect.top) / rect.height) * 100;
    if (share > 15 && share < 85) {
        panes[0].paneEl.style.flex = `0 0 calc(${share}% - 8px)`;
        panes[1].paneEl.style.flex = '1 1 0%';
    }
});
window.addEventListener('mouseup', () => {
    if (!paneResizing) return;
    paneResizing = false;
    paneResizer.classList.remove('dragging');
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
});

function renderLeft(keepScroll) {
    renderPane(panes[0], keepScroll);
    if (split) renderPane(panes[1], keepScroll);
}

function renderPane(p, keepScroll) {
    const body = p.bodyEl;
    const top = keepScroll ? body.scrollTop : 0;
    body.replaceChildren();
    if (!activeTask) return;
    const task = activeTask;
    const wrap = el('div');
    const tab = p.tab;

    if (tab === 'readme') wrap.appendChild(renderMd(task.readme, task.meta.dataset));
    else if (tab === 'theory') {
        const doc = renderMd(task.theory, task.meta.dataset);
        const terms = [...new Set([...doc.querySelectorAll('code.term')].map((c) => c.textContent.trim().toUpperCase()))];
        if (terms.length) {
            const bar = el('div', 'term-bar');
            bar.appendChild(el('span', 'term-bar-label', 'Нажми на слово, чтобы увидеть пример на маленьких таблицах:'));
            for (const t of terms) {
                const b = el('button', 'chip', t);
                b.type = 'button';
                b.addEventListener('click', () => openTerm(t));
                bar.appendChild(b);
            }
            wrap.appendChild(bar);
        }
        wrap.appendChild(doc);
    }
    else if (tab === 'hints') renderHints(wrap, task);
    else if (tab === 'solution') renderSolution(wrap, task);

    body.appendChild(wrap);
    body.scrollTop = top;
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
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        if (!checkBtn.disabled) checkQuery();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (!runBtn.disabled) runQuery();
    }
});

function setEditorEnabled(on) {
    const ready = on && !!activeTask;
    editor.disabled = !ready;
    runBtn.disabled = !ready;
    checkBtn.disabled = !ready || isManual();
}

/* Ручные задания (два окна psql, транзакции): автопроверки нет, ученик сам отмечает выполнение */
function isManual() { return !!(activeTask && activeTask.meta && activeTask.meta.manual); }

/* ============================================
   OUTPUT: таблица и вердикт
   ============================================ */
const MAX_ROWS = 200;

function resultTable(res, compact) {
    const frag = document.createDocumentFragment();
    const shown = res.rows.slice(0, MAX_ROWS);
    const more = res.rows.length - shown.length;
    if (!compact) frag.appendChild(el('div', 'result-meta',
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
    showOutTab('output');
    showMessage(label);
    try { await fn(); } finally {
        busy = false;
        runBtn.disabled = false;
        checkBtn.disabled = isManual();
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
        if (v.status === 'pass') {
            markSolved(task);
            const next = nextTaskOf(task);
            if (next) {
                const b = el('button', 'btn-primary next-btn', 'Следующее задание →');
                b.type = 'button';
                b.addEventListener('click', () => openTaskById(next.id));
                output.insertBefore(b, output.children[1] || null);
            }
        }
    });
}

runBtn.addEventListener('click', runQuery);
checkBtn.addEventListener('click', checkQuery);

/* ============================================
   ПРАВАЯ НИЖНЯЯ ПАНЕЛЬ: вкладки «Вывод» / «Схема БД»
   ============================================ */
const schemaViewEl = $('schemaView');
let outTab = 'output';
const schemaView = createSchemaView(schemaViewEl, {
    run: (dataset, sql) => engine.run(dataset, 'main', sql),
    resultTable,
    el,
});

function schemaDataset() {
    if (activeTask) return activeTask.meta.dataset;
    return data && data.datasets ? Object.keys(data.datasets)[0] : null;
}

function refreshSchema() {
    if (outTab !== 'schema') return;
    const dataset = schemaDataset();
    if (!data || !dataset) schemaView.message('Задания ещё загружаются…');
    else if (!engine) schemaView.message('PostgreSQL ещё загружается…');
    else schemaView.show(dataset);
}

function showOutTab(name) {
    outTab = name;
    document.querySelectorAll('#outTabs .tab').forEach((b) => b.classList.toggle('active', b.dataset.out === name));
    output.hidden = name !== 'output';
    schemaViewEl.hidden = name !== 'schema';
    refreshSchema();
}

document.querySelectorAll('#outTabs .tab').forEach((b) =>
    b.addEventListener('click', () => showOutTab(b.dataset.out)));

/* ============================================
   ЭНЦИКЛОПЕДИЯ
   ============================================ */
const wiki = createWiki({
    root: $('wikiView'),
    contentArea: $('contentArea'),
    button: $('wikiBtn'),
    sidebar,
    renderMd: (md) => renderMd(md, defaultDataset()),
    store,
    el,
});

$('wikiBtnTop').addEventListener('click', () => $('wikiBtn').click());

/* ============================================
   SELECT TASK
   ============================================ */
function selectTask(task, row) {
    wiki.close();
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
    if (isManual()) showManualNote(task);
    refreshSchema();
}

function showManualNote(task) {
    output.replaceChildren();
    output.appendChild(verdictBox('error', 'Ручное задание', [
        'Это задание делается в двух окнах psql, поэтому автопроверки нет: в браузере одно соединение с базой.',
        'Выполни шаги в терминале по условию, сверься с вкладкой «Решение» и отметь выполнение кнопкой ниже.',
    ]));
    const done = el('button', 'btn-primary', solved[task.id] ? '✅ Выполнено' : '✔ Отметить как выполненное');
    done.type = 'button';
    done.addEventListener('click', () => { markSolved(task); done.textContent = '✅ Выполнено'; });
    output.appendChild(done);
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
            if (task.meta.manual) continue;
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
    applySplit();

    try {
        const res = await fetch('tasks.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        data = await res.json();
        $('wikiBtnTop').hidden = !(data.wiki && data.wiki.length);
    } catch (e) {
        setNav('Не удалось загрузить tasks.json: ' + e.message +
            '. Открой страницу через http (например, python3 -m http.server), а не двойным кликом по файлу.', 'error');
        return;
    }

    buildTree();
    updateProgress();
    wiki.setData(data.wiki || []);
    setNav('Загружаю PostgreSQL…');

    enginePromise = createEngine(data.datasets, (msg) => setNav(msg))
        .then((e) => {
            engine = e;
            setNav('');
            setEditorEnabled(true);
            if (activeTask && !isManual()) showMessage('Результат появится здесь. Ctrl+Enter выполняет запрос.');
            refreshSchema();
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
