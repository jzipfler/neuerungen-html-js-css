# JavaScript Neuerungen für eine kurze Vorführung

*Oktober 2023 bis 5 Oktober 2026*

Diese Arbeitsunterlage verbindet eine Auswahl relevanter Neuerungen mit kleinen Beispielen für die Vorführung im Team. Die Übersicht dient zum Nachlesen; die empfohlenen Demos bilden den Ablauf. Sie ist keine vollständige Liste aller Änderungen und Fehlerkorrekturen. Quellen geprüft am 5. Oktober 2026.

### Release Infos und Quellen

Quelle: [TC39 Finished Proposals mit Veröffentlichungsjahr](https://github.com/tc39/proposals/blob/main/finished-proposals.md)

Quelle: [Ecma ECMA 262 mit Jahresausgaben und Archiv](https://ecma-international.org/publications-and-standards/standards/ecma-262/)

Die jährliche ECMAScript-Ausgabe beschreibt den Sprachstandard. Browser und Node.js liefern Features unabhängig davon aus. Die laufende TC39-Spezifikation enthält bereits Ergänzungen für spätere Ausgaben; bei Jahresangaben verwenden wir die Jahresausgabe oder die Finished-Proposals-Liste.

### Überblick nach Ausgabe

| Ausgabe | Relevante Neuerungen | Auswahl |
| --- | --- | --- |
| ES2022 | `.at()` für Arrays, Strings und TypedArrays | Ja · ältere Grundlage |
| ES2023 | toSorted, toReversed, toSpliced, with; findLast und findLastIndex | Ältere Grundlage |
| ES2024 | Object.groupBy und Map.groupBy; Promise.withResolvers; RegExp v; wohlgeformte Unicode-Strings; veränderbare Buffer | groupBy |
| ES2025 | Set-Operationen; Iterator Helpers; RegExp.escape; Promise.try; Import Attributes und JSON-Module; Float16Array; RegExp-Modifikatoren | Sets und Iteratoren |
| ES2026 | Array.fromAsync; Iterator.concat; Math.sumPrecise; Error.isError; Map getOrInsert; Uint8Array Base64 und Hex; JSON.parse Quelltextzugriff | Optional |

ES2023 wurde im Juni 2023 veröffentlicht und liegt vor unserem Startdatum. Die Array-Kopiermethoden sind daher nur ein optionaler Einstieg. ES2026 ist als 17. Ausgabe vom Juni 2026 veröffentlicht. Temporal und Explicit Resource Management führt die aktuell geprüfte TC39-Liste mit geplantem Jahr 2027; sie werden hier nicht als ES2026-Features eingeordnet.

Quelle: [ECMAScript 2025 Introduction mit Änderungen 2024 und 2025](https://tc39.es/ecma262/2025/multipage/#sec-intro)

## Einzelne Elemente mit relativen Indizes lesen

### Demo 1 Das letzte Element mit at lesen

`.at()` gehört zu ES2022 und liegt vor unserem Zeitraum. Wir nehmen es als Grundlage auf, weil negative Indizes den Zugriff vom Ende aus vereinfachen. `0` bezeichnet das erste Element, `-1` das letzte und `-2` das vorletzte.

```javascript
const events = ["Login", "Suche", "Export"];

// Vorher
const before = events[events.length - 1]; // "Export"

// Mit at
console.log(events.at(0));   // "Login"
console.log(events.at(-1));  // "Export"
console.log(events.at(-2));  // "Suche"
console.log(events.at(99));  // undefined
console.log([].at(-1));      // undefined

// Eckige Klammern interpretieren -1 nicht als Position vom Ende
console.log(events[-1]);    // undefined

// Funktioniert auch mit Strings und TypedArrays
console.log("report.csv".at(-1)); // "v"
console.log(new Uint8Array([10, 20, 30]).at(-1)); // 30
```

Vorführung in 1 bis 2 Minuten: Ein weiteres Ereignis anhängen und erneut `.at(-1)` aufrufen. Danach das Array leeren. Die Methode verändert die Sammlung nicht; bei einem Index außerhalb des Bereichs liefert sie `undefined`. Bei `events[-1]` wird dagegen eine Eigenschaft mit dem Namen `"-1"` gelesen.

`.at()` dient zum Lesen. Zum Schreiben weiterhin `events[events.length - 1] = value` verwenden. Bei Strings arbeitet `.at()` mit UTF-16-Codeeinheiten; ein Emoji kann aus mehreren Einheiten bestehen.

Quelle: [TC39 Relative Indexing Method](https://tc39.es/proposal-relative-indexing-method/)

## Daten gruppieren und Mengen vergleichen

### Demo 2 Gruppieren ohne eigene Sammellogik

Object.groupBy aus ES2024 bündelt Elemente anhand eines Schlüssels. Für Aufgaben nach Status oder Mitarbeiter nach Team entfällt eine selbst geschriebene reduce-Sammellogik.

```javascript
const tasks = [
  { title: "Login", status: "open" },
  { title: "Suche", status: "done" },
  { title: "Export", status: "open" }
];
// Vorher
const before = tasks.reduce((groups, task) => {
  (groups[task.status] ??= []).push(task);
  return groups;
}, Object.create(null));
// Heute
const after = Object.groupBy(tasks, task => task.status);
console.log(after.open.map(task => task.title));
// ["Login", "Export"]
```

Vorführung in 3 Minuten: Einen neuen Status hinzufügen; die Gruppe entsteht automatisch. Das Ergebnis hat keinen Objekt-Prototyp. Zum Prüfen einer Gruppe Object.hasOwn verwenden. Für Objekte als Gruppenschlüssel eignet sich Map.groupBy. Die enthaltenen Objekte werden nicht tief kopiert.

Quelle: [TC39 Array Grouping](https://github.com/tc39/proposal-array-grouping)

### Demo 3 Überschneidungen mit Sets

Die neuen Set-Methoden aus ES2025 drücken Mengenoperationen direkt aus. Bei Rollen, Tags oder Filterauswahlen ist das Ergebnis sofort verständlich.

```javascript
const chosen = new Set(["TS", "JS", "CSS"]);
const known = new Set(["JS", "HTML"]);
// Vorher
const before = new Set([...chosen].filter(x => known.has(x)));
// Heute
console.log([...chosen.intersection(known)]); // ["JS"]
console.log([...chosen.difference(known)]); // ["TS", "CSS"]
console.log([...chosen.union(known)]); // ["TS", "JS", "CSS", "HTML"]
```

Vorführung in 2 Minuten: Mit einem weiteren Tag das Ergebnis ändern. Die ursprünglichen Sets bleiben unverändert. Ergänzend existieren symmetricDifference, isSubsetOf, isSupersetOf und isDisjointFrom. Objektwerte werden über ihre Identität verglichen.

Quelle: [TC39 Set Methods](https://github.com/tc39/proposal-set-methods)

## Iteratoren und sichere Suchmuster

### Demo 4 Iteratoren verarbeiten nur benötigte Werte

Iterator Helpers aus ES2025 erlauben map, filter und take auf Iteratoren. Die Berechnung wird erst beim Verbrauch ausgelöst. Das ist bei Generatoren und großen Datenfolgen interessant.

```javascript
function* tickets() {
  for (let id = 1; id <= 100; id++) {
    console.log("Erzeuge", id);
    yield { id, open: id % 2 === 0 };
  }
}
// Vorher: alle 100 Werte materialisieren
// [...tickets()].filter(t => t.open).slice(0, 2)

// Heute: erst bei toArray berechnen
const selected = tickets().filter(t => t.open).take(2);
const result = selected.toArray();
console.log(result.map(t => t.id)); // [2, 4]
```

Vorführung in 3 Minuten: Vor toArray erscheint noch keine Erzeuge-Ausgabe; danach nur für die IDs 1 bis 4. Ein verbrauchter Iterator lässt sich nicht wie ein Array erneut durchlaufen. Async Iterator Helpers sind ein eigenes Thema und gehören nicht zu diesen synchronen Helpers.

Quelle: [TC39 Iterator Helpers](https://github.com/tc39/proposal-iterator-helpers)

Quelle: [web.dev Baseline für Iterator Helpers seit 31 März 2025](https://web.dev/blog/baseline-iterator-helpers)

### Demo 5 Text als literales RegExp Muster verwenden

RegExp.escape aus ES2025 maskiert Text für ein reguläres Ausdrucksmuster. Punkte und Klammern in einem Suchtext werden dadurch als Text behandelt. Eine eigene unvollständige Liste zu ersetzender Zeichen entfällt.

```javascript
const query = "a.b";
const before = new RegExp(query);
console.log(before.test("aXb")); // true

const after = new RegExp(RegExp.escape(query));
console.log(after.test("aXb")); // false
console.log(after.test("a.b")); // true
```

Reserve für 1 Minute: query auf einen Text mit Klammern ändern. Bei einer reinen Teilstringsuche ist includes oft einfacher. RegExp.escape schützt den Mustertext; es ist keine HTML-Escaping-Funktion.

Quelle: [TC39 RegExp Escaping](https://github.com/tc39/proposal-regex-escaping)

## Neue Ausgabe und Einsatz in der Laufzeit

### Optionales Beispiel aus ES2026

getOrInsertComputed legt einen Map-Wert erst bei einem fehlenden Schlüssel an. Das passt zu Caches und Gruppenlisten. Ein vorhandener undefined-Wert zählt als vorhandener Eintrag; die Methode prüft die Schlüsselpräsenz.

```javascript
const cache = new Map();
// Vorher
if (!cache.has("user:1")) {
  cache.set("user:1", { name: "Ada" });
}
const before = cache.get("user:1");
// Heute mit getOrInsertComputed
const after = cache.getOrInsertComputed(
  "user:2", () => ({ name: "Lin" })
);
console.log(after.name); // Lin
```

Quelle: [TC39 Upsert](https://github.com/tc39/proposal-upsert)

### Support vor der Vorführung prüfen

Die folgenden Tests prüfen die tatsächliche Demo-Laufzeit. Bei fehlenden Methoden die ältere Lösung zeigen oder vorab einen passenden Polyfill auswählen. Eine ECMAScript-Jahresangabe allein garantiert keinen Support im Zielbrowser, in einer WebView oder in der eingesetzten Node-Version.

```javascript
console.table({
  arrayAt: typeof Array.prototype.at === "function",
  groupBy: typeof Object.groupBy === "function",
  setIntersection: typeof Set.prototype.intersection === "function",
  iteratorHelpers: typeof globalThis.Iterator?.prototype?.take
    === "function",
  regexpEscape: typeof RegExp.escape === "function",
  mapUpsert: typeof Map.prototype.getOrInsertComputed === "function"
});
```

Quelle: [Baseline Jahresübersicht 2024](https://web.dev/baseline/2024)

Quelle: [Baseline Jahresübersicht 2025](https://web.dev/baseline/2025)

Quelle: [Baseline Jahresübersicht 2026](https://web.dev/baseline/2026)

### Empfohlene Vorführung in 10 bis 12 Minuten

Mit `.at()` als kurzem Einstieg beginnen, dann groupBy zeigen, danach dieselben fachlichen Daten für einen Mengenvergleich nutzen. Iterator Helpers mit den Konsolenausgaben als sichtbarem Effekt zeigen. RegExp.escape oder getOrInsertComputed als Reserve wählen. Bei jedem Beispiel nach dem Ergebnis eine konkrete Einsatzstelle im Team nennen, etwa Gruppierung in einer Tabelle, Tagfilter oder Cache.

### Abgrenzung zu TypeScript

target und lib steuern Übersetzung und Typdeklarationen. Sie installieren keine neuen Built-in-Methoden. `.at()`, groupBy, Set-Operationen, Iterator Helpers und RegExp.escape wurden mit Node.js 24.19.0 geprüft; die gezeigten Ergebnisse stimmen. getOrInsertComputed fehlt in dieser Laufzeit und ist deshalb nur eine Reserve für eine geeignete Umgebung. Die Prüfung in euren Zielbrowsern und Node-Versionen steht noch aus.
