// Links in den TypeScript Playground. Der Playground erwartet den Code
// LZ-komprimiert im Fragment (#code/…), kompatibel zu
// lz-string compressToEncodedURIComponent (MIT, Pieroxy).
(() => {
  'use strict';

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$';

  function compressToEncodedURIComponent(input) {
    const dictionary = new Map();
    const toCreate = new Set();
    const out = [];
    let w = '';
    let enlargeIn = 2;
    let dictSize = 3;
    let numBits = 2;
    let buffer = 0;
    let position = 0;

    // Schreibt die unteren `bits` Bits von value, niedrigstes Bit zuerst
    const write = (value, bits) => {
      for (let i = 0; i < bits; i++) {
        buffer = (buffer << 1) | (value & 1);
        value >>= 1;
        if (position === 5) {
          position = 0;
          out.push(ALPHABET[buffer]);
          buffer = 0;
        } else {
          position++;
        }
      }
    };

    const enlarge = () => {
      if (--enlargeIn === 0) {
        enlargeIn = 2 ** numBits;
        numBits++;
      }
    };

    const emit = () => {
      if (toCreate.has(w)) {
        const code = w.charCodeAt(0);
        if (code < 256) {
          write(0, numBits);
          write(code, 8);
        } else {
          write(1, numBits);
          write(code, 16);
        }
        enlarge();
        toCreate.delete(w);
      } else {
        write(dictionary.get(w), numBits);
      }
      enlarge();
    };

    for (let i = 0; i < input.length; i++) {
      const c = input.charAt(i);
      if (!dictionary.has(c)) {
        dictionary.set(c, dictSize++);
        toCreate.add(c);
      }
      const wc = w + c;
      if (dictionary.has(wc)) {
        w = wc;
      } else {
        emit();
        dictionary.set(wc, dictSize++);
        w = c;
      }
    }
    if (w !== '') emit();
    write(2, numBits);

    // Letztes Zeichen auffüllen
    for (;;) {
      buffer <<= 1;
      if (position === 5) {
        out.push(ALPHABET[buffer]);
        break;
      }
      position++;
    }
    return out.join('');
  }

  function playgroundUrl(code, version) {
    const query = version ? `?ts=${encodeURIComponent(version)}` : '';
    return `https://www.typescriptlang.org/play/${query}#code/${compressToEncodedURIComponent(code)}`;
  }

  Deck.playgroundUrl = playgroundUrl;
  Deck.compressToEncodedURIComponent = compressToEncodedURIComponent;
})();
