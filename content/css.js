(() => {
  'use strict';
  const { add, d } = Deck;

  // Prüft @function, indem eine Testfunktion definiert und ausgewertet wird
  function supportsCssFunction() {
    const style = document.createElement('style');
    style.textContent = '@function --deck-probe() { result: 7px; } .deck-probe { width: --deck-probe(); }';
    const probe = document.createElement('div');
    probe.className = 'deck-probe';
    probe.style.position = 'absolute';
    document.head.append(style);
    document.body.append(probe);
    const ok = getComputedStyle(probe).width === '7px';
    probe.remove();
    style.remove();
    return ok;
  }

  add('css', [
    {
      id: 'css',
      layout: 'chapter',
      kicker: 'Kapitel 3',
      title: 'CSS',
      since: 'Baseline 2023 bis 2026',
      blocks: [
        {
          type: 'lead',
          text: 'CSS entwickelt sich in einzelnen Modulen; eine jährliche Gesamtversion gibt es nicht. Wir ordnen die Auswahl nach dem Jahr der browserübergreifenden Verfügbarkeit.'
        },
        {
          type: 'table',
          head: ['Baseline-Jahr', 'Relevante Features', 'Demo'],
          rows: [
            ['2023', '`:has()` seit Dezember; Nesting; Container Size Queries; Subgrid; moderne Farbräume und `color-mix()`', '`:has()`'],
            ['2024', '`text-wrap: balance`; `light-dark()`; relative Farben; `@starting-style`; `transition-behavior`; `@property`; `backdrop-filter`; `scrollbar-gutter`', 'Text und Farben'],
            ['2025', 'View Transitions; `view-transition-class`; `::details-content`; `content-visibility`; Popover als benachbarte HTML-API', 'View Transitions'],
            ['2026', '`@scope`; Container Style Queries; `field-sizing`; `contrast-color()`; `shape()`; `:open`; `sibling-index()`; `sibling-count()`; `progress()`', 'Positionsfunktionen und Berechnungen']
          ]
        },
        {
          type: 'callout',
          text: 'Container Size Queries, Subgrid, moderne Farben und ursprüngliches Nesting waren bereits vor Oktober 2023 browserübergreifend verfügbar – ergänzende Grundlagen. Size Queries reagieren auf Containermaße, Style Queries auf Stilwerte; beide haben unterschiedliche Supportstände.'
        }
      ],
      sources: [
        { label: 'web.dev Baseline', url: 'https://web.dev/baseline' },
        { label: 'W3C CSS Snapshot 2025', url: 'https://www.w3.org/TR/css-2025/' },
        { label: 'Baseline 2023', url: 'https://web.dev/baseline/2023' },
        { label: 'Baseline 2024', url: 'https://web.dev/baseline/2024' },
        { label: 'Baseline 2025', url: 'https://web.dev/baseline/2025' },
        { label: 'Baseline 2026', url: 'https://web.dev/baseline/2026' }
      ],
      notes: [
        'Ziel: zeigen, was CSS heute ausdrücken kann. Ältere Grundlagen und Features mit eingeschränktem Support sind gekennzeichnet.',
        'Ursprüngliche Übersicht am 5. Oktober 2026 recherchiert; Container-Einheiten, Positionsfunktionen, Counter, Fortschritt und eigene Funktionen am 26. Oktober 2026 ergänzt.',
        'Die Unterlage ist ein Baukasten – alle Demos nacheinander würden die 15 Minuten sprengen. Mit **R** nur den Hauptablauf zeigen.'
      ]
    },

    {
      id: 'css-has',
      topic: '`:has()`',
      kicker: 'CSS · Demo 1 · Zustände ohne zusätzlichen Code',
      title: 'Das Elternelement reagiert auf den Inhalt',
      status: 'neu',
      since: 'Baseline Dezember 2023',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: '`:has()` wählt Elemente anhand passender verwandter Elemente aus. Für eine Aufgabenliste reicht CSS, um die Zeile eines ausgewählten Kontrollkästchens zu gestalten.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher: Klasse per change-Handler',
            blocks: [{
              type: 'demo', kind: 'web', height: 170,
              html: d`
                <label class="task"><input type="checkbox"> Dokumentation ergänzen</label>
                <label class="task"><input type="checkbox"> Tests schreiben</label>
              `,
              css: d`
                .task { display: block; padding: 1rem; }
                .task.is-done {
                  background: #dcfce7;
                  text-decoration: line-through;
                }
              `,
              js: d`
                document.querySelectorAll(".task input").forEach(input => {
                  input.addEventListener("change", () => {
                    input.closest(".task").classList.toggle("is-done", input.checked);
                  });
                });
              `
            }]
          },
          after: {
            label: 'Heute: nur CSS',
            blocks: [{
              type: 'demo', kind: 'web', height: 170,
              html: d`
                <label class="task"><input type="checkbox"> Dokumentation ergänzen</label>
                <label class="task"><input type="checkbox"> Tests schreiben</label>
              `,
              css: d`
                .task { display: block; padding: 1rem; }
                .task:has(input:checked) {
                  background: #dcfce7;
                  text-decoration: line-through;
                }
              `
            }]
          }
        }
      ],
      support: {
        text: 'Baseline seit Dezember 2023.',
        test: () => CSS.supports('selector(:has(*))')
      },
      sources: [
        { label: 'CSS Selectors Level 4: Relational Pseudo-class', url: 'https://drafts.csswg.org/selectors/#relational' }
      ],
      notes: [
        'Checkbox anklicken. Rechts gibt es keine Zeile JavaScript.',
        'Die Regel im Editor auskommentieren oder den Selektor ändern, etwa auf `:has(input:not(:checked))`.',
        'CSS steuert hier die Darstellung; gespeicherter Aufgabenstatus bleibt Aufgabe der Anwendungslogik.'
      ]
    },

    {
      id: 'css-text-wrap',
      topic: '`text-wrap: balance`',
      kicker: 'CSS · Zusatzbeispiel · Text',
      title: 'Überschriften gleichmäßiger umbrechen',
      status: 'neu',
      role: 'zusatz',
      since: 'Baseline 2024',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: '`text-wrap: balance` verteilt kurze Textblöcke auf ausgeglichenere Zeilen. Statt manueller `<br>`-Tags bleibt die Überschrift bei unterschiedlichen Breiten flexibel.'
        },
        {
          type: 'demo', kind: 'web', height: 330,
          html: d`
            <p class="hint">Rahmen unten rechts ziehen, um die Breite zu ändern.</p>
            <div class="box">
              <h1 class="headline plain">Neue Möglichkeiten für unsere Webanwendungen</h1>
              <h1 class="headline">Neue Möglichkeiten für unsere Webanwendungen</h1>
            </div>
          `,
          css: d`
            .headline {
              max-width: 24ch;
              font: 700 2.5rem/1.1 system-ui;
              text-wrap: balance;
            }
            .headline.plain { text-wrap: wrap; color: #94a3b8; }

            /* Nur Demo-Gestaltung */
            .box { resize: horizontal; overflow: auto; width: 26rem; max-width: 100%; border: 1px dashed #94a3b8; padding: 0 1rem; }
            .hint { margin: 0 0 0.5rem; font-size: 0.8rem; color: #64748b; }
          `
        }
      ],
      support: {
        text: 'Baseline 2024. Algorithmus und Zahl ausbalancierter Zeilen sind browserabhängig.',
        test: () => CSS.supports('text-wrap', 'balance')
      },
      sources: [
        { label: 'CSS Text Level 4: text-wrap-style', url: 'https://drafts.csswg.org/css-text-4/#text-wrap-style' }
      ],
      notes: [
        'Grau: normaler Umbruch, schwarz: `balance`. Breite des Rahmens ändern.',
        'Für kurze Überschriften verwenden. Es ist keine feste Kontrolle über einzelne Umbruchstellen.'
      ]
    },

    {
      id: 'css-light-dark',
      topic: '`light-dark()`',
      kicker: 'CSS · Zusatzbeispiel · Farbschemata',
      title: 'Zwei Farbschemata mit `light-dark()`',
      status: 'neu',
      role: 'zusatz',
      since: 'Baseline 2024',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: '`light-dark()` wählt einen Farbwert passend zum verwendeten Farbschema. Farbpaare stehen direkt am Einsatzort. Voraussetzung ist `color-scheme`.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher: Überschreiben per Media Query',
            blocks: [{
              type: 'code', lang: 'css', code: d`
                body { background: #f8fafc; color: #0f172a; }

                @media (prefers-color-scheme: dark) {
                  body { background: #0f172a; color: #f8fafc; }
                }
              `
            }]
          },
          after: {
            label: 'Heute',
            blocks: [{
              type: 'demo', kind: 'web', height: 180,
              html: d`
                <p>Diese Seite folgt dem Farbschema.</p>
                <button data-set="light">Hell</button>
                <button data-set="dark">Dunkel</button>
                <button data-set="">System</button>
              `,
              css: d`
                :root { color-scheme: light dark; }
                body {
                  background: light-dark(#f8fafc, #0f172a);
                  color: light-dark(#0f172a, #f8fafc);
                }
                :root[data-theme="light"] { color-scheme: light; }
                :root[data-theme="dark"]  { color-scheme: dark; }
              `,
              js: d`
                // Nur für die Demo: data-theme am html-Element setzen
                document.querySelectorAll("[data-set]").forEach(button => {
                  button.onclick = () => {
                    const value = button.dataset.set;
                    if (value) document.documentElement.dataset.theme = value;
                    else delete document.documentElement.dataset.theme;
                  };
                });
              `
            }]
          }
        }
      ],
      support: {
        text: 'Baseline 2024. Kontrast und Lesbarkeit der gewählten Farben weiterhin selbst prüfen.',
        test: () => CSS.supports('color', 'light-dark(white, black)')
      },
      sources: [
        { label: 'CSS Color Level 5: light-dark()', url: 'https://drafts.csswg.org/css-color-5/#light-dark' }
      ],
      notes: [
        'Zwischen Hell und Dunkel wechseln. Ohne Attribut folgt die Seite der Systemeinstellung.',
        'Diese Präsentation nutzt für ihr eigenes Farbschema die klassische Variante mit Media Query – Taste **T**.'
      ]
    },

    {
      id: 'css-view-transitions',
      topic: '`document.startViewTransition()`',
      kicker: 'CSS · Zusatzbeispiel · Übergänge',
      title: 'Zwischen zwei Ansichten animieren',
      status: 'neu',
      role: 'zusatz',
      since: 'Baseline 2025 (same-document)',
      minutes: 3,
      blocks: [
        {
          type: 'lead',
          text: '„Same-document“ heißt: Es gibt keinen echten Seitenwechsel. Eine Single-Page-App tauscht per JavaScript den Inhalt aus – etwa von der Liste zur Detailansicht. View Transitions animieren genau diesen Austausch.'
        },
        {
          type: 'columns',
          cols: [
            [
              {
                type: 'list',
                ordered: true,
                items: [
                  '**Vorher:** Der Browser hält ein Bild der alten Ansicht fest.',
                  '**Update:** Im Callback von `startViewTransition()` tauscht unser Code den DOM aus.',
                  '**Nachher:** Der Browser blendet von alt nach neu über.',
                  'Elemente mit **gleichem** `view-transition-name` in alter und neuer Ansicht gelten als dasselbe Element und wandern von ihrer alten an die neue Position.'
                ]
              }
            ],
            [
              {
                type: 'callout',
                title: 'Abgrenzung',
                text: 'Echte Seitenwechsel zwischen zwei HTML-Dokumenten (Multi-Page-App) sind **cross-document** View Transitions. Sie werden per CSS mit `@view-transition` aktiviert und haben einen eigenen Supportstand.'
              }
            ]
          ]
        },
        {
          type: 'demo', kind: 'web', height: 380,
          html: d`
            <label><input type="checkbox" id="use-vt" checked> View Transition verwenden</label>
            <label><input type="checkbox" id="slow"> Zeitlupe</label>
            <main id="app"></main>
          `,
          css: d`
            /* Die angeklickte Karte trägt in Liste und Detailansicht denselben
               view-transition-name (per JS gesetzt) und wandert deshalb mit. */
            .card {
              box-sizing: border-box;
              display: flex;
              justify-content: space-between;
              width: 100%;
              margin-bottom: 0.5rem;
              padding: 0.75rem 1rem;
              border: 0;
              border-radius: 0.5rem;
              background: #e0e7ff;
              text-align: left;
            }
            .card.large {
              flex-direction: column;
              padding: 1.5rem;
              background: #c7d2fe;
              font-size: 1.4rem;
            }

            /* Nur für die Demo: Übergang verlangsamen */
            html.slow::view-transition-group(*),
            html.slow::view-transition-old(*),
            html.slow::view-transition-new(*) {
              animation-duration: 2s;
            }
          `,
          js: d`
            const tickets = [
              { id: 1, title: "Login reparieren", status: "Offen", text: "Nach dem Update schlägt die Anmeldung fehl." },
              { id: 2, title: "Export beschleunigen", status: "In Arbeit", text: "Große Exporte dauern über eine Minute." },
              { id: 3, title: "Suche verbessern", status: "Erledigt", text: "Treffer werden nach Relevanz sortiert." }
            ];
            const app = document.querySelector("#app");

            function card(ticket, tag) {
              const node = document.createElement(tag);
              node.className = "card";
              node.style.viewTransitionName = "ticket-" + ticket.id;
              node.innerHTML = "<b>" + ticket.title + "</b><span>" + ticket.status + "</span>";
              return node;
            }

            function listView() {
              const view = document.createElement("section");
              view.innerHTML = "<h2>Ansicht 1: Ticketliste</h2>";
              for (const ticket of tickets) {
                const item = card(ticket, "button");
                item.onclick = () => show(() => detailView(ticket));
                view.append(item);
              }
              return view;
            }

            function detailView(ticket) {
              const view = document.createElement("section");
              view.innerHTML = "<h2>Ansicht 2: Ticketdetails</h2>";
              const head = card(ticket, "div");
              head.classList.add("large");
              const text = document.createElement("p");
              text.textContent = ticket.text;
              const back = document.createElement("button");
              back.textContent = "← Zurück zur Liste";
              back.onclick = () => show(listView);
              view.append(head, text, back);
              return view;
            }

            // Der eigentliche Wechsel: alten Inhalt durch neuen ersetzen
            function show(createView) {
              const update = () => app.replaceChildren(createView());
              const animate = document.querySelector("#use-vt").checked &&
                document.startViewTransition &&
                !matchMedia("(prefers-reduced-motion: reduce)").matches;
              if (!animate) return update();
              // Bei schnellem Doppelklick überspringt der Browser den Übergang
              document.startViewTransition(update).ready.catch(() => {});
            }

            document.querySelector("#slow").onchange = event =>
              document.documentElement.classList.toggle("slow", event.target.checked);

            // Startansicht ohne Übergang
            app.replaceChildren(listView());
          `
        }
      ],
      support: {
        text: 'Basisfunktion Baseline 2025. Einzelne Erweiterungen und Übergänge zwischen Dokumenten gesondert prüfen.',
        test: () => 'startViewTransition' in document
      },
      sources: [
        { label: 'Chrome: Same-document View Transitions', url: 'https://developer.chrome.com/docs/web-platform/view-transitions/same-document' }
      ],
      notes: [
        'Erst mit „View Transition verwenden“ aus ein Ticket öffnen: Die Ansicht springt hart um. Dann mit Übergang: Die Karte wandert in den Detailkopf, der Rest blendet über.',
        '„Zeitlupe“ einschalten, um die drei Schritte sichtbar zu machen: altes Bild, DOM-Austausch, Animation.',
        'Wichtig: Es ist immer dasselbe Dokument. Der Inhalt von `#app` wird ausgetauscht – so wie bei einem Routenwechsel in einer Single-Page-App.',
        'Für echte Seitenwechsel zwischen HTML-Dokumenten gibt es cross-document View Transitions mit `@view-transition` – eigener Supportstand.',
        'DOM-Aktualisierungen bleiben JavaScript. Bei reduzierter Bewegung wird der Übergang übersprungen.',
        'Diese Präsentation nutzt View Transitions selbst beim Folienwechsel.'
      ]
    },

    {
      id: 'css-container-queries',
      topic: '`@container`',
      kicker: 'CSS · Container',
      title: 'Container Size Queries',
      status: 'grundlage',
      since: 'Vor Oktober 2023',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Die Komponente reagiert auf ihren umgebenden Container, nicht auf den Viewport – etwa in einer schmalen Sidebar und in einer breiten Hauptspalte.'
        },
        {
          type: 'demo', kind: 'web', height: 340,
          html: d`
            <div class="slot" style="width: 14rem">
              <article class="card"><b>Titel</b><span>Beschreibung der Komponente</span></article>
            </div>
            <div class="slot" style="width: 34rem">
              <article class="card"><b>Titel</b><span>Beschreibung der Komponente</span></article>
            </div>
          `,
          css: d`
            .slot { container-type: inline-size; }
            .card { display: grid; gap: 1rem; }
            @container (width > 30rem) {
              .card { grid-template-columns: 1fr 2fr; }
            }

            /* Nur Demo-Gestaltung: Slots per Ziehen verbreitern */
            .slot { resize: horizontal; overflow: auto; max-width: 100%; margin-bottom: 1rem; border: 1px dashed #94a3b8; padding: 0.5rem; }
            .card { background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; }
          `
        }
      ],
      support: {
        text: 'Size Queries sind seit 2023 browserübergreifend verfügbar. Style Queries sind ein eigenes Feature mit anderem Supportstand.',
        test: () => CSS.supports('container-type', 'inline-size')
      },
      sources: [
        { label: 'CSS Conditional Rules Level 5: Container Queries', url: 'https://drafts.csswg.org/css-conditional-5/#container-queries' }
      ],
      notes: [
        'Zwei Slots mit unterschiedlicher Breite. Den oberen Slot an der Ecke breiter ziehen: Ab 30rem wechselt das Layout.',
        'Der Query-Container muss ein Vorfahr der gestylten Karte sein.',
        'Dieses Beispiel betrifft Maße und verwendet keine Style Query.'
      ]
    },

    {
      id: 'css-container-units',
      topic: '`cqi` · `cqw` · `cqh`',
      kicker: 'CSS · Demo 2 · Containergrößen in Werten',
      title: 'Schrift und Abstände mit dem Container skalieren',
      status: 'grundlage',
      since: 'Vor Oktober 2023',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Container-Einheiten ergänzen Container Queries: Statt nur einen Breakpoint abzufragen, hängt eine Größe fließend vom Query-Container ab.'
        },
        {
          type: 'columns',
          cols: [
            [
              {
                type: 'table',
                head: ['Einheit', 'Bezug für 1 Einheit'],
                rows: [
                  ['`cqw`', '1 % der Breite'],
                  ['`cqh`', '1 % der Höhe'],
                  ['`cqi`', '1 % der Inline-Größe'],
                  ['`cqb`', '1 % der Block-Größe'],
                  ['`cqmin`', 'Kleinerer Wert von `cqi` und `cqb`'],
                  ['`cqmax`', 'Größerer Wert von `cqi` und `cqb`']
                ]
              }
            ],
            [
              {
                type: 'callout',
                tone: 'warn',
                text: 'Der Vorfahr muss die abgefragte Achse als Query-Container bereitstellen. `inline-size` reicht nicht für jede Verwendung von `cqh` oder `cqb`. Fehlt ein Container für eine Achse, greift der kleine Viewport als Bezug.'
              }
            ]
          ]
        },
        {
          type: 'demo', kind: 'web', height: 380,
          html: d`
            <div class="card-slot" style="width: 16rem">
              <article class="fluid-card">
                <h2>Eine Komponente für Sidebar und Hauptbereich</h2>
                <p>Schrift und Abstand passen sich an den Container an.</p>
              </article>
            </div>
            <div class="card-slot" style="width: 32rem">
              <article class="fluid-card">
                <h2>Eine Komponente für Sidebar und Hauptbereich</h2>
                <p>Schrift und Abstand passen sich an den Container an.</p>
              </article>
            </div>
          `,
          css: d`
            .card-slot { container-type: inline-size; }
            .fluid-card { padding: clamp(1rem, 4cqi, 2rem); }
            .fluid-card h2 { font-size: clamp(1.25rem, 5cqi, 2.5rem); margin: 0; }

            /* Nur Demo-Gestaltung */
            .card-slot { resize: horizontal; overflow: auto; max-width: 100%; margin-bottom: 1rem; border: 1px dashed #94a3b8; }
            .fluid-card { background: #f1f5f9; }
          `
        }
      ],
      support: {
        text: 'Container-Einheiten sind seit 2023 browserübergreifend verfügbar.',
        test: () => CSS.supports('width', '1cqi')
      },
      sources: [
        { label: 'CSS Conditional Rules Level 5: Container Relative Lengths', url: 'https://drafts.csswg.org/css-conditional-5/#container-lengths' }
      ],
      notes: [
        'Zwei Container mit unterschiedlichen Breiten; der Viewport bleibt gleich. Einen Container an der Ecke ziehen.',
        '`cqi` berücksichtigt die Schreibrichtung; in horizontalen Texten entspricht die Inline-Größe der Breite.',
        'Containermaße sind nicht automatisch die Maße des direkten Elternelements.'
      ]
    },

    {
      id: 'css-nesting',
      topic: 'Natives Nesting `&`',
      kicker: 'CSS · Reserve',
      title: 'Natives Nesting',
      status: 'grundlage',
      role: 'reserve',
      since: '2023',
      minutes: 1,
      blocks: [
        {
          type: 'compare',
          before: {
            label: 'Frühere getrennte Selektoren',
            blocks: [{
              type: 'demo', kind: 'web', height: 120,
              html: '<div class="card">Mit der Maus darüberfahren</div>',
              css: d`
                .card { padding: 1rem; }
                .card:hover { outline: 2px solid steelblue; }
              `
            }]
          },
          after: {
            label: 'Mit nativem Nesting',
            blocks: [{
              type: 'demo', kind: 'web', height: 120,
              html: '<div class="card">Mit der Maus darüberfahren</div>',
              css: d`
                .card {
                  padding: 1rem;
                  &:hover { outline: 2px solid steelblue; }
                }
              `
            }]
          }
        },
        {
          type: 'callout',
          text: 'Nesting bietet keine vollständige Sass-Sprache. Sass-Funktionen oder Mixins werden dadurch nicht automatisch ersetzt. Eigene native Funktionen sind mit `@function` separat möglich, bisher mit eingeschränktem Support.'
        }
      ],
      support: {
        text: 'Ältere Grundlage aus 2023.',
        test: () => CSS.supports('selector(&)')
      },
      sources: [
        { label: 'CSS Nesting Module Level 1', url: 'https://drafts.csswg.org/css-nesting-1/' }
      ],
      notes: [
        'Nur bei Rückfragen zu Sass zeigen.'
      ]
    },

    {
      id: 'css-sibling-index',
      topic: '`sibling-index()` · `sibling-count()`',
      kicker: 'CSS · Demo 3 · Wiederholungen',
      title: 'Gestaffelte Animationen mit Positionsfunktionen',
      status: 'neu',
      since: 'Baseline Newly available seit August 2026',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'CSS hat keine `for`-Schleife wie Sass. `sibling-index()` und `sibling-count()` erlauben aber Berechnungen anhand der Position eines Elements und der Anzahl seiner Geschwister. Der Index beginnt bei 1.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher: eine Regel je Position',
            blocks: [{
              type: 'code', lang: 'css', code: d`
                /* Oder per Sass-Schleife generiert */
                .stagger > li:nth-child(1) { animation-delay: 0ms; }
                .stagger > li:nth-child(2) { animation-delay: 100ms; }
                .stagger > li:nth-child(3) { animation-delay: 200ms; }
                /* … für jede weitere Position */
              `
            }]
          },
          after: {
            label: 'Heute',
            blocks: [{
              type: 'demo', kind: 'web', height: 190,
              html: d`
                <ul class="stagger">
                  <li>TypeScript</li>
                  <li>JavaScript</li>
                  <li>CSS</li>
                </ul>
              `,
              css: d`
                @keyframes appear {
                  from { opacity: 0; transform: translateY(8px); }
                  to   { opacity: 1; transform: translateY(0); }
                }

                @supports (animation-delay: calc(sibling-index() * 1ms)) {
                  @media (prefers-reduced-motion: no-preference) {
                    .stagger > li {
                      animation: appear 400ms both;
                      animation-delay: calc((sibling-index() - 1) * 100ms);
                    }
                  }
                }
              `
            }]
          }
        },
        {
          type: 'callout',
          text: 'Gezählt werden alle Geschwisterelemente, nicht nur die, die `.stagger > li` treffen. Ein zusätzliches anderes Element verschiebt die Indizes. Die Funktionen erzeugen keine neuen DOM-Elemente.'
        }
      ],
      support: {
        text: 'Laut WebDX seit August 2026 Baseline Newly available. Ältere Browser zeigen die Liste direkt ohne Animation.',
        test: () => CSS.supports('animation-delay', 'calc(sibling-index() * 1ms)')
      },
      sources: [
        { label: 'CSS Values Level 5: Tree Counting', url: 'https://drafts.csswg.org/css-values-5/#tree-counting' },
        { label: 'WebDX: sibling-count', url: 'https://web-platform-dx.github.io/web-features-explorer/features/sibling-count/' }
      ],
      notes: [
        'Im HTML ein viertes `<li>HTML</li>` ergänzen. Die Demo startet neu, das neue Element erhält automatisch eine Verzögerung.',
        'Ergänzung: `calc(sibling-index() / sibling-count())` liefert einen Wert relativ zur Gesamtzahl.',
        'Ist im System „Bewegung reduzieren“ aktiv, bleibt die Animation bewusst aus.'
      ]
    },

    {
      id: 'css-counter',
      topic: '`counter()`',
      kicker: 'CSS · Demo 4 · Nummerierung',
      title: 'Abschnitte automatisch nummerieren',
      status: 'grundlage',
      since: 'Lange etabliert',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: 'CSS-Counter sind ein kurzer Grundlagen-Einschub. `counter()` liefert Text für die Darstellung; `sibling-index()` liefert eine Zahl für Berechnungen.'
        },
        {
          type: 'demo', kind: 'web', height: 240,
          html: d`
            <article class="guide">
              <h2>Installation</h2>
              <p>Projekt vorbereiten.</p>
              <h2>Konfiguration</h2>
              <p>Optionen festlegen.</p>
            </article>
          `,
          css: d`
            .guide { counter-reset: section; }
            .guide h2 { counter-increment: section; }
            .guide h2::before { content: counter(section) ". "; }
          `
        },
        {
          type: 'callout',
          text: 'Für gewöhnliche nummerierte Listen bleibt `<ol>` die passende HTML-Struktur. Generierter Inhalt sollte nicht die einzige Quelle fachlich notwendiger Informationen sein.'
        }
      ],
      support: {
        text: 'Seit vielen Jahren in allen Browsern verfügbar.',
        test: () => CSS.supports('counter-reset', 'section')
      },
      sources: [
        { label: 'CSS Lists and Counters Level 3', url: 'https://drafts.csswg.org/css-lists-3/#auto-numbering' }
      ],
      notes: [
        'Eine Überschrift dazwischen einfügen, etwa `<h2>Voraussetzungen</h2>`. Die Nummerierung passt sich an.'
      ]
    },

    {
      id: 'css-progress',
      topic: '`progress()`',
      kicker: 'CSS · Demo 5 · Fortschritt berechnen',
      title: 'Einen Wert mit `progress()` normieren',
      status: 'neu',
      since: 'Baseline 2026',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: '`progress()` berechnet die relative Position eines Werts zwischen zwei Grenzen: `progress(75, 0, 100)` ergibt `0.75`. Die Grundform begrenzt auf 0 bis 1. Einen Lade- oder Scrollzustand ermittelt die Funktion nicht.'
        },
        {
          type: 'demo', kind: 'web', height: 210,
          html: d`
            <label>Wert <input id="value" type="range" min="0" max="120" value="75"></label>
            <div class="meter" style="--value: 75" aria-hidden="true"></div>
            <p id="text">75 von 100 Schritten abgeschlossen</p>
          `,
          css: d`
            .meter {
              height: 0.5rem;
              background: #e2e8f0;
            }
            .meter::before {
              content: "";
              display: block;
              height: 100%;
              background: steelblue;
              width: 75%; /* Grunddarstellung für dieses Beispiel */
            }
            @supports (opacity: progress(1, 0, 2)) {
              .meter::before {
                width: calc(progress(var(--value), 0, 100) * 100%);
              }
            }
          `,
          js: d`
            // Wert und zugängliche Textausgabe gemeinsam aktualisieren
            const input = document.querySelector("#value");
            input.addEventListener("input", () => {
              document.querySelector(".meter").style.setProperty("--value", input.value);
              document.querySelector("#text").textContent =
                input.value + " von 100 Schritten abgeschlossen";
            });
          `
        }
      ],
      support: {
        text: 'Laut Baseline-Übersicht 2026. Ohne Unterstützung bleibt die Grunddarstellung mit 75 %.',
        test: () => CSS.supports('opacity', 'progress(1, 0, 2)')
      },
      sources: [
        { label: 'CSS Values Level 5: Progress Notation', url: 'https://drafts.csswg.org/css-values-5/#progress' }
      ],
      notes: [
        'Den Regler bewegen, auch über 100: Der Balken bleibt bei 100 %, weil die Grundform begrenzt.',
        'Interessant vor allem bei anderen Grenzen als 0 und 100, etwa einer Messgröße zwischen 20 und 80 – im CSS ausprobieren.',
        'Für echten Aufgabenfortschritt ist das native `<progress>`-Element häufig die einfachere Lösung.'
      ]
    },

    {
      id: 'css-scroll-timeline',
      topic: '`animation-timeline: scroll()`',
      kicker: 'CSS · Demo 6 · Fortschritt darstellen',
      title: 'Scrollfortschritt ohne eigenen Scroll-Handler',
      status: 'eingeschraenkt',
      since: 'Scroll-driven Animations',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Mit einer Scroll-Timeline hängt der Animationsfortschritt an der Scrollposition. Anders als `progress()` erhält sie ihren Fortschritt direkt vom Scrollen.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher: Scroll-Handler',
            blocks: [{
              type: 'code', lang: 'js', code: d`
                const bar = document.querySelector(".reading-progress");

                addEventListener("scroll", () => {
                  const max = document.documentElement.scrollHeight - innerHeight;
                  bar.style.transform = "scaleX(" + scrollY / max + ")";
                }, { passive: true });
              `
            }]
          },
          after: {
            label: 'Heute: nur CSS',
            blocks: [{
              type: 'demo', kind: 'web', height: 260,
              html: d`
                <div class="reading-progress" aria-hidden="true"></div>
                <h2>Im Ergebnis scrollen</h2>
                <p class="long">Darunter ausreichend langer Seiteninhalt.</p>
                <p>Ende des Artikels.</p>
              `,
              css: d`
                @keyframes reading {
                  from { transform: scaleX(0); }
                  to   { transform: scaleX(1); }
                }
                @supports (animation-timeline: scroll()) {
                  .reading-progress {
                    position: fixed;
                    inset: 0 0 auto;
                    height: 4px;
                    z-index: 1000;
                    background: steelblue;
                    transform-origin: left;
                    animation: reading linear both;
                    animation-timeline: scroll(root block);
                  }
                }

                /* Nur Demo-Gestaltung */
                .long { height: 1500px; background: linear-gradient(#f1f5f9, #cbd5e1); padding: 1rem; }
              `
            }]
          }
        },
        {
          type: 'callout',
          text: '`animation-timeline` steht nach dem `animation`-Shorthand, weil dieser die Timeline zurücksetzt. Ohne Unterstützung erscheint keine Leiste. Für bewegte Einblendeffekte die Präferenz für reduzierte Bewegung berücksichtigen.'
        }
      ],
      support: {
        text: 'Support im Zielbrowser vorab prüfen; Stand am Vorführungstag erneut kontrollieren.',
        test: () => CSS.supports('animation-timeline', 'scroll()')
      },
      sources: [
        { label: 'WebKit: A Guide to Scroll-driven Animations', url: 'https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/' }
      ],
      notes: [
        'Im Ergebnisfenster hoch- und herunterscrollen: Die Leiste oben folgt der Scrollposition.',
        'Zusammen mit `progress()` zeigen: berechneter Wert und Scrollposition als zwei unterschiedliche Fortschrittsquellen.'
      ]
    },

    {
      id: 'css-function',
      topic: '`@function`',
      kicker: 'CSS · Demo 7 · Ausblick',
      title: 'Wiederverwendbare Berechnungen mit `@function`',
      status: 'experimentell',
      since: 'Chrome und Edge seit 139',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Mit `@function` lassen sich eigene Funktionen definieren, die Parameter annehmen und einen CSS-Wert liefern. Die Namen beginnen mit `--`. Das Beispiel bündelt die Berechnung eines Abstandssystems.'
        },
        {
          type: 'demo', kind: 'web', height: 230,
          html: d`
            <p id="status"></p>
            <div class="function-card">
              <span>Karte</span>
              <span>mit Abstand</span>
            </div>
          `,
          css: d`
            @function --spacing(--factor <number>) {
              result: calc(var(--factor) * 0.25rem);
            }

            .function-card {
              display: flex;
              padding: 1rem;
              gap: 0.5rem;
              background: #ede9fe;
            }

            /* Demo nur für Browser mit Unterstützung von @function */
            .function-demo .function-card {
              padding: --spacing(4);
              gap: --spacing(2);
            }

            .function-card span { background: #fff; padding: 0.25rem 0.5rem; }
          `,
          js: d`
            // Klasse erst nach geprüftem Support aktivieren
            const probe = document.createElement("div");
            probe.style.width = "--spacing(4)";
            document.body.append(probe);
            const supported = getComputedStyle(probe).width === "16px";
            probe.remove();

            document.body.classList.toggle("function-demo", supported);
            document.querySelector("#status").textContent = supported
              ? "@function wird unterstützt – Demo aktiv"
              : "@function wird nicht unterstützt – Grunddarstellung";

            const card = document.querySelector(".function-card");
            console.log("padding:", getComputedStyle(card).padding);
            console.log("gap:", getComputedStyle(card).gap);
          `
        },
        {
          type: 'callout',
          tone: 'exp',
          title: 'Kein automatischer Fallback',
          text: 'Eine unbekannte Funktion kann eine Deklaration erst bei der Wertberechnung ungültig machen. Deshalb die Klasse nur nach geprüftem Support aktivieren. `@supports (--x: 1)` beweist keine Unterstützung von `@function`.'
        }
      ],
      support: {
        text: 'Stand 26. Oktober 2026: Chrome und Edge seit 139; Firefox und Safari noch nicht. Die Spezifikation ist ein Entwurf – ausdrücklich ein Ausblick.',
        test: supportsCssFunction
      },
      sources: [
        { label: 'CSS Custom Functions and Mixins (Entwurf)', url: 'https://drafts.csswg.org/css-mixins-1/' },
        { label: 'WebDX: function', url: 'https://web-platform-dx.github.io/web-features-explorer/features/function/' }
      ],
      notes: [
        'In einem unterstützten Browser den Faktor ändern, etwa `--spacing(8)`. Die Konsole zeigt den berechneten Wert.',
        'In der Funktion lassen sich auch Bedingungen wie `@media` verwenden.',
        'Eine Funktion liefert einen Wert; ganze Deklarationsblöcke wiederzuverwenden ist ein eigenes Mixin-Thema.'
      ]
    },

    {
      id: 'css-support',
      kicker: 'CSS · Support und Ablauf',
      title: 'Support prüfen und Auswahl treffen',
      role: 'einordnung',
      blocks: [
        {
          type: 'checks',
          items: [
            { label: '`:has()`', code: 'CSS.supports("selector(:has(*))")', test: () => CSS.supports('selector(:has(*))') },
            { label: '`text-wrap: balance`', code: 'CSS.supports("text-wrap", "balance")', test: () => CSS.supports('text-wrap', 'balance') },
            { label: '`light-dark()`', code: 'CSS.supports("color", "light-dark(white, black)")', test: () => CSS.supports('color', 'light-dark(white, black)') },
            { label: 'View Transitions', code: '"startViewTransition" in document', test: () => 'startViewTransition' in document },
            { label: 'Container-Einheiten', code: 'CSS.supports("width", "1cqi")', test: () => CSS.supports('width', '1cqi') },
            { label: '`sibling-index()`', code: 'CSS.supports("animation-delay", "calc(sibling-index() * 1ms)")', test: () => CSS.supports('animation-delay', 'calc(sibling-index() * 1ms)') },
            { label: '`progress()`', code: 'CSS.supports("opacity", "progress(1, 0, 2)")', test: () => CSS.supports('opacity', 'progress(1, 0, 2)') },
            { label: 'Scroll-Timeline', code: 'CSS.supports("animation-timeline", "scroll()")', test: () => CSS.supports('animation-timeline', 'scroll()') },
            { label: '`@function`', code: 'Testfunktion definieren und auswerten', test: supportsCssFunction }
          ]
        },
        {
          type: 'table',
          head: ['Dauer', 'Beispiel', 'Sichtbarer Effekt'],
          rows: [
            ['2 Min.', '`:has()`', 'Zeile reagiert auf Checkbox'],
            ['3 Min.', 'Container Query und `cqi`', 'Layout und Schrift passen sich der Komponente an'],
            ['2 Min.', '`sibling-index()`', 'Neue Elemente erhalten automatisch eine Verzögerung'],
            ['1 Min.', 'Counter', 'Abschnittsnummern passen sich an'],
            ['3 Min.', '`progress()` und Scroll-Timeline', 'Berechneter Wert und Scrollposition als zwei Fortschrittsquellen'],
            ['2 Min.', '`@function`', 'Eigene parametrisierte Berechnung in CSS'],
            ['2 Min.', 'Support und Fragen', 'Einordnung für die eigenen Zielbrowser']
          ]
        },
        {
          type: 'p',
          text: 'Bei älteren Zielbrowsern die Grunddarstellung erhalten und neuere Gestaltung gezielt ergänzen.'
        }
      ],
      notes: [
        'Textumbrüche, Farbschemata, Nesting und View Transitions bleiben als zusätzliche Beispiele erhalten.',
        'Supportstände am Vorführungstag erneut prüfen, insbesondere für `@function` und Scroll-Timelines.'
      ]
    }
  ]);
})();
