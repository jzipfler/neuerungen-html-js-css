# TypeScript Neuerungen für eine kurze Vorführung

*Oktober 2023 bis 5 Oktober 2026*

Diese Arbeitsunterlage verbindet eine Auswahl relevanter Neuerungen mit kleinen Beispielen für die Vorführung im Team. Die Übersicht dient zum Nachlesen; die empfohlenen Demos bilden den Ablauf. Sie ist keine vollständige Liste aller Änderungen und Fehlerkorrekturen. Quellen geprüft am 5. Oktober 2026.

### Release Infos und Quellen

Quelle: [TypeScript Dokumentation mit Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html)

Quelle: [Microsoft TypeScript Blog mit Release Ankündigungen](https://devblogs.microsoft.com/typescript/)

Im Zeitraum beginnt die Auswahl mit 5.3. TypeScript 5.0 bis 5.2 liegen davor. Als ergänzende Grundlagen nehmen wir `satisfies` aus 4.9 und `const`-Typparameter aus 5.0 ausdrücklich in die Hauptdemos auf. Stand der geprüften Quellen ist 7.0 veröffentlicht; die Handbook-Navigation reicht derzeit nur bis 6.0. Für 7.0 verwenden wir deshalb die Release-Ankündigung.

### Überblick nach Version

| Version | Ausgewählte Neuerungen | Demo |
| --- | --- | --- |
| 4.9 · 2022 | `satisfies` prüft die Typkompatibilität und erhält einen konkreten Ergebnistyp | Ja · ältere Grundlage |
| 5.0 · 2023 | `const`-Typparameter verbessern die Inferenz von Literaltypen | Ja · ältere Grundlage |
| 5.3 · 2023 | Import Attributes; switch true Narrowing; präzisere Prüfungen von super | Reserve |
| 5.4 · 2024 | NoInfer; Narrowing nach letzter Zuweisung in Closures; groupBy Typen | Ja |
| 5.5 · 2024 | Abgeleitete Type Predicates; konstante Indexzugriffe; isolatedDeclarations | Ja |
| 5.6 · 2024 | Prüfung verdächtiger Bedingungen; Iterator Helpers Typen; noCheck | Ja |
| 5.7 · 2024 | Prüfung nie initialisierter Variablen; rewriteRelativeImportExtensions | Reserve |
| 5.8 · 2025 | Prüfung einzelner Return-Zweige; erasableSyntaxOnly; Node ESM | Reserve |
| 5.9 · 2025 | Neues tsc init; import defer; module node20; erweiterbare Hovers | Reserve |
| 6.0 · 2026 | Inferenzverbesserungen; es2025; neue Defaults und Deprecations | Einordnung |
| 7.0 · 2026 | Nativer Compiler; Parallelisierung; neuer Language Server | Optional |

Die Versionsangaben betreffen den Compiler. Ein neuer lib-Typ macht eine JavaScript-API noch nicht in der Laufzeit verfügbar. Details stehen in den jeweils gleichnamigen Release Notes.

## Typen mit weniger Hilfscode

### Demo 1 satisfies prüft eine Konfiguration

`satisfies` gibt es seit TypeScript 4.9 und damit vor unserem Zeitraum. Wir zeigen es als Grundlage für typisierte Konfigurationen. Es prüft die Kompatibilität mit einem Zieltyp, ohne die Variable auf diesen Zieltyp zu verbreitern.

```typescript
type Route = "home" | "account";
type Destination = string | { path: string; requiresAuth: boolean };

// Mit Annotation sind beide Einträge nur noch Destination
const annotated: Record<Route, Destination> = {
  home: "/",
  account: { path: "/account", requiresAuth: true }
};
// annotated.home.toUpperCase(); // Fehler: könnte ein Objekt sein

// Mit satisfies werden die passenden Eintragstypen erhalten
const routes = {
  home: "/",
  account: { path: "/account", requiresAuth: true }
} satisfies Record<Route, Destination>;

routes.home.toUpperCase(); // OK: string
routes.account.path.toUpperCase(); // OK: string
```

Vorführung in 3 Minuten: Den Typ von `annotated.home` und `routes.home` im Editor vergleichen. Danach `account` in `acount` umbenennen oder `requiresAuth` einen String zuweisen. Die Prüfung am Objektliteral meldet den Fehler.

| Schreibweise | Wirkung |
| --- | --- |
| `const x: T = …` | Prüft die Zuweisung und deklariert die Variable als `T`. |
| `… as T` | Ist eine Typbehauptung und kann Typfehler verdecken. |
| `… satisfies T` | Prüft die Kompatibilität und behält den konkreten Ergebnistyp. |

`satisfies` validiert keine Daten zur Laufzeit und macht ein Objekt nicht unveränderlich. Der Zieltyp kann die Inferenz kontextuell beeinflussen; alle Literale werden dadurch nicht automatisch konserviert. Für unveränderliche Literaltypen kann zusätzlich `as const` sinnvoll sein.

Quelle: [TypeScript 4.9 The satisfies Operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)

### Demo 2 const Typparameter erhalten Literaltypen

Seit TypeScript 5.0 kann ein generischer Typparameter den Modifikator `const` tragen. Bei direkt übergebenen Literalen bevorzugt die Inferenz dadurch konkrete Literaltypen. Das passt zu Hilfsfunktionen für Routen, Events oder Konfigurationen. Auch dieses Feature liegt vor unserem Zeitraum.

```typescript
function defineRoutes<T extends readonly string[]>(routes: T): T {
  return routes;
}

const before = defineRoutes(["home", "account"]);
// string[]
const explicit = defineRoutes(["home", "account"] as const);
// readonly ["home", "account"]

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
```

Vorführung in 2 Minuten: Die Typen von `before` und `routes` vergleichen, anschließend die ungültige Route aktivieren. Das `const` steht am Typparameter; es ist keine neue Schreibweise für einen normalen Funktionsparameter.

Bei Arrays sollte die Constraint hier `readonly string[]` lauten. Mit `string[]` kann die Inferenz auf den allgemeineren Typ zurückfallen. Bereits verbreiterte Variablen werden nicht nachträglich präziser:

```typescript
const input = ["home", "account"]; // string[]
const result = defineRoutesExactly(input); // weiterhin string[]
```

Der Modifikator friert keine Werte zur Laufzeit ein. `satisfies` prüft die Kompatibilität; `const`-Typparameter steuern die Inferenz beim generischen Aufruf.

Quelle: [TypeScript 5.0 const Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters)

### Demo 3 Filter leitet den Ergebnistyp ab

Seit 5.5 kann TypeScript aus passenden Filterfunktionen ein Type Predicate ableiten. Das ist besonders nützlich bei optionalen API-Werten. Vorher war dafür häufig eine explizite Annotation nötig.

```typescript
const values: (number | undefined)[] = [12, undefined, 0];

// Bisher explizit formuliert
const before = values.filter(
  (value): value is number => value !== undefined
);

// Ab TypeScript 5.5 mit strictNullChecks
const after = values.filter(value => value !== undefined);
after.map(value => value.toFixed(2)); // string[]
```

Vorführung in 3 Minuten: Im Playground zwischen 5.4 und 5.5 wechseln und den Typ von after zeigen. Die Null bleibt erhalten. filter(Boolean) ist kein gleichwertiger Ersatz; ein Truthiness-Test würde auch die Zahl 0 entfernen.

Quelle: [5.5 Inferred Type Predicates](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#inferred-type-predicates)

### Demo 4 NoInfer begrenzt die Inferenz

Seit 5.4 verhindert NoInfer, dass ein Parameter zusätzliche Kandidaten für einen generischen Typ liefert. Im Beispiel darf der Standardwert nur aus den angebotenen Optionen stammen.

```typescript
// Vorher ein zweiter Typparameter
function oldChoice<C extends string, V extends C>(
  options: C[], initial: V
) { return initial; }

// Ab 5.4
function choice<C extends string>(
  options: C[], initial: NoInfer<C>
) { return initial; }

choice(["small", "large"], "small"); // OK
choice(["small", "large"], "medium"); // Fehler
```

Vorführung in 2 Minuten: NoInfer entfernen und zeigen, dass medium dann zur Inferenz beiträgt. Danach wieder einsetzen. Das ist ein Typwerkzeug; Daten aus einem Netzwerk benötigen weiterhin Laufzeitvalidierung.

Quelle: [5.4 The NoInfer Utility Type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html#the-noinfer-utility-type)

## Narrowing und frühere Fehlermeldungen

### Demo 5 Narrowing bleibt im Callback erhalten

Ab 5.4 erkennt TypeScript bei bestimmten Closures die letzte Zuweisung. Der bereits eingegrenzte Typ bleibt dadurch verfügbar. Vorher ließ sich eine konstante lokale Variable als Ausweg verwenden.

```typescript
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
```

Reserve für 2 Minuten: 5.3 und 5.4 vergleichen. Weitere Zuweisungen in verschachtelten Funktionen können das Narrowing verhindern.

Quelle: [5.4 Preserved Narrowing in Closures](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html#preserved-narrowing-in-closures-following-last-assignments)

### Demo 6 Der Compiler entdeckt eine vergessene Methode

5.6 meldet bestimmte syntaktisch erkennbar immer wahre oder nie nullische Ausdrücke. Ein RegExp-Objekt als Bedingung ist ein leicht nachvollziehbarer Fehler.

```typescript
const ticket = "ABC-123";

// Fehler ab 5.6: Das Objekt ist immer truthy
if (/^ABC-/) {
  console.log("Passendes Ticket");
}

// Gemeint war
if (/^ABC-/.test(ticket)) {
  console.log("Passendes Ticket");
}
```

Vorführung in 1 Minute: ticket auf XYZ-123 ändern und das Laufzeitproblem erklären. Dann .test ergänzen. Der Compiler ersetzt damit weder Tests noch sämtliche Lint-Regeln.

Quelle: [5.6 Disallowed Nullish and Truthy Checks](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-6.html#disallowed-nullish-and-truthy-checks)

## Aktueller Compiler und Ablauf

### TypeScript 6 und 7 einordnen

6.0 ist die Übergangsversion zum nativen Compiler. Relevant für bestehende Projekte sind unter anderem geänderte Defaults für rootDir und types sowie veraltete Optionen wie baseUrl und moduleResolution node10. Ein Compiler-Upgrade kann deshalb Konfigurationsarbeit auslösen.

Quelle: [TypeScript 6.0 Breaking Changes and Deprecations](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#breaking-changes-and-deprecations-in-typescript-60)

Microsoft veröffentlichte 7.0 am 8. Juli 2026. Der Compiler ist in Go implementiert und parallelisiert Arbeit. Die veröffentlichten Beschleunigungen beziehen sich auf konkrete Projekte und Maschinen; eine feste Beschleunigung für unser Projekt lässt sich daraus nicht ableiten. 7.0 stellt noch keine programmgesteuerte Compiler-API bereit. Für integrierte Werkzeuge und Frameworks ist die Kompatibilität gesondert zu prüfen.

Quelle: [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)

### Optionaler Vergleich am eigenen Projekt

Für eine Performance-Demo getrennte Checkouts mit fest installierten Compiler-Versionen und derselben angepassten Konfiguration verwenden. Identischen Commit, identische Hardware und gleiche Cache-Bedingungen wählen. Mehrere Durchläufe messen; Versionsnummern und Median zeigen. Ein einzelner Lauf mit unterschiedlichem Cache wäre wenig aussagekräftig.

```bash
# In jedem vorbereiteten Checkout
npx tsc --version
npx tsc --noEmit --extendedDiagnostics -p tsconfig.json
```

### Empfohlene Vorführung in 10 bis 12 Minuten

Start mit `satisfies` und der Konfiguration. Daran schließen `const`-Typparameter mit den präzisen Routennamen an. Danach den Typwechsel beim Filter zeigen und mit der verdächtigen Bedingung einen Fehler aufdecken. Zum Schluss 6.0 und 7.0 kurz einordnen. NoInfer und die Closure-Demo bleiben Reserve; einen Performance-Vergleich nur mit vorbereiteten Messungen einbauen.

### Vorbereitung und Einsatz

Für die Typdemos https://www.typescriptlang.org/play verwenden und strictNullChecks einschalten. Die Vergleichsversionen vorab auswählen und Beispiele getrennt öffnen, damit absichtliche Fehler die anderen Demos nicht verdecken. Browserunterstützung spielt für `satisfies`, `const`-Typparameter, NoInfer und Type Predicates keine Rolle, da diese Typkonstrukte bei der Übersetzung entfernt werden. `satisfies` benötigt mindestens TypeScript 4.9, `const`-Typparameter mindestens 5.0; die Editor- und Build-Werkzeuge müssen die Syntax verstehen.

### Weitere Release Notes zum Nachlesen

Quelle: [TypeScript 5.3](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-3.html)

Quelle: [TypeScript 5.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html)

Quelle: [TypeScript 5.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html)

Quelle: [TypeScript 5.9](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
