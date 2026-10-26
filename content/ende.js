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
            { chapter: 'js', goto: 'chapter:js', meta: 'JavaScript', title: 'Weniger eigene Hilfsfunktionen', text: '`groupBy`, Set-Operationen und Iterator Helpers ersetzen typische Utilities – Laufzeitsupport prüfen.' },
            { chapter: 'css', goto: 'chapter:css', meta: 'CSS', title: 'Komponenten reagieren auf Kontext', text: '`:has()`, Container und Positionsfunktionen ersetzen JavaScript und Wiederholungen.' },
            { chapter: 'html', goto: 'chapter:html', meta: 'HTML', title: 'Der Browser übernimmt Interaktion', text: 'Dialog, Popover, `commandfor` und `details name` ersetzen eigene Zustandslogik.' }
          ]
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Vor dem Einsatz',
          text: 'Supportstände für unsere Zielbrowser, WebViews und Node-Versionen prüfen. Bei älteren Zielen die Grunddarstellung erhalten und Neues gezielt ergänzen.'
        },
        {
          type: 'lead',
          text: 'Fragen? Welche Einsatzstelle in unseren Anwendungen probieren wir zuerst aus?'
        }
      ],
      notes: [
        'Konkrete nächste Schritte sammeln: Welche Hilfsfunktion, welche Komponente, welches Modal könnten wir ersetzen?',
        'Hinweis: Die Präsentation liegt im Repository und läuft lokal – jede Demo lässt sich nachträglich ausprobieren.'
      ]
    }
  ]);
})();
