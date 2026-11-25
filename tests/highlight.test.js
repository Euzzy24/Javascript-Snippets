import { describe, it, expect } from 'vitest';
import { highlight } from '../src/lib/highlight.js';

describe('highlight', () => {
  it('marks whole-line comments in JS, CSS and HTML', () => {
    const lines = highlight('// note\n  /* x */\n<!-- y -->');
    expect(lines.map((l) => l.isComment)).toEqual([true, true, true]);
  });
  it('does not mark a line with a trailing comment', () => {
    expect(highlight('const a = 1; // trailing')[0].isComment).toBe(false);
  });
  it('turns an empty line into a single space so it keeps its height', () => {
    expect(highlight('a\n\nb')[1].text).toBe(' ');
  });
  it('keeps markup as raw text (React escapes it on render)', () => {
    expect(highlight('<b>hi</b>')[0].text).toBe('<b>hi</b>');
  });
});
