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
          text: 'Was erledigt der Browser heute selbst, wofür wir bisher eigene Komponenten, Bibliotheken oder zusätzliches JavaScript gebraucht haben?'
        },
        {
          type: 'table',
          head: ['Feature', 'Stand', 'Worum es geht'],
          rows: [
            ['`<dialog>` und `showModal()`', 'Seit 2022 in allen großen Browsern, älteres Feature', 'Was ein echter modaler Dialog alles mitbringt'],
            ['`<details name="…">`', 'Baseline 2024', 'In einer Gruppe ist höchstens ein Abschnitt offen'],
            ['`popover` und `popovertarget`', 'Baseline seit Januar 2025', 'Einblendungen, die die Seite nicht sperren, ohne eigenen Toggle-Handler'],
            ['`dialog.requestClose()`', 'Baseline seit Mai 2025', 'Schließen an einer Stelle abfangen und notfalls verhindern'],
            ['`commandfor` und `command`', 'Baseline seit Dezember 2025', 'Dialoge per Button-Attribut steuern, ohne JavaScript'],
            ['`<dialog closedby="…">`', 'Noch nicht überall verfügbar', 'Festlegen, ob Escape oder ein Klick daneben den Dialog schließt'],
            ['`inert`', 'Baseline April 2023, älteres Feature', 'Teile der Seite für Bedienung und Screenreader sperren'],
            ['`<search>`', 'Baseline Oktober 2023', 'Suchbereiche semantisch kennzeichnen'],
            ['Deklaratives Shadow DOM', 'Baseline Februar 2024', 'Shadow DOM direkt im HTML, etwa beim Rendern auf dem Server']
          ]
        },
        {
          type: 'p',
          text: 'HTML ist ein Living Standard, Jahresversionen wie ES2025 gibt es nicht. Dass ein Feature im Standard steht, heißt deshalb noch nicht, dass es die Browser schon können. Diesen Unterschied machen wir jeweils deutlich.'
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
        'Im Mittelpunkt steht, was der Browser an Interaktion mitbringt: Dialoge, Popovers und Akkordeons. Dafür haben wir bisher oft eigene Zustandsverwaltung und Event-Handler geschrieben.',
        'Die Beispiele zeigen nur, wie es grundsätzlich funktioniert. Tastaturbedienung, Beschriftung und das Verhalten in unserer Anwendung müssen wir trotzdem selbst prüfen.',
        'Manche Erweiterungen eines Elements kommen erst später in den Browsern an als das Element selbst.'
      ]
    },

    {
      id: 'html-dialog',
      topic: '`<dialog>` · `showModal()`',
      kicker: 'HTML · Demo 1 · Eingebaute Interaktion',
      title: 'Ein modaler Dialog, den der Browser mitbringt',
      status: 'grundlage',
      since: 'Seit 2022 in allen großen Browsern',
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
                  'Overlay selbst bauen und gestalten',
                  'Fokus ins Modal setzen und dort festhalten',
                  'Escape-Taste selbst abfangen',
                  'Hintergrund für Maus, Tastatur und Screenreader sperren',
                  'Beim Schließen den Fokus zurücksetzen',
                  'Mit `z-index` sicherstellen, dass das Modal oben liegt'
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
          text: '`showModal()` legt den Dialog in den Top Layer und sperrt den Rest der Seite. Wichtig: Mit dem Attribut `open` oder mit `show()` öffnet er sich dagegen **nicht modal**.'
        }
      ],
      support: {
        text: 'Seit 2022 in allen großen Browsern.',
        test: hasDialog
      },
      sources: [
        { label: 'WHATWG: dialog', url: 'https://html.spec.whatwg.org/dev/interactive-elements.html#the-dialog-element' }
      ],
      notes: [
        'Öffnen, mit Tab herumspringen, Escape drücken, dann noch einmal öffnen und über „Fertig“ schließen.',
        '`method="dialog"` schließt den Dialog beim Absenden, ohne etwas an einen Server zu schicken. Der Wert des Buttons landet in `dialog.returnValue`. Gespeichert wird dadurch aber nichts.',
        'Überlegen, wo der Fokus beim Öffnen landen soll, und immer einen sichtbaren Schließen-Button anbieten.'
      ]
    },

    {
      id: 'html-invoker-commands',
      topic: '`commandfor` · `command`',
      kicker: 'HTML · Demo 2 · Eingebaute Interaktion',
      title: 'Dialog öffnen ohne Klick-Handler',
      status: 'neu',
      since: 'Baseline seit 12. Dezember 2025',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Mit Invoker Commands schickt ein Button einen Befehl direkt an ein anderes Element. `commandfor` nennt die ID des Ziels, `command` die Aktion.'
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
          text: 'Für Dialoge gibt es die eingebauten Befehle `show-modal`, `close` und `request-close`. Eigene Befehle beginnen mit `--`, für sie braucht es weiterhin eigenen Code. `type="button"` stellt klar, dass der Button kein Formular absendet.'
        }
      ],
      support: {
        text: 'Baseline Newly available seit 12. Dezember 2025. Ein Browser, der `<dialog>` kann, kennt diese Attribute nicht zwingend. Als Fallback `showModal()` per JavaScript aufrufen.',
        test: () => 'commandForElement' in HTMLButtonElement.prototype
      },
      sources: [
        { label: 'Open UI: Invoker Commands', url: 'https://open-ui.org/components/invokers.explainer/' },
        { label: 'WebDX: Invoker Commands', url: 'https://web-platform-dx.github.io/web-features-explorer/features/invoker-commands/' }
      ],
      notes: [
        'Zeigen, dass rechts kein JavaScript dabei ist. Dann den Dialog öffnen und schließen.',
        'Für Popovers gibt es passend dazu `show-popover`, `hide-popover` und `toggle-popover`.'
      ]
    },

    {
      id: 'html-popover',
      topic: '`popover` · `popovertarget`',
      kicker: 'HTML · Demo 3 · Eingebaute Interaktion',
      title: 'Ein Popover direkt im HTML',
      status: 'neu',
      since: 'Baseline seit 27. Januar 2025',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Ein Popover passt für Zusatzinformationen, bei denen der Rest der Seite bedienbar bleiben soll. Das Attribut `popover` macht den Inhalt also nicht modal.'
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
          text: 'Ein Popover ist nicht automatisch ein Menü, eine Combobox oder ein Tooltip: Semantik und Tastatursteuerung dafür fehlen. Auch die Position am Auslöser muss man selbst festlegen, etwa mit CSS Anchor Positioning.'
        }
      ],
      support: {
        text: 'Baseline Newly available seit 27. Januar 2025. Anfangs hieß es April 2024, das Datum wurde aber wegen eines Fehlers beim Schließen auf iOS korrigiert.',
        test: () => 'popover' in HTMLElement.prototype
      },
      sources: [
        { label: 'WHATWG: Popover', url: 'https://html.spec.whatwg.org/dev/popover.html' },
        { label: 'web.dev: korrigierte Baseline-Einordnung', url: 'https://web.dev/blog/popover-baseline' }
      ],
      notes: [
        'Öffnen, dann daneben klicken oder Escape drücken. Das Auto-Popover liegt im Top Layer und schließt sich bei einem Klick daneben von selbst (Light Dismiss).',
        'Einen eigenen Toggle-Handler braucht es dafür nicht.'
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
                  ['Rest der Seite gesperrt?', 'Ja', 'Nein'],
                  ['Typische Verwendung', 'Eine Entscheidung oder ein in sich geschlossener Arbeitsschritt', 'Zusatzinformationen, Einblendung ohne Sperre'],
                  ['Klick daneben schließt', 'Mit `closedby="any"`, falls unterstützt', 'Ja'],
                  ['Escape schließt', 'Ja, wenn es nicht verhindert wird', 'Ja'],
                  ['Liegt im Top Layer', 'Ja', 'Ja']
                ]
              },
              {
                type: 'p',
                text: 'Welches Element man nimmt, legt das Verhalten nicht allein fest. Es gibt zum Beispiel auch nicht modale Dialoge.'
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
        'Wir vergleichen hier bewusst einen Dialog mit `showModal()` und ein Auto-Popover.',
        'Ohne `closedby` passiert beim Dialog nichts, wenn man daneben klickt. Das Popover schließt sich.'
      ]
    },

    {
      id: 'html-details-name',
      topic: '`<details name>`',
      kicker: 'HTML · Demo 4 · Eingebaute Interaktion',
      title: 'Exklusive Akkordeons mit `details name`',
      status: 'neu',
      since: 'Baseline 2024',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: '`<details>` und `<summary>` gibt es schon lange. Neu ist: Bekommen mehrere Einträge denselben `name`, ist immer nur einer davon offen. Ganz ohne JavaScript.'
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
        text: 'Baseline 2024. Nicht überall sinnvoll: Wer mehrere Antworten vergleichen will, möchte sie vielleicht gleichzeitig offen haben.',
        test: () => 'name' in HTMLDetailsElement.prototype
      },
      sources: [
        { label: 'WHATWG: details', url: 'https://html.spec.whatwg.org/dev/interactive-elements.html#the-details-element' },
        { label: 'MDN: Exklusive Akkordeons', url: 'https://developer.mozilla.org/en-US/blog/html-details-exclusive-accordions/' }
      ],
      notes: [
        'Rechts nacheinander die Einträge öffnen: Der vorige schließt sich jeweils. Links bleiben alle offen.',
        'Zwei Akkordeons, die nichts miteinander zu tun haben, brauchen verschiedene Namen.',
        'In der Rechercheunterlage steckt die Gruppe in einer `<section aria-labelledby>` mit Überschrift. Auf echten Seiten sollte man das auch so machen.'
      ]
    },

    {
      id: 'html-closedby',
      topic: '`<dialog closedby>`',
      kicker: 'HTML · Reserve · Schließverhalten',
      title: 'Mit `closedby` festlegen, was den Dialog schließt',
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
                  ['`any`', 'Klick daneben (Light Dismiss) und die üblichen Wege wie Escape'],
                  ['`closerequest`', 'Die üblichen Wege wie Escape, aber kein Klick daneben'],
                  ['`none`', 'Nichts davon, nur Schließen per Button oder Code']
                ]
              },
              {
                type: 'p',
                text: 'Ohne das Attribut verhält sich ein modaler Dialog wie bei `closerequest`. Ein Schließen-Button, ein Formular mit `method="dialog"` oder `close()` funktionieren in jedem Fall.'
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
        text: 'Stand 26. Oktober 2026: Chrome und Edge seit 134, Firefox seit 141, Safari laut WebDX noch nicht. Ein sichtbarer Schließen-Button gehört deshalb immer dazu.',
        test: () => typeof HTMLDialogElement !== 'undefined' && 'closedBy' in HTMLDialogElement.prototype
      },
      sources: [
        { label: 'WebDX: dialog closedby', url: 'https://web-platform-dx.github.io/web-features-explorer/features/dialog-closedby/' }
      ],
      notes: [
        '`any` und `closerequest` vergleichen: Wert im Editor ändern, dann daneben klicken.',
        'Als Zusatz gedacht, weil der Support noch eingeschränkt ist.'
      ]
    },

    {
      id: 'html-request-close',
      topic: '`dialog.requestClose()`',
      kicker: 'HTML · Reserve · Schließverhalten',
      title: 'Schließen verhindern mit `requestClose()`',
      status: 'neu',
      role: 'reserve',
      since: 'Baseline seit Mai 2025',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: '`requestClose()` löst erst ein `cancel`-Event aus. Dort kann die Anwendung das Schließen verhindern, etwa wenn noch ungespeicherte Änderungen da sind. `close()` dagegen schließt sofort.'
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
          text: 'Ohne JavaScript geht das mit einem Button und `command="request-close"`. Auch bei `closedby="none"` lässt sich `requestClose()` weiterhin direkt aufrufen.'
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
        'Öffnen und „Abbrechen“ drücken: Der Dialog schließt. Noch einmal öffnen, etwas tippen, dann „Abbrechen“ oder Escape: Jetzt erscheint ein Hinweis, und der Dialog bleibt offen. „Verwerfen“ ruft `close()` auf.',
        'Das Beispiel zeigt nur, wo die eigene Logik hingehört. Eine richtige Rückfrage ist es noch nicht.'
      ]
    },

    {
      id: 'html-customizable-select',
      topic: '`appearance: base-select`',
      kicker: 'HTML · Demo 5 · Formularfelder',
      title: 'Ein echtes `select` frei gestalten',
      status: 'eingeschraenkt',
      since: 'Chrome und Edge 135, Safari 27',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Mit Customizable Select lässt sich ein echtes Formularfeld frei gestalten. `appearance: base-select` öffnet das geschlossene Feld und die aufgeklappte Liste für eigenes CSS. `<selectedcontent>` zeigt den Inhalt der gewählten Option an.'
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
        text: 'Stand Oktober 2026: Chrome und Edge seit 135, Safari seit 27, Firefox laut WebDX noch nicht. Ohne Support bleibt ein normales Auswahlfeld mit den Texten der Optionen. Wenn die Optionen mehr als Text enthalten oder ein Framework im Spiel ist, den Fallback genau prüfen.',
        test: () => CSS.supports('appearance', 'base-select')
      },
      sources: [
        { label: 'Chrome: A customizable select', url: 'https://developer.chrome.com/blog/a-customizable-select' },
        { label: 'WebDX: Customizable Select', url: 'https://web-platform-dx.github.io/web-features-explorer/features/customizable-select/' }
      ],
      notes: [
        'Zwischen Standard- und angepasster Darstellung wechseln und die Auswahl auch per Tastatur ändern.',
        'Der Formularwert kommt weiterhin aus `value`. Es bleibt ein echtes `select`, keine nachgebaute Liste.',
        'Anders als in der Rechercheunterlage hängt vor den Selektoren `.custom`, damit der Umschalter funktioniert.'
      ]
    },

    {
      id: 'html-plaintext-only',
      topic: '`contenteditable="plaintext-only"`',
      kicker: 'HTML · Demo 6 · Bearbeitbare Bereiche',
      title: 'Einfügen ohne Formatierung',
      status: 'neu',
      role: 'zusatz',
      since: 'Baseline seit 4. März 2025',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: 'Mit `contenteditable="plaintext-only"` lässt sich Text bearbeiten, und beim Einfügen bleiben Fett, Kursiv, Links und andere Formatierungen draußen.'
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
          text: 'In normalen Formularen ist `textarea` meist die bessere Wahl. Ein `contenteditable`-Bereich wird nicht mit dem Formular abgeschickt, nicht validiert und nicht gespeichert.'
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
        'Den gelben Absatz kopieren und in beide Felder einfügen. Im zweiten kommt nur der reine Text an.',
        'Interessant ist das vor allem für eigene Bearbeitungsoberflächen, bei denen ein `textarea` nicht reicht.'
      ]
    },

    {
      id: 'html-hidden-until-found',
      topic: '`hidden="until-found"`',
      kicker: 'HTML · Demo 7 · Auffindbarer Inhalt',
      title: 'Versteckten Text mit der Browsersuche finden',
      status: ['grundlage', 'eingeschraenkt'],
      role: 'zusatz',
      since: 'Chromium seit 2022, Firefox 148',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: '`hidden="until-found"` versteckt einen Bereich, aber die Suche im Browser und Sprungmarken (`#anker`) finden ihn trotzdem und klappen ihn auf.'
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
          text: 'Der Text ist nur unsichtbar, nicht geschützt. Vertrauliches gehört hier nicht hinein. Ein zusätzliches `display: none` würde die Suche aushebeln. Auf echten Seiten immer auch einen Button oder Link zum Aufklappen anbieten, ein Sprunglink allein funktioniert nicht überall.'
        }
      ],
      support: {
        text: 'In Chromium seit 2022, Firefox seit 148 (2026), Safari laut WebDX noch nicht. Browser ohne Support behandeln den Bereich wie ein normales `hidden`.',
        test: () => 'onbeforematch' in HTMLElement.prototype
      },
      sources: [
        { label: 'WHATWG: hidden', url: 'https://html.spec.whatwg.org/dev/interaction.html#the-hidden-attribute' },
        { label: 'WebDX: hidden until found', url: 'https://web-platform-dx.github.io/web-features-explorer/features/hidden-until-found/' }
      ],
      notes: [
        'In das Ergebnis klicken, die Seitensuche öffnen (Strg/⌘ + F) und nach „Nordlicht“ suchen. Der Bereich klappt auf.',
        'Danach „Zurücksetzen“ und den Sprunglink ausprobieren.'
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
          text: 'Ein experimenteller Vorschlag: Der Browser soll HTML-Inhalte in ein Canvas zeichnen können, etwa Bedienelemente auf die Flächen einer 3D-Szene.'
        },
        {
          type: 'list',
          items: [
            'Es geht darum, DOM und Canvas zusammenzubringen. Ein neuer Container für HTML ist es nicht.',
            'Die API hat sich schon mehrmals geändert. Neuere Beispiele nutzen `content="drawable"` und `drawable` statt des älteren `layoutsubtree`.',
            'Beispielcode muss deshalb immer zur Browserversion passen.'
          ]
        },
        {
          type: 'callout',
          title: 'Bereits im Einsatz: [Canvas UI](https://canvasui.dev/)',
          text: 'Eine Komponentenbibliothek von David Haz (React Bits). Sie zeichnet echtes, bedienbares HTML mit HTML-in-Canvas in ein Canvas und legt WebGL-Effekte darüber, etwa Glas, Flüssigkeit oder Partikel. Texte, Links und Formulare bleiben dabei im DOM. Kann der Browser das nicht, gibt es ein einfaches GPU-Overlay oder den Inhalt ohne Effekt. Quellcode auf [GitHub](https://github.com/DavidHDev/canvas-ui), Lizenz MIT mit Commons Clause.'
        },
        {
          type: 'callout',
          tone: 'exp',
          title: 'Keine lokale Demo',
          text: 'Für die Vorführung eine offizielle Demo oder die Beispiele von Canvas UI in einer vorbereiteten Umgebung zeigen und klar sagen, dass es ein Experiment ist. Eine eigene Demo in dieser Präsentation gibt es absichtlich nicht.'
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
        '1 bis 2 Minuten als Ausblick am Ende der langen Fassung.',
        'Der Origin Trial läuft laut aktueller Ankündigung bis einschließlich Chrome 160 (Stand 29. September 2026). Ältere Artikel nennen noch Chrome 148 bis 150, das war der ursprüngliche Zeitraum vor der Verlängerung.',
        'Canvas UI zeigt gut, wofür das gedacht ist: Effekte über echtem HTML statt über einem Screenshot davon. Alles sieht man nur in Chrome mit Origin-Trial-Token oder dem Flag `canvas-draw-element`. Safari und Firefox können die API nicht.',
        'Canvas UI kommt nicht als npm-Paket, sondern wie bei shadcn über eine Registry, aus der man den Quellcode übernimmt. Wrapper gibt es für React, Vue, Svelte, Solid und reines TypeScript.'
      ]
    },

    {
      id: 'html-weitere',
      kicker: 'HTML · Für Rückfragen',
      title: 'Was es sonst noch gibt',
      role: 'zusatz',
      blocks: [
        {
          type: 'table',
          head: ['Thema', 'Wofür', 'Stand'],
          rows: [
            ['Deklaratives Shadow DOM', 'Shadow Root samt Styles direkt im HTML, etwa für Web Components, die auf dem Server gerendert werden', 'Baseline 2024 · [web.dev](https://web.dev/articles/declarative-shadow-dom)'],
            ['Scoped Custom Element Registries', 'Custom Elements mit gleichem Namen aus verschiedenen Bibliotheken nebeneinander nutzen', 'Unterschiedlich unterstützt · [Chrome](https://developer.chrome.com/blog/scoped-registries), [WebDX](https://web-platform-dx.github.io/web-features-explorer/features/scoped-custom-element-registries/)'],
            ['Interest Invokers mit `interestfor`', 'Einblendungen bei Hover, Fokus oder langem Drücken', 'Nur Chromium · [WebDX](https://web-platform-dx.github.io/web-features-explorer/features/interest-invokers/)'],
            ['`fetchpriority`', 'Dem Browser sagen, welche Ressourcen er zuerst laden soll', 'Baseline seit Oktober 2024; nur ein Hinweis an den Browser, keine Garantie · [web.dev](https://web.dev/articles/fetch-priority)'],
            ['Speculation Rules', 'Seiten, die als Nächstes wahrscheinlich aufgerufen werden, vorab laden oder rendern', 'Nur Chromium; Wirkung vorher messen · [Chrome](https://developer.chrome.com/docs/web-platform/implementing-speculation-rules)']
          ]
        },
        {
          type: 'h',
          text: 'Außerdem'
        },
        {
          type: 'list',
          items: [
            '`inert` sperrt einen Teil der Seite für Bedienung und Screenreader, er bleibt aber sichtbar. Bei `showModal()` macht der Browser das automatisch mit dem Rest der Seite.',
            '`<search>` kennzeichnet einen Such- oder Filterbereich. Suchen muss man trotzdem selbst.',
            'Deklaratives Shadow DOM schreibt man als `<template shadowrootmode="open">`.',
            'Mit `::backdrop`, `@starting-style`, diskreten Übergängen und Anchor Positioning gestaltet man diese Elemente per CSS. Ob der Browser das kann, ist eine eigene Frage, unabhängig vom HTML-Element selbst.'
          ]
        }
      ],
      notes: [
        'Das ist eine Auswahl, keine vollständige Liste aller Änderungen.',
        'Solange wir keine Web Components bauen, sind Scoped Registries eher Hintergrundwissen. Ladepriorität und Speculation Rules nur mit vorbereiteter Messung zeigen.'
      ]
    },

    {
      id: 'html-support',
      kicker: 'HTML · Support und Ablauf',
      title: 'Support prüfen und Demos auswählen',
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
            ['Popover als Alternative ohne Sperre', 'Popover und exklusives Akkordeon'],
            ['Exklusives Akkordeon', 'Customizable Select'],
            ['Ein Zusatzbeispiel, je nach Interesse', 'Plaintext Only und Hidden Until Found'],
            ['Kurz zum Browsersupport', 'HTML-in-Canvas als Ausblick zum Schluss']
          ]
        },
        {
          type: 'p',
          text: 'Die Prüfungen zeigen nur, ob es die API gibt, nicht, ob sie sich richtig verhält. Dialoge und Popovers deshalb immer auch mit Maus, Tab, Enter und Escape ausprobieren.'
        }
      ],
      notes: [
        '`closedby` und `requestClose()` halten wir in Reserve, falls Fragen zum Schließen kommen.',
        'Was davon wir zeigen, hängt davon ab, woran das Team gerade arbeitet.'
      ]
    }
  ]);
})();
