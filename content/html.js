(() => {
  'use strict';
  const { add, d } = Deck;

  const hasDialog = () => typeof HTMLDialogElement !== 'undefined' && 'showModal' in HTMLDialogElement.prototype;

  const dialogCss = d`
    dialog {
      max-width: min(32rem, 90vw);
      border: 0;
      border-radius: 0.75rem;
      padding: 1.5rem;
    }
    dialog::backdrop {
      background: rgb(0 0 0 / 0.45);
    }
  `;

  add('html', [
    {
      id: 'html',
      layout: 'chapter',
      kicker: 'Kapitel 4',
      title: 'HTML',
      since: 'Living Standard · Baseline 2023 bis 2026',
      blocks: [
        {
          type: 'callout',
          title: 'Roter Faden',
          text: 'Was übernimmt der Browser heute, wofür wir bisher eigene Komponenten, Bibliotheken oder zusätzliche JavaScript-Logik gebraucht haben?'
        },
        {
          type: 'table',
          head: ['Feature', 'Einordnung', 'Nutzen für die Demo'],
          rows: [
            ['`<dialog>` und `showModal()`', 'Browserübergreifend seit 2022, ältere Grundlage', 'Native modale Interaktion verstehen'],
            ['`<details name="…">`', 'Baseline 2024', 'Höchstens ein Abschnitt einer Gruppe bleibt geöffnet'],
            ['`popover` und `popovertarget`', 'Baseline seit Januar 2025', 'Nichtmodale Einblendungen ohne eigenen Toggle-Handler'],
            ['`dialog.requestClose()`', 'Baseline seit Mai 2025', 'Schließanfragen zentral abfangen'],
            ['`commandfor` und `command`', 'Baseline seit Dezember 2025', 'Dialoge deklarativ per Button steuern'],
            ['`<dialog closedby="…">`', 'Eingeschränkt verfügbar', 'Schließen durch Escape oder Klick außerhalb konfigurieren'],
            ['`inert`', 'Baseline April 2023, ältere Grundlage', 'Teilbereiche von Interaktion und Zugänglichkeit ausschließen'],
            ['`<search>`', 'Baseline Oktober 2023', 'Suchbereiche semantisch auszeichnen'],
            ['Deklaratives Shadow DOM', 'Baseline Februar 2024', 'Shadow DOM direkt aus HTML, etwa bei serverseitigem Rendering']
          ]
        },
        {
          type: 'p',
          text: 'HTML wird als Living Standard gepflegt; jährliche Gesamtversionen wie ES2025 gibt es nicht. Wir unterscheiden die Existenz eines Features im Standard von seiner Verfügbarkeit in Browsern.'
        }
      ],
      sources: [
        { label: 'WHATWG HTML für Webentwickler', url: 'https://html.spec.whatwg.org/dev/' },
        { label: 'WHATWG: details und dialog', url: 'https://html.spec.whatwg.org/dev/interactive-elements.html' },
        { label: 'WHATWG: Popover', url: 'https://html.spec.whatwg.org/dev/popover.html' },
        { label: 'web.dev Baseline', url: 'https://web.dev/baseline' },
        { label: 'WebDX Feature Explorer', url: 'https://web-platform-dx.github.io/web-features-explorer/' }
      ],
      notes: [
        'Recherche vom 26. Oktober 2026.',
        'Schwerpunkt native Interaktion: Dialoge, Popovers und Akkordeons, für die wir bisher oft eigene Zustandsverwaltung und Event-Handler geschrieben haben.',
        'Die Beispiele zeigen die Grundmechanik; Tastaturbedienung, Beschriftung und fachliches Verhalten in der Anwendung separat prüfen.',
        'Einzelne Erweiterungen eines Elements können später verfügbar werden als das Element selbst.'
      ]
    },

    {
      id: 'html-dialog',
      topic: '`<dialog>` · `showModal()`',
      kicker: 'HTML · Demo 1 · Native Interaktion',
      title: 'Ein nativer modaler Dialog',
      status: 'grundlage',
      since: 'Browserübergreifend seit 2022',
      minutes: 2,
      blocks: [
        {
          type: 'compare',
          before: {
            label: 'Vorher: eigenes Modal',
            blocks: [
              {
                type: 'list',
                items: [
                  'Overlay-Element und Darstellung selbst bauen',
                  'Fokus in das Modal setzen und darin halten',
                  'Escape-Taste selbst behandeln',
                  'Hintergrund für Maus, Tastatur und Screenreader sperren',
                  'Fokus beim Schließen zurückgeben',
                  'Stapelreihenfolge mit `z-index` absichern'
                ]
              }
            ]
          },
          after: {
            label: 'Heute: dialog mit showModal()',
            blocks: [{
              type: 'demo', kind: 'web', height: 300,
              html: d`
                <button type="button" id="open-settings">Einstellungen öffnen</button>
                <p id="result"></p>

                <dialog id="settings" aria-labelledby="settings-title">
                  <h2 id="settings-title">Einstellungen</h2>
                  <p>Hier könnten die Einstellungen stehen.</p>
                  <form method="dialog">
                    <button value="done" autofocus>Fertig</button>
                  </form>
                </dialog>
              `,
              css: dialogCss,
              js: d`
                const dialog = document.querySelector("#settings");
                document.querySelector("#open-settings").addEventListener("click", () => {
                  dialog.showModal();
                });

                dialog.addEventListener("close", () => {
                  document.querySelector("#result").textContent =
                    "returnValue: " + JSON.stringify(dialog.returnValue);
                });
              `
            }]
          }
        },
        {
          type: 'callout',
          text: '`showModal()` platziert den Dialog im Top Layer und macht die übrige Seite inert. Nur `open` im Markup oder `show()` öffnet ihn **nichtmodal** – ein wesentlicher Unterschied.'
        }
      ],
      support: {
        text: 'Browserübergreifend seit 2022.',
        test: hasDialog
      },
      sources: [
        { label: 'WHATWG: dialog', url: 'https://html.spec.whatwg.org/dev/interactive-elements.html#the-dialog-element' }
      ],
      notes: [
        'Öffnen, mit Tab navigieren, Escape drücken und erneut über „Fertig“ schließen.',
        '`method="dialog"` schließt den Dialog beim Absenden, ohne Formulardaten an einen Server zu schicken. Der Buttonwert steht in `dialog.returnValue` – das ist kein Speichern von Einstellungen.',
        'Den anfänglichen Fokus passend zum Inhalt wählen und einen sichtbaren Schließen-Button anbieten.'
      ]
    },

    {
      id: 'html-invoker-commands',
      topic: '`commandfor` · `command`',
      kicker: 'HTML · Demo 2 · Native Interaktion',
      title: 'Den Öffnen-Handler durch HTML ersetzen',
      status: 'neu',
      since: 'Baseline seit 12. Dezember 2025',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Mit Invoker Commands sendet ein Button einen unterstützten Befehl direkt an ein Zielelement. `commandfor` verweist auf die ID, `command` benennt die Aktion.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher: JavaScript-Handler',
            blocks: [{
              type: 'code', lang: 'js', code: d`
                const dialog = document.querySelector("#settings");
                document.querySelector("#open-settings").addEventListener("click", () => {
                  dialog.showModal();
                });
              `
            }]
          },
          after: {
            label: 'Heute: nur Attribute',
            blocks: [{
              type: 'demo', kind: 'web', height: 280,
              html: d`
                <button type="button" commandfor="settings-native" command="show-modal">
                  Einstellungen öffnen
                </button>

                <dialog id="settings-native" aria-labelledby="settings-native-title">
                  <h2 id="settings-native-title">Einstellungen</h2>
                  <p>Dieser Dialog wird direkt per HTML gesteuert.</p>
                  <button type="button" commandfor="settings-native" command="close" autofocus>
                    Fertig
                  </button>
                </dialog>
              `,
              css: dialogCss
            }]
          }
        },
        {
          type: 'callout',
          text: '`show-modal`, `close` und `request-close` sind eingebaute Dialogbefehle. Eigene Befehle mit `--` benötigen weiterhin eigene Logik. `type="button"` macht deutlich, dass der Button kein Formular absenden soll.'
        }
      ],
      support: {
        text: 'Baseline Newly available seit 12. Dezember 2025. Native Dialogunterstützung allein genügt nicht, um diese Attribute vorauszusetzen; Fallback: `showModal()` per JavaScript.',
        test: () => 'commandForElement' in HTMLButtonElement.prototype
      },
      sources: [
        { label: 'Open UI: Invoker Commands', url: 'https://open-ui.org/components/invokers.explainer/' },
        { label: 'WebDX: Invoker Commands', url: 'https://web-platform-dx.github.io/web-features-explorer/features/invoker-commands/' }
      ],
      notes: [
        'Zeigen, dass rechts kein JavaScript vorhanden ist. Dann den Dialog öffnen und schließen.',
        'Für Popovers gibt es entsprechend `show-popover`, `hide-popover` und `toggle-popover`.'
      ]
    },

    {
      id: 'html-popover',
      topic: '`popover` · `popovertarget`',
      kicker: 'HTML · Demo 3 · Native Interaktion',
      title: 'Ein Popover direkt im HTML',
      status: 'neu',
      since: 'Baseline seit 27. Januar 2025',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Ein Popover eignet sich für ergänzende Informationen, bei denen die restliche Seite bedienbar bleiben soll. Das Attribut `popover` allein macht den Inhalt nicht modal.'
        },
        {
          type: 'demo', kind: 'web', height: 260,
          html: d`
            <button type="button" popovertarget="export-help">
              Hinweise zum Export
            </button>

            <div id="export-help" popover="auto">
              <p>Der Export enthält die aktuell gefilterten Einträge.</p>
              <button type="button"
                      popovertarget="export-help"
                      popovertargetaction="hide">
                Schließen
              </button>
            </div>

            <p>Dieser Text bleibt bedienbar: <a href="#">Ein Link</a></p>
          `,
          css: d`
            [popover] {
              border: 1px solid #94a3b8;
              border-radius: 0.5rem;
              padding: 1rem;
            }
          `
        },
        {
          type: 'callout',
          tone: 'warn',
          text: '`popover` liefert nicht automatisch die Semantik oder Tastatursteuerung eines Menüs, einer Combobox oder eines Tooltips. Die Positionierung am Auslöser ist ein eigener Schritt, etwa mit CSS Anchor Positioning.'
        }
      ],
      support: {
        text: 'Baseline Newly available seit 27. Januar 2025. Frühere Angaben mit April 2024 wurden wegen eines Problems beim Schließen auf iOS korrigiert.',
        test: () => 'popover' in HTMLElement.prototype
      },
      sources: [
        { label: 'WHATWG: Popover', url: 'https://html.spec.whatwg.org/dev/popover.html' },
        { label: 'web.dev: korrigierte Baseline-Einordnung', url: 'https://web.dev/blog/popover-baseline' }
      ],
      notes: [
        'Öffnen, außerhalb klicken und Escape ausprobieren. Das Auto-Popover erscheint im Top Layer und unterstützt Light Dismiss.',
        'Für dieses Beispiel ist kein selbst geschriebener Toggle-Handler nötig.'
      ]
    },

    {
      id: 'html-dialog-vs-popover',
      topic: '`showModal()` vs. `popover`',
      kicker: 'HTML · Demo 3 · Vergleich',
      title: 'Dialog oder Popover?',
      minutes: 1,
      blocks: [
        {
          type: 'columns',
          cols: [
            [
              {
                type: 'table',
                head: ['Frage', 'Modaler Dialog mit `showModal()`', 'Auto-Popover'],
                rows: [
                  ['Übrige Seite gesperrt?', 'Ja', 'Nein'],
                  ['Typische Verwendung', 'Eine Entscheidung oder abgeschlossener Arbeitsschritt', 'Ergänzende Informationen, nichtmodale Einblendung'],
                  ['Klick außerhalb schließt', 'Mit unterstütztem `closedby="any"`', 'Ja'],
                  ['Escape schließt', 'Standardmäßig ja, sofern nicht verhindert', 'Ja'],
                  ['Darstellung im Top Layer', 'Ja', 'Ja']
                ]
              },
              {
                type: 'p',
                text: 'Die Art des Elements allein definiert nicht die fachliche Interaktion. Ein nichtmodaler Dialog ist ebenfalls möglich.'
              }
            ],
            [
              {
                type: 'demo', kind: 'web', stack: true, height: 240,
                html: d`
                  <button type="button" id="open-dialog">Modaler Dialog</button>
                  <button type="button" popovertarget="info">Auto-Popover</button>
                  <p>Klick außerhalb, Escape, Tab ausprobieren.</p>

                  <dialog id="confirm" aria-labelledby="confirm-title">
                    <h2 id="confirm-title">Export starten?</h2>
                    <form method="dialog">
                      <button value="cancel">Abbrechen</button>
                      <button value="start" autofocus>Starten</button>
                    </form>
                  </dialog>

                  <div id="info" popover>
                    Ergänzende Information. Die Seite bleibt bedienbar.
                  </div>
                `,
                css: dialogCss + '\n[popover] { border: 1px solid #94a3b8; border-radius: 0.5rem; padding: 1rem; }',
                js: d`
                  document.querySelector("#open-dialog").addEventListener("click", () => {
                    document.querySelector("#confirm").showModal();
                  });
                `
              }
            ]
          ]
        }
      ],
      notes: [
        'Für die Demo vergleichen wir ausdrücklich `showModal()` mit einem Auto-Popover.',
        'Beim Dialog führt ein Klick außerhalb ohne `closedby` zu nichts – beim Popover schließt er.'
      ]
    },

    {
      id: 'html-details-name',
      topic: '`<details name>`',
      kicker: 'HTML · Demo 4 · Native Interaktion',
      title: 'Exklusive Akkordeons mit `details name`',
      status: 'neu',
      since: 'Baseline 2024',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: '`<details>` und `<summary>` sind etabliert. Neu ist die Möglichkeit, mehrere Einträge über denselben `name` zu einer exklusiven Gruppe zu verbinden – ohne JavaScript.'
        },
        {
          type: 'compare',
          before: {
            label: 'Ohne name',
            blocks: [{
              type: 'demo', kind: 'web', height: 230,
              html: d`
                <details>
                  <summary>Welche Einträge werden exportiert?</summary>
                  <p>Die Einträge der aktuellen Filterauswahl.</p>
                </details>
                <details>
                  <summary>Welches Format wird verwendet?</summary>
                  <p>CSV mit den ausgewählten Spalten.</p>
                </details>
                <details>
                  <summary>Kann ich den Export abbrechen?</summary>
                  <p>Ein laufender Export lässt sich über die Oberfläche abbrechen.</p>
                </details>
              `
            }]
          },
          after: {
            label: 'Mit name',
            blocks: [{
              type: 'demo', kind: 'web', height: 230,
              html: d`
                <details name="export-faq">
                  <summary>Welche Einträge werden exportiert?</summary>
                  <p>Die Einträge der aktuellen Filterauswahl.</p>
                </details>
                <details name="export-faq">
                  <summary>Welches Format wird verwendet?</summary>
                  <p>CSV mit den ausgewählten Spalten.</p>
                </details>
                <details name="export-faq">
                  <summary>Kann ich den Export abbrechen?</summary>
                  <p>Ein laufender Export lässt sich über die Oberfläche abbrechen.</p>
                </details>
              `
            }]
          }
        }
      ],
      support: {
        text: 'Baseline 2024. Die exklusive Darstellung bewusst wählen: Zum Vergleichen mehrerer Antworten kann gleichzeitiges Öffnen hilfreicher sein.',
        test: () => 'name' in HTMLDetailsElement.prototype
      },
      sources: [
        { label: 'WHATWG: details', url: 'https://html.spec.whatwg.org/dev/interactive-elements.html#the-details-element' },
        { label: 'MDN: Exklusive Akkordeons', url: 'https://developer.mozilla.org/en-US/blog/html-details-exclusive-accordions/' }
      ],
      notes: [
        'Rechts nacheinander die Einträge öffnen: Der bisherige schließt sich. Links bleiben mehrere offen.',
        'Namen zwischen unabhängigen Akkordeons unterschiedlich wählen.',
        'Im Originaldokument steht die Gruppe in einem `<section aria-labelledby>` mit Überschrift – für echte Seiten so übernehmen.'
      ]
    },

    {
      id: 'html-closedby',
      topic: '`<dialog closedby>`',
      kicker: 'HTML · Reserve · Schließverhalten',
      title: '`closedby` für Benutzeraktionen',
      status: 'eingeschraenkt',
      role: 'reserve',
      since: 'Chrome und Edge 134, Firefox 141',
      minutes: 1,
      blocks: [
        {
          type: 'columns',
          cols: [
            [
              {
                type: 'table',
                head: ['Wert', 'Verhalten'],
                rows: [
                  ['`any`', 'Light Dismiss sowie Schließanfragen der Plattform, etwa Escape'],
                  ['`closerequest`', 'Schließanfragen der Plattform, kein Light Dismiss'],
                  ['`none`', 'Keine dieser automatischen Benutzeraktionen; explizites Schließen bleibt möglich']
                ]
              },
              {
                type: 'p',
                text: 'Ohne Attribut verhält sich ein modaler Dialog wie `closerequest`. Explizite Aktionen wie ein Schließen-Button, ein Dialogformular oder `close()` schließen weiterhin.'
              }
            ],
            [
              {
                type: 'demo', kind: 'web', stack: true, height: 240,
                html: d`
                  <button type="button" commandfor="dismiss-demo" command="show-modal">
                    Dialog mit Light Dismiss öffnen
                  </button>
                  <dialog id="dismiss-demo" closedby="any" aria-labelledby="dismiss-title">
                    <h2 id="dismiss-title">Klick außerhalb ausprobieren</h2>
                    <button type="button" commandfor="dismiss-demo" command="close" autofocus>
                      Schließen
                    </button>
                  </dialog>
                `,
                css: dialogCss
              }
            ]
          ]
        }
      ],
      support: {
        text: 'Stand 26. Oktober 2026: Chrome und Edge seit 134, Firefox seit 141; laut WebDX noch nicht in Safari. Der sichtbare Schließen-Button bleibt die Grundbedienung.',
        test: () => typeof HTMLDialogElement !== 'undefined' && 'closedBy' in HTMLDialogElement.prototype
      },
      sources: [
        { label: 'WebDX: dialog closedby', url: 'https://web-platform-dx.github.io/web-features-explorer/features/dialog-closedby/' }
      ],
      notes: [
        '`any` und `closerequest` vergleichen: Wert im Editor ändern, dann außerhalb klicken.',
        'Als Erweiterung mit eingeschränktem Support eingeplant.'
      ]
    },

    {
      id: 'html-request-close',
      topic: '`dialog.requestClose()`',
      kicker: 'HTML · Reserve · Schließverhalten',
      title: '`requestClose()` für abbrechbare Schließanfragen',
      status: 'neu',
      role: 'reserve',
      since: 'Baseline seit Mai 2025',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: '`requestClose()` löst zuerst ein `cancel`-Event aus. Die Anwendung kann das Schließen dort verhindern, etwa solange Änderungen ungespeichert sind. `close()` schließt unmittelbar.'
        },
        {
          type: 'demo', kind: 'web', height: 330,
          html: d`
            <button type="button" id="edit">Notiz bearbeiten</button>

            <dialog id="edit-dialog" aria-labelledby="edit-title">
              <h2 id="edit-title">Notiz</h2>
              <label>Text <input name="note"></label>
              <p id="hint" role="status"></p>
              <button type="button" id="cancel-edit">Abbrechen</button>
              <button type="button" id="discard">Verwerfen</button>
            </dialog>
          `,
          css: dialogCss,
          js: d`
            const editor = document.querySelector("#edit-dialog");
            const cancelButton = document.querySelector("#cancel-edit");
            const hint = document.querySelector("#hint");
            let dirty = false;

            document.querySelector("#edit").onclick = () => {
              dirty = false;
              hint.textContent = "";
              editor.showModal();
            };

            editor.addEventListener("input", () => { dirty = true; });
            editor.addEventListener("cancel", event => {
              if (dirty) {
                event.preventDefault();
                hint.textContent = "Ungespeicherte Änderungen. Verwerfen?";
              }
            });
            cancelButton.addEventListener("click", () => editor.requestClose());
            document.querySelector("#discard").onclick = () => editor.close();
          `
        },
        {
          type: 'p',
          text: 'Deklarativ kann ein Button `command="request-close"` verwenden. `closedby="none"` verhindert nicht den expliziten Aufruf von `requestClose()`.'
        }
      ],
      support: {
        text: 'Laut WebDX Baseline seit Mai 2025.',
        test: () => typeof HTMLDialogElement !== 'undefined' && 'requestClose' in HTMLDialogElement.prototype
      },
      sources: [
        { label: 'WebDX: requestClose', url: 'https://web-platform-dx.github.io/web-features-explorer/features/requestclose/' }
      ],
      notes: [
        'Öffnen, „Abbrechen“ drücken: schließt. Erneut öffnen, etwas tippen, „Abbrechen“ oder Escape: Hinweis statt Schließen. „Verwerfen“ ruft `close()` auf.',
        'Der Ausschnitt zeigt die Stelle für die Fachlogik, keine vollständige Rückfrage.'
      ]
    },

    {
      id: 'html-customizable-select',
      topic: '`appearance: base-select`',
      kicker: 'HTML · Demo 5 · Formularfelder',
      title: 'Ein natives `select` frei gestalten',
      status: 'eingeschraenkt',
      since: 'Chrome und Edge 135, Safari 27',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Customizable Select verbindet zusätzliche Gestaltung mit einem echten Formularfeld. Mit `appearance: base-select` lassen sich der geschlossene Zustand und die Auswahlliste gestalten; `<selectedcontent>` zeigt den Inhalt der gewählten Option.'
        },
        {
          type: 'demo', kind: 'web', height: 330,
          html: d`
            <label><input type="checkbox" id="custom" checked> Angepasste Darstellung</label>
            <p>
              <label for="ticket-status">Status</label>
              <select id="ticket-status" name="status">
                <button type="button"><selectedcontent></selectedcontent></button>
                <option value="open"><span aria-hidden="true">○</span> Offen</option>
                <option value="active"><span aria-hidden="true">◐</span> In Arbeit</option>
                <option value="done"><span aria-hidden="true">●</span> Erledigt</option>
              </select>
            </p>
            <output id="value"></output>
          `,
          css: d`
            @supports (appearance: base-select) {
              .custom #ticket-status,
              .custom #ticket-status::picker(select) {
                appearance: base-select;
              }
              .custom #ticket-status {
                border: 1px solid steelblue;
                border-radius: 0.5rem;
                padding: 0.6rem 1rem;
              }
              .custom #ticket-status::picker(select) {
                border: 1px solid steelblue;
                border-radius: 0.5rem;
                padding: 0.5rem;
              }
              .custom #ticket-status option {
                padding: 0.5rem;
                gap: 0.75rem;
              }
              .custom #ticket-status option:checked {
                background: #dbeafe;
              }
            }
          `,
          js: d`
            // Nur für die Demo: zwischen nativer und angepasster Darstellung wechseln
            const toggle = document.querySelector("#custom");
            const select = document.querySelector("#ticket-status");
            const show = () => {
              document.body.classList.toggle("custom", toggle.checked);
              document.querySelector("#value").textContent = "Formularwert: " + select.value;
            };
            toggle.addEventListener("change", show);
            select.addEventListener("change", show);
            show();
          `
        }
      ],
      support: {
        text: 'Stand Oktober 2026: Chrome und Edge seit 135, Safari seit 27; laut WebDX noch kein Firefox. Ohne Support bleibt eine gewöhnliche Auswahl mit den Texten der Optionen – Fallback bei reichhaltigem Optionsinhalt und in der Framework-Version prüfen.',
        test: () => CSS.supports('appearance', 'base-select')
      },
      sources: [
        { label: 'Chrome: A customizable select', url: 'https://developer.chrome.com/blog/a-customizable-select' },
        { label: 'WebDX: Customizable Select', url: 'https://web-platform-dx.github.io/web-features-explorer/features/customizable-select/' }
      ],
      notes: [
        'Zwischen nativer und angepasster Darstellung wechseln und die Auswahl per Tastatur ändern.',
        'Der explizite `value` bestimmt weiterhin den Formularwert. Die Funktionalität von `select` wird nicht durch eine selbst gebaute Liste ersetzt.',
        'Gegenüber dem Originaldokument sind die Selektoren mit `.custom` versehen, damit der Umschalter funktioniert.'
      ]
    },

    {
      id: 'html-plaintext-only',
      topic: '`contenteditable="plaintext-only"`',
      kicker: 'HTML · Demo 6 · Bearbeitbare Bereiche',
      title: 'Text bearbeiten ohne eingefügte Formatierungen',
      status: 'neu',
      role: 'zusatz',
      since: 'Baseline seit 4. März 2025',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: '`contenteditable="plaintext-only"` erlaubt das Bearbeiten des Textinhalts, ohne Rich-Text-Formatierungen beim Einfügen zu übernehmen.'
        },
        {
          type: 'demo', kind: 'web', height: 330,
          html: d`
            <p class="source">Zum Kopieren: Dieser Absatz ist <b>fett</b>, <i>kursiv</i> und <a href="#">verlinkt</a>.</p>

            <p id="rich-label">Mit Formatierungen</p>
            <div contenteditable="true" role="textbox"
                 aria-labelledby="rich-label" aria-multiline="true">
              Hier Text einfügen.
            </div>

            <p id="plain-label">Nur Text</p>
            <div contenteditable="plaintext-only" role="textbox"
                 aria-labelledby="plain-label" aria-multiline="true">
              Hier denselben Text einfügen.
            </div>
          `,
          css: d`
            [contenteditable] {
              border: 1px solid #94a3b8;
              border-radius: 0.5rem;
              padding: 0.5rem 0.75rem;
              min-height: 2.5rem;
            }
            [id$="-label"] { margin: 1rem 0 0.25rem; font-weight: 600; }
            .source { background: #fef9c3; padding: 0.5rem; }
          `
        },
        {
          type: 'callout',
          text: 'Für gewöhnliche Formulare ist `textarea` meist passender: Ein Contenteditable-Bereich erhält nicht automatisch Formularübermittlung, Validierung oder Speicherfunktion.'
        }
      ],
      support: {
        text: 'Baseline Newly available seit 4. März 2025.',
        test: () => {
          const node = document.createElement('div');
          node.contentEditable = 'plaintext-only';
          return node.contentEditable === 'plaintext-only';
        }
      },
      sources: [
        { label: 'web.dev: plaintext-only ist Baseline', url: 'https://web.dev/blog/contenteditable-plaintext-only-baseline' }
      ],
      notes: [
        'Den gelben Absatz kopieren und in beide Bereiche einfügen. Im zweiten Bereich bleibt nur der Text.',
        'Der Mehrwert liegt bei gezielt gestalteten bearbeitbaren Oberflächen.'
      ]
    },

    {
      id: 'html-hidden-until-found',
      topic: '`hidden="until-found"`',
      kicker: 'HTML · Demo 7 · Auffindbarer Inhalt',
      title: 'Verborgenen Text über die Browsersuche finden',
      status: ['grundlage', 'eingeschraenkt'],
      role: 'zusatz',
      since: 'Chromium seit 2022, Firefox 148',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: '`hidden="until-found"` verbirgt einen Bereich, lässt dessen Text aber für die Browsersuche und Fragmentnavigation auffindbar.'
        },
        {
          type: 'demo', kind: 'web', height: 260,
          html: d`
            <a href="#export-details">Zu den technischen Einzelheiten</a>
            <h2>Technische Einzelheiten</h2>
            <div id="export-details" hidden="until-found">
              <p>Der Export verwendet den speziellen Trennschlüssel Nordlicht.</p>
            </div>
          `,
          js: d`
            document.querySelector("#export-details")
              .addEventListener("beforematch", () => {
                console.log("beforematch: Bereich wird aufgedeckt");
              });
          `
        },
        {
          type: 'callout',
          tone: 'warn',
          text: 'Die Funktion versteckt Darstellung, keine vertraulichen Daten. Zusätzliches `display: none` würde den Suchmechanismus verhindern. Für produktive Inhalte einen expliziten Weg zum Aufdecken vorsehen; der Fragmentlink allein ist kein universeller Fallback.'
        }
      ],
      support: {
        text: 'In Chromium seit 2022, Firefox seit 148 (2026); laut WebDX noch nicht in Safari. Browser ohne Support behandeln den Bereich wie gewöhnlich verborgen.',
        test: () => 'onbeforematch' in HTMLElement.prototype
      },
      sources: [
        { label: 'WHATWG: hidden', url: 'https://html.spec.whatwg.org/dev/interaction.html#the-hidden-attribute' },
        { label: 'WebDX: hidden until found', url: 'https://web-platform-dx.github.io/web-features-explorer/features/hidden-until-found/' }
      ],
      notes: [
        'In das Ergebnis klicken, „Auf Seite suchen“ öffnen (Strg/⌘ + F) und nach „Nordlicht“ suchen. Der Bereich wird aufgedeckt.',
        'Danach „Zurücksetzen“ und den Fragmentlink ausprobieren.'
      ]
    },

    {
      id: 'html-in-canvas',
      topic: 'HTML-in-Canvas',
      kicker: 'HTML · Ausblick',
      title: 'HTML in Canvas',
      status: 'experimentell',
      role: 'optional',
      since: 'Chrome Origin Trial bis Chrome 160',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Ein experimenteller Vorschlag, mit dem der Browser DOM-Inhalte in Canvas zeichnen kann – etwa HTML-Bedienelemente auf Flächen einer 3D-Szene.'
        },
        {
          type: 'list',
          items: [
            'Es geht um die Verbindung von DOM und Canvas-Rendering, nicht um einen gewöhnlichen HTML-Container.',
            'Die API wurde mehrfach verändert. Neuere Beispiele verwenden `content="drawable"` und `drawable` statt des älteren `layoutsubtree`.',
            'Beispielcode immer auf die verwendete Browserversion abstimmen.'
          ]
        },
        {
          type: 'callout',
          title: 'Bereits im Einsatz: [Canvas UI](https://canvasui.dev/)',
          text: 'Komponentenbibliothek von David Haz (React Bits). Die Komponenten zeichnen echtes, weiterhin bedienbares HTML per HTML-in-Canvas in eine Canvas und legen WebGL-Effekte darüber, etwa Glas, Flüssigkeit oder Partikel. Texte, Links und Formulare bleiben im DOM. Ohne Unterstützung fallen die Effekte auf ein einfaches GPU-Overlay oder den unveränderten Inhalt zurück. Quellcode auf [GitHub](https://github.com/DavidHDev/canvas-ui), Lizenz MIT mit Commons Clause.'
        },
        {
          type: 'callout',
          tone: 'exp',
          title: 'Keine lokale Demo',
          text: 'Für die Vorführung eine offizielle Demo oder die Beispiele von Canvas UI in einer vorbereiteten Testumgebung verwenden und das Feature deutlich als Experiment kennzeichnen. Eine lokale Browserdemo ist bewusst nicht eingerichtet.'
        }
      ],
      sources: [
        { label: 'WICG: html-in-canvas', url: 'https://github.com/WICG/html-in-canvas' },
        { label: 'Chrome: Origin Trial', url: 'https://developer.chrome.com/blog/html-in-canvas-origin-trial' },
        { label: 'Chrome: API-Änderungen', url: 'https://developer.chrome.com/blog/html-in-canvas-ot-changes' },
        { label: 'Canvas UI', url: 'https://canvasui.dev/' },
        { label: 'InfoQ: Canvas UI', url: 'https://www.infoq.com/news/2026/09/canvas-ui-webgl/' }
      ],
      notes: [
        '1 bis 2 Minuten als experimenteller Abschluss der erweiterten Fassung.',
        'Origin Trial läuft laut aktueller Ankündigung bis einschließlich Chrome 160 (Stand 29. September 2026). Ältere Artikel nennen noch Chrome 148 bis 150 – das war der ursprüngliche Zeitraum vor der Verlängerung.',
        'Canvas UI zeigt, wofür das gedacht ist: Effekte über echtem HTML statt über einem Screenshot. Die volle Darstellung braucht Chrome mit Origin-Trial-Token oder dem Flag `canvas-draw-element`; Safari und Firefox unterstützen die API nicht.',
        'Canvas UI verteilt Quellcode über eine shadcn-artige Registry statt als npm-Paket; Wrapper gibt es für React, Vue, Svelte, Solid und Vanilla TypeScript.'
      ]
    },

    {
      id: 'html-weitere',
      kicker: 'HTML · Für Rückfragen',
      title: 'Weitere Entwicklungen zum Nachlesen',
      role: 'zusatz',
      blocks: [
        {
          type: 'table',
          head: ['Thema', 'Konkreter Nutzen', 'Einordnung'],
          rows: [
            ['Deklaratives Shadow DOM', 'Shadow Root samt Styles direkt im HTML, etwa für serverseitig gerenderte Web Components', 'Baseline 2024 · [web.dev](https://web.dev/articles/declarative-shadow-dom)'],
            ['Scoped Custom Element Registries', 'Gleichnamige Custom Elements verschiedener Bibliotheken getrennt registrieren', 'Uneinheitlicher Support · [Chrome](https://developer.chrome.com/blog/scoped-registries), [WebDX](https://web-platform-dx.github.io/web-features-explorer/features/scoped-custom-element-registries/)'],
            ['Interest Invokers mit `interestfor`', 'Hover, Fokus oder langes Drücken als Auslöser für Einblendungen', 'Nur Chromium · [WebDX](https://web-platform-dx.github.io/web-features-explorer/features/interest-invokers/)'],
            ['`fetchpriority`', 'Relative Ladepriorität wichtiger Ressourcen beeinflussen', 'Baseline seit Oktober 2024; ein Hinweis, keine feste Reihenfolge · [web.dev](https://web.dev/articles/fetch-priority)'],
            ['Speculation Rules', 'Wahrscheinliche Folgeseiten vorladen oder vorrendern', 'Chromium; Effekte vorab messen · [Chrome](https://developer.chrome.com/docs/web-platform/implementing-speculation-rules)']
          ]
        },
        {
          type: 'h',
          text: 'Ergänzende Themen'
        },
        {
          type: 'list',
          items: [
            '`inert` sperrt einen Teilbaum für Interaktion und entfernt ihn aus der Zugänglichkeitsdarstellung – ohne ihn visuell auszublenden. Bei `showModal()` übernimmt der Browser das bereits.',
            '`<search>` zeichnet einen Such- oder Filterbereich semantisch aus. Die Suche selbst implementiert es nicht.',
            'Deklaratives Shadow DOM über `<template shadowrootmode="open">`.',
            'CSS `::backdrop`, `@starting-style`, diskrete Übergänge und Anchor Positioning verbinden HTML und CSS – Gestaltungsmöglichkeiten getrennt vom HTML-Basissupport prüfen.'
          ]
        }
      ],
      notes: [
        'Diese Themen sind eine Auswahl, kein vollständiges Änderungsprotokoll.',
        'Für ein Team ohne Web Components sind Scoped Registries eher Hintergrundwissen. Ladeprioritäten und Speculation Rules brauchen eine vorbereitete Messung.'
      ]
    },

    {
      id: 'html-support',
      kicker: 'HTML · Support und Ablauf',
      title: 'Supportchecks und Auswahl',
      role: 'einordnung',
      blocks: [
        {
          type: 'checks',
          items: [
            { label: '`dialog` mit `showModal()`', code: '"showModal" in HTMLDialogElement.prototype', test: hasDialog },
            { label: 'Invoker Commands', code: '"commandForElement" in HTMLButtonElement.prototype', test: () => 'commandForElement' in HTMLButtonElement.prototype },
            { label: 'Popover', code: '"popover" in HTMLElement.prototype', test: () => 'popover' in HTMLElement.prototype },
            { label: '`details name`', code: '"name" in HTMLDetailsElement.prototype', test: () => 'name' in HTMLDetailsElement.prototype },
            { label: '`requestClose()`', code: '"requestClose" in HTMLDialogElement.prototype', test: () => 'requestClose' in HTMLDialogElement.prototype },
            { label: '`closedby`', code: '"closedBy" in HTMLDialogElement.prototype', test: () => 'closedBy' in HTMLDialogElement.prototype },
            { label: 'Customizable Select', code: 'CSS.supports("appearance", "base-select")', test: () => CSS.supports('appearance', 'base-select') },
            { label: '`hidden="until-found"`', code: '"onbeforematch" in HTMLElement.prototype', test: () => 'onbeforematch' in HTMLElement.prototype }
          ]
        },
        {
          type: 'table',
          head: ['Kurze Fassung · 8 bis 10 Min.', 'Erweiterte Fassung · 14 bis 17 Min.'],
          rows: [
            ['Dialog und deklarative Buttons', 'Dialog und deklarative Buttons'],
            ['Popover als nichtmodale Alternative', 'Popover und exklusives Akkordeon'],
            ['Exklusives Akkordeon', 'Customizable Select'],
            ['Ein Zusatzbeispiel nach Teaminteresse', 'Plaintext Only und Hidden Until Found'],
            ['Kurze Supporteinordnung', 'HTML-in-Canvas als experimenteller Abschluss']
          ]
        },
        {
          type: 'p',
          text: 'Die Prüfungen zeigen verfügbare API-Oberflächen; sie ersetzen keine Verhaltenstests. Dialoge und Popovers mit Maus, Tab, Enter und Escape testen.'
        }
      ],
      notes: [
        '`closedby` und `requestClose()` bleiben Reserve für Fragen zum Schließverhalten.',
        'Die passende Auswahl hängt von den Anwendungen des Teams ab.'
      ]
    }
  ]);
})();
