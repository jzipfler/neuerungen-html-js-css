// Kleiner Syntax-Highlighter für die Codebeispiele. Bewusst einfach gehalten:
// Er färbt Kommentare, Strings, Schlüsselwörter, Zahlen, Funktionen und Tags.
(() => {
  'use strict';

  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  const keywords = [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'of', 'in', 'while',
    'do', 'switch', 'case', 'break', 'continue', 'new', 'class', 'extends', 'import',
    'export', 'from', 'default', 'typeof', 'instanceof', 'void', 'delete', 'throw', 'try',
    'catch', 'finally', 'async', 'await', 'yield', 'true', 'false', 'null', 'undefined',
    'this', 'super', 'as', 'satisfies', 'type', 'interface', 'readonly', 'keyof', 'infer',
    'is', 'declare', 'enum', 'namespace', 'string', 'number', 'boolean', 'never', 'unknown', 'any'
  ].join('|');

  const script = {
    re: new RegExp(
      '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)' +
      '|("(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'|`(?:\\\\.|[^`\\\\])*`)' +
      '|\\b(' + keywords + ')\\b' +
      '|(\\b\\d[\\d_]*(?:\\.\\d+)?\\b)' +
      '|(\\b[A-Z][\\w$]*\\b)' +
      '|([A-Za-z_$][\\w$]*(?=\\s*\\())',
      'g'
    ),
    classes: ['comment', 'string', 'keyword', 'number', 'type', 'fn']
  };

  const css = {
    re: new RegExp(
      '(\\/\\*[\\s\\S]*?\\*\\/|^\\s*\\/\\/[^\\n]*)' +
      '|("[^"\\n]*"|\'[^\'\\n]*\')' +
      '|(@[\\w-]+)' +
      '|((?<=^[ \\t]*|[{;][ \\t]*)-{0,2}[a-zA-Z][\\w-]*(?=\\s*:(?!:)))' +
      '|(#[0-9a-fA-F]{3,8}\\b|\\b\\d+(?:\\.\\d+)?(?:%|[a-z]+\\b)?)' +
      '|(-{0,2}[a-zA-Z][\\w-]*(?=\\())',
      'gm'
    ),
    classes: ['comment', 'string', 'at', 'prop', 'number', 'fn']
  };

  const bash = {
    re: /(#[^\n]*)|("[^"\n]*")/g,
    classes: ['comment', 'string']
  };

  const html = {
    re: /(<!--[\s\S]*?-->)|(<\/?[A-Za-z][\w-]*(?:\s(?:"[^"]*"|'[^']*'|[^>"'])*)?\/?>)/g,
    classes: ['comment', 'tag']
  };

  function highlightTag(tag) {
    return tag.replace(
      /^(<\/?)([\w-]+)|("[^"]*"|'[^']*')|([\w:-]+)(?=\s*=|[\s/>])|(\/?>)$/g,
      (m, open, name, str, attr, close) => {
        if (name) return `<span class="t-tag">${esc(open + name)}</span>`;
        if (str) return `<span class="t-string">${esc(str)}</span>`;
        if (attr) return `<span class="t-attr">${esc(attr)}</span>`;
        if (close) return `<span class="t-tag">${esc(close)}</span>`;
        return esc(m);
      }
    );
  }

  const languages = { js: script, ts: script, css, scss: css, html, bash };

  function highlight(code, lang) {
    const rule = languages[lang];
    if (!rule) return esc(code);
    let out = '';
    let last = 0;
    for (const m of code.matchAll(rule.re)) {
      out += esc(code.slice(last, m.index));
      const group = m.slice(1).findIndex(part => part !== undefined);
      const cls = rule.classes[group];
      if (lang === 'html' && cls === 'tag') {
        out += highlightTag(m[0]);
      } else {
        out += `<span class="t-${cls}">${esc(m[0])}</span>`;
      }
      last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
  }

  Deck.highlight = highlight;
})();
