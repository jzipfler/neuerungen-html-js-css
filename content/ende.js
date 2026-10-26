(() => {
  'use strict';
  const { add } = Deck;

  add('ende', [
    {
      id: 'ende',
      layout: 'title',
      kicker: 'Abschluss',
      title: 'Was nehmen wir mit?',
      blocks: [
        {
          type: 'cards',
          items: [
            { chapter: 'ts', goto: 'chapter:ts', meta: 'TypeScript', title: 'Präzisere Typen mit weniger Hilfscode', text: '`satisfies`, `const`-Typparameter, abgeleitete Type Predicates. Upgrade auf 6.0 und 7.0 bewusst planen.' },
            { chapter: 'js', goto: 'chapter:js', meta: 'JavaScript', title: 'Weniger eigene Hilfsfunktionen', text: '`groupBy`, Set-Operationen und Iterator Helpers ersetzen typische Hilfsfunktionen. Vorher prüfen, ob die Laufzeitumgebung sie kennt.' },
            { chapter: 'css', goto: 'chapter:css', meta: 'CSS', title: 'Komponenten passen sich ihrem Umfeld an', text: '`:has()`, Container und Positionsfunktionen sparen JavaScript und wiederholte Regeln.' },
            { chapter: 'html', goto: 'chapter:html', meta: 'HTML', title: 'Der Browser übernimmt die Interaktion', text: 'Dialog, Popover, `commandfor` und `details name` machen selbst geschriebene Zustandslogik überflüssig.' }
          ]
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Vor dem Einsatz',
          text: 'Prüfen, ob unsere Zielbrowser, WebViews und Node-Versionen das jeweilige Feature unterstützen. Für ältere Umgebungen eine funktionierende Grundversion behalten und Neues obendrauf setzen.'
        },
        {
          type: 'lead',
          text: 'Fragen? Und: Wo in unseren Anwendungen probieren wir als Erstes etwas davon aus?'
        }
      ],
      notes: [
        'Konkrete nächste Schritte sammeln: Welche Hilfsfunktion, welche Komponente, welches Modal könnten wir ersetzen?',
        'Die Präsentation liegt im Repository und läuft lokal. Alle Demos lassen sich also später in Ruhe selbst ausprobieren.'
      ]
    }
  ]);
})();
