# CSS Neuerungen für eine kurze Vorführung

*Schwerpunkt Oktober 2023 bis Oktober 2026 mit ergänzenden Grundlagen*

Diese Arbeitsunterlage verbindet eine Auswahl relevanter Neuerungen mit kleinen Beispielen für die Vorführung im Team. Die Übersicht dient zum Nachlesen; die empfohlenen Demos bilden den Ablauf. Sie ist keine vollständige Liste aller Änderungen und Fehlerkorrekturen. Die ursprüngliche Übersicht wurde am 5. Oktober 2026 recherchiert; die Abschnitte zu Container-Einheiten, Positionsfunktionen, Countern, Fortschritt und eigenen Funktionen wurden am 26. Oktober 2026 ergänzt. Ziel der Vorführung ist zu zeigen, was CSS heute ausdrücken kann. Ältere Grundlagen und Features mit eingeschränktem Support sind ausdrücklich gekennzeichnet.

### Release Infos und Quellen

Quelle: [web.dev Baseline mit Jahresübersichten](https://web.dev/baseline)

Quelle: [W3C CSS Snapshot 2025 als Spezifikationsübersicht](https://www.w3.org/TR/css-2025/)

CSS entwickelt sich in einzelnen Modulen. Es gibt keine jährliche CSS-Gesamtversion. Deshalb ordnen wir die Auswahl nach dem Jahr der browserübergreifenden Verfügbarkeit. Baseline Newly available beschreibt Unterstützung in den Baseline-Kernbrowsern; Widely available folgt nach 30 Monaten. Das ersetzt die Prüfung unserer konkreten Zielbrowser nicht.

### Überblick nach Baseline Jahr

| Jahr | Relevante Features | Demo |
| --- | --- | --- |
| 2023 | :has() seit Dezember; Nesting; Container Size Queries; Subgrid; moderne Farbräume und color-mix() | has |
| 2024 | text-wrap: balance; light-dark(); relative Farben; @starting-style; transition-behavior; @property; backdrop-filter; scrollbar-gutter | Text und Farben |
| 2025 | View Transitions; view-transition-class; ::details-content; content-visibility; Popover als benachbarte HTML API | View Transitions |
| 2026 | @scope; Container Style Queries; field-sizing; contrast-color(); shape(); :open; sibling-index(); sibling-count(); progress() | Positionsfunktionen und Berechnungen |

Container Size Queries, Subgrid, moderne Farben und ursprüngliches Nesting wurden bereits vor Oktober 2023 browserübergreifend verfügbar. Sie sind ergänzende Grundlagen. Size Queries reagieren auf Containermaße; Style Queries reagieren auf unterstützte Stilwerte. Die beiden Features haben unterschiedliche Supportstände.

Quelle: [Baseline 2023](https://web.dev/baseline/2023)

Quelle: [Baseline 2024](https://web.dev/baseline/2024)

Quelle: [Baseline 2025](https://web.dev/baseline/2025)

Quelle: [Baseline 2026](https://web.dev/baseline/2026)

## Zustände und Text ohne zusätzlichen Code

### Demo 1 Das Elternelement reagiert auf den Inhalt

:has() wählt Elemente anhand passender verwandter Elemente aus. Für eine Aufgabenliste reicht dadurch CSS, um die Zeile eines ausgewählten Kontrollkästchens zu gestalten. Die browserübergreifende Verfügbarkeit wurde im Dezember 2023 erreicht.

```html
<!-- HTML -->
<label class="task">
  <input type="checkbox"> Dokumentation ergänzen
</label>
```

```css
.task { display: block; padding: 1rem; }
.task:has(input:checked) {
  background: #dcfce7;
  text-decoration: line-through;
}
```

Vorher wurde dafür häufig per change-Handler eine Klasse an der Zeile gesetzt. Vorführung in 3 Minuten: Checkbox anklicken und die Regel im Inspector deaktivieren. CSS steuert hier die Darstellung; gespeicherter Aufgabenstatus bleibt eine Aufgabe der Anwendungslogik.

Quelle: [CSS Selectors Level 4 Relational Pseudo Class](https://drafts.csswg.org/selectors/#relational)

### Demo 2 Überschriften gleichmäßiger umbrechen

text-wrap: balance verteilt kurze Textblöcke auf ausgeglichenere Zeilen. Statt manueller br-Tags bleibt die Überschrift bei unterschiedlichen Breiten flexibel. Das Feature gehört zu Baseline 2024.

```html
<!-- HTML -->
<h1 class="headline">
  Neue Möglichkeiten für unsere Webanwendungen
</h1>
```

```css
.headline {
  max-width: 24ch;
  font: 700 2.5rem/1.1 system-ui;
  text-wrap: balance;
}
```

Vorführung in 2 Minuten: balance im Inspector an- und ausschalten, dann die Breite ändern. Für kurze Überschriften verwenden. Der Algorithmus und die Zahl ausbalancierter Zeilen sind browserabhängig; es ist keine feste Kontrolle über einzelne Umbruchstellen.

Quelle: [CSS Text Level 4 Text Wrap Style](https://drafts.csswg.org/css-text-4/#text-wrap-style)

## Farbschemata und sichtbare Übergänge

### Demo 3 Zwei Farbschemata mit light dark

light-dark aus Baseline 2024 wählt einen Farbwert passend zum verwendeten Farbschema. Dadurch lassen sich die Farbpaare am Einsatzort definieren. color-scheme ist Voraussetzung für die Auswahl.

```css
/* Vorher meist über prefers-color-scheme überschrieben */
:root { color-scheme: light dark; }
body {
  background: light-dark(#f8fafc, #0f172a);
  color: light-dark(#0f172a, #f8fafc);
}
/* Für die Demo jeweils nur eine Regel aktivieren */
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"]  { color-scheme: dark; }
```

Vorführung in 2 Minuten: Am html-Element data-theme zwischen light und dark wechseln. Ohne Attribut folgt die Seite der Systemeinstellung. Kontrast und Lesbarkeit der gewählten Farben weiterhin selbst prüfen.

Quelle: [CSS Color Level 5 light dark](https://drafts.csswg.org/css-color-5/#light-dark)

### Demo 4 Einen DOM Wechsel animieren

Same-document View Transitions sind eine Web-API mit CSS-Pseudoelementen. Der Browser erfasst den Zustand vor und nach der Aktualisierung und animiert dazwischen. Die Basisfunktion gehört zu Baseline 2025; einzelne Erweiterungen und Übergänge zwischen Dokumenten gesondert prüfen.

```html
<!-- HTML -->
<button id="toggle">Ansicht wechseln</button>
<main id="panel">Listenansicht</main>
```

```javascript
const button = document.querySelector("#toggle");
const panel = document.querySelector("#panel");
let grid = false;
button.onclick = () => {
  const update = () => {
    grid = !grid;
    panel.textContent = grid ? "Kachelansicht" : "Listenansicht";
  };
  if (matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !document.startViewTransition) update();
  else document.startViewTransition(update);
};
```

Vorführung in 3 Minuten: Button anklicken. Schon der Standardübergang zeigt den Effekt. Optional panel mit view-transition-name: panel versehen. DOM-Aktualisierungen bleiben JavaScript; Bewegung wird bei reduzierter Bewegungspräferenz übersprungen.

Quelle: [Chrome Dokumentation Same Document View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/same-document)

## Ergänzende Grundlagen und Vorbereitung

### Grundlage Container Size Queries

Size Queries waren schon vor unserem Startdatum verfügbar. Als Grundlage bleiben sie sehr nützlich: Die Komponente reagiert auf ihren umgebenden Container, etwa in einer schmalen Sidebar und in einer breiten Hauptspalte.

```html
<!-- HTML -->
<div class="slot">
  <article class="card"><b>Titel</b><span>Beschreibung</span></article>
</div>
```

```css
.slot { container-type: inline-size; }
.card { display: grid; gap: 1rem; }
@container (width > 30rem) {
  .card { grid-template-columns: 1fr 2fr; }
}
```

Reserve für 3 Minuten: Zwei slots mit unterschiedlicher Breite nebeneinander zeigen. Der Query-Container muss ein Vorfahr der gestylten card sein. Dieses Beispiel betrifft Maße und verwendet keine Style Query.

Quelle: [CSS Conditional Rules Level 5 Container Queries](https://drafts.csswg.org/css-conditional-5/#container-queries)

### Reserve Natives Nesting

```css
/* Frühere getrennte Selektoren */
.card { padding: 1rem; }
.card:hover { outline: 2px solid steelblue; }

/* Mit nativem Nesting */
.card {
  padding: 1rem;
  &:hover { outline: 2px solid steelblue; }
}
```

Nesting ist eine ältere Grundlage aus 2023. Es bietet keine vollständige Sass-Sprache. Eigene native Funktionen sind mit `@function` separat möglich, bisher mit eingeschränktem Support. Sass-Funktionen oder Mixins werden durch Nesting nicht automatisch ersetzt.

Quelle: [CSS Nesting Module Level 1](https://drafts.csswg.org/css-nesting-1/)

## Containergrößen direkt in Werten verwenden

### Demo 5 Schrift und Abstände mit dem Container skalieren

Container-Einheiten ergänzen Container Queries: Statt nur einen Breakpoint abzufragen, kann eine Größe fließend vom Query-Container abhängen. Sie gehören zu den älteren Grundlagen vor Oktober 2023.

| Einheit | Bezug für 1 Einheit |
| --- | --- |
| `cqw` | 1 Prozent der Breite |
| `cqh` | 1 Prozent der Höhe |
| `cqi` | 1 Prozent der Inline-Größe |
| `cqb` | 1 Prozent der Block-Größe |
| `cqmin` | Kleinerer Wert von `cqi` und `cqb` |
| `cqmax` | Größerer Wert von `cqi` und `cqb` |

```html
<div class="card-slot">
  <article class="fluid-card">
    <h2>Eine Komponente für Sidebar und Hauptbereich</h2>
    <p>Schrift und Abstand passen sich an den Container an.</p>
  </article>
</div>
```

```css
.card-slot { container-type: inline-size; }
.fluid-card { padding: clamp(1rem, 4cqi, 2rem); }
.fluid-card h2 { font-size: clamp(1.25rem, 5cqi, 2.5rem); }
```

Vorführung in 2 Minuten: Zwei Container mit unterschiedlichen Breiten zeigen oder einen Container im Inspector verkleinern. Der Viewport bleibt gleich. `cqi` berücksichtigt die Schreibrichtung; in horizontalen Texten entspricht die Inline-Größe der Breite.

Der jeweilige Vorfahr muss die abgefragte Größenachse als Query-Container bereitstellen. `inline-size` reicht nicht für jede Verwendung von `cqh` oder `cqb`. Fehlt ein geeigneter Container für eine Achse, greift der entsprechende kleine Viewport als Bezug ein. Deshalb sind Containermaße nicht automatisch die Maße des direkten Elternelements.

Quelle: [CSS Conditional Rules Level 5 Container Relative Lengths](https://drafts.csswg.org/css-conditional-5/#container-lengths)

## Wiederholungen und Nummerierung

### Demo 6 Gestaffelte Animationen mit Positionsfunktionen

CSS hat keine allgemeine `for`-Schleife wie Sass. `sibling-index()` und `sibling-count()` ermöglichen jedoch Berechnungen anhand der Position eines Elements und der Anzahl seiner Geschwister. Der Index beginnt bei 1; die Anzahl schließt das Element selbst ein.

```html
<ul class="stagger">
  <li>TypeScript</li>
  <li>JavaScript</li>
  <li>CSS</li>
</ul>
```

```css
@keyframes appear {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@supports (animation-delay: calc(sibling-index() * 1ms)) {
  @media (prefers-reduced-motion: no-preference) {
    .stagger > li {
      animation: appear 400ms both;
      animation-delay: calc((sibling-index() - 1) * 100ms);
    }
  }
}
```

Vorführung in 2 Minuten: Liste neu laden und danach ein viertes `li` ergänzen. Für dessen Verzögerung ist keine zusätzliche CSS-Regel nötig. Als Ergänzung lässt sich ein Zahlenwert mit `calc(sibling-index() / sibling-count())` relativ zur Gesamtzahl berechnen.

Gezählt werden alle Geschwisterelemente, nicht nur die Elemente, die `.stagger > li` treffen. Ein zusätzliches anderes Element kann die Indizes daher verschieben. Die Funktionen erzeugen keine neuen DOM-Elemente.

Support: Laut WebDX seit August 2026 Baseline Newly available. Ältere Browser erhalten hier die direkt sichtbare Liste.

Quellen: [CSS Values Level 5 Tree Counting](https://drafts.csswg.org/css-values-5/#tree-counting), [WebDX Supportübersicht](https://web-platform-dx.github.io/web-features-explorer/features/sibling-count/)

### Demo 7 Abschnitte automatisch nummerieren

CSS-Counter sind lange etablierte Funktionen und werden als kurzer Grundlagen-Einschub gezeigt. Für gewöhnliche nummerierte Listen bleibt `<ol>` die passende HTML-Struktur.

```html
<article class="guide">
  <h2>Installation</h2>
  <p>Projekt vorbereiten.</p>
  <h2>Konfiguration</h2>
  <p>Optionen festlegen.</p>
</article>
```

```css
.guide { counter-reset: section; }
.guide h2 { counter-increment: section; }
.guide h2::before { content: counter(section) ". "; }
```

Vorführung in 1 Minute: Eine Überschrift dazwischen einfügen. Die Nummerierung passt sich automatisch an. `counter()` liefert Text für die Darstellung; `sibling-index()` liefert eine Zahl für Berechnungen. Generierter Inhalt sollte nicht die einzige Quelle fachlich notwendiger Informationen sein.

Quelle: [CSS Lists and Counters Level 3](https://drafts.csswg.org/css-lists-3/#auto-numbering)

## Fortschritt berechnen und darstellen

### Demo 8 Einen Wert mit progress normieren

`progress()` berechnet die relative Position eines Werts zwischen zwei Grenzen. Beispielsweise ergibt `progress(75, 0, 100)` den Wert `0.75`. Die Grundform begrenzt das Ergebnis auf 0 bis 1. Die Funktion ermittelt selbst keinen Lade- oder Scrollzustand.

```html
<div class="meter" style="--value: 75" aria-hidden="true"></div>
<p>75 von 100 Schritten abgeschlossen</p>
```

```css
.meter {
  height: 0.5rem;
  background: #e2e8f0;
}
.meter::before {
  content: "";
  display: block;
  height: 100%;
  background: steelblue;
  width: 75%; /* Grunddarstellung für dieses Beispiel */
}
@supports (opacity: progress(1, 0, 2)) {
  .meter::before {
    width: calc(progress(var(--value), 0, 100) * 100%);
  }
}
```

Vorführung in 1 Minute: `--value` im Inspector verändern, auch auf 120. Die Funktion ist vor allem bei anderen Grenzen als 0 und 100 interessant, etwa bei einer Messgröße zwischen 20 und 80. In einer Anwendung müssen Wert und zugängliche Textausgabe gemeinsam aktualisiert werden. Für echten Aufgabenfortschritt ist das native `<progress>`-Element häufig die einfachere Lösung.

Quelle: [CSS Values Level 5 Progress Notation](https://drafts.csswg.org/css-values-5/#progress)

### Demo 9 Scrollfortschritt ohne eigenen Scroll Handler

Mit einer Scroll-Timeline hängt der Animationsfortschritt an der Scrollposition. Eine schmale Leiste am oberen Rand ist ein gut sichtbares Beispiel. Anders als `progress()` erhält sie ihren Fortschritt direkt vom Scrollen.

```html
<div class="reading-progress" aria-hidden="true"></div>
<!-- Darunter ausreichend langer Seiteninhalt -->
```

```css
@keyframes reading {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@supports (animation-timeline: scroll()) {
  .reading-progress {
    position: fixed;
    inset: 0 0 auto;
    height: 4px;
    z-index: 1000;
    background: steelblue;
    transform-origin: left;
    animation: reading linear both;
    animation-timeline: scroll(root block);
  }
}
```

Vorführung in 2 Minuten: Eine lange Seite hoch- und herunterscrollen. `animation-timeline` steht nach dem `animation`-Shorthand, weil dieser die Timeline zurücksetzt. Ohne Unterstützung erscheint in diesem Beispiel keine Leiste. Die genaue Timeline im Zielbrowser vorab prüfen. Für bewegte Einblendeffekte zusätzlich die Präferenz für reduzierte Bewegung berücksichtigen.

Quelle: [WebKit Guide to Scroll Driven Animations](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)

## Eigene Funktionen direkt in CSS

### Demo 10 Wiederverwendbare Berechnungen mit function

Mit `@function` können wir eigene Funktionen definieren, die Parameter annehmen und einen CSS-Wert liefern. Die Namen beginnen mit `--`. Das Beispiel bündelt die Berechnung eines Abstandssystems.

```css
@function --spacing(--factor <number>) {
  result: calc(var(--factor) * 0.25rem);
}

.function-card {
  padding: 1rem;
  gap: 0.5rem;
}

/* Demo nur für Browser mit Unterstützung von @function */
.function-demo .function-card {
  padding: --spacing(4);
  gap: --spacing(2);
}
```

Vorführung in 2 Minuten: In einem unterstützten Browser `function-demo` am übergeordneten Element setzen. Danach den Faktor ändern. Es lassen sich auch Bedingungen wie `@media` in der Funktion verwenden. Eine Funktion liefert einen Wert; ganze Deklarationsblöcke wiederzuverwenden ist ein eigenes Mixin-Thema.

Die zweite Regel ist kein automatischer Support-Fallback: Eine unbekannte Funktion kann eine Deklaration erst bei der Wertberechnung ungültig machen. Deshalb die Klasse in dieser Demo nur nach vorab geprüftem Support aktivieren. Ein Test auf Custom Properties wie `@supports (--x: 1)` beweist keine Unterstützung von `@function`.

Stand 26. Oktober 2026: Laut WebDX unterstützen Chrome und Edge `@function` seit Version 139; Firefox und Safari noch nicht. Die Spezifikation ist ein Entwurf. Das Beispiel ist deshalb ein ausdrücklich gekennzeichneter Ausblick und kein browserübergreifender Standardbaustein für jedes Projekt.

Quellen: [CSS Custom Functions and Mixins Entwurf](https://drafts.csswg.org/css-mixins-1/), [WebDX Supportübersicht für function](https://web-platform-dx.github.io/web-features-explorer/features/function/)

## Support und Ablauf

Für has, text-wrap und light-dark reichen im Demo-Browser diese Prüfungen: CSS.supports("selector(:has(*))"), CSS.supports("text-wrap", "balance") und CSS.supports("color", "light-dark(white, black)"). Für View Transitions document.startViewTransition prüfen. Bei älteren Zielbrowsern die Grunddarstellung erhalten und neuere Gestaltung gezielt ergänzen.

### Empfohlene Auswahl für 15 Minuten

| Dauer | Beispiel | Sichtbarer Effekt |
| --- | --- | --- |
| 2 Minuten | `:has()` | Zeile reagiert auf Checkbox |
| 3 Minuten | Container Query und `cqi` | Layout und Schrift passen sich der Komponente an |
| 2 Minuten | `sibling-index()` | Neue Elemente erhalten automatisch eine Verzögerung |
| 1 Minute | Counter | Abschnittsnummern passen sich an |
| 3 Minuten | `progress()` und Scroll-Timeline | Berechneter Wert und Scrollposition als zwei unterschiedliche Fortschrittsquellen |
| 2 Minuten | `@function` | Eigene parametrisierte Berechnung in CSS |
| 2 Minuten | Support und Fragen | Einordnung für die eigenen Zielbrowser |

Textumbrüche, Farbschemata, Nesting und View Transitions bleiben als zusätzliche Beispiele erhalten. Die Unterlage ist ein Baukasten; alle zehn Demos nacheinander würden die kurze CSS-Session überladen.

Vor der Session die Ausschnitte auf lokalen HTML-Seiten im vorgesehenen Browser ausführen und verschiedene Containerbreiten prüfen. Die neuen Beispiele sind anhand der Dokumentation vorbereitet; sie wurden hier nicht in Browsern ausgeführt. Supportstände am Vorführungstag erneut prüfen, insbesondere für `@function` und Scroll-Timelines.
