// Wandelt die Foliendaten aus content/*.js in DOM-Elemente um.
(() => {
  'use strict';

  const { chapters, statuses, roles } = Deck;

  const esc = text => String(text).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // Minimales Inline-Markdown: `code`, **fett**, [Link](https://…)
  function md(text) {
    return String(text).split(/(`[^`]+`)/).map(part => {
      if (part.length > 1 && part.startsWith('`') && part.endsWith('`')) {
        return `<code>${esc(part.slice(1, -1))}</code>`;
      }
      return esc(part)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    }).join('');
  }

  function el(tag, cls, html) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function runTest(test) {
    try {
      return Boolean(test());
    } catch {
      return false;
    }
  }

  const chapterLabel = id => chapters.find(c => c.id === id)?.label ?? id;

  function badges(slide, { live = true } = {}) {
    const wrap = el('div', 'badges');
    for (const status of [].concat(slide.status || [])) {
      const info = statuses[status];
      wrap.append(el('span', `badge badge-${info.tone}`, esc(info.label)));
    }
    if (slide.role && roles[slide.role]) wrap.append(el('span', 'chip chip-role', esc(roles[slide.role])));
    if (slide.since) wrap.append(el('span', 'chip', esc(slide.since)));
    if (slide.minutes) wrap.append(el('span', 'chip', `${esc(slide.minutes)} Min.`));
    if (live && slide.support?.test) {
      const ok = runTest(slide.support.test);
      const chip = el('span', `chip check ${ok ? 'is-ok' : 'is-missing'}`,
        ok ? '✓ In diesem Browser verfügbar' : '✗ In diesem Browser nicht verfügbar');
      chip.title = 'Live-Prüfung im aktuell verwendeten Browser';
      wrap.append(chip);
    }
    return wrap;
  }

  function table(head, rows) {
    const wrap = el('div', 'table-wrap');
    const tbl = el('table');
    if (head) {
      const tr = el('tr');
      for (const cell of head) tr.append(el('th', null, md(cell)));
      const thead = el('thead');
      thead.append(tr);
      tbl.append(thead);
    }
    const body = el('tbody');
    for (const row of rows) {
      const tr = el('tr');
      row.forEach((cell, i) => tr.append(el(i === 0 && !head ? 'th' : 'td', null, md(cell))));
      body.append(tr);
    }
    tbl.append(body);
    wrap.append(tbl);
    return wrap;
  }

  function renderBlock(block, ctx, path) {
    switch (block.type) {
      case 'lead':
        return el('p', 'lead', md(block.text));
      case 'p':
        return el('p', null, md(block.text));
      case 'h':
        return el('h2', 'block-heading', md(block.text));
      case 'list': {
        const list = el(block.ordered ? 'ol' : 'ul', 'list');
        for (const item of block.items) list.append(el('li', null, md(item)));
        return list;
      }
      case 'table':
        return table(block.head, block.rows);
      case 'callout': {
        const box = el('div', `callout callout-${block.tone || 'info'}`);
        if (block.title) box.append(el('p', 'callout-title', md(block.title)));
        box.append(el('p', null, md(block.text)));
        return box;
      }
      case 'code': {
        const editor = Deck.Demo.createEditor({ lang: block.lang, value: block.code, label: block.label, readOnly: true });
        editor.el.classList.add('is-static');
        return editor.el;
      }
      case 'demo':
        return Deck.Demo.create(block, `${ctx.slideId}:${path}`, { stack: ctx.stack });
      case 'compare': {
        const wrap = el('div', 'compare');
        for (const side of ['before', 'after']) {
          const data = block[side];
          const col = el('section', `compare-side compare-${data.tone || side}`);
          col.append(el('h2', 'compare-label', md(data.label || (side === 'before' ? 'Vorher' : 'Heute'))));
          col.append(renderBlocks(data.blocks, { ...ctx, stack: true }, `${path}${side[0]}`));
          wrap.append(col);
        }
        return wrap;
      }
      case 'columns': {
        const wrap = el('div', 'columns');
        block.cols.forEach((col, i) => {
          const div = el('div', 'column');
          div.append(renderBlocks(col, ctx, `${path}c${i}`));
          wrap.append(div);
        });
        return wrap;
      }
      case 'cards': {
        const grid = el('div', 'cards');
        for (const item of block.items) {
          const card = el(item.goto ? 'button' : 'div', 'card');
          if (item.goto) {
            card.type = 'button';
            card.addEventListener('click', () => ctx.goto?.(item.goto));
          }
          if (item.chapter) card.dataset.chapter = item.chapter;
          if (item.meta) card.append(el('span', 'card-meta', md(item.meta)));
          card.append(el('span', 'card-title', md(item.title)));
          if (item.text) card.append(el('span', 'card-text', md(item.text)));
          grid.append(card);
        }
        return grid;
      }
      case 'legend': {
        const list = el('dl', 'legend');
        for (const item of block.items) {
          const dt = el('dt');
          dt.append(item.status
            ? el('span', `badge badge-${statuses[item.status].tone}`, esc(statuses[item.status].label))
            : el('span', `chip ${item.cls || ''}`, esc(item.chip)));
          list.append(dt, el('dd', null, md(item.text)));
        }
        return list;
      }
      case 'checks': {
        const rows = block.items.map(item => {
          const ok = runTest(item.test);
          return { item, ok };
        });
        const wrap = el('div', 'table-wrap');
        const tbl = el('table', 'checks');
        tbl.innerHTML = '<thead><tr><th>Feature</th><th>Prüfung</th><th>Dieser Browser</th></tr></thead>';
        const body = el('tbody');
        for (const { item, ok } of rows) {
          const tr = el('tr');
          tr.append(el('td', null, md(item.label)), el('td', null, `<code>${esc(item.code)}</code>`));
          tr.append(el('td', `check-cell ${ok ? 'is-ok' : 'is-missing'}`, ok ? '✓ verfügbar' : '✗ fehlt'));
          body.append(tr);
        }
        tbl.append(body);
        wrap.append(tbl);
        const ua = el('p', 'fineprint', `Geprüft im aktuell verwendeten Browser: ${esc(navigator.userAgent)}`);
        const frag = document.createDocumentFragment();
        frag.append(wrap, ua);
        return frag;
      }
      default:
        return el('p', 'callout callout-warn', `Unbekannter Blocktyp: ${esc(block.type)}`);
    }
  }

  function renderBlocks(list = [], ctx, prefix = '') {
    const frag = document.createDocumentFragment();
    list.forEach((block, i) => frag.append(renderBlock(block, ctx, `${prefix}${i}`)));
    return frag;
  }

  function slide(data, ctx) {
    const article = el('article', `slide-inner layout-${data.layout || 'default'}`);
    article.dataset.chapter = data.chapter;

    const head = el('header', 'slide-head');
    const kicker = data.kicker ?? chapterLabel(data.chapter);
    if (kicker) head.append(el('p', 'kicker', md(kicker)));
    if (data.topic) head.append(el('p', 'topic', md(data.topic)));
    head.append(el('h1', 'slide-title', md(data.title)));
    const badgeRow = badges(data);
    if (badgeRow.childElementCount) head.append(badgeRow);
    article.append(head);

    const body = el('div', 'slide-body');
    body.append(renderBlocks(data.blocks, { ...ctx, slideId: data.id }));
    article.append(body);

    if (data.support?.text || data.sources?.length) {
      const foot = el('footer', 'slide-foot');
      if (data.support?.text) {
        const p = el('p', 'support');
        p.innerHTML = `<strong>Support:</strong> ${md(data.support.text)}`;
        foot.append(p);
      }
      if (data.sources?.length) foot.append(sources(data.sources));
      article.append(foot);
    }
    return article;
  }

  function sources(list) {
    const wrap = el('div', 'sources');
    wrap.append(el('strong', null, list.length > 1 ? 'Quellen:' : 'Quelle:'));
    const ul = el('ul');
    for (const source of list) {
      const li = el('li');
      li.innerHTML = `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${md(source.label)}</a>`;
      ul.append(li);
    }
    wrap.append(ul);
    return wrap;
  }

  function notes(data) {
    const frag = document.createDocumentFragment();
    const list = [].concat(data.notes || []);
    if (!list.length) {
      frag.append(el('p', 'muted', 'Keine Notizen für diese Folie.'));
      return frag;
    }
    const ul = el('ul', 'notes-list');
    for (const note of list) ul.append(el('li', null, md(note)));
    frag.append(ul);
    return frag;
  }

  Deck.render = { md, esc, el, badges, slide, notes, sources, runTest, chapterLabel };
})();
