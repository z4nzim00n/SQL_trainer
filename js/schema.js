/*
 * Вкладка «Схема БД»: граф таблиц (столбцы, PK, FK, связи) и просмотр строк таблиц.
 *
 * Схема читается из самой базы запросами к pg_catalog, поэтому подходит любому набору данных:
 * новую модель БД описывать отдельно не нужно.
 * Показывается только основной набор данных (main): скрытый, на котором идёт проверка, остаётся скрытым.
 */

const NS = 'http://www.w3.org/2000/svg';

/* Размеры графа (в пикселях SVG до масштабирования под ширину панели) */
const CHAR_W = 7.2;
const ROW_H = 22;
const HEAD_H = 28;
const PAD_X = 10;
const BADGE_W = 24;
const GAP_X = 72;
const GAP_Y = 26;
const MARGIN = 14;
const MIN_SCALE = 0.7;

const COLUMNS_SQL = `
SELECT c.relname AS tbl, a.attname AS col,
       format_type(a.atttypid, a.atttypmod) AS type
FROM pg_attribute a
JOIN pg_class c ON c.oid = a.attrelid
WHERE c.relnamespace = current_schema()::regnamespace
  AND c.relkind = 'r' AND a.attnum > 0 AND NOT a.attisdropped
ORDER BY c.relname, a.attnum`;

const CONSTRAINTS_SQL = `
SELECT c.conrelid::regclass::text AS tbl,
       c.contype::text AS kind,
       (SELECT string_agg(a.attname, ',' ORDER BY k.ord)
          FROM unnest(c.conkey) WITH ORDINALITY AS k(num, ord)
          JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = k.num) AS cols,
       CASE WHEN c.confrelid <> 0 THEN c.confrelid::regclass::text END AS ref_tbl,
       (SELECT string_agg(a.attname, ',' ORDER BY k.ord)
          FROM unnest(c.confkey) WITH ORDINALITY AS k(num, ord)
          JOIN pg_attribute a ON a.attrelid = c.confrelid AND a.attnum = k.num) AS ref_cols
FROM pg_constraint c
WHERE c.connamespace = current_schema()::regnamespace AND c.contype IN ('p', 'f')`;

const TYPE_ALIASES = {
    'character varying': 'varchar',
    'character': 'char',
    'timestamp without time zone': 'timestamp',
    'timestamp with time zone': 'timestamptz',
    'double precision': 'float8',
};

function shortType(t) {
    const base = t.replace(/\(.*\)$/, '');
    const alias = TYPE_ALIASES[base];
    return alias ? alias + t.slice(base.length) : t;
}

