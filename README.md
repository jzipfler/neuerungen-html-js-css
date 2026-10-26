# Neuerungen in TypeScript, JavaScript, CSS und HTML

Interaktive Präsentation für eine Team-Session. Schwerpunkt: Oktober 2023 bis Oktober 2026, ergänzt um ausgewählte ältere Grundlagen.

Die vier Markdown-Dokumente im Ordner [`unterlagen/`](unterlagen/) bilden die Inhaltsbasis:

- [TypeScript_Neuerungen.md](unterlagen/TypeScript_Neuerungen.md)
- [JavaScript_Neuerungen.md](unterlagen/JavaScript_Neuerungen.md)
- [CSS_Neuerungen.md](unterlagen/CSS_Neuerungen.md)
- [HTML_Neuerungen.md](unterlagen/HTML_Neuerungen.md)

## Starten

Die Präsentation braucht weder Build-Schritt noch Abhängigkeiten.

**Mit lokalem Server** (empfohlen, verhält sich wie später auf GitHub Pages):

```bash
python3 -m http.server 8123
```

Danach <http://localhost:8123> öffnen.

**Direkt öffnen:** `index.html` per Doppelklick. Die Seite ist dafür ausgelegt (klassische Skripte, keine Module, Kommunikation per `postMessage`), dieser Weg wurde aber noch nicht in jedem Browser geprüft.

## Bedienung

| Taste | Aktion |
| --- | --- |
| `→` `Leertaste` `Bild ↓` | Nächste Folie |
| `←` `⇧ + Leertaste` `Bild ↑` | Vorherige Folie |
| `Pos1` `Ende` | Erste und letzte Folie |
| `0` bis `5` | Kapitel: Start, TypeScript, JavaScript, CSS, HTML, Abschluss |
| `O` | Übersicht und Kapitelwahl |
| `N` | Sprechernotizen ein- und ausblenden |
| `P` | Referentenansicht in neuem Fenster (Notizen, nächste Folie, Laufzeit) |
| `R` | Nur Hauptablauf: Reserve-, Zusatz- und optionale Folien ausblenden |
| `T` | Farbschema: System, Hell, Dunkel |
| `+` `−` | Schrift vergrößern oder verkleinern, etwa für den Beamer |
| `F` | Vollbild |
| `?` | Hilfe |

In den Editoren führt `Strg/⌘ + Enter` die Demo sofort aus, `Esc` verlässt den Editor. Nach einem Klick in ein Demo-Ergebnis liegt der Fokus im iframe; für die Foliennavigation einmal außerhalb klicken.

Jede Folie hat eine eigene Adresse (`index.html#css-has`), die sich als Lesezeichen oder Link verwenden lässt.

## Aufbau

```
index.html               Präsentation
presenter.html           Referentenansicht (wird mit Taste P geöffnet)
assets/css/              Gestaltung
assets/js/deck.js        Kapitel, Kennzeichnungen, Hilfsfunktionen
assets/js/render.js      Foliendaten → DOM
assets/js/demo.js        Editor und Ausführung der Live-Demos
assets/js/highlight.js   Syntax-Hervorhebung
assets/js/playground.js  Links in den TypeScript Playground
assets/js/app.js         Navigation, Tastatur, Übersicht, Notizen
assets/js/presenter.js   Referentenansicht
content/*.js             Folieninhalte je Kapitel
unterlagen/*.md          Recherche-Dokumente als Inhaltsbasis
```

Alle Skripte sind klassische Skripte ohne Module, damit `index.html` auch direkt aus dem Dateisystem läuft.

## Live-Demos

- **JavaScript, CSS, HTML:** Der Code ist bearbeitbar und läuft in einem isolierten iframe (`sandbox` ohne `allow-same-origin`). Konsolenausgaben erscheinen unter dem Ergebnis. Änderungen bleiben erhalten, solange der Tab offen ist; „Zurücksetzen“ stellt das Original wieder her.
- **TypeScript:** Der Code ist bearbeitbar. Die Buttons öffnen den aktuellen Editorinhalt im [TypeScript Playground](https://www.typescriptlang.org/play) mit fest gewählter Compiler-Version, etwa 5.4 gegenüber 5.5.
- **Supportchecks:** Folien mit einem Feature zeigen live, ob der aktuelle Browser es unterstützt. Je Kapitel gibt es eine Übersichtstabelle.

## Kennzeichnungen

| Kennzeichnung | Bedeutung |
| --- | --- |
| Neu im Zeitraum | Im Zeitraum erschienen oder browserübergreifend verfügbar geworden |
| Ältere Grundlage | Bereits vor Oktober 2023 verfügbar |
| Eingeschränkter Support | Fehlt noch in mindestens einem verbreiteten Browser oder einer Laufzeit |
| Experimentell | Entwurf, Origin Trial oder nur ein Browser |
| Reserve, Zusatzbeispiel, Optional | Nicht im Hauptablauf, mit `R` ausblendbar |

## Folien bearbeiten

Folien stehen als Daten in `content/<kapitel>.js`. Eine Folie besteht aus Metadaten und Blöcken:

```js
{
  id: 'css-has',                 // Adresse der Folie (#css-has)
  kicker: 'CSS · Demo 1',
  title: 'Das Elternelement reagiert auf den Inhalt',
  status: 'neu',                 // neu | grundlage | eingeschraenkt | experimentell, auch als Array
  role: 'reserve',               // optional: reserve | zusatz | optional | einordnung
  since: 'Baseline Dezember 2023',
  minutes: 2,
  blocks: [
    { type: 'lead', text: 'Text mit `code` und **Betonung**' },
    { type: 'compare', before: { label: 'Vorher', blocks: [...] }, after: { label: 'Heute', blocks: [...] } },
    { type: 'demo', kind: 'web', html: '…', css: '…', js: '…', height: 200 },
    { type: 'demo', kind: 'js', js: '…' },
    { type: 'demo', kind: 'ts', ts: '…', versions: [{ label: 'TS 5.5', ts: '5.5.4' }] }
  ],
  support: { text: 'Baseline seit Dezember 2023.', test: () => CSS.supports('selector(:has(*))') },
  sources: [{ label: 'CSS Selectors Level 4', url: 'https://…' }],
  notes: ['Sprechernotiz 1', 'Sprechernotiz 2']
}
```

Weitere Blocktypen: `p`, `h`, `list`, `table`, `callout`, `code`, `columns`, `cards`, `legend`, `checks`. Codebeispiele werden mit dem Tag `d\`…\`` geschrieben, der die gemeinsame Einrückung entfernt.

## Später: GitHub Pages

Die Präsentation ist eine rein statische Seite und kann ohne Anpassung über GitHub Pages ausgeliefert werden (Branch `main`, Ordner `/`). Die Datei `.nojekyll` verhindert die Jekyll-Verarbeitung. Bisher ist nichts veröffentlicht.

## Stand der Inhalte

Supportangaben stammen aus den Recherchen vom 5. und 26. Oktober 2026. Supportstände am Vorführungstag erneut prüfen, besonders für eingeschränkte und experimentelle Features.
