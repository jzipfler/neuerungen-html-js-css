(() => {
  'use strict';
  const { add, d } = Deck;

  const runtimeNote = 'Dass ein Feature zu einer ECMAScript-Ausgabe gehört, heißt noch nicht, dass unsere Zielbrowser, WebViews oder Node-Versionen es kennen.';

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
          text: 'Jedes Jahr erscheint eine neue Ausgabe des ECMAScript-Standards. Browser und Node.js bauen neue Features aber nach eigenem Zeitplan ein.'
        },
        {
          type: 'table',
          head: ['Ausgabe', 'Relevante Neuerungen', 'Auswahl'],
          rows: [
            ['ES2022', '`.at()` für Arrays, Strings und TypedArrays', 'Ja · ältere Grundlage'],
            ['ES2023', '`toSorted`, `toReversed`, `toSpliced`, `with`; `findLast`, `findLastIndex`', 'Ältere Grundlage'],
            ['ES2024', '`Object.groupBy` und `Map.groupBy`; `Promise.withResolvers`; RegExp `v`-Flag; wohlgeformte Unicode-Strings; veränderbare Buffer', '`groupBy`'],
            ['ES2025', 'Set-Operationen; Iterator Helpers; `RegExp.escape`; `Promise.try`; Import Attributes, JSON-Module; `Float16Array`; RegExp-Modifikatoren', 'Sets und Iteratoren'],
            ['ES2026', '`Array.fromAsync`; `Iterator.concat`; `Math.sumPrecise`; `Error.isError`; `getOrInsert` für Maps; Base64 und Hex für `Uint8Array`; Zugriff auf den Originaltext in `JSON.parse`', 'Optional']
          ]
        },
        {
          type: 'callout',
          text: 'ES2023 erschien im Juni 2023, also kurz vor unserem Zeitraum. ES2026 ist im Juni 2026 als 17. Ausgabe erschienen. **Temporal** und **Explicit Resource Management** stehen in der TC39-Liste erst für 2027, gehören also nicht zu ES2026.'
        }
      ],
      sources: [
        { label: 'TC39 Finished Proposals', url: 'https://github.com/tc39/proposals/blob/main/finished-proposals.md' },
        { label: 'Ecma ECMA-262', url: 'https://ecma-international.org/publications-and-standards/standards/ecma-262/' },
        { label: 'ECMAScript 2025 Introduction', url: 'https://tc39.es/ecma262/2025/multipage/#sec-intro' }
      ],
      notes: [
        'Quellen geprüft am 5. Oktober 2026.',
        'Der aktuelle Arbeitsstand der Spezifikation enthält schon Features für kommende Ausgaben. Die Jahreszahlen hier stammen deshalb aus den veröffentlichten Ausgaben oder der Liste der Finished Proposals.',
        'Alle JavaScript-Demos laufen live in dem Browser, in dem die Präsentation gerade offen ist.'
      ]
    },

    {
      id: 'js-at',
      topic: '`Array.prototype.at()`',
      kicker: 'JavaScript · Demo 1 · Vom Ende her zählen',
      title: 'Das letzte Element mit `.at()` lesen',
      status: 'grundlage',
      since: 'ES2022',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Mit negativen Indizes zählt man einfach vom Ende her: `0` ist das erste Element, `-1` das letzte, `-2` das vorletzte.'
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
          text: '`.at()` ist nur zum Lesen da. Geschrieben wird weiterhin mit `events[events.length - 1] = value`. Bei Strings zählt `.at()` UTF-16-Codeeinheiten, und ein Emoji kann aus mehreren davon bestehen.'
        }
      ],
      support: {
        text: 'Seit ES2022 in allen gängigen Browsern verfügbar.',
        test: () => typeof Array.prototype.at === 'function'
      },
      sources: [
        { label: 'TC39 Relative Indexing Method', url: 'https://tc39.es/proposal-relative-indexing-method/' }
      ],
      notes: [
        'Kurzer Einstieg mit einem älteren Feature aus ES2022.',
        'Ein weiteres Ereignis anhängen und noch einmal `.at(-1)` aufrufen. Danach das Array leeren.',
        'Das Array bleibt dabei unverändert. Liegt der Index außerhalb, kommt `undefined` zurück.',
        '`events[-1]` liest dagegen eine Eigenschaft mit dem Namen `"-1"`.'
      ]
    },

    {
      id: 'js-groupby',
      topic: '`Object.groupBy()` · `Map.groupBy()`',
      kicker: 'JavaScript · Demo 2 · Daten gruppieren',
      title: 'Gruppieren ohne `reduce`',
      status: 'neu',
      since: 'ES2024',
      minutes: 3,
      blocks: [
        {
          type: 'lead',
          text: '`Object.groupBy` sortiert Elemente nach einem Schlüssel in Gruppen. Ob Aufgaben nach Status oder Mitarbeitende nach Team: Das selbst geschriebene `reduce` fällt weg.'
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
          text: 'Das Ergebnis hat keinen Prototyp. Wer Objekte als Schlüssel braucht, nimmt `Map.groupBy`. Die Elemente selbst werden nicht kopiert, die Gruppen verweisen auf die Originale.'
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
        'Einen Eintrag mit neuem Status hinzufügen, etwa `{ title: "Import", status: "blocked" }`. Die passende Gruppe entsteht von selbst.',
        'Ob es eine Gruppe gibt, prüft man mit `Object.hasOwn`, weil das Ergebnis keinen Prototyp hat.',
        'Ein Beispiel aus unseren Projekten nennen: eine gruppierte Tabelle oder Liste.'
      ]
    },

    {
      id: 'js-set-methods',
      topic: '`intersection()` · `difference()` · `union()`',
      kicker: 'JavaScript · Demo 3 · Mengen vergleichen',
      title: 'Schnittmengen mit Sets',
      status: 'neu',
      since: 'ES2025',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Mit den neuen Set-Methoden schreibt man Mengenoperationen so hin, wie man sie meint. Bei Rollen, Tags oder ausgewählten Filtern liest sich das sofort.'
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
          text: 'Die beiden Ausgangs-Sets bleiben unverändert. Außerdem gibt es `symmetricDifference`, `isSubsetOf`, `isSupersetOf` und `isDisjointFrom`. Objekte gelten nur als gleich, wenn es dasselbe Objekt ist.'
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
        'Am besten mit denselben Beispieldaten wie vorher weitermachen, etwa Tags oder Rollen.',
        'Ein weiteres Tag ergänzen, zum Beispiel `"HTML"` in `chosen`, und zeigen, wie sich das Ergebnis ändert.',
        'Wo das passt: Tagfilter, Berechtigungen.'
      ]
    },

    {
      id: 'js-iterator-helpers',
      topic: 'Iterator Helpers · `filter()` · `take()` · `toArray()`',
      kicker: 'JavaScript · Demo 4 · Iteratoren',
      title: 'Iteratoren berechnen nur, was gebraucht wird',
      status: 'neu',
      since: 'ES2025 · Baseline seit 31. März 2025',
      minutes: 3,
      blocks: [
        {
          type: 'lead',
          text: 'Mit Iterator Helpers gehen `map`, `filter` und `take` direkt auf Iteratoren. Gerechnet wird erst, wenn jemand die Werte abholt. Das lohnt sich bei Generatoren und großen Datenmengen.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher: erst alle Werte erzeugen',
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
            label: 'Heute: erst bei toArray rechnen',
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
          text: 'Anders als ein Array lässt sich ein Iterator nur einmal durchlaufen. Async Iterator Helpers sind ein separater Vorschlag und hier nicht enthalten.'
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
        'Der Unterschied ist gut zu sehen: Links stehen 100 „Erzeuge“-Zeilen in der Ausgabe, rechts nur vier.',
        'Rechts erscheint vor `toArray` noch keine einzige „Erzeuge“-Zeile.',
        'Zum Ausprobieren: `take(2)` in `take(5)` ändern.'
      ]
    },

    {
      id: 'js-regexp-escape',
      topic: '`RegExp.escape()`',
      kicker: 'JavaScript · Reserve',
      title: 'Suchtext sicher in einen regulären Ausdruck einbauen',
      status: 'neu',
      role: 'reserve',
      since: 'ES2025',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: '`RegExp.escape` maskiert alle Sonderzeichen in einem Text, damit er in einem regulären Ausdruck wörtlich gesucht wird. Punkte und Klammern bleiben dann einfach Punkte und Klammern. Die eigene, oft lückenhafte Ersetzungsliste kann weg.'
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
          text: 'Wer nur einen Teilstring sucht, ist mit `includes` oft besser bedient. Und: `RegExp.escape` ist nur für reguläre Ausdrücke gedacht, nicht zum Escapen von HTML.'
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
        '`query` auf einen Text mit Klammern setzen, etwa `"Preis (netto)"`, und genau diesen Text testen.'
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
          text: '`getOrInsertComputed` liefert den vorhandenen Wert oder legt ihn an, wenn der Schlüssel fehlt. Praktisch für Caches und gruppierte Listen.'
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
          text: 'Entscheidend ist, ob der Schlüssel existiert: Ein Eintrag mit dem Wert `undefined` gilt als vorhanden. In Node.js 24.19.0 gab es die Methode noch nicht, also nur zeigen, wo sie verfügbar ist.'
        }
      ],
      support: {
        text: 'ES2026. In der getesteten Node.js-Version 24.19.0 noch nicht vorhanden. Kennt der Browser die Methode nicht, zeigt die Demo einen `TypeError`.',
        test: () => typeof Map.prototype.getOrInsertComputed === 'function'
      },
      sources: [
        { label: 'TC39 Upsert', url: 'https://github.com/tc39/proposal-upsert' }
      ],
      notes: [
        'Nur zeigen, wenn der Live-Check grün ist. Andernfalls ist die Fehlermeldung selbst ein gutes Argument, vorher den Support zu prüfen.'
      ]
    },

    {
      id: 'js-support',
      kicker: 'JavaScript · Support',
      title: 'Vor der Vorführung prüfen, was der Browser kann',
      role: 'einordnung',
      blocks: [
        {
          type: 'lead',
          text: 'Die Prüfungen laufen live in diesem Browser. Fehlt eine Methode, zeigen wir die alte Lösung oder binden vorher einen passenden Polyfill ein.'
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
          text: '`target` und `lib` legen fest, wohin kompiliert wird und welche Typen bekannt sind. Neue eingebaute Methoden bringen sie nicht mit. `.at()`, `groupBy`, Set-Operationen, Iterator Helpers und `RegExp.escape` haben wir in Node.js 24.19.0 getestet. In unseren Zielbrowsern und Node-Versionen müssen wir das noch tun.'
        }
      ],
      sources: [
        { label: 'Baseline 2024', url: 'https://web.dev/baseline/2024' },
        { label: 'Baseline 2025', url: 'https://web.dev/baseline/2025' },
        { label: 'Baseline 2026', url: 'https://web.dev/baseline/2026' }
      ],
      notes: [
        'Vorschlag für 10 bis 12 Minuten: `.at()` als kurzer Einstieg, dann `groupBy`, mit denselben Daten weiter zu den Set-Methoden, zum Schluss Iterator Helpers, bei denen die Konsolenausgabe den Unterschied zeigt.',
        '`RegExp.escape` und `getOrInsertComputed` halten wir in Reserve.',
        'Zu jedem Beispiel eine konkrete Stelle bei uns nennen: gruppierte Tabelle, Tagfilter, Cache.'
      ]
    }
  ]);
})();