/* regclass может вернуть имя со схемой или в кавычках: приводим к простому имени */
function bareName(name) {
    return String(name).replace(/^[^".]+\./, '').replace(/^"|"$/g, '');
}

function svgEl(tag, attrs, text) {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) node.setAttribute(k, String(v));
    if (text !== undefined) node.textContent = text;
    return node;
}

/* Строки из pg_catalog -> модель { tables: [{ name, columns: [{ name, type, pk, fk }] }], fks: [...] } */
export function buildModel(columnRows, constraintRows) {
    const byName = new Map();
    for (const [tbl, col, type] of columnRows) {
        if (!byName.has(tbl)) byName.set(tbl, { name: tbl, columns: [] });
        byName.get(tbl).columns.push({ name: col, type: shortType(type), pk: false, fk: null });
    }

    const fks = [];
    for (const [rawTbl, kind, cols, rawRef, refCols] of constraintRows) {
        const table = byName.get(bareName(rawTbl));
        if (!table || !cols) continue;
        const colNames = cols.split(',');
        if (kind === 'p') {
            for (const c of colNames) {
                const column = table.columns.find((x) => x.name === c);
                if (column) column.pk = true;
            }
        } else if (kind === 'f' && rawRef && refCols) {
            const refNames = refCols.split(',');
            colNames.forEach((c, i) => {
                const column = table.columns.find((x) => x.name === c);
                const fk = { from: table.name, col: c, to: bareName(rawRef), toCol: refNames[i] };
                if (column) column.fk = fk;
                fks.push(fk);
            });
        }
    }
    return { tables: [...byName.values()], fks };
}

/* Раскладка: слои слева направо. Таблицы, на которые ссылаются, левее тех, что ссылаются. */
function computeLayout(model) {
    const layerOf = new Map(model.tables.map((t) => [t.name, 0]));
    for (let pass = 0; pass < model.tables.length; pass++) {
        let changed = false;
        for (const fk of model.fks) {
            if (fk.from === fk.to || !layerOf.has(fk.to)) continue;
            const need = layerOf.get(fk.to) + 1;
            if (layerOf.get(fk.from) < need) {
                layerOf.set(fk.from, need);
                changed = true;
            }
        }
        if (!changed) break;
    }

    const layers = [];
    for (const t of model.tables) {
        const li = layerOf.get(t.name);
        (layers[li] = layers[li] || []).push(t);
    }

    /* Порядок внутри слоя: по среднему положению таблиц, на которые есть ссылки (меньше пересечений) */
    const order = new Map();
    const bary = (t) => {
        const refs = model.fks
            .filter((f) => f.from === t.name && f.from !== f.to && order.has(f.to))
            .map((f) => order.get(f.to));
        return refs.length ? refs.reduce((a, b) => a + b, 0) / refs.length : 0;
    };
    layers.forEach((arr, li) => {
        if (!arr) return;
        if (li === 0) arr.sort((a, b) => a.name.localeCompare(b.name));
        else arr.sort((a, b) => bary(a) - bary(b) || a.name.localeCompare(b.name));
        arr.forEach((t, i) => order.set(t.name, i));
    });

    const boxes = new Map();
    const columns = layers.filter(Boolean).map((arr) =>
        arr.map((t) => {
            const nameChars = Math.max(...t.columns.map((c) => c.name.length), 1);
            const typeChars = Math.max(...t.columns.map((c) => c.type.length), 1);
            const w = Math.max(
                PAD_X * 2 + BADGE_W + nameChars * CHAR_W + 16 + typeChars * CHAR_W,
                PAD_X * 2 + t.name.length * CHAR_W + 6
            );
            const h = HEAD_H + t.columns.length * ROW_H + 6;
            const box = { t, w, h, x: 0, y: 0 };
            boxes.set(t.name, box);
            return box;
        })
    );

    const colHeights = columns.map((col) => col.reduce((s, b) => s + b.h, 0) + GAP_Y * (col.length - 1));
    const maxH = Math.max(...colHeights, 0);
    let x = MARGIN;
    columns.forEach((col, ci) => {
        let y = MARGIN + (maxH - colHeights[ci]) / 2;
        for (const b of col) {
            b.x = x;
            b.y = y;
            y += b.h + GAP_Y;
        }
        x += Math.max(...col.map((b) => b.w)) + GAP_X;
    });

    return { boxes, width: x - GAP_X + MARGIN, height: maxH + MARGIN * 2 };
}

/* SVG-граф. onSelect(name) вызывается при клике на таблицу. */
function drawGraph(model, onSelect) {
    const { boxes, width, height } = computeLayout(model);
    const svg = svgEl('svg', { class: 'er-svg', viewBox: `0 0 ${width} ${height}`, role: 'img',
        'aria-label': 'Схема базы данных: таблицы и связи между ними' });
    svg.dataset.w = width;
    svg.dataset.h = height;

    const defs = svgEl('defs');
    const marker = svgEl('marker', { id: 'er-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5,
        markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
    marker.appendChild(svgEl('path', { d: 'M0,0 L10,5 L0,10 z', class: 'er-arrow' }));
    defs.appendChild(marker);
    svg.appendChild(defs);

    const edgeLayer = svgEl('g', { class: 'er-edges' });
    const boxLayer = svgEl('g', { class: 'er-boxes' });
    svg.append(edgeLayer, boxLayer);

    const rowY = (box, colName) => {
        const i = Math.max(0, box.t.columns.findIndex((c) => c.name === colName));
        return box.y + HEAD_H + i * ROW_H + ROW_H / 2;
    };

    const edges = [];
    for (const fk of model.fks) {
        const a = boxes.get(fk.from);
        const b = boxes.get(fk.to);
        if (!a || !b) continue;
        const ya = rowY(a, fk.col);
        const yb = rowY(b, fk.toCol);
        let x1, x2, d;
        if (a.x >= b.x + b.w) {
            x1 = a.x;
            x2 = b.x + b.w;
            const dx = Math.max(30, (x1 - x2) / 2);
            d = `M${x1},${ya} C${x1 - dx},${ya} ${x2 + dx},${yb} ${x2},${yb}`;
        } else {
            x1 = a.x + a.w;
            x2 = b.x + b.w;
            d = `M${x1},${ya} C${x1 + 38},${ya} ${x2 + 38},${yb} ${x2},${yb}`;
        }
        const path = svgEl('path', { d, class: 'er-edge', 'marker-end': 'url(#er-arrow)' });
        path.appendChild(svgEl('title', {}, `${fk.from}.${fk.col} → ${fk.to}.${fk.toCol}`));
        const dot = svgEl('circle', { cx: x1, cy: ya, r: 3, class: 'er-edge-dot' });
        edgeLayer.append(path, dot);
        edges.push({ fk, path, dot });
    }

    const groups = new Map();
    for (const [name, box] of boxes) {
        const { t, x, y, w, h } = box;
        const g = svgEl('g', { class: 'er-box', tabindex: 0, role: 'button', 'aria-label': `Таблица ${name}` });
        g.dataset.table = name;
        g.appendChild(svgEl('rect', { class: 'frame', x, y, width: w, height: h, rx: 7 }));
        g.appendChild(svgEl('path', { class: 'head',
            d: `M${x},${y + HEAD_H} V${y + 7} Q${x},${y} ${x + 7},${y} H${x + w - 7} Q${x + w},${y} ${x + w},${y + 7} V${y + HEAD_H} Z` }));
        g.appendChild(svgEl('text', { class: 'title', x: x + PAD_X, y: y + HEAD_H * 0.68 }, name));

        t.columns.forEach((c, i) => {
            const cy = y + HEAD_H + i * ROW_H + ROW_H * 0.7;
            if (c.pk) g.appendChild(svgEl('text', { class: 'badge-pk', x: x + PAD_X, y: cy }, 'PK'));
            else if (c.fk) g.appendChild(svgEl('text', { class: 'badge-fk', x: x + PAD_X, y: cy }, 'FK'));
            g.appendChild(svgEl('text', { class: 'col', x: x + PAD_X + BADGE_W, y: cy }, c.name));
            g.appendChild(svgEl('text', { class: 'type', x: x + w - PAD_X, y: cy, 'text-anchor': 'end' }, c.type));
        });

        const related = new Set([name]);
        for (const e of edges) {
            if (e.fk.from === name) related.add(e.fk.to);
            if (e.fk.to === name) related.add(e.fk.from);
        }
        const on = () => {
            svg.classList.add('dim');
            g.classList.add('on');
            for (const [n, other] of groups) if (related.has(n)) other.classList.add('on');
            for (const e of edges) {
                if (e.fk.from === name || e.fk.to === name) {
                    e.path.classList.add('on');
                    e.dot.classList.add('on');
                    groups.get(e.fk.from)?.classList.add('on');
                    groups.get(e.fk.to)?.classList.add('on');
                }
            }
        };
        const off = () => {
            svg.classList.remove('dim');
            svg.querySelectorAll('.on').forEach((n) => n.classList.remove('on'));
        };
        g.addEventListener('mouseenter', on);
        g.addEventListener('mouseleave', off);
        g.addEventListener('focus', on);
        g.addEventListener('blur', off);
        g.addEventListener('click', () => onSelect(name));
        g.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(name); }
        });
        groups.set(name, g);
        boxLayer.appendChild(g);
    }
    return svg;
}

