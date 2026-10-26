(() => {
  'use strict';
  const { add, d } = Deck;

  const typeOnly = 'Reine Typsyntax: Sie verschwindet beim Kompilieren, der Browser bekommt sie nie zu sehen. Editor und Build-Werkzeuge müssen sie aber verstehen.';

  add('ts', [
    {
      id: 'ts',
      layout: 'chapter',
      kicker: 'Kapitel 1',
      title: 'TypeScript',
      since: '5.3 bis 7.0 · Oktober 2023 bis Oktober 2026',
      blocks: [
        {
          type: 'lead',
          text: 'Die Auswahl beginnt mit TypeScript 5.3. Zwei ältere Features nehmen wir bewusst trotzdem in die Hauptdemos auf: `satisfies` (4.9) und `const`-Typparameter (5.0).'
        },
        {
          type: 'table',
          head: ['Version', 'Ausgewählte Neuerungen', 'Demo'],
          rows: [
            ['4.9 · 2022', '`satisfies` prüft gegen einen Typ, ohne den konkreten Typ zu verlieren', 'Ja · ältere Grundlage'],
            ['5.0 · 2023', '`const`-Typparameter: Literaltypen werden genauer abgeleitet', 'Ja · ältere Grundlage'],
            ['5.3 · 2023', 'Import Attributes; Narrowing in `switch (true)`; genauere Prüfung von `super`', 'Reserve'],
            ['5.4 · 2024', '`NoInfer`; Narrowing in Closures nach der letzten Zuweisung; Typen für `groupBy`', 'Ja'],
            ['5.5 · 2024', 'Abgeleitete Type Predicates; Narrowing bei konstanten Indexzugriffen; `isolatedDeclarations`', 'Ja'],
            ['5.6 · 2024', 'Warnung bei verdächtigen Bedingungen; Typen für Iterator Helpers; `noCheck`', 'Ja'],
            ['5.7 · 2024', 'Fehler bei nie initialisierten Variablen; `rewriteRelativeImportExtensions`', 'Reserve'],
            ['5.8 · 2025', 'Jeder Zweig eines `return` wird einzeln geprüft; `erasableSyntaxOnly`; Node ESM', 'Reserve'],
            ['5.9 · 2025', 'Neues `tsc --init`; `import defer`; `module node20`; erweiterbare Hovers', 'Reserve'],
            ['6.0 · 2026', 'Bessere Inferenz; `es2025`; neue Standardwerte, veraltete Optionen', 'Einordnung'],
            ['7.0 · 2026', 'Nativer Compiler; Parallelisierung; neuer Language Server', 'Optional']
          ]
        },
        {
          type: 'callout',
          text: 'Die Versionen beziehen sich auf den Compiler. Nur weil es einen Typ in `lib` gibt, existiert die JavaScript-API zur Laufzeit noch lange nicht.'
        }
      ],
      sources: [
        { label: 'TypeScript Release Notes', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/overview.html' },
        { label: 'Microsoft TypeScript Blog', url: 'https://devblogs.microsoft.com/typescript/' }
      ],
      notes: [
        'Das ist eine Auswahl, nicht alles, was sich geändert hat. Quellen geprüft am 5. Oktober 2026.',
        '7.0 ist zwar erschienen, das Handbook führt aber nur Release Notes bis 6.0. Für 7.0 stützen wir uns deshalb auf die Release-Ankündigung.',
        'Die TypeScript-Demos bestehen aus bearbeitbarem Code und Links in den Playground mit fest eingestellter Version.'
      ]
    },

    {
      id: 'ts-satisfies',
      topic: '`satisfies`',
      kicker: 'TypeScript · Demo 1 · Genauere Typen',
      title: 'Konfiguration prüfen mit `satisfies`',
      status: 'grundlage',
      since: 'TypeScript 4.9 · 2022',
      minutes: 3,
      blocks: [
        {
          type: 'lead',
          text: '`satisfies` prüft, ob ein Wert zu einem Typ passt, macht die Variable aber nicht zu diesem Typ. So behält jeder Eintrag einer Konfiguration seinen genauen Typ.'
        },
        {
          type: 'compare',
          before: {
            label: 'Mit Typannotation',
            blocks: [{
              type: 'demo', kind: 'ts',
              versions: [{ label: 'TS 4.9', ts: '4.9.5' }],
              ts: d`
                type Route = "home" | "account";
                type Destination = string | { path: string; requiresAuth: boolean };

                // Mit Annotation sind beide Einträge nur noch Destination
                const annotated: Record<Route, Destination> = {
                  home: "/",
                  account: { path: "/account", requiresAuth: true }
                };

                annotated.home.toUpperCase(); // Fehler: könnte ein Objekt sein
              `
            }]
          },
          after: {
            label: 'Mit satisfies',
            blocks: [{
              type: 'demo', kind: 'ts',
              versions: [{ label: 'TS 4.8 (vorher)', ts: '4.8.4' }, { label: 'TS 4.9', ts: '4.9.5' }],
              ts: d`
                type Route = "home" | "account";
                type Destination = string | { path: string; requiresAuth: boolean };

                // Mit satisfies bleiben die passenden Eintragstypen erhalten
                const routes = {
                  home: "/",
                  account: { path: "/account", requiresAuth: true }
                } satisfies Record<Route, Destination>;

                routes.home.toUpperCase();         // OK: string
                routes.account.path.toUpperCase(); // OK: string
              `
            }]
          }
        },
        {
          type: 'table',
          head: ['Schreibweise', 'Wirkung'],
          rows: [
            ['`const x: T = …`', 'Prüft die Zuweisung, die Variable hat danach den Typ `T`.'],
            ['`… as T`', 'Behauptet nur einen Typ und kann so Fehler verstecken.'],
            ['`… satisfies T`', 'Prüft gegen `T`, der genaue Typ bleibt erhalten.']
          ]
        }
      ],
      support: { text: typeOnly + ' Mindestens TypeScript 4.9.' },
      sources: [
        { label: 'TypeScript 4.9: The satisfies Operator', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator' }
      ],
      notes: [
        'Stammt aus 4.9 und ist damit älter als unser Zeitraum. Wir zeigen es trotzdem, weil es die Grundlage für typisierte Konfigurationen ist.',
        'Im Playground mit der Maus über `annotated.home` und `routes.home` fahren und die Typen vergleichen.',
        'Danach `account` in `acount` umbenennen oder `requiresAuth` einen String zuweisen: TypeScript meldet den Fehler direkt am Objekt.',
        '`satisfies` prüft nichts zur Laufzeit und macht das Objekt auch nicht unveränderlich. Wer unveränderliche Literaltypen will, kann zusätzlich `as const` schreiben.',
        'Der Zieltyp kann beeinflussen, welche Typen abgeleitet werden. Nicht jedes Literal bleibt dadurch automatisch als Literaltyp erhalten.'
      ]
    },

    {
      id: 'ts-const-type-parameter',
      topic: '`<const T>` · const-Typparameter',
      kicker: 'TypeScript · Demo 2 · Genauere Typen',
      title: 'Genaue Literaltypen mit `const`-Typparametern',
      status: 'grundlage',
      since: 'TypeScript 5.0 · 2023',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Vor einen generischen Typparameter lässt sich `const` schreiben. Übergibt man dann direkt Literale, leitet TypeScript die genauen Literaltypen ab, ohne dass der Aufrufer `as const` braucht.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher',
            blocks: [{
              type: 'demo', kind: 'ts',
              versions: [{ label: 'TS 5.0', ts: '5.0.4' }],
              ts: d`
                function defineRoutes<T extends readonly string[]>(routes: T): T {
                  return routes;
                }

                const before = defineRoutes(["home", "account"]);
                // string[]

                const explicit = defineRoutes(["home", "account"] as const);
                // readonly ["home", "account"]
              `
            }]
          },
          after: {
            label: 'Mit const-Typparameter',
            blocks: [{
              type: 'demo', kind: 'ts',
              versions: [{ label: 'TS 4.9 (vorher)', ts: '4.9.5' }, { label: 'TS 5.0', ts: '5.0.4' }],
              ts: d`
                function defineRoutesExactly<const T extends readonly string[]>(
                  routes: T
                ): T {
                  return routes;
                }

                const routes = defineRoutesExactly(["home", "account"]);
                // readonly ["home", "account"] ohne as const am Aufruf

                type RouteName = typeof routes[number]; // "home" | "account"
                const valid: RouteName = "home";
                // const invalid: RouteName = "admin"; // Fehler
              `
            }]
          }
        },
        {
          type: 'columns',
          cols: [
            [
              { type: 'callout', title: 'Constraint `readonly string[]`', text: 'Bei Arrays sollte die Constraint `readonly string[]` lauten. Mit `string[]` landet man unter Umständen wieder beim allgemeinen Typ.' }
            ],
            [
              { type: 'code', lang: 'ts', label: 'Variable mit schon allgemeinem Typ', code: d`
                const input = ["home", "account"]; // string[]
                const result = defineRoutesExactly(input); // weiterhin string[]
              ` }
            ]
          ]
        }
      ],
      support: { text: typeOnly + ' Mindestens TypeScript 5.0.' },
      sources: [
        { label: 'TypeScript 5.0: const Type Parameters', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters' }
      ],
      notes: [
        'Auch dieses Feature ist älter als unser Zeitraum (5.0). Praktisch für Hilfsfunktionen rund um Routen, Events oder Konfigurationen.',
        'Die Typen von `before` und `routes` vergleichen, dann die Zeile mit der ungültigen Route `admin` einkommentieren.',
        'Das `const` gehört zum Typparameter, nicht zum normalen Funktionsparameter.',
        'Zur Laufzeit friert `const` hier nichts ein. Kurz gesagt: `satisfies` prüft, ob etwas passt, `const`-Typparameter bestimmen, welcher Typ beim Aufruf abgeleitet wird.'
      ]
    },

    {
      id: 'ts-type-predicates',
      topic: 'Inferred Type Predicates',
      kicker: 'TypeScript · Demo 3 · Genauere Typen',
      title: '`filter` kennt den richtigen Ergebnistyp',
      status: 'neu',
      since: 'TypeScript 5.5 · 2024',
      minutes: 3,
      blocks: [
        {
          type: 'lead',
          text: 'Seit 5.5 erkennt TypeScript bei geeigneten Filterfunktionen selbst, dass sie ein Type Predicate sind. Das hilft vor allem bei optionalen Werten aus einer API. Vorher musste man das oft von Hand annotieren.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher: explizites Type Predicate',
            blocks: [{
              type: 'demo', kind: 'ts',
              versions: [{ label: 'TS 5.4', ts: '5.4.5' }],
              ts: d`
                const values: (number | undefined)[] = [12, undefined, 0];

                const before = values.filter(
                  (value): value is number => value !== undefined
                );
                before.map(value => value.toFixed(2));
              `
            }]
          },
          after: {
            label: 'Ab TypeScript 5.5',
            blocks: [{
              type: 'demo', kind: 'ts',
              versions: [{ label: 'TS 5.4 (vorher)', ts: '5.4.5' }, { label: 'TS 5.5', ts: '5.5.4' }],
              ts: d`
                const values: (number | undefined)[] = [12, undefined, 0];

                // Mit strictNullChecks
                const after = values.filter(value => value !== undefined);
                after.map(value => value.toFixed(2)); // string[]
              `
            }]
          }
        },
        {
          type: 'callout',
          tone: 'warn',
          title: '`filter(Boolean)` ist kein gleichwertiger Ersatz',
          text: '`Boolean` wirft auch die Zahl `0` raus, weil sie als falsy gilt. Im Beispiel bleibt die `0` drin.'
        }
      ],
      support: { text: typeOnly + ' Ab TypeScript 5.5 und nur mit `strictNullChecks` (im Playground standardmäßig an).' },
      sources: [
        { label: 'TypeScript 5.5: Inferred Type Predicates', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#inferred-type-predicates' }
      ],
      notes: [
        'Im Playground zwischen 5.4 und 5.5 wechseln und jeweils den Typ von `after` zeigen: erst `(number | undefined)[]`, dann `number[]`.',
        'In 5.4 gibt es bei `value.toFixed` einen Fehler, weil `value` noch `undefined` sein könnte.',
        'Die Null bleibt drin. Mit `filter(Boolean)` wäre sie weg.'
      ]
    },

    {
      id: 'ts-truthy-checks',
      topic: 'Bedingungen, die immer wahr sind',
      kicker: 'TypeScript · Demo 4 · Fehler früher finden',
      title: 'Der Compiler bemerkt ein vergessenes `.test()`',
      status: 'neu',
      since: 'TypeScript 5.6 · 2024',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: 'Seit 5.6 meldet TypeScript Bedingungen, die schon am Code erkennbar immer wahr sind oder nie `null` sein können. Ein typisches Beispiel: Ein regulärer Ausdruck steht allein im `if`, weil `.test()` fehlt.'
        },
        {
          type: 'compare',
          before: {
            label: 'Im Compiler',
            tone: 'neutral',
            blocks: [{
              type: 'demo', kind: 'ts',
              versions: [{ label: 'TS 5.5 (kein Fehler)', ts: '5.5.4' }, { label: 'TS 5.6 (Fehler)', ts: '5.6.3' }],
              ts: d`
                const ticket = "ABC-123";

                // Fehler ab 5.6: Das Objekt ist immer truthy
                if (/^ABC-/) {
                  console.log("Passendes Ticket");
                }

                // Gemeint war
                if (/^ABC-/.test(ticket)) {
                  console.log("Passendes Ticket");
                }
              `
            }]
          },
          after: {
            label: 'Zur Laufzeit',
            tone: 'neutral',
            blocks: [{
              type: 'demo', kind: 'js',
              js: d`
                const ticket = "XYZ-123";

                if (/^ABC-/) {
                  console.log("Variante ohne test: Passendes Ticket");
                }

                if (/^ABC-/.test(ticket)) {
                  console.log("Variante mit test: Passendes Ticket");
                } else {
                  console.log("Variante mit test: kein passendes Ticket");
                }
              `
            }]
          }
        }
      ],
      support: { text: 'Prüfung im Compiler ab TypeScript 5.6. Tests und Linter braucht es trotzdem.' },
      sources: [
        { label: 'TypeScript 5.6: Disallowed Nullish and Truthy Checks', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-6.html#disallowed-nullish-and-truthy-checks' }
      ],
      notes: [
        'Rechts läuft der Code als JavaScript: Obwohl das Ticket `XYZ-123` heißt, meldet die Variante ohne `.test` einen Treffer.',
        'Im Playground mit 5.5 und mit 5.6 öffnen: Erst 5.6 meldet „This kind of expression is always truthy“.',
        'Dann `.test(ticket)` ergänzen. Tests und Lint-Regeln macht das nicht überflüssig.'
      ]
    },

    {
      id: 'ts-noinfer',
      topic: '`NoInfer<T>`',
      kicker: 'TypeScript · Reserve',
      title: '`NoInfer` schließt einen Parameter von der Inferenz aus',
      status: 'neu',
      role: 'reserve',
      since: 'TypeScript 5.4 · 2024',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Mit `NoInfer` zählt ein Parameter nicht mit, wenn TypeScript den generischen Typ ableitet. So muss der Startwert eine der angebotenen Optionen sein.'
        },
        {
          type: 'compare',
          before: {
            label: 'Vorher: zweiter Typparameter',
            blocks: [{
              type: 'demo', kind: 'ts',
              versions: [{ label: 'TS 5.3', ts: '5.3.3' }],
              ts: d`
                function oldChoice<C extends string, V extends C>(
                  options: C[], initial: V
                ) { return initial; }

                oldChoice(["small", "large"], "small");  // OK
                oldChoice(["small", "large"], "medium"); // Fehler
              `
            }]
          },
          after: {
            label: 'Ab 5.4 mit NoInfer',
            blocks: [{
              type: 'demo', kind: 'ts',
              versions: [{ label: 'TS 5.3 (vorher)', ts: '5.3.3' }, { label: 'TS 5.4', ts: '5.4.5' }],
              ts: d`
                function choice<C extends string>(
                  options: C[], initial: NoInfer<C>
                ) { return initial; }

                choice(["small", "large"], "small");  // OK
                choice(["small", "large"], "medium"); // Fehler
              `
            }]
          }
        }
      ],
      support: { text: typeOnly + ' Mindestens TypeScript 5.4.' },
      sources: [
        { label: 'TypeScript 5.4: The NoInfer Utility Type', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html#the-noinfer-utility-type' }
      ],
      notes: [
        '`NoInfer` entfernen: Jetzt fließt `medium` in den abgeleiteten Typ ein, und der Fehler verschwindet. Danach wieder einsetzen.',
        '`NoInfer` wirkt nur auf Typen. Daten, die über das Netz kommen, müssen wir weiterhin zur Laufzeit prüfen.'
      ]
    },

    {
      id: 'ts-closure-narrowing',
      topic: 'Narrowing in Closures',
      kicker: 'TypeScript · Reserve',
      title: 'Narrowing bleibt im Callback erhalten',
      status: 'neu',
      role: 'reserve',
      since: 'TypeScript 5.4 · 2024',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Ab 5.4 erkennt TypeScript in vielen Fällen, dass eine Variable nach der letzten Zuweisung nicht mehr geändert wird. Dann gilt der eingegrenzte Typ auch im Callback. Früher half man sich mit einer zusätzlichen `const`-Variable.'
        },
        {
          type: 'demo', kind: 'ts',
          versions: [{ label: 'TS 5.3 (Fehler)', ts: '5.3.3' }, { label: 'TS 5.4 (OK)', ts: '5.4.5' }],
          ts: d`
            function labels(prefix: string | number, names: string[]) {
              if (typeof prefix === "number") {
                prefix = String(prefix);
              }
              // TS 5.3: prefix im Callback noch string | number
              // TS 5.4: prefix hier als string erkannt
              return names.map(name => prefix.toUpperCase() + name);
            }

            // Früherer Ausweg vor dem map:
            // const stablePrefix = prefix;
            // return names.map(name => stablePrefix.toUpperCase() + name);
          `
        }
      ],
      support: { text: typeOnly + ' Mindestens TypeScript 5.4.' },
      sources: [
        { label: 'TypeScript 5.4: Preserved Narrowing in Closures', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html#preserved-narrowing-in-closures-following-last-assignments' }
      ],
      notes: [
        '5.3 und 5.4 im Playground vergleichen.',
        'Wird die Variable noch in einer verschachtelten Funktion neu zugewiesen, klappt das Narrowing nicht mehr.'
      ]
    },

    {
      id: 'ts-6-7',
      topic: 'TypeScript 6.0 · 7.0',
      kicker: 'TypeScript · Aktueller Compiler',
      title: 'Was TypeScript 6 und 7 für uns bedeuten',
      status: 'neu',
      role: 'einordnung',
      since: '6.0 · 2026 · 7.0 seit 8. Juli 2026',
      minutes: 2,
      blocks: [
        {
          type: 'columns',
          cols: [
            [
              { type: 'h', text: 'TypeScript 6.0 · Übergangsversion' },
              {
                type: 'list',
                items: [
                  'Zwischenschritt auf dem Weg zum nativen Compiler.',
                  'Neue Standardwerte, unter anderem für `rootDir` und `types`.',
                  'Optionen wie `baseUrl` und `moduleResolution: node10` gelten als veraltet.',
                  'Beim Upgrade muss man deshalb wahrscheinlich die Konfiguration anpassen.'
                ]
              }
            ],
            [
              { type: 'h', text: 'TypeScript 7.0 · Nativer Compiler' },
              {
                type: 'list',
                items: [
                  'In Go geschrieben, arbeitet parallel, bringt einen neuen Language Server mit.',
                  'Die veröffentlichten Messwerte stammen aus bestimmten Projekten auf bestimmten Rechnern. Wie viel schneller es bei uns wird, sagen sie nicht.',
                  'Eine Compiler-API für eigene Werkzeuge gibt es noch nicht.',
                  'Ob unsere Werkzeuge und Frameworks damit laufen, müssen wir einzeln prüfen.'
                ]
              }
            ]
          ]
        }
      ],
      sources: [
        { label: 'TypeScript 6.0: Breaking Changes and Deprecations', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#breaking-changes-and-deprecations-in-typescript-60' },
        { label: 'Announcing TypeScript 7.0', url: 'https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/' }
      ],
      notes: [
        'Kurz halten. Für unsere Projekte heißt das: 6.0 bedeutet Arbeit an der Konfiguration, 7.0 bringt Tempo, aber noch keine Compiler-API.',
        'Werkzeuge, die auf der Compiler-API aufbauen (Linter, Codegeneratoren, Framework-Plugins), vor dem Upgrade prüfen.'
      ]
    },

    {
      id: 'ts-performance',
      topic: '`tsc --extendedDiagnostics`',
      kicker: 'TypeScript · Optional',
      title: 'Wie schnell ist 7.0 bei uns?',
      role: 'optional',
      minutes: 3,
      blocks: [
        {
          type: 'lead',
          text: 'Nur zeigen, wenn wir vorher gemessen haben. Ein einzelner Lauf mit unterschiedlich gefülltem Cache sagt wenig aus.'
        },
        {
          type: 'list',
          items: [
            'Zwei getrennte Checkouts, jeweils mit fest installierter Compiler-Version und derselben angepassten Konfiguration.',
            'Gleicher Commit, gleiche Hardware, gleicher Cache-Zustand.',
            'Mehrmals messen, dann Versionsnummern und Median zeigen.'
          ]
        },
        {
          type: 'code',
          lang: 'bash',
          label: 'In jedem vorbereiteten Checkout',
          code: d`
            npx tsc --version
            npx tsc --noEmit --extendedDiagnostics -p tsconfig.json
          `
        }
      ],
      sources: [
        { label: 'Announcing TypeScript 7.0', url: 'https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/' }
      ],
      notes: [
        'Diese Folie nur zeigen, wenn wir vorher gemessen haben.'
      ]
    },

    {
      id: 'ts-ablauf',
      kicker: 'TypeScript · Vorbereitung',
      title: 'Ablauf und Vorbereitung',
      role: 'einordnung',
      blocks: [
        {
          type: 'columns',
          cols: [
            [
              { type: 'h', text: 'Vorschlag für 10 bis 12 Minuten' },
              {
                type: 'list',
                ordered: true,
                items: [
                  '`satisfies` und die Konfiguration',
                  '`const`-Typparameter und genaue Routennamen',
                  'Der richtige Typ nach `filter`',
                  'Der Compiler findet eine verdächtige Bedingung',
                  'Kurz zu TypeScript 6.0 und 7.0'
                ]
              },
              { type: 'p', text: '`NoInfer` und die Closure-Demo halten wir in Reserve.' }
            ],
            [
              { type: 'h', text: 'Vorbereitung' },
              {
                type: 'list',
                items: [
                  'Die Typdemos im [TypeScript Playground](https://www.typescriptlang.org/play) zeigen. Dort ist `strict` und damit auch `strictNullChecks` eingeschaltet.',
                  'Die Buttons öffnen den aktuellen Code aus dem Editor mit einer fest eingestellten Compiler-Version.',
                  'Jedes Beispiel einzeln öffnen, damit die absichtlichen Fehler einer Demo nicht die anderen überdecken.',
                  'Für `satisfies`, `const`-Typparameter, `NoInfer` und Type Predicates ist egal, welcher Browser läuft.'
                ]
              }
            ]
          ]
        }
      ],
      sources: [
        { label: 'TypeScript 5.3', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-3.html' },
        { label: 'TypeScript 5.7', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html' },
        { label: 'TypeScript 5.8', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html' },
        { label: 'TypeScript 5.9', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html' }
      ],
      notes: [
        'Überleitung zu JavaScript: TypeScript beschreibt nur Typen. Welche Methoden es zur Laufzeit wirklich gibt, hängt von der Umgebung ab.'
      ]
    }
  ]);
})();
