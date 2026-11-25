// Builds the files students copy, and the document each live demo runs.
// Ported unchanged in logic from the original page script, so the output
// stays byte-identical (see tests/parity.test.js).

// Same trimming the original src() helper did, plus CRLF -> LF, which the
// HTML parser used to do for us when the snippets lived in the page.
export const normalise = (text) =>
  text.replace(/\r\n?/g, '\n').replace(/^\s*\n/, '').replace(/\s+$/, '');

export const indent = (text, pad) =>
  text.split('\n').map((l) => (l ? pad + l : l)).join('\n');

export const headTop = (title) =>
  '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n' +
  '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
  '  <title>' + title + '</title>\n';

export const linkedFile = (body, title) =>
  headTop(title) + '  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n' +
  indent(body, '  ') + '\n\n  <script src="script.js"></script>\n</body>\n</html>';

export const singleFile = (body, css, js, title) =>
  headTop(title) + '  <style>\n' + indent(css, '    ') + '\n  </style>\n</head>\n<body>\n' +
  indent(body, '  ') + '\n\n  <script>\n' + indent(js, '    ') + '\n  </script>\n</body>\n</html>';

export const demoDoc = (body, css, js, fallback) =>
  '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1"><script>' + fallback + '</script><style>' + css +
  '</style></head><body>' + body + '<script>' + js + '</script></body></html>';

// The three tabs shown for a level, in tab order.
export const levelFiles = ({ title, html, css, js }) => ({
  'page.html': linkedFile(html, title),
  'style.css': css,
  'script.js': js,
});
