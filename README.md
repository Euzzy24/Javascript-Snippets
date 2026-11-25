# JavaScript Snippets

The IT55 "JavaScript Snippets" lesson page: a "click anything" warm-up (Level 0) and five working examples, from a button click to a mini shop, each with a live demo and copyable `page.html` / `style.css` / `script.js`.

The page is a Vite + React app. **The snippets students copy are plain vanilla HTML/CSS/JS and must stay that way.** The lesson teaches DOM APIs (`querySelector`, `addEventListener`), not React.

## Run it

Needs Node 20.19+.

```
npm install
npm run dev        # dev server with hot reload
npm test           # run the tests once
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```

## Where things live

| What | Where |
| --- | --- |
| Snippet code for level N (`l0` = the "Click anything" warm-up) | `src/levels/lN/body.html`, `style.css`, `script.js` |
| Level text (heading, intro, chips, "Try it") | `src/levels/index.jsx` |
| Image fallback injected into every demo | `src/levels/demoFallback.js` (injected as text, never imported as a module) |
| How the copied files and demo documents are built | `src/lib/snippetFiles.js` |
| Page components | `src/components/` |
| Page styles | `src/styles/global.css` |

`body.html` is only the page body. The full `page.html` students copy is built around it.

## Editing a snippet

1. Edit the files in `src/levels/lN/`. Keep them LF, and never put a literal `</script>` in them (a test checks this).
2. Run `npm test`. The parity tests fail and show what changed in the copy output.
3. If the change is what you meant, run `npm run test:update` and review the diff in `tests/fixtures/`. That diff is exactly what students will copy. See `tests/fixtures/README.md`.

## Legacy file

`JavaScript Snippet Levels.html` is the original single-file page. It stays until the React build is deployed and checked on its real host. Deployment, including Vite's `base` path if the page is served from a subfolder, is a separate task.
