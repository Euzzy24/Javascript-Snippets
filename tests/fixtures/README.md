# Copy-output snapshots

One folder per level. Each holds the exact text the page produces:

- `page.html`, `style.css`, `script.js`: what "Copy this file" copies for each tab
- `single.html`: what "Copy as one HTML file" copies
- `demo.html`: the document loaded into the live demo iframe

They were first captured from the original `JavaScript Snippet Levels.html`, using the page's own copy buttons under jsdom, before the React rewrite. The rewrite was checked against them byte for byte.

`tests/parity.test.js` uses them as file snapshots:

- **You edited a snippet on purpose:** run `npm run test:update`, then read the diff here. It is exactly what students will copy.
- **A test fails and you didn't mean to change a snippet:** the copy output drifted. Fix the code, not these files.

Do not edit these files by hand. They must stay LF (see `.gitattributes`).
