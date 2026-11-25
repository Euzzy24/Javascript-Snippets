import { describe, it, expect } from 'vitest';
import { normalise, indent, demoDoc } from '../src/lib/snippetFiles.js';
import { levels, demoFallback } from '../src/levels/index.jsx';

describe('indent', () => {
  it('pads non-empty lines and leaves empty lines alone', () => {
    expect(indent('a\n\nb', '  ')).toBe('  a\n\n  b');
  });
});

describe('normalise', () => {
  it('removes all leading blank lines and trailing whitespace, keeping first-line indent', () => {
    expect(normalise('\n\n   \n  const a = 1;\n\n')).toBe('  const a = 1;');
  });
  it('converts CRLF and CR to LF', () => {
    expect(normalise('a\r\nb\rc\r\n')).toBe('a\nb\nc');
  });
});

describe('demoDoc', () => {
  it('puts the image fallback script before the snippet css', () => {
    const doc = demoDoc('<p>x</p>', 'p{}', 'let a;', demoFallback);
    expect(doc.indexOf(demoFallback)).toBeGreaterThan(-1);
    expect(doc.indexOf(demoFallback)).toBeLessThan(doc.indexOf('<style>p{}'));
  });
});

describe('level data', () => {
  it('has the warm-up l0 then l1..l5 in order, each with code', () => {
    expect(levels.map((l) => l.key)).toEqual(['l0', 'l1', 'l2', 'l3', 'l4', 'l5']);
    for (const l of levels) {
      expect(l.html.length).toBeGreaterThan(0);
      expect(l.css.length).toBeGreaterThan(0);
      expect(l.js.length).toBeGreaterThan(0);
    }
  });

  it('no snippet contains a closing script tag (it would break the demo and the single-file copy)', () => {
    for (const l of levels) {
      for (const part of [l.html, l.css, l.js]) expect(part).not.toMatch(/<\/script/i);
    }
  });
});