/* Подгоняем масштаб под ширину панели (но не мельче MIN_SCALE: дальше появится прокрутка) */
function fitSvg(svg, wrap) {
    const w = Number(svg.dataset.w);
    const h = Number(svg.dataset.h);
    const avail = Math.max(120, wrap.clientWidth - 10);
    const scale = Math.min(1, Math.max(MIN_SCALE, avail / w));
    svg.setAttribute('width', Math.round(w * scale));
    svg.setAttribute('height', Math.round(h * scale));
}

/*
 * root     контейнер вкладки
 * deps.run(dataset, sql) -> { columns, rows } | { error }, всегда на основном наборе данных
 * deps.resultTable(res), deps.el(tag, className, text): помощники интерфейса
 */
export function createSchemaView(root, { run, resultTable, el }) {
    const cache = new Map();
    let showToken = 0;
    let resizeObserver = null;

    function message(text, cls) {
        root.replaceChildren(el('div', cls || 'output-hint', text));
    }

    async function load(dataset) {
        if (cache.has(dataset)) return cache.get(dataset);
        const cols = await run(dataset, COLUMNS_SQL);
        if (cols.error) throw new Error(cols.error);
        const cons = await run(dataset, CONSTRAINTS_SQL);
        if (cons.error) throw new Error(cons.error);
        const entry = { model: buildModel(cols.rows, cons.rows), selected: null, previews: new Map() };
        cache.set(dataset, entry);
        return entry;
    }

    async function show(dataset) {
        const token = ++showToken;
        if (resizeObserver) { resizeObserver.disconnect(); resizeObserver = null; }

        let entry;
        try {
            if (!cache.has(dataset)) message('Читаю схему из базы…');
            entry = await load(dataset);
        } catch (e) {
            if (token === showToken) message('Не удалось прочитать схему: ' + e.message, 'output-hint error-text');
            return;
        }
        if (token !== showToken) return;
        if (!entry.model.tables.length) { message('В базе нет таблиц.'); return; }

        const note = el('div', 'output-hint',
            'Схема читается из базы. Стрелка идёт от внешнего ключа (FK) к первичному (PK). Нажми на таблицу, чтобы увидеть её строки.');
        const wrap = el('div', 'er-wrap');
        const chips = el('div', 'chips');
        const dataBox = el('div', 'table-data');

        let selToken = 0;
        async function select(name) {
            const mine = ++selToken;
            entry.selected = name;
            wrap.querySelectorAll('.er-box').forEach((g) => g.classList.toggle('sel', g.dataset.table === name));
            chips.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.table === name));

            let res = entry.previews.get(name);
            if (!res) {
                dataBox.replaceChildren(el('div', 'output-hint', 'Читаю строки…'));
                const quoted = '"' + name.replace(/"/g, '""') + '"';
                res = await run(dataset, `SELECT * FROM ${quoted} ORDER BY 1 LIMIT 201`);
                if (!res.error) entry.previews.set(name, res);
            }
            if (mine !== selToken) return;

            dataBox.replaceChildren(el('div', 'table-data-title', `Таблица ${name}`));
            if (res.error) dataBox.appendChild(el('div', 'output-hint', 'Не удалось прочитать строки: ' + res.error));
            else dataBox.appendChild(resultTable(res));
        }

        const svg = drawGraph(entry.model, select);
        wrap.appendChild(svg);

        for (const t of entry.model.tables) {
            const b = el('button', 'chip', t.name);
            b.type = 'button';
            b.dataset.table = t.name;
            b.addEventListener('click', () => select(t.name));
            chips.appendChild(b);
        }

        root.replaceChildren(note, wrap, chips, dataBox);
        fitSvg(svg, wrap);
        if (typeof ResizeObserver === 'function') {
            resizeObserver = new ResizeObserver(() => fitSvg(svg, wrap));
            resizeObserver.observe(wrap);
        }
        select(entry.selected && entry.model.tables.some((t) => t.name === entry.selected)
            ? entry.selected
            : entry.model.tables[0].name);
    }

    return { show, message };
}
