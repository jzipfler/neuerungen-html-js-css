// Bearbeitbare Live-Demos: Editor mit Hervorhebung, Ausführung in einem
// isolierten iframe (sandbox ohne allow-same-origin) und Konsolenausgabe.
(() => {
  'use strict';

  const LABELS = { html: 'HTML', css: 'CSS', js: 'JavaScript', ts: 'TypeScript', bash: 'Shell', scss: 'CSS' };
  const ORDER = ['html', 'css', 'js', 'ts'];

  // Bearbeitete Fassungen bleiben erhalten, solange der Tab offen ist.
  const edits = new Map();

  // Aktive Demos der aktuellen Folie; Nachrichten werden über event.source zugeordnet.
  const live = new Set();
  window.addEventListener('message', event => {
    const data = event.data;
    if (!data || data.source !== 'deck-demo') return;
    for (const demo of live) {
      if (demo.frame.contentWindow === event.source) demo.receive(data);
    }
  });

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function button(label, onClick, cls = 'btn') {
    const node = el('button', cls, label);
    node.type = 'button';
    node.addEventListener('click', onClick);
    return node;
  }

  function createEditor({ lang, value, label, onInput, onRun, readOnly = false }) {
    const wrap = el('div', 'editor');
    wrap.dataset.lang = lang;
    const head = el('div', 'editor-head');
    head.append(el('span', 'editor-lang', label || LABELS[lang] || lang));
    if (!readOnly) head.append(el('span', 'editor-hint', 'bearbeitbar'));
    const body = el('div', 'editor-body');
    const pre = el('pre', 'editor-hl');
    pre.setAttribute('aria-hidden', String(!readOnly));
    body.append(pre);
    wrap.append(head, body);

    let textarea = null;
    const render = text => { pre.innerHTML = Deck.highlight(text, lang) + '\n'; };

    if (readOnly) {
      render(value);
      return { el: wrap, get value() { return value; } };
    }

    textarea = el('textarea', 'editor-input');
    textarea.value = value;
    textarea.spellcheck = false;
    textarea.setAttribute('autocapitalize', 'off');
    textarea.setAttribute('autocomplete', 'off');
    textarea.setAttribute('autocorrect', 'off');
    textarea.setAttribute('aria-label', `${label || LABELS[lang]} bearbeiten. Escape verlässt den Editor.`);
    body.append(textarea);
    render(value);

    textarea.addEventListener('input', () => {
      render(textarea.value);
      onInput?.(textarea.value);
    });
    textarea.addEventListener('keydown', event => {
      if (event.key === 'Tab' && !event.shiftKey && !event.altKey && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        textarea.setRangeText('  ', textarea.selectionStart, textarea.selectionEnd, 'end');
        textarea.dispatchEvent(new Event('input'));
      } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onRun?.();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        textarea.blur();
      }
    });

    return {
      el: wrap,
      get value() { return textarea.value; },
      set value(text) { textarea.value = text; render(text); }
    };
  }

  // Wird als erstes Skript in jede Demo eingefügt und leitet Konsolenausgaben weiter.
  function bridgeSource(run) {
    return `(() => {
  const run = ${run};
  const send = (level, text) => parent.postMessage({ source: 'deck-demo', run, level, text }, '*');
  const name = key => /^[A-Za-z_$][\\w$]*$/.test(key) ? key : JSON.stringify(key);
  const fmt = (value, depth = 0, seen = new WeakSet()) => {
    if (typeof value === 'string') return depth ? JSON.stringify(value) : value;
    if (value === undefined) return 'undefined';
    if (value === null || typeof value === 'number' || typeof value === 'boolean') return Object.is(value, -0) ? '-0' : String(value);
    if (typeof value === 'bigint') return value + 'n';
    if (typeof value === 'symbol') return value.toString();
    if (typeof value === 'function') return '[Funktion ' + (value.name || 'anonym') + ']';
    if (value instanceof Error) return value.name + ': ' + value.message;
    if (typeof Element !== 'undefined' && value instanceof Element) return '<' + value.localName + (value.id ? '#' + value.id : '') + '>';
    if (seen.has(value)) return '[Zirkulär]';
    if (depth > 4) return Array.isArray(value) ? '[…]' : '{…}';
    seen.add(value);
    let out;
    const inner = v => fmt(v, depth + 1, seen);
    if (Array.isArray(value)) out = '[' + value.map(inner).join(', ') + ']';
    else if (ArrayBuffer.isView(value)) out = value.constructor.name + '(' + value.length + ') [' + Array.from(value).join(', ') + ']';
    else if (value instanceof Map) out = 'Map(' + value.size + ') {' + [...value].map(([k, v]) => inner(k) + ' => ' + inner(v)).join(', ') + '}';
    else if (value instanceof Set) out = 'Set(' + value.size + ') {' + [...value].map(inner).join(', ') + '}';
    else {
      const proto = Object.getPrototypeOf(value);
      const prefix = proto === null ? '[Object: null prototype] '
        : proto !== Object.prototype && proto.constructor && proto.constructor.name ? proto.constructor.name + ' ' : '';
      const keys = Object.keys(value);
      out = prefix + (keys.length ? '{ ' + keys.map(k => name(k) + ': ' + inner(value[k])).join(', ') + ' }' : '{}');
    }
    seen.delete(value);
    return out;
  };
  for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
    const original = console[level].bind(console);
    console[level] = (...args) => { original(...args); send(level, args.map(a => fmt(a)).join(' ')); };
  }
  console.table = data => {
    if (data && typeof data === 'object') {
      send('table', Object.entries(data).map(([k, v]) => k + '\\t' + fmt(v, 1)).join('\\n'));
    } else {
      send('log', fmt(data));
    }
  };
  addEventListener('error', event => send('error', event.message || String(event.error)));
  addEventListener('unhandledrejection', event => send('error', 'Unbehandelte Ablehnung: ' + fmt(event.reason)));
  // Fragmentlinks im srcdoc-Dokument halten, statt auf die Präsentation zu navigieren
  document.addEventListener('click', event => {
    const link = event.target.closest && event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented) return;
    event.preventDefault();
    location.hash = link.getAttribute('href');
  });
})();`;
  }

  const BASE_CSS = `:root { color-scheme: light; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; line-height: 1.5; }
body { margin: 16px; color: #0f172a; background: #ffffff; }
button, input, select, textarea { font: inherit; }
button { cursor: pointer; }`;

  const safeScript = code => code.replace(/<\/script/gi, '<\\/script');
  const safeStyle = code => code.replace(/<\/style/gi, '<\\/style');

  function buildDocument({ html = '', css = '', js = '' }, run) {
    return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${BASE_CSS}</style>
<style id="demo-css">${safeStyle(css)}</style>
<script>${bridgeSource(run)}<\/script>
</head>
<body>
${html}
${js ? `<script>${safeScript(js)}<\/script>` : ''}
</body>
</html>`;
  }

  // block: { kind: 'js' | 'web' | 'ts', html?, css?, js?, ts?, height?, versions?, stack? }
  function create(block, key, options = {}) {
    const kind = block.kind;
    const langs = ORDER.filter(lang => typeof block[lang] === 'string');
    const stacked = options.stack || block.stack || kind === 'ts';
    const root = el('div', `demo demo-${kind}${stacked ? ' stack' : ''}`);
    const codeCol = el('div', 'demo-code');
    const resultCol = el('div', 'demo-result');
    root.append(codeCol);

    const editors = {};
    let timer = 0;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(run, 650);
    };

    for (const lang of langs) {
      const storeKey = `${key}:${lang}`;
      editors[lang] = createEditor({
        lang,
        value: edits.get(storeKey) ?? block[lang],
        label: block.labels?.[lang],
        onInput: value => {
          edits.set(storeKey, value);
          if (kind !== 'ts') schedule();
        },
        onRun: () => run()
      });
      codeCol.append(editors[lang].el);
    }

    const toolbar = el('div', 'demo-toolbar');
    codeCol.append(toolbar);

    const reset = () => {
      for (const lang of langs) {
        edits.delete(`${key}:${lang}`);
        editors[lang].value = block[lang];
      }
      run();
    };

    if (kind === 'ts') {
      for (const version of block.versions || []) {
        const link = el('a', 'btn', `Playground · ${version.label}`);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.title = `Code im TypeScript Playground mit Version ${version.ts || 'aktuell'} öffnen`;
        const update = () => { link.href = Deck.playgroundUrl(editors.ts.value, version.ts); };
        link.addEventListener('pointerdown', update);
        link.addEventListener('focus', update);
        update();
        toolbar.append(link);
      }
      toolbar.append(button('Zurücksetzen', reset, 'btn btn-quiet'));
      return root;
    }

    toolbar.append(
      button('▶ Ausführen', () => run()),
      button('Zurücksetzen', reset, 'btn btn-quiet'),
      el('span', 'demo-hint', 'Läuft automatisch nach Änderungen · Strg/⌘ + Enter')
    );

    root.append(resultCol);
    const frameWrap = el('div', 'result-frame');
    const frameHead = el('div', 'result-head', kind === 'web' ? 'Ergebnis' : 'Ausführung');
    const frame = document.createElement('iframe');
    frame.title = 'Ergebnis der Demo';
    frame.setAttribute('sandbox', 'allow-scripts allow-modals allow-forms');
    frame.setAttribute('loading', 'eager');
    frameWrap.style.height = `${block.height || 240}px`;
    frameWrap.append(frame);

    const consoleWrap = el('div', 'console');
    const consoleHead = el('div', 'result-head', 'Konsole');
    const consoleBody = el('div', 'console-body');
    consoleBody.setAttribute('role', 'log');
    consoleWrap.append(consoleHead, consoleBody);

    if (kind === 'web') {
      resultCol.append(frameHead, frameWrap, consoleWrap);
    } else {
      // Reine Skriptdemo: das iframe läuft unsichtbar, gezeigt wird die Konsole
      frameWrap.hidden = true;
      resultCol.append(consoleWrap, frameWrap);
    }

    let runId = 0;
    let lines = 0;

    const showEmpty = () => {
      consoleBody.replaceChildren(el('div', 'console-empty', kind === 'web' ? 'Keine Ausgaben' : 'Noch keine Ausgabe'));
      consoleWrap.classList.toggle('is-empty', true);
    };

    function run() {
      clearTimeout(timer);
      runId++;
      lines = 0;
      showEmpty();
      const files = {};
      for (const lang of langs) files[lang] = editors[lang].value;
      frame.srcdoc = buildDocument(files, runId);
    }

    const demo = {
      frame,
      receive(message) {
        if (message.run !== runId) return;
        if (lines === 0) consoleBody.replaceChildren();
        consoleWrap.classList.toggle('is-empty', false);
        lines++;
        if (lines > 500) return;
        const line = el('div', `console-line level-${message.level}`);
        if (message.level === 'table') {
          const table = el('table', 'console-table');
          for (const row of String(message.text).split('\n')) {
            const [k, v] = row.split('\t');
            const tr = el('tr');
            tr.append(el('th', null, k));
            const td = el('td', v === 'true' ? 'is-true' : v === 'false' ? 'is-false' : null, v);
            tr.append(td);
            table.append(tr);
          }
          line.append(table);
        } else {
          line.textContent = message.text;
        }
        consoleBody.append(line);
      }
    };
    live.add(demo);
    run();
    return root;
  }

  Deck.Demo = {
    create,
    createEditor,
    // Vor jedem Folienwechsel aufrufen, damit alte iframes keine Nachrichten mehr zustellen
    reset() { live.clear(); }
  };
})();
