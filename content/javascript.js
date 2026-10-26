(() => {
  'use strict';
  const { add, d } = Deck;

  const runtimeNote = 'Eine ECMAScript-Jahresangabe garantiert keinen Support im Zielbrowser, in einer WebView oder in der eingesetzten Node-Version.';

  add('js', [
    {
      id: 'js',
      layout: 'chapter',
      kicker: 'Kapitel 2',
      title: 'JavaScript',
      since: 'ES2024 bis ES2026',
      blocks: [
        {
          type: 'lead',
          text: 'Die jährliche ECMAScript-Ausgabe beschreibt den Sprachstandard. Browser und Node.js liefern Features unabhängig davon aus.'
        },
        {
          type: 'table',
          head: ['Ausgabe', 'Relevante Neuerungen', 'Auswahl'],
          rows: [
            ['ES2022', '`.at()` für Arrays, Strings und TypedArrays', 'Ja · ältere Grundlage'],
            ['ES2023', '`toSorted`, `toReversed`, `toSpliced`, `with`; `findLast` und `findLastIndex`', 'Ältere Grundlage'],
            ['ES2024', '`Object.groupBy` und `Map.groupBy`; `Promise.withResolvers`; RegExp `v`-Flag; wohlgeformte Unicode-Strings; veränderbare Buffer', '`groupBy`'],
            ['ES2025', 'Set-Operationen; Iterator Helpers; `RegExp.escape`; `Promise.try`; Import Attributes und JSON-Module; `Float16Array`; RegExp-Modifikatoren', 'Sets und Iteratoren'],
            ['ES2026', '`Array.fromAsync`; `Iterator.concat`; `Math.sumPrecise`; `Error.isError`; Map `getOrInsert`; `Uint8Array` Base64 und Hex; `JSON.parse` Quelltextzugriff', 'Optional']
          ]
        },
        {
          type: 'callout',
          text: 'ES2023 erschien im Juni 2023 und liegt vor unserem Startdatum. ES2026 ist als 17. Ausgabe im Juni 2026 erschienen. **Temporal** und **Explicit Resource Management** führt die geprüfte TC39-Liste mit geplantem Jahr 2027 – sie sind hier keine ES2026-Features.'
        }
      ],
      sources: [
        { label: 'TC39 Finished Proposals', url: 'https://github.com/tc39/proposals/blob/main/finished-proposals.md' },
        { label: 'Ecma ECMA-262', url: 'https://ecma-international.org/publications-and-standards/standards/ecma-262/' },
        { label: 'ECMAScript 2025 Introduction', url: 'https://tc39.es/ecma262/2025/multipage/#sec-intro' }
      ],
      notes: [
        'Quellen geprüft am 5. Oktober 2026.',
        'Die laufende TC39-Spezifikation enthält bereits Ergänzungen für spätere Ausgaben. Bei Jahresangaben verwenden wir die Jahresausgabe oder die Finished-Proposals-Liste.',
        'Alle JavaScript-Demos laufen live im Browser, in dem die Präsentation geöffnet ist.'
      ]
    },

    {
      id: 'js-at',
      topic: '`Array.prototype.at()`',
      kicker: 'JavaScript · Demo 1 · Relative Indizes',
      title: 'Das letzte Element mit `.at()` lesen',
      status: 'grundlage',
      since: 'ES2022',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Negative Indizes vereinfachen den Zugriff vom Ende aus: `0` ist das erste Element, `-1` das letzte, `-2` das vorletzte.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                const events = ["Login", "Suche", "Export"];

                console.log(events[events.length - 1]); // "Export"
                console.log(events[events.length - 2]); // "Suche"

                // Eckige Klammern lesen eine Eigenschaft namens "-1"
                console.log(events[-1]); // undefined
              `
            }]
          },
          after: {
            label: 'Mit .at()',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                const events = ["Login", "Suche", "Export"];

                console.log(events.at(0));   // "Login"
                console.log(events.at(-1));  // "Export"
                console.log(events.at(-2));  // "Suche"
                console.log(events.at(99));  // undefined
                console.log([].at(-1));      // undefined

                // Funktioniert auch mit Strings und TypedArrays
                console.log("report.csv".at(-1)); // "v"
                console.log(new Uint8Array([10, 20, 30]).at(-1)); // 30
              `
            }]
          }
        },
        {
          type: 'callout',
          text: '`.at()` dient zum Lesen. Zum Schreiben weiterhin `events[events.length - 1] = value` verwenden. Bei Strings arbeitet `.at()` mit UTF-16-Codeeinheiten; ein Emoji kann aus mehreren Einheiten bestehen.'
        }
      ],
      support: {
        text: 'Breit verfügbar seit ES2022.',
        test: () => typeof Array.prototype.at === 'function'
      },
      sources: [
        { label: 'TC39 Relative Indexing Method', url: 'https://tc39.es/proposal-relative-indexing-method/' }
      ],
      notes: [
        'Kurzer Einstieg, ältere Grundlage aus ES2022.',
        'Ein weiteres Ereignis anhängen und erneut `.at(-1)` aufrufen. Danach das Array leeren.',
        'Die Methode verändert die Sammlung nicht. Außerhalb des Bereichs liefert sie `undefined`.',
        'Bei `events[-1]` wird eine Eigenschaft mit dem Namen `"-1"` gelesen.'
      ]
    },

    {
      id: 'js-groupby',
      topic: '`Object.groupBy()` · `Map.groupBy()`',
      kicker: 'JavaScript · Demo 2 · Daten gruppieren',
      title: 'Gruppieren ohne eigene Sammellogik',
      status: 'neu',
      since: 'ES2024',
      minutes: 3,
      blocks: [
        {
          type: 'lead',
          text: '`Object.groupBy` bündelt Elemente anhand eines Schlüssels. Für Aufgaben nach Status oder Mitarbeitende nach Team entfällt eine selbst geschriebene `reduce`-Sammellogik.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher mit reduce',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                const tasks = [
                  { title: "Login", status: "open" },
                  { title: "Suche", status: "done" },
                  { title: "Export", status: "open" }
                ];

                const before = tasks.reduce((groups, task) => {
                  (groups[task.status] ??= []).push(task);
                  return groups;
                }, Object.create(null));

                console.log(before.open.map(task => task.title));
              `
            }]
          },
          after: {
            label: 'Heute mit Object.groupBy',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                const tasks = [
                  { title: "Login", status: "open" },
                  { title: "Suche", status: "done" },
                  { title: "Export", status: "open" }
                ];

                const after = Object.groupBy(tasks, task => task.status);
                console.log(after.open.map(task => task.title));
                // ["Login", "Export"]

                // Ergebnis ohne Prototyp: Gruppen mit Object.hasOwn prüfen
                console.log(Object.hasOwn(after, "blocked")); // false
              `
            }]
          }
        },
        {
          type: 'callout',
          text: 'Das Ergebnis hat keinen Objekt-Prototyp. Für Objekte als Gruppenschlüssel eignet sich `Map.groupBy`. Die enthaltenen Objekte werden nicht tief kopiert.'
        }
      ],
      support: {
        text: 'ES2024, Baseline 2024. ' + runtimeNote,
        test: () => typeof Object.groupBy === 'function'
      },
      sources: [
        { label: 'TC39 Array Grouping', url: 'https://github.com/tc39/proposal-array-grouping' }
      ],
      notes: [
        'Einen neuen Status hinzufügen, etwa `{ title: "Import", status: "blocked" }` – die Gruppe entsteht automatisch.',
        'Zum Prüfen einer Gruppe `Object.hasOwn` verwenden, weil das Ergebnis keinen Prototyp hat.',
        'Einsatzstelle im Team nennen: Gruppierung in einer Tabelle oder Liste.'
      ]
    },

    {
      id: 'js-set-methods',
      topic: '`intersection()` · `difference()` · `union()`',
      kicker: 'JavaScript · Demo 3 · Mengen vergleichen',
      title: 'Überschneidungen mit Sets',
      status: 'neu',
      since: 'ES2025',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Die neuen Set-Methoden drücken Mengenoperationen direkt aus. Bei Rollen, Tags oder Filterauswahlen ist das Ergebnis sofort verständlich.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                const chosen = new Set(["TS", "JS", "CSS"]);
                const known = new Set(["JS", "HTML"]);

                const before = new Set([...chosen].filter(x => known.has(x)));
                console.log([...before]); // ["JS"]
              `
            }]
          },
          after: {
            label: 'Heute',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                const chosen = new Set(["TS", "JS", "CSS"]);
                const known = new Set(["JS", "HTML"]);

                console.log([...chosen.intersection(known)]); // ["JS"]
                console.log([...chosen.difference(known)]);   // ["TS", "CSS"]
                console.log([...chosen.union(known)]);        // ["TS", "JS", "CSS", "HTML"]
              `
            }]
          }
        },
        {
          type: 'callout',
          text: 'Die ursprünglichen Sets bleiben unverändert. Ergänzend gibt es `symmetricDifference`, `isSubsetOf`, `isSupersetOf` und `isDisjointFrom`. Objektwerte werden über ihre Identität verglichen.'
        }
      ],
      support: {
        text: 'ES2025. ' + runtimeNote,
        test: () => typeof Set.prototype.intersection === 'function'
      },
      sources: [
        { label: 'TC39 Set Methods', url: 'https://github.com/tc39/proposal-set-methods' }
      ],
      notes: [
        'Dieselben fachlichen Daten wie zuvor nutzen – etwa Tags oder Rollen.',
        'Mit einem weiteren Tag das Ergebnis ändern, zum Beispiel `"HTML"` zu `chosen` hinzufügen.',
        'Einsatzstelle: Tagfilter, Berechtigungen.'
      ]
    },

    {
      id: 'js-iterator-helpers',
      topic: 'Iterator Helpers · `filter()` · `take()` · `toArray()`',
      kicker: 'JavaScript · Demo 4 · Iteratoren',
      title: 'Iteratoren verarbeiten nur benötigte Werte',
      status: 'neu',
      since: 'ES2025 · Baseline seit 31. März 2025',
      minutes: 3,
      blocks: [
        {
          type: 'lead',
          text: 'Iterator Helpers erlauben `map`, `filter` und `take` direkt auf Iteratoren. Die Berechnung startet erst beim Verbrauch – interessant bei Generatoren und großen Datenfolgen.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher: alle Werte materialisieren',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                function* tickets() {
                  for (let id = 1; id <= 100; id++) {
                    console.log("Erzeuge", id);
                    yield { id, open: id % 2 === 0 };
                  }
                }

                const result = [...tickets()].filter(t => t.open).slice(0, 2);
                console.log(result.map(t => t.id)); // [2, 4]
              `
            }]
          },
          after: {
            label: 'Heute: erst bei toArray berechnen',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                function* tickets() {
                  for (let id = 1; id <= 100; id++) {
                    console.log("Erzeuge", id);
                    yield { id, open: id % 2 === 0 };
                  }
                }

                const selected = tickets().filter(t => t.open).take(2);
                console.log("Pipeline angelegt, noch nichts erzeugt");

                const result = selected.toArray();
                console.log(result.map(t => t.id)); // [2, 4]
              `
            }]
          }
        },
        {
          type: 'callout',
          text: 'Ein verbrauchter Iterator lässt sich nicht wie ein Array erneut durchlaufen. Async Iterator Helpers sind ein eigenes Thema und gehören nicht zu diesen synchronen Helpers.'
        }
      ],
      support: {
        text: 'ES2025, Baseline seit 31. März 2025. ' + runtimeNote,
        test: () => typeof globalThis.Iterator?.prototype?.take === 'function'
      },
      sources: [
        { label: 'TC39 Iterator Helpers', url: 'https://github.com/tc39/proposal-iterator-helpers' },
        { label: 'web.dev: Iterator Helpers sind Baseline', url: 'https://web.dev/blog/baseline-iterator-helpers' }
      ],
      notes: [
        'Sichtbarer Effekt: Links erscheinen 100 „Erzeuge“-Zeilen, rechts nur vier.',
        'Vor `toArray` erscheint rechts noch keine „Erzeuge“-Ausgabe.',
        'Variante: `take(2)` auf `take(5)` ändern.'
      ]
    },

    {
      id: 'js-regexp-escape',
      topic: '`RegExp.escape()`',
      kicker: 'JavaScript · Reserve',
      title: 'Text als literales RegExp-Muster verwenden',
      status: 'neu',
      role: 'reserve',
      since: 'ES2025',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: '`RegExp.escape` maskiert Text für ein reguläres Ausdrucksmuster. Punkte und Klammern im Suchtext werden als Text behandelt – eine eigene, oft unvollständige Ersetzungsliste entfällt.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                const query = "a.b";
                const before = new RegExp(query);

                console.log(before.test("aXb")); // true – der Punkt passt auf alles
                console.log(before.test("a.b")); // true
              `
            }]
          },
          after: {
            label: 'Mit RegExp.escape',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                const query = "a.b";
                const after = new RegExp(RegExp.escape(query));

                console.log(after.test("aXb")); // false
                console.log(after.test("a.b")); // true
              `
            }]
          }
        },
        {
          type: 'callout',
          text: 'Bei einer reinen Teilstringsuche ist `includes` oft einfacher. `RegExp.escape` schützt den Mustertext; es ist keine HTML-Escaping-Funktion.'
        }
      ],
      support: {
        text: 'ES2025. ' + runtimeNote,
        test: () => typeof RegExp.escape === 'function'
      },
      sources: [
        { label: 'TC39 RegExp Escaping', url: 'https://github.com/tc39/proposal-regex-escaping' }
      ],
      notes: [
        '`query` auf einen Text mit Klammern ändern, etwa `"Preis (netto)"`, und gegen `"Preis (netto)"` testen.'
      ]
    },

    {
      id: 'js-upsert',
      topic: '`Map.prototype.getOrInsertComputed()`',
      kicker: 'JavaScript · Optional · ES2026',
      title: 'Map-Werte bei Bedarf anlegen',
      status: ['neu', 'eingeschraenkt'],
      role: 'optional',
      since: 'ES2026',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: '`getOrInsertComputed` legt einen Map-Wert erst bei einem fehlenden Schlüssel an. Das passt zu Caches und Gruppenlisten.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                const cache = new Map();

                if (!cache.has("user:1")) {
                  cache.set("user:1", { name: "Ada" });
                }
                const before = cache.get("user:1");
                console.log(before.name); // Ada
              `
            }]
          },
          after: {
            label: 'Heute mit getOrInsertComputed',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                const cache = new Map();

                const after = cache.getOrInsertComputed(
                  "user:2", () => ({ name: "Lin" })
                );
                console.log(after.name); // Lin
              `
            }]
          }
        },
        {
          type: 'callout',
          tone: 'warn',
          text: 'Ein vorhandener `undefined`-Wert zählt als vorhandener Eintrag; die Methode prüft die Schlüsselpräsenz. In Node.js 24.19.0 fehlte die Methode noch – nur in einer geeigneten Umgebung zeigen.'
        }
      ],
      support: {
        text: 'ES2026. Fehlte in der geprüften Node.js-Version 24.19.0. Fehlt sie im Browser, zeigt die Demo einen `TypeError`.',
        test: () => typeof Map.prototype.getOrInsertComputed === 'function'
      },
      sources: [
        { label: 'TC39 Upsert', url: 'https://github.com/tc39/proposal-upsert' }
      ],
      notes: [
        'Nur zeigen, wenn der Live-Check grün ist. Sonst ist die Fehlermeldung selbst ein gutes Argument für den Supportcheck.'
      ]
    },

    {
      id: 'js-support',
      kicker: 'JavaScript · Support',
      title: 'Support vor der Vorführung prüfen',
      role: 'einordnung',
      blocks: [
        {
          type: 'lead',
          text: 'Die Prüfungen laufen live in diesem Browser. Bei fehlenden Methoden die ältere Lösung zeigen oder vorab einen passenden Polyfill auswählen.'
        },
        {
          type: 'checks',
          items: [
            { label: '`.at()`', code: 'typeof Array.prototype.at === "function"', test: () => typeof Array.prototype.at === 'function' },
            { label: '`Object.groupBy`', code: 'typeof Object.groupBy === "function"', test: () => typeof Object.groupBy === 'function' },
            { label: 'Set-Operationen', code: 'typeof Set.prototype.intersection === "function"', test: () => typeof Set.prototype.intersection === 'function' },
            { label: 'Iterator Helpers', code: 'typeof globalThis.Iterator?.prototype?.take === "function"', test: () => typeof globalThis.Iterator?.prototype?.take === 'function' },
            { label: '`RegExp.escape`', code: 'typeof RegExp.escape === "function"', test: () => typeof RegExp.escape === 'function' },
            { label: '`getOrInsertComputed`', code: 'typeof Map.prototype.getOrInsertComputed === "function"', test: () => typeof Map.prototype.getOrInsertComputed === 'function' }
          ]
        },
        {
          type: 'callout',
          title: 'Abgrenzung zu TypeScript',
          text: '`target` und `lib` steuern Übersetzung und Typdeklarationen. Sie installieren keine neuen Built-in-Methoden. `.at()`, `groupBy`, Set-Operationen, Iterator Helpers und `RegExp.escape` wurden mit Node.js 24.19.0 geprüft. Die Prüfung in euren Zielbrowsern und Node-Versionen steht noch aus.'
        }
      ],
      sources: [
        { label: 'Baseline 2024', url: 'https://web.dev/baseline/2024' },
        { label: 'Baseline 2025', url: 'https://web.dev/baseline/2025' },
        { label: 'Baseline 2026', url: 'https://web.dev/baseline/2026' }
      ],
      notes: [
        'Empfohlener Ablauf in 10 bis 12 Minuten: `.at()` als kurzer Einstieg, dann `groupBy`, danach dieselben Daten für einen Mengenvergleich, Iterator Helpers mit Konsolenausgaben als sichtbarem Effekt.',
        '`RegExp.escape` oder `getOrInsertComputed` als Reserve.',
        'Bei jedem Beispiel eine konkrete Einsatzstelle nennen: Gruppierung in einer Tabelle, Tagfilter, Cache.'
      ]
    }
  ]);
})();
