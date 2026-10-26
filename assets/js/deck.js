// Gemeinsame Daten und Hilfen für Präsentation und Referentenansicht.
// Klassische Skripte statt ES-Module, damit index.html auch per file:// läuft.
window.Deck = (() => {
  'use strict';

  const chapters = [
    { id: 'start', label: 'Start', short: 'Start', key: '0' },
    { id: 'ts', label: 'TypeScript', short: 'TS', key: '1' },
    { id: 'js', label: 'JavaScript', short: 'JS', key: '2' },
    { id: 'css', label: 'CSS', short: 'CSS', key: '3' },
    { id: 'html', label: 'HTML', short: 'HTML', key: '4' },
    { id: 'ende', label: 'Abschluss', short: 'Ende', key: '5' }
  ];

  // Einordnung eines Features
  const statuses = {
    neu: { label: 'Neu im Zeitraum', tone: 'new' },
    grundlage: { label: 'Ältere Grundlage', tone: 'base' },
    eingeschraenkt: { label: 'Eingeschränkter Support', tone: 'limited' },
    experimentell: { label: 'Experimentell', tone: 'exp' }
  };

  // Rolle einer Folie im Ablauf; ausgeblendet im Modus „Nur Hauptablauf“
  const roles = {
    reserve: 'Reserve',
    zusatz: 'Zusatzbeispiel',
    optional: 'Optional',
    einordnung: 'Einordnung'
  };
  const hiddenInMainOnly = new Set(['reserve', 'zusatz', 'optional']);

  const slides = [];

  // Template-Tag für Codebeispiele: entfernt gemeinsame Einrückung, lässt Backslashes unverändert.
  function d(strings, ...values) {
    const text = String.raw({ raw: strings.raw }, ...values)
      .replace(/^[ \t]*\n/, '')
      .replace(/\n[ \t]*$/, '');
    const lines = text.split('\n');
    const indent = Math.min(
      ...lines.filter(line => line.trim()).map(line => line.match(/^ */)[0].length)
    );
    return lines.map(line => line.slice(indent)).join('\n');
  }

  function add(chapter, list) {
    for (const slide of list) slides.push({ chapter, ...slide });
  }

  const isMain = slide => !hiddenInMainOnly.has(slide.role);

  return { chapters, statuses, roles, slides, d, add, isMain };
})();
