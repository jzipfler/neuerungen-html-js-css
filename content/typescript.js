(() => {
  'use strict';
  const { add, d } = Deck;

  const typeOnly = 'Typkonstrukt: wird beim Übersetzen entfernt, Browserunterstützung spielt keine Rolle. Editor- und Build-Werkzeuge müssen die Syntax verstehen.';

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
          text: 'Die Auswahl beginnt mit TypeScript 5.3. Als ältere Grundlagen nehmen wir `satisfies` (4.9) und `const`-Typparameter (5.0) ausdrücklich in die Hauptdemos auf.'
        },
        {
          type: 'table',
          head: ['Version', 'Ausgewählte Neuerungen', 'Demo'],
          rows: [
            ['4.9 · 2022', '`satisfies` prüft die Typkompatibilität und erhält einen konkreten Ergebnistyp', 'Ja · ältere Grundlage'],
            ['5.0 · 2023', '`const`-Typparameter verbessern die Inferenz von Literaltypen', 'Ja · ältere Grundlage'],
            ['5.3 · 2023', 'Import Attributes; `switch (true)` Narrowing; präzisere Prüfungen von `super`', 'Reserve'],
            ['5.4 · 2024', '`NoInfer`; Narrowing nach letzter Zuweisung in Closures; `groupBy`-Typen', 'Ja'],
            ['5.5 · 2024', 'Abgeleitete Type Predicates; konstante Indexzugriffe; `isolatedDeclarations`', 'Ja'],
            ['5.6 · 2024', 'Prüfung verdächtiger Bedingungen; Iterator-Helpers-Typen; `noCheck`', 'Ja'],
            ['5.7 · 2024', 'Prüfung nie initialisierter Variablen; `rewriteRelativeImportExtensions`', 'Reserve'],
            ['5.8 · 2025', 'Prüfung einzelner Return-Zweige; `erasableSyntaxOnly`; Node ESM', 'Reserve'],
            ['5.9 · 2025', 'Neues `tsc --init`; `import defer`; `module node20`; erweiterbare Hovers', 'Reserve'],
            ['6.0 · 2026', 'Inferenzverbesserungen; `es2025`; neue Defaults und Deprecations', 'Einordnung'],
            ['7.0 · 2026', 'Nativer Compiler; Parallelisierung; neuer Language Server', 'Optional']
          ]
        },
        {
          type: 'callout',
          text: 'Die Versionsangaben betreffen den Compiler. Ein neuer `lib`-Typ macht eine JavaScript-API noch nicht in der Laufzeit verfügbar.'
        }
      ],
      sources: [
        { label: 'TypeScript Release Notes', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/overview.html' },
        { label: 'Microsoft TypeScript Blog', url: 'https://devblogs.microsoft.com/typescript/' }
      ],
      notes: [
        'Auswahl, keine vollständige Liste aller Änderungen. Quellen geprüft am 5. Oktober 2026.',
        'Stand der Quellen: 7.0 ist veröffentlicht, die Handbook-Navigation reicht bis 6.0. Für 7.0 verwenden wir die Release-Ankündigung.',
        'TypeScript-Demos laufen über bearbeitbaren Code und Playground-Links mit fest gewählter Version.'
      ]
    },

    {
      id: 'ts-satisfies',
      kicker: 'TypeScript · Demo 1 · Typen mit weniger Hilfscode',
      title: '`satisfies` prüft eine Konfiguration',
      status: 'grundlage',
      since: 'TypeScript 4.9 · 2022',
      minutes: 3,
      blocks: [
        {
          type: 'lead',
          text: '`satisfies` prüft die Kompatibilität mit einem Zieltyp, ohne die Variable auf diesen Zieltyp zu verbreitern. Typisierte Konfigurationen behalten dadurch ihre konkreten Eintragstypen.'
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
            ['`const x: T = …`', 'Prüft die Zuweisung und deklariert die Variable als `T`.'],
            ['`… as T`', 'Ist eine Typbehauptung und kann Typfehler verdecken.'],
            ['`… satisfies T`', 'Prüft die Kompatibilität und behält den konkreten Ergebnistyp.']
          ]
        }
      ],
      support: { text: typeOnly + ' Mindestens TypeScript 4.9.' },
      sources: [
        { label: 'TypeScript 4.9: The satisfies Operator', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator' }
      ],
      notes: [
        'Ältere Grundlage aus 4.9, vor unserem Zeitraum. Wir zeigen sie als Basis für typisierte Konfigurationen.',
        'Im Playground den Typ von `annotated.home` und `routes.home` per Hover vergleichen.',
        'Danach `account` in `acount` umbenennen oder `requiresAuth` einen String zuweisen: Die Prüfung am Objektliteral meldet den Fehler.',
        '`satisfies` validiert keine Daten zur Laufzeit und macht ein Objekt nicht unveränderlich. Für unveränderliche Literaltypen kann zusätzlich `as const` sinnvoll sein.',
        'Der Zieltyp kann die Inferenz kontextuell beeinflussen; alle Literale werden dadurch nicht automatisch konserviert.'
      ]
    },

    {
      id: 'ts-const-type-parameter',
      kicker: 'TypeScript · Demo 2 · Typen mit weniger Hilfscode',
      title: '`const`-Typparameter erhalten Literaltypen',
      status: 'grundlage',
      since: 'TypeScript 5.0 · 2023',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Ein generischer Typparameter kann den Modifikator `const` tragen. Bei direkt übergebenen Literalen bevorzugt die Inferenz dann konkrete Literaltypen – ohne `as const` am Aufruf.'
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
              { type: 'callout', title: 'Constraint `readonly string[]`', text: 'Bei Arrays sollte die Constraint `readonly string[]` lauten. Mit `string[]` kann die Inferenz auf den allgemeineren Typ zurückfallen.' }
            ],
            [
              { type: 'code', lang: 'ts', label: 'Bereits verbreiterte Variablen', code: d`
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
        'Auch dieses Feature liegt vor unserem Zeitraum (5.0). Passt zu Hilfsfunktionen für Routen, Events oder Konfigurationen.',
        'Typen von `before` und `routes` vergleichen, anschließend die ungültige Route `admin` aktivieren.',
        'Das `const` steht am Typparameter – es ist keine neue Schreibweise für einen normalen Funktionsparameter.',
        'Der Modifikator friert keine Werte zur Laufzeit ein. `satisfies` prüft Kompatibilität; `const`-Typparameter steuern die Inferenz beim generischen Aufruf.'
      ]
    },

    {
      id: 'ts-type-predicates',
      kicker: 'TypeScript · Demo 3 · Typen mit weniger Hilfscode',
      title: '`filter` leitet den Ergebnistyp ab',
      status: 'neu',
      since: 'TypeScript 5.5 · 2024',
      minutes: 3,
      blocks: [
        {
          type: 'lead',
          text: 'Seit 5.5 leitet TypeScript aus passenden Filterfunktionen ein Type Predicate ab. Besonders nützlich bei optionalen API-Werten; vorher war dafür häufig eine explizite Annotation nötig.'
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
          text: 'Ein Truthiness-Test würde auch die Zahl `0` entfernen. Im Beispiel bleibt die `0` erhalten.'
        }
      ],
      support: { text: typeOnly + ' Mindestens TypeScript 5.5 mit `strictNullChecks` (im Playground standardmäßig aktiv).' },
      sources: [
        { label: 'TypeScript 5.5: Inferred Type Predicates', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#inferred-type-predicates' }
      ],
      notes: [
        'Im Playground zwischen 5.4 und 5.5 wechseln und den Typ von `after` zeigen: `(number | undefined)[]` gegenüber `number[]`.',
        'In 5.4 meldet `value.toFixed` einen Fehler, weil `value` möglicherweise `undefined` ist.',
        'Die Null bleibt erhalten – darum ist `filter(Boolean)` kein Ersatz.'
      ]
    },

    {
      id: 'ts-truthy-checks',
      kicker: 'TypeScript · Demo 4 · Frühere Fehlermeldungen',
      title: 'Der Compiler entdeckt eine vergessene Methode',
      status: 'neu',
      since: 'TypeScript 5.6 · 2024',
      minutes: 1,
      blocks: [
        {
          type: 'lead',
          text: '5.6 meldet bestimmte syntaktisch erkennbar immer wahre oder nie nullische Ausdrücke. Ein RegExp-Objekt als Bedingung ist ein leicht nachvollziehbarer Fehler.'
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
      support: { text: 'Compilerprüfung ab TypeScript 5.6. Ersetzt weder Tests noch sämtliche Lint-Regeln.' },
      sources: [
        { label: 'TypeScript 5.6: Disallowed Nullish and Truthy Checks', url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-6.html#disallowed-nullish-and-truthy-checks' }
      ],
      notes: [
        'Rechts läuft der Code als JavaScript: Mit `XYZ-123` meldet die Variante ohne `.test` trotzdem einen Treffer.',
        'Im Playground mit 5.5 und 5.6 öffnen: Erst 5.6 meldet „This kind of expression is always truthy“.',
        'Dann `.test(ticket)` ergänzen. Der Compiler ersetzt weder Tests noch Lint-Regeln.'
      ]
    },

    {
      id: 'ts-noinfer',
      kicker: 'TypeScript · Reserve',
      title: '`NoInfer` begrenzt die Inferenz',
      status: 'neu',
      role: 'reserve',
      since: 'TypeScript 5.4 · 2024',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: '`NoInfer` verhindert, dass ein Parameter zusätzliche Kandidaten für einen generischen Typ liefert. Der Standardwert darf nur aus den angebotenen Optionen stammen.'
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
        '`NoInfer` entfernen und zeigen, dass `medium` dann zur Inferenz beiträgt und kein Fehler mehr kommt. Danach wieder einsetzen.',
        'Das ist ein Typwerkzeug. Daten aus einem Netzwerk benötigen weiterhin Laufzeitvalidierung.'
      ]
    },

    {
      id: 'ts-closure-narrowing',
      kicker: 'TypeScript · Reserve',
      title: 'Narrowing bleibt im Callback erhalten',
      status: 'neu',
      role: 'reserve',
      since: 'TypeScript 5.4 · 2024',
      minutes: 2,
      blocks: [
        {
          type: 'lead',
          text: 'Ab 5.4 erkennt TypeScript bei bestimmten Closures die letzte Zuweisung. Der bereits eingegrenzte Typ bleibt verfügbar. Vorher ließ sich eine konstante lokale Variable als Ausweg verwenden.'
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
        'Weitere Zuweisungen in verschachtelten Funktionen können das Narrowing verhindern.'
      ]
    },

    {
      id: 'ts-6-7',
      kicker: 'TypeScript · Aktueller Compiler',
      title: 'TypeScript 6 und 7 einordnen',
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
                  'Übergang zum nativen Compiler.',
                  'Geänderte Defaults, unter anderem für `rootDir` und `types`.',
                  'Veraltete Optionen wie `baseUrl` und `moduleResolution: node10`.',
                  'Ein Compiler-Upgrade kann deshalb Konfigurationsarbeit auslösen.'
                ]
              }
            ],
            [
              { type: 'h', text: 'TypeScript 7.0 · Nativer Compiler' },
              {
                type: 'list',
                items: [
                  'In Go implementiert, parallelisiert die Arbeit, neuer Language Server.',
                  'Veröffentlichte Beschleunigungen gelten für konkrete Projekte und Maschinen – keine feste Zahl für unser Projekt.',
                  'Noch keine programmgesteuerte Compiler-API.',
                  'Kompatibilität integrierter Werkzeuge und Frameworks gesondert prüfen.'
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
        'Kurz halten: Was bedeutet das für unsere Projekte? 6.0 bringt Konfigurationsarbeit, 7.0 Geschwindigkeit, aber noch keine Compiler-API.',
        'Für Werkzeuge, die die Compiler-API nutzen (Linter, Codegeneratoren, Framework-Plugins), Kompatibilität vor dem Upgrade prüfen.'
      ]
    },

    {
      id: 'ts-performance',
      kicker: 'TypeScript · Optional',
      title: 'Performance-Vergleich am eigenen Projekt',
      role: 'optional',
      minutes: 3,
      blocks: [
        {
          type: 'lead',
          text: 'Nur mit vorbereiteten Messungen zeigen. Ein einzelner Lauf mit unterschiedlichem Cache wäre wenig aussagekräftig.'
        },
        {
          type: 'list',
          items: [
            'Getrennte Checkouts mit fest installierten Compiler-Versionen und derselben angepassten Konfiguration.',
            'Identischer Commit, identische Hardware, gleiche Cache-Bedingungen.',
            'Mehrere Durchläufe messen; Versionsnummern und Median zeigen.'
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
        'Diese Folie nur einsetzen, wenn Messwerte vorab erhoben wurden.'
      ]
    },

    {
      id: 'ts-ablauf',
      kicker: 'TypeScript · Vorbereitung',
      title: 'Vorbereitung und Einsatz',
      role: 'einordnung',
      blocks: [
        {
          type: 'columns',
          cols: [
            [
              { type: 'h', text: 'Empfohlene Vorführung in 10 bis 12 Minuten' },
              {
                type: 'list',
                ordered: true,
                items: [
                  '`satisfies` und die Konfiguration',
                  '`const`-Typparameter mit präzisen Routennamen',
                  'Typwechsel beim Filter',
                  'Verdächtige Bedingung als aufgedeckter Fehler',
                  'TypeScript 6.0 und 7.0 kurz einordnen'
                ]
              },
              { type: 'p', text: '`NoInfer` und die Closure-Demo bleiben Reserve.' }
            ],
            [
              { type: 'h', text: 'Vorbereitung' },
              {
                type: 'list',
                items: [
                  'Für die Typdemos den [TypeScript Playground](https://www.typescriptlang.org/play) verwenden; `strictNullChecks` ist dort über `strict` aktiv.',
                  'Die Buttons öffnen den aktuellen Editorinhalt mit fest gewählter Compiler-Version.',
                  'Beispiele getrennt öffnen, damit absichtliche Fehler die anderen Demos nicht verdecken.',
                  'Browserunterstützung spielt für `satisfies`, `const`-Typparameter, `NoInfer` und Type Predicates keine Rolle.'
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
        'Übergang zu JavaScript: TypeScript beschreibt Typen – welche Methoden zur Laufzeit existieren, entscheidet die Umgebung.'
      ]
    }
  ]);
})();
