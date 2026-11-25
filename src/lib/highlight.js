// Splits code into lines and marks whole-line comments.
// Returns data; the component renders it, so React does the escaping.
export const highlight = (code) =>
  code.split('\n').map((line) => {
    const t = line.trim();
    return {
      text: line || ' ',
      isComment: t.startsWith('//') || t.startsWith('/*') || t.startsWith('<!--'),
    };
  });
