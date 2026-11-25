import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Only index.html is an app entry; the snippet and fixture .html files are data.
  optimizeDeps: { entries: ['index.html'] },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    // Vitest skips CSS by default, which would make the snippet style.css?raw imports empty.
    css: { include: [/src\/levels\//] },
  },
});
