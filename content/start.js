(() => {
  'use strict';
  const { add } = Deck;

  add('start', [
    {
      id: 'titel',
      layout: 'title',
      kicker: 'Team-Session · Stand Oktober 2026',
      title: 'Neuerungen in TypeScript, JavaScript, CSS und HTML',
      blocks: [
        {
          type: 'lead',
          text: 'Was die Plattform heute kann. Schwerpunkt Oktober 2023 bis Oktober 2026, ergänzt um ausgewählte ältere Grundlagen. Jede Demo ist live bearbeitbar.'
        },
        {
          type: 'cards',
          items: [
            { chapter: 'ts', goto: 'chapter:ts', meta: 'Kapitel 1 · 10–12 Min.', title: 'TypeScript', text: 'Typen mit weniger Hilfscode, frühere Fehlermeldungen, TypeScript 6 und 7' },
            { chapter: 'js', goto: 'chapter:js', meta: 'Kapitel 2 · 10–12 Min.', title: 'JavaScript', text: 'Gruppieren, Mengen, Iteratoren und sichere Suchmuster' },
            { chapter: 'css', goto: 'chapter:css', meta: 'Kapitel 3 · 15 Min.', title: 'CSS', text: 'Zustände, Container, Positionsfunktionen, Fortschritt und eigene Funktionen' },
            { chapter: 'html', goto: 'chapter:html', meta: 'Kapitel 4 · 8–17 Min.', title: 'HTML', text: 'Dialoge, Popovers, Akkordeons und gestaltbare Formularfelder' }
          ]
        }
      ],
      notes: [
        'Begrüßung. Ziel: zeigen, was die Plattform heute selbst übernimmt, und wo wir eigenen Code einsparen können.',
        'Die Unterlage ist ein Baukasten. Mit **R** blenden wir Reserve- und Zusatzbeispiele aus und bleiben im Hauptablauf.',
        'Mit **O** öffnet sich die Übersicht, mit **1–4** springen wir direkt in ein Kapitel.'
      ]
    },
    {
      id: 'ablauf',
      title: 'Ablauf und Kapitelwahl',
      blocks: [
        {
          type: 'p',
          text: 'Alle vier Bereiche nacheinander ergeben etwa 45 bis 55 Minuten. Für eine kurze Session wählen wir Kapitel aus oder verteilen sie auf zwei Termine.'
        },
        {
          type: 'table',
          head: ['Kapitel', 'Dauer', 'Roter Faden'],
          rows: [
            ['TypeScript', '10–12 Min.', '`satisfies` → `const`-Typparameter → Type Predicates → verdächtige Bedingungen → TS 6 und 7'],
            ['JavaScript', '10–12 Min.', '`.at()` → `groupBy` → Set-Operationen → Iterator Helpers → Supportcheck'],
            ['CSS', '15 Min.', '`:has()` → Container und `cqi` → `sibling-index()` → Counter → `progress()` und Scroll-Timeline → `@function`'],
            ['HTML', '8–10 Min. kurz, 14–17 Min. erweitert', 'Dialog und deklarative Buttons → Popover → exklusives Akkordeon → Customizable Select und weitere']
          ]
        },
        {
          type: 'cards',
          items: [
            { chapter: 'ts', goto: 'chapter:ts', meta: 'Taste 1', title: 'TypeScript' },
            { chapter: 'js', goto: 'chapter:js', meta: 'Taste 2', title: 'JavaScript' },
            { chapter: 'css', goto: 'chapter:css', meta: 'Taste 3', title: 'CSS' },
            { chapter: 'html', goto: 'chapter:html', meta: 'Taste 4', title: 'HTML' }
          ]
        }
      ],
      notes: [
        'Kurz abstimmen, welche Kapitel heute im Fokus stehen.',
        'HTML und CSS lassen sich gut verbinden: erst native Interaktion zeigen, dann deren Gestaltung.',
        'Bei jedem Beispiel nach dem Ergebnis eine konkrete Einsatzstelle im Team nennen.'
      ]
    },
    {
      id: 'legende',
      title: 'So lesen wir die Kennzeichnungen',
      blocks: [
        {
          type: 'legend',
          items: [
            { status: 'neu', text: 'Im Zeitraum Oktober 2023 bis Oktober 2026 erschienen oder browserübergreifend verfügbar geworden.' },
            { status: 'grundlage', text: 'Bereits vor Oktober 2023 verfügbar. Wir zeigen sie, weil spätere Beispiele darauf aufbauen oder sie im Alltag noch selten genutzt werden.' },
            { status: 'eingeschraenkt', text: 'Fehlt noch in mindestens einem verbreiteten Browser oder einer Laufzeit. Nur mit Fallback oder nach Prüfung der Zielumgebung einsetzen.' },
            { status: 'experimentell', text: 'Entwurf, Origin Trial oder nur in einem Browser. Ausblick, kein Standardbaustein für Projekte.' },
            { chip: 'Reserve', cls: 'chip-role', text: 'Gehört nicht zum Hauptablauf. Mit **R** ausblendbar.' },
            { chip: '✓ In diesem Browser verfügbar', cls: 'check is-ok', text: 'Live-Prüfung im Browser, in dem die Präsentation gerade läuft.' }
          ]
        },
        {
          type: 'callout',
          title: 'Baseline',
          text: '**Newly available** bedeutet Unterstützung in den aktuellen Baseline-Kernbrowsern (Chrome, Edge, Firefox, Safari). **Widely available** folgt 30 Monate später. Beides ersetzt nicht die Prüfung unserer konkreten Zielbrowser, WebViews und Node-Versionen.'
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Stand der Angaben',
          text: 'Supportangaben wurden am 5. und 26. Oktober 2026 recherchiert. Supportstände am Vorführungstag erneut prüfen, besonders bei eingeschränkten und experimentellen Features.'
        }
      ],
      sources: [
        { label: 'web.dev Baseline', url: 'https://web.dev/baseline' },
        { label: 'WebDX Feature Explorer', url: 'https://web-platform-dx.github.io/web-features-explorer/' }
      ],
      notes: [
        'Die Kennzeichnungen tauchen auf jeder Folie oben auf.',
        'Der grüne oder rote Live-Check bezieht sich auf den Browser, in dem wir gerade präsentieren – nicht auf die Zielbrowser unserer Anwendungen.'
      ]
    }
  ]);
})();
