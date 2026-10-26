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
          text: 'CSS wird in einzelnen Modulen weiterentwickelt, eine jährliche Gesamtversion gibt es nicht. Wir sortieren deshalb danach, in welchem Jahr ein Feature in allen großen Browsern angekommen ist.'
        },
        {
          type: 'table',
          head: ['Baseline-Jahr', 'Relevante Features', 'Demo'],
          rows: [
            ['2023', '`:has()` (ab Dezember); Nesting; Container Size Queries; Subgrid; moderne Farbräume und `color-mix()`', '`:has()`'],
            ['2024', '`text-wrap: balance`; `light-dark()`; relative Farben; `@starting-style`; `transition-behavior`; `@property`; `backdrop-filter`; `scrollbar-gutter`', 'Text und Farben'],
            ['2025', 'View Transitions; `view-transition-class`; `::details-content`; `content-visibility`; Popover (eigentlich eine HTML-API)', 'View Transitions'],
            ['2026', '`@scope`; Container Style Queries; `field-sizing`; `contrast-color()`; `shape()`; `:open`; `sibling-index()`; `sibling-count()`; `progress()`', 'Positionsfunktionen und Berechnungen']
          ]
        },
        {
          type: 'callout',
          text: 'Container Size Queries, Subgrid, moderne Farben und die erste Form von Nesting gab es schon vor Oktober 2023 in allen großen Browsern. Wir zeigen sie als Grundlagen. Achtung: Size Queries fragen die Größe eines Containers ab, Style Queries seine Stilwerte. Die beiden werden unterschiedlich gut unterstützt.'
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
        'Ziel: zeigen, was mit CSS heute alles geht. Ältere Grundlagen und Features mit eingeschränktem Support sind gekennzeichnet.',
        'Die Übersicht stammt vom 5. Oktober 2026. Container-Einheiten, Positionsfunktionen, Counter, Fortschritt und eigene Funktionen kamen am 26. Oktober 2026 dazu.',
        'Die Folien sind ein Baukasten. Alle Demos zusammen passen nicht in 15 Minuten, deshalb mit **R** nur den Hauptablauf zeigen.'
      ]
    },

    {
      id: 'css-has',
      topic: '`:has()`',
      kicker: 'CSS · Demo 1 · Zustände ohne JavaScript',
      title: 'Das Elternelement reagiert auf seinen Inhalt',
      status: 'neu',
      since: 'Baseline Dezember 2023',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Mit `:has()` wählt man ein Element danach aus, was in ihm steckt oder ihm folgt. In einer Aufgabenliste lässt sich so die Zeile mit angehakter Checkbox allein mit CSS hervorheben.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher: Klasse per change-Handler setzen',
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
        'Checkbox anklicken. Rechts steckt keine einzige Zeile JavaScript dahinter.',
        'Im Editor die Regel auskommentieren oder den Selektor ändern, etwa in `:has(input:not(:checked))`.',
        'CSS kümmert sich hier nur um die Darstellung. Den Status zu speichern bleibt Sache der Anwendung.'
      ]
    },

    {
      id: 'css-text-wrap',
      topic: '`text-wrap: balance`',
      kicker: 'CSS · Zusatzbeispiel · Text',
      title: 'Überschriften gleichmäßig umbrechen',
      status: 'neu',
      role: 'zusatz',
      since: 'Baseline 2024',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: '`text-wrap: balance` verteilt kurze Texte auf etwa gleich lange Zeilen. Anders als mit `<br>` von Hand passt sich die Überschrift dabei jeder Breite an.'
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
        text: 'Baseline 2024. Wie genau ausbalanciert wird und für wie viele Zeilen, entscheidet jeder Browser selbst.',
        test: () => CSS.supports('text-wrap', 'balance')
      },
      sources: [
        { label: 'CSS Text Level 4: text-wrap-style', url: 'https://drafts.csswg.org/css-text-4/#text-wrap-style' }
      ],
      notes: [
        'Grau ist der normale Umbruch, schwarz der mit `balance`. Dann den Rahmen breiter und schmaler ziehen.',
        'Gedacht für kurze Überschriften. Wo genau umbrochen wird, lässt sich damit nicht festlegen.'
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
          text: '`light-dark()` nimmt je nach aktivem Farbschema den hellen oder den dunklen Wert. Beide Farben stehen direkt nebeneinander an der Stelle, an der sie gebraucht werden. Damit das funktioniert, muss `color-scheme` gesetzt sein.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher: per Media Query überschreiben',
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
        text: 'Baseline 2024. Ob Kontrast und Lesbarkeit stimmen, müssen wir weiterhin selbst prüfen.',
        test: () => CSS.supports('color', 'light-dark(white, black)')
      },
      sources: [
        { label: 'CSS Color Level 5: light-dark()', url: 'https://drafts.csswg.org/css-color-5/#light-dark' }
      ],
      notes: [
        'Zwischen Hell und Dunkel umschalten. Bei „System“ richtet sich die Seite nach der Einstellung des Betriebssystems.',
        'Diese Präsentation selbst macht es noch klassisch mit Media Query (umschalten mit **T**).'
      ]
    },

    {
      id: 'css-view-transitions',
      topic: '`document.startViewTransition()`',
      kicker: 'CSS · Zusatzbeispiel · Übergänge',
      title: 'Animierter Wechsel zwischen zwei Ansichten',
      status: 'neu',
      role: 'zusatz',
      since: 'Baseline 2025 (same-document)',
      minutes: 3,
      blocks: [
        {
          type: 'lead',
          text: '„Same-document“ heißt: Die Seite wird nicht neu geladen. Eine Single-Page-App tauscht per JavaScript nur den Inhalt aus, etwa von der Liste zur Detailansicht. View Transitions animieren genau diesen Wechsel.'
        },
        {
          type: 'columns',
          cols: [
            [
              {
                type: 'list',
                ordered: true,
                items: [
                  '**Vorher:** Der Browser macht ein Bild der alten Ansicht.',
                  '**Update:** Im Callback von `startViewTransition()` ändert unser Code das DOM.',
                  '**Nachher:** Der Browser blendet von der alten zur neuen Ansicht über.',
                  'Haben Elemente in alter und neuer Ansicht **denselben** `view-transition-name`, behandelt der Browser sie als ein Element und lässt es von der alten an die neue Position wandern.'
                ]
              }
            ],
            [
              {
                type: 'callout',
                title: 'Nicht verwechseln',
                text: 'Für echte Seitenwechsel zwischen zwei HTML-Dokumenten (Multi-Page-App) gibt es **cross-document** View Transitions. Die schaltet man per CSS mit `@view-transition` ein, und sie werden anders unterstützt.'
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
        text: 'Grundfunktion Baseline 2025. Erweiterungen und Übergänge zwischen Dokumenten jeweils einzeln prüfen.',
        test: () => 'startViewTransition' in document
      },
      sources: [
        { label: 'Chrome: Same-document View Transitions', url: 'https://developer.chrome.com/docs/web-platform/view-transitions/same-document' }
      ],
      notes: [
        'Erst „View Transition verwenden“ ausschalten und ein Ticket öffnen: Die Ansicht springt hart um. Dann mit Übergang: Die Karte wandert nach oben in den Kopf der Detailansicht, der Rest blendet über.',
        'Mit „Zeitlupe“ sieht man die drei Schritte: altes Bild, DOM-Austausch, Animation.',
        'Wichtig: Wir bleiben die ganze Zeit im selben Dokument. Nur der Inhalt von `#app` wird ausgetauscht, wie bei einem Routenwechsel in einer Single-Page-App.',
        'Für echte Seitenwechsel zwischen HTML-Dokumenten gibt es cross-document View Transitions mit `@view-transition`. Deren Support ist ein anderer.',
        'Das DOM ändern wir weiterhin per JavaScript. Ist „Bewegung reduzieren“ eingeschaltet, entfällt der Übergang.',
        'Die Präsentation selbst nutzt View Transitions beim Folienwechsel.'
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
          text: 'Die Komponente richtet sich nach dem Platz in ihrem Container, nicht nach dem Viewport. So sieht sie in einer schmalen Sidebar anders aus als in einer breiten Hauptspalte.'
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
        text: 'Size Queries gibt es seit 2023 in allen großen Browsern. Style Queries sind ein eigenes Feature und werden anders unterstützt.',
        test: () => CSS.supports('container-type', 'inline-size')
      },
      sources: [
        { label: 'CSS Conditional Rules Level 5: Container Queries', url: 'https://drafts.csswg.org/css-conditional-5/#container-queries' }
      ],
      notes: [
        'Zwei Slots mit unterschiedlicher Breite. Den oberen an der Ecke breiter ziehen: Ab 30rem wechselt das Layout.',
        'Der Container muss ein Vorfahr der Karte sein, die gestylt wird.',
        'Hier geht es nur um Größen, eine Style Query kommt nicht vor.'
      ]
    },

    {
      id: 'css-container-units',
      topic: '`cqi` · `cqw` · `cqh`',
      kicker: 'CSS · Demo 2 · Größen relativ zum Container',
      title: 'Schrift und Abstände wachsen mit dem Container',
      status: 'grundlage',
      since: 'Vor Oktober 2023',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Container-Einheiten ergänzen Container Queries: Statt an einem Breakpoint umzuschalten, wächst und schrumpft ein Wert stufenlos mit dem Container.'
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
                  ['`cqi`', '1 % der Inline-Größe (meist Breite)'],
                  ['`cqb`', '1 % der Block-Größe (meist Höhe)'],
                  ['`cqmin`', 'Der kleinere Wert von `cqi` und `cqb`'],
                  ['`cqmax`', 'Der größere Wert von `cqi` und `cqb`']
                ]
              }
            ],
            [
              {
                type: 'callout',
                tone: 'warn',
                text: 'Ein Vorfahr muss für die jeweilige Richtung als Container definiert sein. Mit `inline-size` funktionieren `cqh` und `cqb` also nicht in jedem Fall. Gibt es für eine Richtung keinen Container, rechnet der Browser mit dem kleinen Viewport.'
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
        text: 'Container-Einheiten gibt es seit 2023 in allen großen Browsern.',
        test: () => CSS.supports('width', '1cqi')
      },
      sources: [
        { label: 'CSS Conditional Rules Level 5: Container Relative Lengths', url: 'https://drafts.csswg.org/css-conditional-5/#container-lengths' }
      ],
      notes: [
        'Zwei Container mit unterschiedlicher Breite bei gleichem Viewport. Einen davon an der Ecke breiter oder schmaler ziehen.',
        '`cqi` richtet sich nach der Schreibrichtung. Bei horizontalem Text ist die Inline-Größe die Breite.',
        'Der Container ist nicht automatisch das direkte Elternelement.'
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
            label: 'Früher: Selektoren getrennt schreiben',
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
          text: 'Nesting allein macht CSS nicht zu Sass. Funktionen und Mixins aus Sass gibt es damit noch nicht. Eigene Funktionen kann man mit `@function` schreiben, das wird aber bisher nur teilweise unterstützt.'
        }
      ],
      support: {
        text: 'Älteres Feature aus 2023.',
        test: () => CSS.supports('selector(&)')
      },
      sources: [
        { label: 'CSS Nesting Module Level 1', url: 'https://drafts.csswg.org/css-nesting-1/' }
      ],
      notes: [
        'Nur zeigen, wenn jemand nach Sass fragt.'
      ]
    },

    {
      id: 'css-sibling-index',
      topic: '`sibling-index()` · `sibling-count()`',
      kicker: 'CSS · Demo 3 · Ohne Wiederholung',
      title: 'Animationen nacheinander starten mit `sibling-index()`',
      status: 'neu',
      since: 'Baseline Newly available seit August 2026',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Eine `for`-Schleife wie in Sass gibt es in CSS nicht. Mit `sibling-index()` und `sibling-count()` kann man aber mit der Position eines Elements und der Zahl seiner Geschwister rechnen. Gezählt wird ab 1.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher: eine Regel pro Position',
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
          text: 'Mitgezählt werden alle Geschwister, nicht nur die, auf die `.stagger > li` passt. Steht ein anderes Element dazwischen, verschieben sich die Indizes. Neue Elemente im DOM erzeugen die Funktionen nicht.'
        }
      ],
      support: {
        text: 'Laut WebDX seit August 2026 Baseline Newly available. Ältere Browser zeigen die Liste einfach ohne Animation.',
        test: () => CSS.supports('animation-delay', 'calc(sibling-index() * 1ms)')
      },
      sources: [
        { label: 'CSS Values Level 5: Tree Counting', url: 'https://drafts.csswg.org/css-values-5/#tree-counting' },
        { label: 'WebDX: sibling-count', url: 'https://web-platform-dx.github.io/web-features-explorer/features/sibling-count/' }
      ],
      notes: [
        'Im HTML ein viertes `<li>HTML</li>` ergänzen. Die Demo startet neu, und das neue Element bekommt automatisch seine Verzögerung.',
        'Noch ein Trick: `calc(sibling-index() / sibling-count())` ergibt die Position als Anteil an der Gesamtzahl.',
        'Ist im System „Bewegung reduzieren“ eingeschaltet, gibt es absichtlich keine Animation.'
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
          text: 'Ein kurzer Abstecher zu einem alten Bekannten: `counter()` liefert Text, der angezeigt wird. `sibling-index()` dagegen liefert eine Zahl, mit der man rechnen kann.'
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
          text: 'Für normale nummerierte Listen ist `<ol>` weiterhin das richtige Element. Wichtige Informationen sollten nicht nur in per CSS erzeugtem Inhalt stehen.'
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
        'Eine weitere Überschrift einfügen, etwa `<h2>Voraussetzungen</h2>`. Die Nummern passen sich an.'
      ]
    },

    {
      id: 'css-progress',
      topic: '`progress()`',
      kicker: 'CSS · Demo 5 · Mit Anteilen rechnen',
      title: 'Mit `progress()` einen Anteil ausrechnen',
      status: 'neu',
      since: 'Baseline 2026',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: '`progress()` rechnet aus, wo ein Wert zwischen zwei Grenzen liegt: `progress(75, 0, 100)` ergibt `0.75`. In der Grundform bleibt das Ergebnis zwischen 0 und 1. Wie weit etwas geladen oder gescrollt ist, weiß die Funktion nicht.'
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
        text: 'Baseline 2026. Kennt der Browser die Funktion nicht, bleibt der Balken bei 75 %.',
        test: () => CSS.supports('opacity', 'progress(1, 0, 2)')
      },
      sources: [
        { label: 'CSS Values Level 5: Progress Notation', url: 'https://drafts.csswg.org/css-values-5/#progress' }
      ],
      notes: [
        'Den Regler auch über 100 schieben: Der Balken bleibt bei 100 % stehen, weil das Ergebnis nicht über 1 geht.',
        'Spannend wird es mit anderen Grenzen als 0 und 100, etwa einem Messwert zwischen 20 und 80. Im CSS ausprobieren.',
        'Für einen echten Fortschrittsbalken ist das `<progress>`-Element meist die einfachere Wahl.'
      ]
    },

    {
      id: 'css-scroll-timeline',
      topic: '`animation-timeline: scroll()`',
      kicker: 'CSS · Demo 6 · Scrollfortschritt',
      title: 'Lesefortschritt ohne Scroll-Handler',
      status: 'eingeschraenkt',
      since: 'Scroll-driven Animations',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Mit einer Scroll-Timeline läuft eine Animation nicht nach Zeit ab, sondern folgt der Scrollposition. Anders als bei `progress()` muss man dafür nichts ausrechnen.'
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
          text: '`animation-timeline` muss nach `animation` stehen, weil die Kurzschreibweise die Timeline sonst wieder zurücksetzt. Ohne Browserunterstützung erscheint einfach keine Leiste. Bei Einblendeffekten an „Bewegung reduzieren“ denken.'
        }
      ],
      support: {
        text: 'Vorher prüfen, ob der Zielbrowser das kann, und am Tag der Vorführung noch einmal nachsehen.',
        test: () => CSS.supports('animation-timeline', 'scroll()')
      },
      sources: [
        { label: 'WebKit: A Guide to Scroll-driven Animations', url: 'https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/' }
      ],
      notes: [
        'Im Ergebnis hoch- und runterscrollen: Die Leiste oben wächst und schrumpft mit.',
        'Gut im Doppel mit `progress()`: einmal kommt der Fortschritt aus einer Rechnung, einmal aus der Scrollposition.'
      ]
    },

    {
      id: 'css-function',
      topic: '`@function`',
      kicker: 'CSS · Demo 7 · Ausblick',
      title: 'Eigene CSS-Funktionen mit `@function`',
      status: 'experimentell',
      since: 'Chrome und Edge seit 139',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Mit `@function` schreibt man eigene Funktionen, die Parameter bekommen und einen CSS-Wert zurückgeben. Ihre Namen beginnen mit `--`. Im Beispiel steckt die Rechnung für ein Abstandsraster in einer Funktion.'
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
          title: 'Kein Fallback von selbst',
          text: 'Kennt der Browser die Funktion nicht, merkt er das erst beim Berechnen des Werts, und die Deklaration fällt weg. Die Klasse deshalb erst setzen, wenn der Support geprüft ist. `@supports (--x: 1)` taugt dafür nicht, das ist auch ohne `@function` wahr.'
        }
      ],
      support: {
        text: 'Stand 26. Oktober 2026: Chrome und Edge seit Version 139, Firefox und Safari noch nicht. Die Spezifikation ist noch ein Entwurf, das hier ist also ein Blick nach vorn.',
        test: supportsCssFunction
      },
      sources: [
        { label: 'CSS Custom Functions and Mixins (Entwurf)', url: 'https://drafts.csswg.org/css-mixins-1/' },
        { label: 'WebDX: function', url: 'https://web-platform-dx.github.io/web-features-explorer/features/function/' }
      ],
      notes: [
        'In einem Browser, der `@function` kann, den Faktor ändern, etwa auf `--spacing(8)`. Die Konsole zeigt das Ergebnis.',
        'In einer Funktion darf auch `@media` stehen, das Ergebnis kann also von Bedingungen abhängen.',
        'Eine Funktion liefert genau einen Wert. Ganze Blöcke von Deklarationen wiederverwenden, das wäre ein Mixin, und das ist ein anderes Thema.'
      ]
    },

    {
      id: 'css-support',
      kicker: 'CSS · Support und Ablauf',
      title: 'Support prüfen und Demos auswählen',
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
            ['2 Min.', '`:has()`', 'Zeile reagiert auf die Checkbox'],
            ['3 Min.', 'Container Query und `cqi`', 'Layout und Schrift passen sich der Komponente an'],
            ['2 Min.', '`sibling-index()`', 'Neue Elemente bekommen automatisch ihre Verzögerung'],
            ['1 Min.', 'Counter', 'Abschnittsnummern zählen von selbst mit'],
            ['3 Min.', '`progress()` und Scroll-Timeline', 'Fortschritt einmal berechnet, einmal aus der Scrollposition'],
            ['2 Min.', '`@function`', 'Eigene Funktion mit Parameter in CSS'],
            ['2 Min.', 'Support und Fragen', 'Was heißt das für unsere Zielbrowser?']
          ]
        },
        {
          type: 'p',
          text: 'Für ältere Zielbrowser eine funktionierende Grundversion behalten und neuere Gestaltung obendrauf setzen.'
        }
      ],
      notes: [
        'Textumbruch, Farbschemata, Nesting und View Transitions sind als Zusatzbeispiele weiterhin dabei.',
        'Am Tag der Vorführung den Support noch einmal prüfen, vor allem bei `@function` und Scroll-Timelines.'
      ]
    }
  ]);
})();
