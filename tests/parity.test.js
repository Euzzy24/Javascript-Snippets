// Snapshot guard for what students copy and what each live demo runs.
//
// The files in tests/fixtures were first captured from the original
// single-file page ("JavaScript Snippet Levels.html"), and this code was
// proven to reproduce them byte for byte. They now act as file snapshots:
// - Changed a snippet on purpose? Run `npm run test:update`, then review the
//   diff in tests/fixtures — it is exactly what students will copy.
// - A failure you did not expect means the copy output drifted. Fix the code.
import { describe, it, expect } from 'vitest';
import { levelFiles, singleFile, demoDoc } from '../src/lib/snippetFiles.js';
import { levels, demoFallback } from '../src/levels/index.jsx';

const snap = (key, name) => `./fixtures/${key}/${name}`;

describe.each(levels)('$key copy output', (level) => {
  const files = levelFiles(level);
  it.each(Object.keys(files))('%s', async (name) => {
    await expect(files[name]).toMatchFileSnapshot(snap(level.key, name));
  });
  it('single.html (Copy as one HTML file)', async () => {
    await expect(singleFile(level.html, level.css, level.js, level.title)).toMatchFileSnapshot(snap(level.key, 'single.html'));
  });
  it('demo.html (live demo document)', async () => {
    await expect(demoDoc(level.html, level.css, level.js, demoFallback)).toMatchFileSnapshot(snap(level.key, 'demo.html'));
  });
});
