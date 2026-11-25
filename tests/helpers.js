import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, 'fixtures');
export const fixture = (key, file) => fs.readFileSync(path.join(root, key, file), 'utf8');
