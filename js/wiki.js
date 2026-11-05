/*
 * Энциклопедия SQL: статьи из docs/*.md (попадают в tasks.json как data.wiki).
 * Слева оглавление с поиском, справа статья. Примеры ```sql-run запускаются кнопкой.
 */
export function createWiki({ root, contentArea, button, sidebar, renderMd, store, el }) {
    let articles = [];
    let current = store.get('sql-wiki-current', null);
    let query = '';
    let isOpen = false;

    const toc = el('aside', 'wiki-toc');
    const search = el('input', 'wiki-search');
    search.type = 'search';
    search.placeholder = 'Поиск по энциклопедии…';
    search.setAttribute('aria-label', 'Поиск по энциклопедии');
    const list = el('nav', 'wiki-list');
    toc.append(search, list);

    const main = el('div', 'wiki-main');
    const topbar = el('div', 'wiki-topbar');
    const toggle = el('button', 'sidebar-toggle-btn', '☰');
    toggle.type = 'button';
    toggle.title = 'Скрыть/показать меню';
    toggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    const heading = el('span', 'task-bar-title', '📖 Энциклопедия SQL');
    const back = el('button', '', '← К заданиям');
    back.type = 'button';
    back.addEventListener('click', () => close());
    topbar.append(toggle, heading, back);
    const article = el('div', 'wiki-article');
    main.append(topbar, article);
    root.append(toc, main);

    function matches(a) {
        if (!query) return true;
        const q = query.toLowerCase();
        return a.title.toLowerCase().includes(q) || a.md.toLowerCase().includes(q);
    }

    function renderList() {
        list.replaceChildren();
        const shown = articles.filter(matches);
        shown.forEach((a) => {
            const item = el('button', 'wiki-item' + (a.id === current ? ' active' : ''), a.title.replace(/^\d+\.\s*/, ''));
            item.type = 'button';
            item.addEventListener('click', () => show(a.id));
            list.appendChild(item);
        });
        if (!shown.length) list.appendChild(el('div', 'output-hint', 'Ничего не найдено.'));
    }

    function show(id, keepSearch) {
        const idx = articles.findIndex((a) => a.id === id);
        if (idx < 0) return;
        current = id;
        store.set('sql-wiki-current', id);
        const a = articles[idx];
        article.replaceChildren(renderMd(a.md));

        const nav = el('div', 'wiki-pager');
        if (articles[idx - 1]) {
            const p = el('button', '', '← ' + articles[idx - 1].title);
            p.type = 'button';
            p.addEventListener('click', () => show(articles[idx - 1].id));
            nav.appendChild(p);
        }
        if (articles[idx + 1]) {
            const n = el('button', '', articles[idx + 1].title + ' →');
            n.type = 'button';
            n.addEventListener('click', () => show(articles[idx + 1].id));
            nav.appendChild(n);
        }
        article.appendChild(nav);
        article.scrollTop = 0;

        if (query && !keepSearch) {
            const q = query.toLowerCase();
            const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
            let node;
            let first = null;
            while ((node = walker.nextNode())) {
                const i = node.nodeValue.toLowerCase().indexOf(q);
                if (i >= 0 && node.parentElement && !node.parentElement.closest('pre')) { first = node.parentElement; break; }
            }
            if (first) first.scrollIntoView({ block: 'center' });
        }
        renderList();
    }

    function open() {
        if (!articles.length) return;
        isOpen = true;
        contentArea.hidden = true;
        root.hidden = false;
        button.classList.add('active');
        document.querySelectorAll('.tree-task.active').forEach((n) => n.classList.add('dimmed'));
        if (!articles.some((a) => a.id === current)) current = articles[0].id;
        show(current, true);
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        root.hidden = true;
        contentArea.hidden = false;
        button.classList.remove('active');
        document.querySelectorAll('.tree-task.dimmed').forEach((n) => n.classList.remove('dimmed'));
    }

    search.addEventListener('input', () => {
        query = search.value.trim();
        renderList();
        const shown = articles.filter(matches);
        if (shown.length && !shown.some((a) => a.id === current)) show(shown[0].id);
        else if (shown.length && query) show(current);
    });
    button.addEventListener('click', () => (isOpen ? close() : open()));

    return {
        setData(list_) {
            articles = list_;
            button.hidden = !articles.length;
            renderList();
        },
        close,
        open,
    };
}
