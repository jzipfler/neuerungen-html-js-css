// Navigation, Tastatursteuerung, Übersicht, Notizen und Referentenansicht.
(() => {
  'use strict';

  const { chapters, slides, render, isMain } = Deck;
  const $ = selector => document.querySelector(selector);

  const store = {
    get(key) {
      try { return localStorage.getItem(`deck:${key}`); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(`deck:${key}`, value); } catch { /* privates Fenster */ }
    }
  };

  const state = {
    id: null,
    mainOnly: store.get('mainOnly') === '1',
    notes: store.get('notes') === '1',
    scale: Number(store.get('scale')) || 1,
    theme: store.get('theme') || 'auto'
  };

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let presenter = null;

  const visible = () => slides.filter(slide => !state.mainOnly || isMain(slide));
  const byId = id => slides.find(slide => slide.id === id);

  function current() {
    const list = visible();
    return list.find(slide => slide.id === state.id) || list[0];
  }

  // Liegt die aktuelle Folie nicht im sichtbaren Ablauf, nächste sichtbare wählen
  function nearestVisible(id) {
    const list = visible();
    if (list.some(slide => slide.id === id)) return id;
    const start = slides.findIndex(slide => slide.id === id);
    for (let i = start; i < slides.length; i++) {
      if (list.includes(slides[i])) return slides[i].id;
    }
    return list[list.length - 1]?.id;
  }

  function go(id, { push = true } = {}) {
    const target = byId(id) ? nearestVisible(id) : visible()[0].id;
    if (target === state.id) return;
    state.id = target;
    if (push) history.replaceState(null, '', `#${target}`);
    const update = () => mount();
    if (document.startViewTransition && !reducedMotion.matches) {
      // Bei schnellen Wechseln überspringt der Browser Übergänge; das ist kein Fehler
      document.startViewTransition(update).ready.catch(() => {});
    } else {
      update();
    }
  }

  function step(delta) {
    const list = visible();
    const index = list.indexOf(current());
    const next = list[Math.min(list.length - 1, Math.max(0, index + delta))];
    go(next.id);
  }

  function gotoTarget(target) {
    if (target.startsWith('chapter:')) {
      const chapter = target.slice(8);
      const first = visible().find(slide => slide.chapter === chapter);
      if (first) go(first.id);
    } else {
      go(target);
    }
  }

  function mount() {
    const slide = current();
    state.id = slide.id;
    Deck.Demo.reset();

    const main = $('#slide');
    const hadFocus = main.contains(document.activeElement);
    main.replaceChildren(render.slide(slide, { goto: gotoTarget }));
    main.scrollTop = 0;
    if (hadFocus) main.focus({ preventScroll: true });

    document.body.dataset.chapter = slide.chapter;
    document.title = `${slide.title.replace(/[`*]/g, '')} · Neuerungen im Web`;

    const list = visible();
    const index = list.indexOf(slide);
    $('.counter').textContent = `${index + 1} / ${list.length}`;
    $('.progress-bar').style.width = `${((index + 1) / list.length) * 100}%`;
    $('[data-action="prev"]').disabled = index === 0;
    $('[data-action="next"]').disabled = index === list.length - 1;
    $('#announce').textContent = `Folie ${index + 1} von ${list.length}: ${slide.title.replace(/`/g, '')}`;

    for (const button of document.querySelectorAll('.chapters button')) {
      const active = button.dataset.chapter === slide.chapter;
      if (active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    }

    renderNotes(slide);
    sendToPresenter();
  }

  function renderNotes(slide) {
    const panel = $('#notes');
    panel.hidden = !state.notes;
    $('[data-action="notes"]').setAttribute('aria-pressed', String(state.notes));
    if (!state.notes) return;
    const body = $('#notes .notes-body');
    body.replaceChildren(render.notes(slide));
    $('#notes .notes-meta').textContent = slide.minutes ? `Geplant: ${slide.minutes} Min.` : '';
  }

  function buildChapterNav() {
    const nav = $('.chapters');
    nav.replaceChildren();
    for (const chapter of chapters) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.chapter = chapter.id;
      button.innerHTML = `<span class="dot" aria-hidden="true"></span><span class="long">${chapter.label}</span><span class="short">${chapter.short}</span>`;
      button.title = `${chapter.label} (Taste ${chapter.key})`;
      button.addEventListener('click', () => gotoTarget(`chapter:${chapter.id}`));
      nav.append(button);
    }
  }

  function openOverview() {
    const dialog = $('#overview');
    const body = dialog.querySelector('.overview-body');
    body.replaceChildren();
    const list = visible();
    for (const chapter of chapters) {
      const items = list.filter(slide => slide.chapter === chapter.id);
      if (!items.length) continue;
      const section = document.createElement('section');
      section.className = 'overview-chapter';
      section.dataset.chapter = chapter.id;
      section.innerHTML = `<h3><span class="dot" aria-hidden="true"></span>${chapter.label} <kbd>${chapter.key}</kbd></h3>`;
      const ol = document.createElement('ol');
      for (const slide of items) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'overview-item';
        if (slide.id === state.id) button.setAttribute('aria-current', 'true');
        const title = document.createElement('span');
        title.className = 'overview-title';
        title.innerHTML = render.md(slide.title);
        button.append(title, render.badges(slide, { live: false }));
        button.addEventListener('click', () => {
          dialog.close();
          go(slide.id);
        });
        li.append(button);
        ol.append(li);
      }
      section.append(ol);
      body.append(section);
    }
    dialog.querySelector('.overview-mode').textContent = state.mainOnly
      ? 'Modus: Nur Hauptablauf (Reserve und Zusatzbeispiele ausgeblendet)'
      : 'Modus: Alle Folien';
    dialog.showModal();
    dialog.querySelector('[aria-current="true"]')?.focus();
  }

  function toggleMainOnly() {
    state.mainOnly = !state.mainOnly;
    store.set('mainOnly', state.mainOnly ? '1' : '0');
    $('[data-action="mainonly"]').setAttribute('aria-pressed', String(state.mainOnly));
    state.id = nearestVisible(state.id);
    const keep = state.id;
    state.id = null;
    go(keep);
  }

  function toggleNotes() {
    state.notes = !state.notes;
    store.set('notes', state.notes ? '1' : '0');
    renderNotes(current());
  }

  function applyTheme() {
    if (state.theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.dataset.theme = state.theme;
    const labels = { auto: 'System', light: 'Hell', dark: 'Dunkel' };
    const button = $('[data-action="theme"]');
    button.textContent = `◐ ${labels[state.theme]}`;
    button.title = `Farbschema: ${labels[state.theme]} (T)`;
  }

  function cycleTheme() {
    const order = ['auto', 'light', 'dark'];
    state.theme = order[(order.indexOf(state.theme) + 1) % order.length];
    store.set('theme', state.theme);
    applyTheme();
  }

  function setScale(value) {
    state.scale = Math.min(1.6, Math.max(0.7, Math.round(value * 10) / 10));
    store.set('scale', String(state.scale));
    document.documentElement.style.setProperty('--scale', state.scale);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }

  // Referentenansicht: eigenes Fenster, Abstimmung per postMessage (funktioniert auch per file://)
  function openPresenter() {
    if (presenter && !presenter.closed) {
      presenter.focus();
      return;
    }
    presenter = window.open('presenter.html', 'deck-presenter', 'width=1100,height=760');
  }

  function sendToPresenter() {
    if (!presenter || presenter.closed) return;
    presenter.postMessage({
      type: 'deck-state',
      id: state.id,
      visible: visible().map(slide => slide.id)
    }, '*');
  }

  window.addEventListener('message', event => {
    if (!presenter || event.source !== presenter) return;
    const data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'deck-presenter-ready') sendToPresenter();
    if (data.type === 'deck-nav') {
      if (data.action === 'next') step(1);
      else if (data.action === 'prev') step(-1);
      else if (data.action === 'goto' && typeof data.id === 'string') go(data.id);
    }
  });

  const actions = {
    prev: () => step(-1),
    next: () => step(1),
    home: () => go(visible()[0].id),
    overview: openOverview,
    notes: toggleNotes,
    mainonly: toggleMainOnly,
    presenter: openPresenter,
    theme: cycleTheme,
    help: () => $('#help').showModal(),
    fullscreen: toggleFullscreen
  };

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-action]');
    if (trigger && actions[trigger.dataset.action]) actions[trigger.dataset.action]();
  });

  const keymap = [
    { keys: ['→', 'Leertaste', 'Bild ↓'], text: 'Nächste Folie' },
    { keys: ['←', '⇧ + Leertaste', 'Bild ↑'], text: 'Vorherige Folie' },
    { keys: ['Pos1', 'Ende'], text: 'Erste und letzte Folie' },
    { keys: ['0', '1', '2', '3', '4', '5'], text: 'Kapitel: Start, TypeScript, JavaScript, CSS, HTML, Abschluss' },
    { keys: ['O'], text: 'Übersicht und Kapitelwahl' },
    { keys: ['N'], text: 'Sprechernotizen ein- und ausblenden' },
    { keys: ['P'], text: 'Referentenansicht in neuem Fenster' },
    { keys: ['R'], text: 'Nur Hauptablauf (Reserve und Zusatzbeispiele ausblenden)' },
    { keys: ['T'], text: 'Farbschema wechseln' },
    { keys: ['+', '−'], text: 'Schrift vergrößern oder verkleinern' },
    { keys: ['F'], text: 'Vollbild' },
    { keys: ['?'], text: 'Diese Hilfe' },
    { keys: ['Strg/⌘ + Enter'], text: 'Im Editor: Demo sofort ausführen' },
    { keys: ['Esc'], text: 'Im Editor: Editor verlassen, danach wirken die Pfeiltasten wieder' }
  ];

  function buildHelp() {
    const dl = $('#help .help-keys');
    for (const entry of keymap) {
      const dt = document.createElement('dt');
      dt.innerHTML = entry.keys.map(key => `<kbd>${key}</kbd>`).join(' ');
      const dd = document.createElement('dd');
      dd.textContent = entry.text;
      dl.append(dt, dd);
    }
  }

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (document.querySelector('dialog[open]')) return;
    const target = event.target;
    if (target.closest?.('textarea, input, select, [contenteditable]:not([contenteditable="false"])')) return;
    const onControl = target.closest?.('button, a, summary');
    const key = event.key;

    if ((key === ' ' || key === 'Enter') && onControl) return;

    const chapter = chapters.find(c => c.key === key);
    if (chapter) {
      gotoTarget(`chapter:${chapter.id}`);
      event.preventDefault();
      return;
    }

    const handlers = {
      ArrowRight: () => step(1),
      PageDown: () => step(1),
      ' ': () => step(event.shiftKey ? -1 : 1),
      ArrowLeft: () => step(-1),
      PageUp: () => step(-1),
      Home: () => go(visible()[0].id),
      End: () => go(visible()[visible().length - 1].id),
      o: openOverview,
      n: toggleNotes,
      p: openPresenter,
      r: toggleMainOnly,
      t: cycleTheme,
      f: toggleFullscreen,
      '+': () => setScale(state.scale + 0.1),
      '=': () => setScale(state.scale + 0.1),
      '-': () => setScale(state.scale - 0.1),
      '?': () => $('#help').showModal()
    };
    const handler = handlers[key] || handlers[key.toLowerCase()];
    if (handler) {
      event.preventDefault();
      handler();
    }
  });

  window.addEventListener('hashchange', () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && id !== state.id) go(id, { push: false });
  });

  // Start
  buildChapterNav();
  buildHelp();
  applyTheme();
  setScale(state.scale);
  $('[data-action="mainonly"]').setAttribute('aria-pressed', String(state.mainOnly));
  const initial = decodeURIComponent(location.hash.slice(1));
  state.id = nearestVisible(byId(initial) ? initial : visible()[0].id);
  mount();
})();
