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
          text: 'Was heute schon geht: Schwerpunkt Oktober 2023 bis Oktober 2026, dazu einige ältere Grundlagen. Alle Demos lassen sich live bearbeiten.'
        },
        {
          type: 'cards',
          items: [
            { chapter: 'ts', goto: 'chapter:ts', meta: 'Kapitel 1 · 10–12 Min.', title: 'TypeScript', text: 'Genauere Typen mit weniger Hilfscode, Fehler früher finden, TypeScript 6 und 7' },
            { chapter: 'js', goto: 'chapter:js', meta: 'Kapitel 2 · 10–12 Min.', title: 'JavaScript', text: 'Gruppieren, Mengenoperationen, Iteratoren und Suchtexte in regulären Ausdrücken' },
            { chapter: 'css', goto: 'chapter:css', meta: 'Kapitel 3 · 15 Min.', title: 'CSS', text: 'Zustände, Container, Positionsfunktionen, Fortschritt und eigene Funktionen' },
            { chapter: 'html', goto: 'chapter:html', meta: 'Kapitel 4 · 8–17 Min.', title: 'HTML', text: 'Dialoge, Popovers, Akkordeons und gestaltbare Formularfelder' }
          ]
        }
      ],
      notes: [
        'Begrüßung. Ziel: zeigen, was Browser und Sprache inzwischen selbst erledigen und wo wir uns eigenen Code sparen können.',
        'Die Folien sind ein Baukasten. Mit **R** blenden wir Reserve- und Zusatzbeispiele aus und bleiben beim Hauptablauf.',
        'Mit **O** öffnet sich die Übersicht, mit **1–4** springen wir direkt in ein Kapitel.'
      ]
    },
    {
      id: 'ablauf',
      title: 'Ablauf und Kapitelwahl',
      blocks: [
        {
          type: 'p',
          text: 'Alle vier Kapitel am Stück dauern etwa 45 bis 55 Minuten. Für eine kürzere Session wählen wir einzelne Kapitel aus oder verteilen sie auf zwei Termine.'
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
        'Kurz abstimmen, welche Kapitel wir heute machen.',
        'HTML und CSS passen gut zusammen: erst zeigen, welche Interaktion der Browser mitbringt, dann, wie wir sie gestalten.',
        'Nach jedem Beispiel eine konkrete Stelle in unseren Projekten nennen, an der es passen würde.'
      ]
    },
    {
      id: 'legende',
      title: 'Was die Kennzeichnungen bedeuten',
      blocks: [
        {
          type: 'legend',
          items: [
            { status: 'neu', text: 'Zwischen Oktober 2023 und Oktober 2026 erschienen oder in allen großen Browsern angekommen.' },
            { status: 'grundlage', text: 'Schon vor Oktober 2023 verfügbar. Wir zeigen sie trotzdem, weil spätere Beispiele darauf aufbauen oder weil sie im Alltag noch selten vorkommen.' },
            { status: 'eingeschraenkt', text: 'Fehlt noch in mindestens einem verbreiteten Browser oder einer Laufzeitumgebung. Nur mit Fallback einsetzen oder nachdem wir die Zielumgebung geprüft haben.' },
            { status: 'experimentell', text: 'Entwurf, Origin Trial oder nur in einem Browser. Ein Blick nach vorn, noch nichts für den Projektalltag.' },
            { chip: 'Reserve', cls: 'chip-role', text: 'Nicht Teil des Hauptablaufs, lässt sich mit **R** ausblenden.' },
            { chip: '✓ In diesem Browser verfügbar', cls: 'check is-ok', text: 'Wird live in dem Browser geprüft, in dem die Präsentation gerade läuft.' }
          ]
        },
        {
          type: 'callout',
          title: 'Baseline',
          text: '**Newly available** heißt: Das Feature läuft in den aktuellen Versionen der Baseline-Kernbrowser (Chrome, Edge, Firefox, Safari). **Widely available** gilt 30 Monate danach. Unsere eigenen Zielbrowser, WebViews und Node-Versionen müssen wir trotzdem selbst prüfen.'
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Stand der Angaben',
          text: 'Die Angaben zur Browserunterstützung stammen vom 5. und 26. Oktober 2026. Am Tag der Vorführung noch einmal nachsehen, vor allem bei eingeschränkten und experimentellen Features.'
        }
      ],
      sources: [
        { label: 'web.dev Baseline', url: 'https://web.dev/baseline' },
        { label: 'WebDX Feature Explorer', url: 'https://web-platform-dx.github.io/web-features-explorer/' }
      ],
      notes: [
        'Die Kennzeichnungen stehen oben auf jeder Folie.',
        'Der grüne oder rote Live-Check bezieht sich auf den Browser, in dem wir gerade präsentieren – nicht auf die Zielbrowser unserer Anwendungen.'
      ]
    }
  ]);
})();
