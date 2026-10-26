# HTML Neuerungen für eine kurze Vorführung

*Schwerpunkt Oktober 2023 bis Oktober 2026 mit ergänzenden Grundlagen · Recherche vom 26. Oktober 2026*

HTML gehört als vierter Bereich neben TypeScript, JavaScript und CSS in unsere Vorführung. Der Schwerpunkt liegt auf nativer Interaktion: Dialoge, Popovers und Akkordeons, für die wir bisher oft eigene Zustandsverwaltung und Event-Handler geschrieben haben. Die Beispiele zeigen die Grundmechanik; sie ersetzen nicht die Prüfung von Tastaturbedienung, Beschriftung und fachlichem Verhalten in der Anwendung.

## Release Infos und Quellen

HTML wird als Living Standard gepflegt. Es gibt keine jährlichen HTML-Gesamtversionen wie ES2025. Wir unterscheiden die Existenz eines Features im Standard von seiner Verfügbarkeit in Browsern.

- [WHATWG HTML Living Standard für Webentwickler](https://html.spec.whatwg.org/dev/)
- [WHATWG Interaktive Elemente mit details und dialog](https://html.spec.whatwg.org/dev/interactive-elements.html)
- [WHATWG Popover](https://html.spec.whatwg.org/dev/popover.html)
- [web.dev Baseline mit Jahresübersichten](https://web.dev/baseline)
- [WebDX Feature Explorer](https://web-platform-dx.github.io/web-features-explorer/)

Baseline Newly available bedeutet Unterstützung in den Baseline-Kernbrowsern, nicht automatisch in allen eingesetzten älteren Browsern und WebViews. Einzelne Erweiterungen eines Elements können später verfügbar werden als das Element selbst.

## Auswahl und zeitliche Einordnung

| Feature | Einordnung | Nutzen für die Demo |
| --- | --- | --- |
| `<dialog>` und `showModal()` | Browserübergreifend seit 2022, ältere Grundlage | Native modale Interaktion verstehen |
| `<details name="…">` | Baseline 2024 | Höchstens ein Abschnitt einer Gruppe bleibt geöffnet |
| `popover` und `popovertarget` | Baseline seit Januar 2025 | Nichtmodale Einblendungen ohne eigenen Toggle-Handler |
| `dialog.requestClose()` | Baseline seit Mai 2025 | Schließanfragen zentral abfangen |
| `commandfor` und `command` | Baseline seit Dezember 2025 | Dialoge deklarativ per Button steuern |
| `<dialog closedby="…">` | Eingeschränkt verfügbar | Schließen durch Escape oder Klick außerhalb konfigurieren |
| `inert` | Baseline April 2023, ältere Grundlage | Teilbereiche von Interaktion und Zugänglichkeit ausschließen |
| `<search>` | Baseline Oktober 2023 | Suchbereiche semantisch auszeichnen |
| Deklaratives Shadow DOM | Baseline Februar 2024 | Shadow DOM direkt aus HTML aufbauen, etwa bei serverseitigem Rendering |

Die ersten sechs Einträge bilden die Demo-Auswahl. Die letzten drei sind ergänzende Themen für Rückfragen. Die HTML-Basis von `<details>` ist älter; neu in unserer Auswahl ist vor allem das Gruppieren über `name`.

Quellen für die Verfügbarkeit: [Popover](https://web.dev/blog/popover-baseline), [Invoker Commands](https://web-platform-dx.github.io/web-features-explorer/features/invoker-commands/), [requestClose](https://web-platform-dx.github.io/web-features-explorer/features/requestclose/), [closedby](https://web-platform-dx.github.io/web-features-explorer/features/dialog-closedby/), [details name](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/name), [Baseline Grundlagen](https://web.dev/baseline).

## Demo 1 Ein nativer modaler Dialog

Vorher benötigten eigene Modals zusätzliche Logik für Darstellung, Fokus und das Sperren des Hintergrunds. Als ältere Grundlage zeigen wir zuerst `<dialog>` mit `showModal()`.

```html
<button type="button" id="open-settings">Einstellungen öffnen</button>

<dialog id="settings" aria-labelledby="settings-title">
  <h2 id="settings-title">Einstellungen</h2>
  <p>Hier könnten die Einstellungen stehen.</p>
  <form method="dialog">
    <button value="done" autofocus>Fertig</button>
  </form>
</dialog>
```

```javascript
const dialog = document.querySelector("#settings");
document.querySelector("#open-settings").addEventListener("click", () => {
  dialog.showModal();
});
```

```css
#settings {
  max-width: min(32rem, 90vw);
  border: 0;
  border-radius: 0.75rem;
  padding: 1.5rem;
}
#settings::backdrop {
  background: rgb(0 0 0 / 0.45);
}
```

Vorführung in 2 Minuten: Öffnen, mit Tab navigieren, Escape drücken und erneut über Fertig schließen. `showModal()` platziert den Dialog im Top Layer und macht die übrige Seite inert. Nur `open` im Markup oder `show()` öffnet ihn nichtmodal. Das ist ein wesentlicher Unterschied.

`method="dialog"` schließt den Dialog beim Absenden, ohne Formulardaten an einen Server zu schicken. Der Buttonwert kann über `dialog.returnValue` ausgewertet werden. Das ist kein Speichern von Einstellungen. Den anfänglichen Fokus passend zum Inhalt wählen und einen sichtbaren Schließen-Button anbieten.

Quelle: [WHATWG dialog](https://html.spec.whatwg.org/dev/interactive-elements.html#the-dialog-element).

## Demo 2 Den Öffnen Handler durch HTML ersetzen

Mit Invoker Commands kann ein Button einen unterstützten Befehl direkt an ein Zielelement senden. Wir ersetzen den JavaScript-Handler aus Demo 1 durch diese Attribute:

```html
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
```

Vorführung in 2 Minuten: Zeigen, dass kein eigener JavaScript-Handler vorhanden ist, dann den Dialog öffnen und schließen. `commandfor` verweist auf die ID, `command` benennt die Aktion. `show-modal`, `close` und `request-close` sind eingebaute Dialogbefehle. Eigene Befehle mit `--` benötigen weiterhin eigene Logik.

`type="button"` macht deutlich, dass der Button kein Formular absenden soll. Bei älteren Browsern mit fehlendem Invoker-Support kann für die Dialogöffnung weiterhin `showModal()` per JavaScript verwendet werden.

Support: Baseline Newly available seit 12. Dezember 2025. Native Dialogunterstützung allein genügt nicht, um diese neueren Attribute vorauszusetzen.

Quellen: [Open UI Invoker Commands](https://open-ui.org/components/invokers.explainer/), [WebDX Invoker Commands](https://web-platform-dx.github.io/web-features-explorer/features/invoker-commands/).

## Demo 3 Ein Popover direkt im HTML

Ein Popover eignet sich für ergänzende Informationen, bei denen die restliche Seite bedienbar bleiben soll. Das Attribut `popover` allein macht den Inhalt nicht modal.

```html
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
```

Vorführung in 2 Minuten: Öffnen, außerhalb klicken und Escape ausprobieren. Das Auto-Popover erscheint im Top Layer und unterstützt Light Dismiss. Es braucht für dieses Beispiel keinen selbst geschriebenen Toggle-Handler. Die Positionierung am Auslöser ist ein eigener Gestaltungsschritt, beispielsweise mit CSS Anchor Positioning.

Das Beispiel ist eine einfache Informationsbox. `popover` liefert nicht automatisch die vollständige Semantik oder Tastatursteuerung eines Menüs, einer Combobox oder eines Tooltips. Solche Muster separat korrekt umsetzen.

Support: Popover ist seit 27. Januar 2025 Baseline Newly available. Frühere Angaben mit April 2024 wurden wegen eines Problems beim Schließen auf iOS korrigiert.

Quellen: [WHATWG Popover](https://html.spec.whatwg.org/dev/popover.html), [web.dev korrigierte Baseline Einordnung](https://web.dev/blog/popover-baseline).

### Dialog oder Popover

| Frage | Modaler Dialog mit showModal | Auto Popover |
| --- | --- | --- |
| Soll die übrige Seite gesperrt sein | Ja | Nein |
| Typische Verwendung | Eine Entscheidung oder abgeschlossener Arbeitsschritt | Ergänzende Informationen oder nichtmodale Einblendung |
| Klick außerhalb schließt | Mit unterstütztem `closedby="any"` | Ja |
| Escape schließt | Standardmäßig ja, sofern nicht verhindert | Ja |
| Darstellung im Top Layer | Ja | Ja |

Die Art des Elements allein definiert nicht die fachliche Interaktion. Ein nichtmodaler Dialog ist ebenfalls möglich. Für die Demo vergleichen wir ausdrücklich `showModal()` mit einem Auto-Popover.

## Demo 4 Akkordeons mit details name

`<details>` und `<summary>` sind etablierte HTML-Elemente. Neu für unseren Zeitraum ist die Möglichkeit, mehrere Einträge über denselben `name` zu einer exklusiven Gruppe zu verbinden.

```html
<section aria-labelledby="faq-title">
  <h2 id="faq-title">Fragen zum Export</h2>

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
</section>
```

Vorführung in 1 Minute: Nacheinander die Einträge öffnen. Sobald ein neuer Eintrag geöffnet wird, schließt der bisherige. Dann `name` entfernen: Mehrere Einträge können gleichzeitig geöffnet bleiben. Das Gruppieren benötigt keine eigene JavaScript-Logik. Namen zwischen unabhängigen Akkordeons unterschiedlich wählen.

Support: `details name` ist Baseline 2024. Die exklusive Darstellung bewusst wählen: Für das Vergleichen mehrerer Antworten kann gleichzeitiges Öffnen hilfreicher sein.

Quellen: [WHATWG details](https://html.spec.whatwg.org/dev/interactive-elements.html#the-details-element), [MDN Einführung in exklusive Akkordeons](https://developer.mozilla.org/en-US/blog/html-details-exclusive-accordions/).

## Demo 5 Schließverhalten gezielt steuern

### closedby für Benutzeraktionen

```html
<button type="button" commandfor="dismiss-demo" command="show-modal">
  Dialog mit Light Dismiss öffnen
</button>
<dialog id="dismiss-demo" closedby="any" aria-labelledby="dismiss-title">
  <h2 id="dismiss-title">Klick außerhalb ausprobieren</h2>
  <button type="button" commandfor="dismiss-demo" command="close" autofocus>
    Schließen
  </button>
</dialog>
```

| Wert | Verhalten |
| --- | --- |
| `any` | Light Dismiss sowie Schließanfragen der Plattform, etwa Escape |
| `closerequest` | Schließanfragen der Plattform, kein Light Dismiss |
| `none` | Keine dieser automatischen Benutzeraktionen; explizites Schließen bleibt möglich |

Vorführung in 1 Minute: `any` und `closerequest` vergleichen. Explizite Aktionen wie ein Schließen-Button, ein Dialogformular oder `close()` können weiterhin schließen. Ohne Attribut verhält sich ein modaler Dialog wie `closerequest`.

Support: Stand 26. Oktober 2026 in Chrome und Edge seit 134 sowie Firefox seit 141; laut WebDX noch nicht in Safari. Das Beispiel ist daher als Erweiterung mit eingeschränktem Support eingeplant. Der sichtbare Schließen-Button bleibt die Grundbedienung.

Quelle: [WebDX dialog closedby](https://web-platform-dx.github.io/web-features-explorer/features/dialog-closedby/).

### requestClose für abbrechbare Schließanfragen

`requestClose()` löst zuerst ein `cancel`-Event aus. Eine Anwendung kann das Schließen dort verhindern, etwa solange Änderungen ungespeichert sind. `close()` schließt unmittelbar und durchläuft diese Abbruchprüfung nicht.

```javascript
// Ergänzung zu einem vorhandenen Dialog mit Abbrechen-Button
const editor = document.querySelector("#edit-dialog");
const cancelButton = document.querySelector("#cancel-edit");
let dirty = false;

editor.addEventListener("input", () => { dirty = true; });
editor.addEventListener("cancel", event => {
  if (dirty) {
    event.preventDefault();
    // Hier eine zugängliche Rückfrage oder einen Hinweis anzeigen.
  }
});
cancelButton.addEventListener("click", () => editor.requestClose());
```

Dieser Ausschnitt zeigt die Stelle für die Fachlogik, keine vollständige Rückfrage. Deklarativ kann ein Button `command="request-close"` verwenden. `closedby="none"` verhindert nicht den expliziten Aufruf von `requestClose()`.

Quelle: [WebDX requestClose mit Support seit Mai 2025](https://web-platform-dx.github.io/web-features-explorer/features/requestclose/).

## Ergänzende Themen für Rückfragen

- `inert` sperrt einen Teilbaum für Interaktion und entfernt ihn aus der Zugänglichkeitsdarstellung. Das Attribut blendet den Bereich nicht visuell aus. Bei `showModal()` übernimmt der Browser die Sperre des Hintergrunds bereits.
- `<search>` zeichnet einen Such- oder Filterbereich semantisch aus. Die eigentliche Suche implementiert es nicht.
- Deklaratives Shadow DOM über `<template shadowrootmode="open">` ermöglicht Shadow DOM im HTML und kann bei serverseitigem Rendering von Web Components interessant sein.
- CSS `::backdrop`, `@starting-style`, diskrete Übergänge und Anchor Positioning sind passende Verbindungen zum CSS-Dokument. Diese Gestaltungsmöglichkeiten getrennt vom HTML-Basissupport prüfen.

Quelle und Einstieg: [web.dev Baseline](https://web.dev/baseline).

## Demo 6 Ein natives select frei gestalten

Customizable Select verbindet zusätzliche Gestaltungsmöglichkeiten mit einem echten Formularfeld. Mit `appearance: base-select` lassen sich der geschlossene Zustand und die Auswahlliste gestalten. `<selectedcontent>` zeigt den Inhalt der gewählten Option an.

```html
<label for="ticket-status">Status</label>
<select id="ticket-status" name="status">
  <button type="button"><selectedcontent></selectedcontent></button>
  <option value="open"><span aria-hidden="true">○</span> Offen</option>
  <option value="active"><span aria-hidden="true">◐</span> In Arbeit</option>
  <option value="done"><span aria-hidden="true">●</span> Erledigt</option>
</select>
```

```css
@supports (appearance: base-select) {
  #ticket-status,
  #ticket-status::picker(select) {
    appearance: base-select;
  }
  #ticket-status {
    border: 1px solid steelblue;
    border-radius: 0.5rem;
    padding: 0.6rem 1rem;
  }
  #ticket-status::picker(select) {
    border: 1px solid steelblue;
    border-radius: 0.5rem;
    padding: 0.5rem;
  }
  #ticket-status option {
    padding: 0.5rem;
    gap: 0.75rem;
  }
  #ticket-status option:checked {
    background: #dbeafe;
  }
}
```

Vorführung in 2 Minuten: Zwischen nativer und angepasster Darstellung wechseln und die Auswahl per Tastatur ändern. Der explizite `value` bestimmt weiterhin den Formularwert. Die Funktionalität von `select` wird nicht durch eine selbst gebaute Liste ersetzt.

Stand Oktober 2026: Chrome und Edge seit 135, Safari seit 27; laut WebDX noch kein Firefox-Support. In nicht unterstützten Browsern bleibt eine gewöhnliche Auswahl mit den Texten der Optionen. Den Fallback bei reichhaltigem Optionsinhalt und in der verwendeten Framework-Version ausdrücklich prüfen.

Quellen: [Chrome Einführung in Customizable Select](https://developer.chrome.com/blog/a-customizable-select), [WebDX Supportübersicht](https://web-platform-dx.github.io/web-features-explorer/features/customizable-select/).

## Demo 7 Text bearbeiten ohne eingefügte Formatierungen

`contenteditable="plaintext-only"` ermöglicht das Bearbeiten des Textinhalts, ohne Rich-Text-Formatierungen beim Einfügen zu übernehmen. Seit 4. März 2025 ist diese Kombination Baseline Newly available.

```html
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
```

Vorführung in 1 Minute: Einen formatierten Absatz mit fett gesetztem Text aus einer Webseite kopieren und in beide Bereiche einfügen. Im zweiten Bereich bleibt der Text ohne diese Formatierung erhalten.

Für gewöhnliche Formulare ist `textarea` meist passender: Ein Contenteditable-Bereich erhält nicht automatisch Formularübermittlung, Validierung oder eine Speicherfunktion. Der Mehrwert liegt bei gezielt gestalteten bearbeitbaren Oberflächen.

Quelle: [web.dev Plaintext Only Baseline](https://web.dev/blog/contenteditable-plaintext-only-baseline).

## Demo 8 Verborgenen Text über die Browsersuche finden

`hidden="until-found"` verbirgt einen Bereich, lässt dessen Text aber für die Browsersuche und Fragmentnavigation auffindbar. Das Feature existiert in Chromium bereits seit 2022 und gehört damit zu unseren ergänzenden Grundlagen; Firefox unterstützt es seit 148 im Jahr 2026. Safari unterstützt es laut WebDX noch nicht.

```html
<h2>Technische Einzelheiten</h2>
<div id="export-details" hidden="until-found">
  <p>Der Export verwendet den speziellen Trennschlüssel Nordlicht.</p>
</div>
<a href="#export-details">Zu den technischen Einzelheiten</a>
```

Vorführung in 1 Minute: Die Browserfunktion „Auf Seite suchen“ öffnen und nach Nordlicht suchen. Der Bereich wird aufgedeckt. Nach erneutem Laden den Fragmentlink ausprobieren.

Die Funktion versteckt Darstellung, keine vertraulichen Daten. `display: none` zusätzlich auf dem Bereich würde den gewünschten Suchmechanismus verhindern. Browser ohne Unterstützung können den Bereich wie gewöhnlich verborgen behandeln; für produktive Inhalte deshalb einen expliziten Weg zum Aufdecken vorsehen. Der Fragmentlink allein ist dafür kein universeller Fallback.

Quellen: [WHATWG hidden](https://html.spec.whatwg.org/dev/interaction.html#the-hidden-attribute), [WebDX Supportübersicht](https://web-platform-dx.github.io/web-features-explorer/features/hidden-until-found/).

## Ausblick HTML in Canvas

HTML-in-Canvas ist ein experimenteller Vorschlag, mit dem der Browser DOM-Inhalte in Canvas zeichnen kann. Ein mögliches Beispiel sind HTML-Bedienelemente auf Flächen einer 3D-Szene. Es geht um die Verbindung von DOM und Canvas-Rendering, nicht um die Einführung eines gewöhnlichen HTML-Containers.

Der Chrome-Origin-Trial läuft laut aktueller Ankündigung bis einschließlich Chrome 160. Die API wurde mehrfach verändert. Neuere Beispiele verwenden `content="drawable"` und `drawable` statt des älteren `layoutsubtree`. Beispielcode immer auf die verwendete Browserversion abstimmen.

Für die Vorführung eine offizielle Demo in einer vorbereiteten Testumgebung verwenden. Hierfür 1 bis 2 Minuten einplanen und das Feature deutlich als Experiment kennzeichnen. Eine lokale Browserdemo wurde für diese Unterlage noch nicht eingerichtet.

Quellen: [WICG Vorschlag](https://github.com/WICG/html-in-canvas), [Chrome Origin Trial](https://developer.chrome.com/blog/html-in-canvas-origin-trial), [Aktuelle API Änderungen](https://developer.chrome.com/blog/html-in-canvas-ot-changes).

## Weitere Entwicklungen zum Nachlesen

| Thema | Konkreter Nutzen | Einordnung und Quelle |
| --- | --- | --- |
| Deklaratives Shadow DOM | Shadow Root samt Styles direkt im HTML, etwa für serverseitig gerenderte Web Components | Baseline 2024; [web.dev Einführung](https://web.dev/articles/declarative-shadow-dom) |
| Scoped Custom Element Registries | Gleichnamige Custom Elements verschiedener Bibliotheken getrennt registrieren | Noch uneinheitlicher Support; [Chrome Einführung](https://developer.chrome.com/blog/scoped-registries) und [WebDX](https://web-platform-dx.github.io/web-features-explorer/features/scoped-custom-element-registries/) |
| Interest Invokers mit `interestfor` | Interesse durch Hover, Fokus oder langes Drücken als Auslöser für Einblendungen verwenden | Chromium, keine browserübergreifende Grundlage; [WebDX](https://web-platform-dx.github.io/web-features-explorer/features/interest-invokers/) |
| `fetchpriority` | Relative Ladepriorität wichtiger Ressourcen, etwa eines zentralen Bildes, beeinflussen | Baseline seit Oktober 2024; ein Hinweis an den Browser, keine feste Reihenfolge; [web.dev](https://web.dev/articles/fetch-priority) und [WebDX](https://web-platform-dx.github.io/web-features-explorer/features/fetch-priority/) |
| Speculation Rules | Wahrscheinliche Folgeseiten vorladen oder vorrendern | Chromium; Effekte und zusätzliche Arbeit vorab messen; [Chrome Leitfaden](https://developer.chrome.com/docs/web-platform/implementing-speculation-rules) und [WebDX](https://web-platform-dx.github.io/web-features-explorer/features/speculation-rules/) |

Diese Themen sind eine Auswahl, kein vollständiges Änderungsprotokoll der Webplattform. Für ein Team ohne Web Components sind Scoped Registries eher Hintergrundwissen. Ladeprioritäten und Speculation Rules brauchen eine vorbereitete Messung, um in einer kurzen Session überzeugend sichtbar zu werden.

## Vorbereitung und Supportchecks

```javascript
console.table({
  customizableSelect: CSS.supports("appearance", "base-select"),
  dialog: typeof HTMLDialogElement !== "undefined" &&
    "showModal" in HTMLDialogElement.prototype,
  popover: "popover" in HTMLElement.prototype,
  invokerCommands: "commandForElement" in HTMLButtonElement.prototype,
  detailsName: "name" in HTMLDetailsElement.prototype,
  requestClose: typeof HTMLDialogElement !== "undefined" &&
    "requestClose" in HTMLDialogElement.prototype,
  closedBy: typeof HTMLDialogElement !== "undefined" &&
    "closedBy" in HTMLDialogElement.prototype
});
```

Die Prüfungen zeigen verfügbare API-Oberflächen; sie ersetzen keine Verhaltenstests. Alle Beispiele auf getrennten HTML-Seiten oder mit eindeutig vergebenen IDs vorbereiten. Dialoge und Popovers mit Maus, Tab, Enter und Escape testen. Die Beispiele wurden anhand offizieller Dokumentation erstellt; eine Browserausführung in eurer Vorführungsumgebung steht noch aus.

## Empfohlene Auswahl für die Vorführung

Der rote Faden lautet: **Was übernimmt der Browser heute, wofür wir bisher eigene Komponenten, Bibliotheken oder zusätzliche JavaScript-Logik gebraucht haben?**

| Kurze Fassung mit 8 bis 10 Minuten | Erweiterte Fassung mit 14 bis 17 Minuten |
| --- | --- |
| Dialog und deklarative Buttons | Dialog und deklarative Buttons |
| Popover als nichtmodale Alternative | Popover und exklusives Akkordeon |
| Exklusives Akkordeon | Customizable Select |
| Ein Zusatzbeispiel nach Teaminteresse | Plaintext Only und Hidden Until Found |
| Kurze Supporteinordnung | HTML-in-Canvas als experimenteller Abschluss |

`closedby` und `requestClose()` bleiben Reserve für Fragen zum Schließverhalten. Nicht alle Beispiele nacheinander zeigen: Die Unterlage ist ein Baukasten. Die passende Auswahl hängt von den Anwendungen des Teams ab.

HTML und CSS lassen sich gut verbinden: erst die native Interaktion zeigen, dann deren Gestaltung ergänzen. Die Gesamtzeit für TypeScript, JavaScript, CSS und HTML muss entsprechend gekürzt oder auf zwei Sessions verteilt werden.
