// Referentenansicht: folgt dem Hauptfenster und steuert es per postMessage.
(() => {
  'use strict';

  const { slides, render } = Deck;
  const $ = selector => document.querySelector(selector);
  const main = window.opener;

  let visibleIds = slides.map(slide => slide.id);
  let currentId = null;
  let startedAt = Date.now();

  const theme = (() => {
    try { return localStorage.getItem('deck:theme'); } catch { return null; }
  })();
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;

  function send(message) {
    if (!main || main.closed) {
      $('.presenter-status').textContent = 'Hauptfenster nicht verbunden. Bitte mit Taste P aus der Präsentation öffnen.';
      return;
    }
    main.postMessage(message, '*');
  }

  function show(id) {
    const slide = slides.find(s => s.id === id);
    if (!slide) return;
    currentId = id;
    document.body.dataset.chapter = slide.chapter;

    $('#current-kicker').innerHTML = render.md(slide.kicker ?? render.chapterLabel(slide.chapter));
    $('#current-topic').innerHTML = slide.topic ? render.md(slide.topic) : '';
    $('#current-topic').hidden = !slide.topic;
    $('#current-title').innerHTML = render.md(slide.title);
    $('#current-badges').replaceChildren(render.badges(slide, { live: false }));
    $('#current-notes').replaceChildren(render.notes(slide));
    $('#current-sources').replaceChildren();
    if (slide.support?.text) {
      const p = render.el('p', 'support', `<strong>Support:</strong> ${render.md(slide.support.text)}`);
      $('#current-sources').append(p);
    }
    if (slide.sources?.length) $('#current-sources').append(render.sources(slide.sources));

    const visible = visibleIds.map(vid => slides.find(s => s.id === vid)).filter(Boolean);
    const index = visible.findIndex(s => s.id === id);
    const next = visible[index + 1];
    $('#next-title').innerHTML = next ? render.md(next.title) : 'Ende der Präsentation';
    $('.presenter-status').textContent = `Folie ${index + 1} von ${visible.length}`;

    const list = $('#chapter-list');
    list.replaceChildren();
    for (const item of visible.filter(s => s.chapter === slide.chapter)) {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = render.md(item.title);
      if (item.id === id) button.setAttribute('aria-current', 'true');
      button.addEventListener('click', () => send({ type: 'deck-nav', action: 'goto', id: item.id }));
      li.append(button);
      list.append(li);
    }
  }

  window.addEventListener('message', event => {
    if (event.source !== main) return;
    const data = event.data;
    if (!data || data.type !== 'deck-state') return;
    if (Array.isArray(data.visible)) visibleIds = data.visible;
    show(data.id);
  });

  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-nav]');
    if (nav) send({ type: 'deck-nav', action: nav.dataset.nav });
  });

  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest('button') && (event.key === ' ' || event.key === 'Enter')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault();
      send({ type: 'deck-nav', action: event.shiftKey ? 'prev' : 'next' });
    } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      send({ type: 'deck-nav', action: 'prev' });
    }
  });

  $('#timer-reset').addEventListener('click', () => { startedAt = Date.now(); tick(); });

  const pad = n => String(n).padStart(2, '0');
  function tick() {
    const seconds = Math.floor((Date.now() - startedAt) / 1000);
    $('#elapsed').textContent = `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
    $('#clock').textContent = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }
  setInterval(tick, 1000);
  tick();

  show(slides[0].id);
  send({ type: 'deck-presenter-ready' });
})();
