---
title: "feat: Add Level 0 warm-up section — click any HTML item, see a JS effect"
type: feat
status: completed
date: 2026-11-25
---

# feat: Add Level 0 warm-up section — click any HTML item, see a JS effect

## Overview

Add a new first section, **Level 0 · Click anything**. It is a small page of everyday HTML elements (heading, paragraph, button, link, list items, checkbox, image-like figure, table row, details/summary). Clicking any of them runs one short JavaScript effect and writes a line to a "What JavaScript just did" log. It does not need to be a working app. The goal is to show, in the simplest form, that JavaScript can hook onto **any** HTML element.

It works like the existing levels: live demo, `page.html` / `style.css` / `script.js` tabs, copy buttons, "Try it" list. It is styled like the other levels (card look) and the snippet stays vanilla.

## Problem Frame

Level 1 already mixes several ideas: a counter, reset, dark mode, input value, and the Enter key. Beginners need a step before it that teaches one idea only: *select an element, listen for a click, change something*, repeated across many element types so the pattern sticks.

## Requirements Trace

- R1. A new section appears **before** Level 1, numbered `00`, labelled as a warm-up, with the same structure as the other levels (heading, difficulty, intro, learn chips, live demo, code tabs, copy buttons, Try it).
- R2. The demo shows at least 8 different plain HTML elements. Each one, when clicked, produces a visible JS effect **and** a log line naming the element and the effect.
- R3. The snippet is vanilla HTML/CSS/JS, beginner-readable (one small, commented listener per element, no frameworks, no delegation tricks), and styled like Levels 1–5.
- R4. Existing Levels 1–5 are unchanged: same numbers, ids (`level-1`…`level-5`), "level N of 5" labels, and byte-identical copy and demo output (their 25 snapshots do not change).
- R5. The nav, hero copy and tests account for the new section.

## Scope Boundaries

- No changes to the Level 1–5 snippet files or their snapshots.
- No changes to `src/levels/demoFallback.js`, because a change there would alter every existing `demo.html` snapshot. Level 0 therefore uses no external images.
- No new shell features (no new tab types, no new components beyond what the level needs).
- `src/components/TopNav.jsx` (recently edited by the user) is not touched.

## Context & Research

### Relevant Code and Patterns

- `src/levels/index.jsx`: an ordered array of level objects (`n`, `key`, `title`, `heading`, `difficulty`, `meter`, `url`, optional `labNote` / `resetLabel` / `fixedHeight`, `intro`, `learn`, `tryIt`, and the raw sources through `?raw` + `normalise`). Level 0 is added here as the first entry.
- `src/levels/l1/`: the closest pattern for the snippet. A `.card` layout with a `system-ui` font, a `#f1f7f5` background, the `#0f7b6c`-family button colours, a `body.dark` variant, and commented `querySelector` + `addEventListener` code. Level 0 mirrors its look and comment style.
- `src/components/Level.jsx`: renders `pad(n)`, the meter with `total` bars, and the lab label `level {n} of {total}{labNote}`. **`total` is currently `levels.length`**, as passed by `src/App.jsx`. With 6 entries every label would become "of 6", which breaks R4.
- `src/components/SectionNav.jsx`: a `LABELS` map keyed by level key, and ids built as `level-${n}`.
- `src/components/Hero.jsx`: the lede says "Five working examples…".
- `tests/parity.test.js`: file snapshots per level under `tests/fixtures/<key>/`. Vitest writes a snapshot file that is missing when it is not in CI mode. Existing ones are compared byte for byte.
- `tests/snippetFiles.test.js`, `tests/SectionNav.test.jsx`, `tests/Level.test.jsx`: these hard-code the five keys and ids, and the "five" wording.

### Institutional Learnings

- From plan 001: the snippet files must stay LF and must never contain `</script`, which a guard test enforces. Vitest needs `css.include` for `src/levels/` (already set) so that `style.css?raw` is not empty.

### External References

- None needed.

## Key Technical Decisions

- **Key `l0`, `n: 0`, id `level-0`, shown as `00`**: no renumbering, so R4 holds with zero churn in the existing snapshots.
- **The lab label for Level 0 reads "warm-up" instead of "N of total"**: an optional `labLabel` field. When it is set, Level renders `level 0 · warm-up` instead of `level {n} of {total}`. This is preferred over "level 0 of 5", which reads oddly.
- **`total` = number of numbered levels (`n >= 1`), not `levels.length`**: computed once in `App` (or exported from the level data) and passed to `Level`. Levels 1–5 keep "of 5", and the meter keeps 5 bars.
- **Difficulty "Warm-up", meter 0 filled bars**: this sets it visibly below Level 1 ("Easy", 1 bar). If the empty meter looks broken in the browser check, fall back to 1 bar (see Deferred to Implementation).
- **One listener per element, no event delegation**: delegation is Level 2's lesson. Each block is 3–6 lines with a comment naming the element, so students can delete or copy any one block on its own.
- **A shared `log(message)` helper** prepends a line to an on-page `<ol id="log" role="log">` (role `log` is announced politely by screen readers). Newest lines go first, and the list keeps the **5** most recent lines, dropping older ones. The log starts with one placeholder line, "Nothing yet. Click something above.", which the first `log()` call removes. The log has a `min-height` big enough for 5 lines, so the demo does not grow while you click. This gives every click visible proof even when the effect itself is subtle. It is the only "helper" in the snippet.
- **Click-only, on purpose (user decision)**: the listeners are `click` only. Five items (`h2`, `p`, `li`, `figure`, `tr`) are not focusable, so keyboard users cannot reach them. The script header comment says so plainly: "these only work with a mouse or touch; real buttons and links also work with the keyboard". One Try-it task asks students to fix one item with `tabindex="0"` and an Enter-key listener. That turns the gap into a lesson without doubling the code.
- **Visible "clickable" cue beyond the cursor**: every clickable item gets a light hover background and a dashed outline. Real controls keep a `:focus-visible` ring. This keeps touch users from missing items, because `cursor: pointer` does not show on touch screens.
- **State is not shown by colour alone**: each toggled effect also changes text or adds a symbol. Done list items get a "✓ " prefix along with the strike-through, and the selected row's first cell gets "▶ ". The log line also names the new state.
- **No dark mode**: Level 1's `body.dark` rules are not copied, because nothing in Level 0 turns them on.
- **Exact behaviour per item** (to remove ambiguity):
  - The heading cycles through 3 texts and wraps back to the first.
  - The figure toggles between big and normal on each click.
  - The link's message goes to the log only.
  - The checkbox listener sits on the `<input>`, not on a wrapping `<label>`, which would fire twice. A `<label for>` next to it lets a click on the text also toggle it, which counts as one click event on the input.
  - List items and table rows use `event.currentTarget` (not `this`, which is undefined inside arrow functions).
- **`<details>` gets a visible JS effect too**: a click listener on `<summary>` changes the summary text ("Show the secret" ↔ "Hide the secret") and logs the new state. The click handler runs **before** the browser opens or closes the element, so the code reads `const willOpen = !details.open`. A comment explains this as the one surprise in the level: "HTML does the opening; our click runs just before it". This satisfies R2 and stays a click listener.
- **No external images**: the "picture" item is a `<figure>` holding a large emoji and a `<figcaption>`. This avoids touching `demoFallback.js` (see Scope Boundaries) and keeps the demo offline-safe.
- **Effects chosen to show different DOM APIs, one each**, so the level doubles as a tour:

| Element | Click effect | API shown |
|---|---|---|
| `<h2>` heading | cycles through 3 greeting texts | `textContent` |
| `<p>` paragraph | toggles a yellow highlight | `classList.toggle()` |
| `<button>` | counts clicks on its own label | variable + `textContent` |
| `<a href="#">` link | stays on the page and says why | `event.preventDefault()` |
| `<li>` list items (3) | strike-through / un-strike the clicked item | `this` / `event.currentTarget` + `classList` |
| `<input type="checkbox">` | its label switches "off" ↔ "on" | `.checked` |
| `<figure>` emoji "picture" | grows, then shrinks back on the next click | `style.transform` |
| `<tr>` table row | selected row highlighted, others cleared | `querySelectorAll` + `forEach` |
| `<details>`/`<summary>` | HTML opens/closes; JS swaps the summary text and logs the new state | reading `.open` (it is the **old** state inside the click handler) |

  The table row and list items use a small `forEach` loop to attach the same listener to several elements. This is the one loop in the snippet, and it is commented as "same listener on each item".

## Open Questions

### Resolved During Planning

- Placement and numbering → Level 0 before Level 1, existing levels unchanged (user choice).
- Look → styled like the other levels (user choice).
- Images → none from outside; an emoji figure instead (protects the existing demo snapshots).
- Keyboard access for non-interactive items → click-only on purpose, with a comment and a Try-it task (user choice).
- "The nav" in R5 means the in-page section nav (`SectionNav`), not `TopNav`.

### Deferred to Implementation

- Exact greeting texts, emoji and log wording: content polish while writing.
- Meter showing 0 vs 1 filled bars: decide after the browser check.
- Whether the demo needs a `fixedHeight`: the auto-fit (220–1600px) should handle it. Add one only if the log growing causes visible jumping.

## Output Structure

    src/levels/l0/
    ├── body.html
    ├── style.css
    └── script.js
    tests/fixtures/l0/
    ├── page.html
    ├── style.css
    ├── script.js
    ├── single.html
    └── demo.html          # written by the first test run, then reviewed

## Implementation Units

- [x] **Unit 1: Write the Level 0 snippet**

**Goal:** The plain-HTML page with a click effect on every item, styled like the other levels.

**Requirements:** R2, R3

**Dependencies:** None

**Files:**
- Create: `src/levels/l0/body.html`, `src/levels/l0/style.css`, `src/levels/l0/script.js`

**Approach:**
- `body.html`: a `.card` containing a short instruction line ("Click anything below"), then the items from the Key Technical Decisions table, then an `<ol id="log">` under a "What JavaScript just did" heading. Use semantic elements and give each an `id` (or a class for groups) for `querySelector`. Every item gets `cursor: pointer` through CSS so it looks clickable.
- `style.css`: copy the Level 1 base (body, `.card`, buttons, fonts, colours) **without** the `body.dark` rules. Add:
  - a `.clickable` hover background and dashed outline cue, and a `:focus-visible` ring for real controls;
  - the classes the JS toggles (`.highlight`, `.done`, `.selected`, `.big`);
  - the log styling, with a `min-height` for 5 lines;
  - a table that fits the card width on mobile (full width, compact cells), and tap targets of at least about 40px tall.

  Keep it short.
- `script.js`: a header comment ("LEVEL 0: Click anything. Every block below is the same 3 steps: find, listen, change"). The `log()` helper comes first, then one commented block per element, in the same order as the page.
- No `</script`. LF line endings. No external URLs.

**Patterns to follow:**
- `src/levels/l1/body.html`, `style.css`, `script.js` for structure, comment voice and colours.

**Test scenarios:**
- Error path: the existing guard ("no snippet contains `</script`") covers `l0` automatically once it is in the level data (Unit 2).
- Integration: covered by the Unit 3 browser check (each element's effect and log line). The snippet has no unit tests of its own; demo behaviour tests stay deferred, as in plan 001.

**Verification:**
- Opening the three files as a standalone page (a copy of "Copy as one HTML file" saved to disk) works: each of the 9 element types gives its effect and a log line, and there are no console errors.

---

- [x] **Unit 2: Wire Level 0 into the page shell**

**Goal:** Level 0 renders first, with a warm-up label, without changing anything about Levels 1–5.

**Requirements:** R1, R4, R5

**Dependencies:** Unit 1

**Files:**
- Modify: `src/levels/index.jsx` (new first entry `l0` with raw imports; update the "five levels" header comment)
- Modify: `src/components/Level.jsx` (optional `labLabel`)
- Modify: `src/App.jsx` (`total` = count of levels with `n >= 1`)
- Modify: `src/components/SectionNav.jsx` (`l0: 'Click anything'`)
- Modify: `src/components/Hero.jsx` (lede mentions the warm-up, e.g. "A warm-up and five working examples…")
- Modify: `README.md` (levels list / folder table mention `l0`)
- Modify: `tests/CodeBox.test.jsx`. It currently takes Level 1 as `levels[0]`, which would become `l0` and break about 10 tests. Look Level 1 up by key instead.
- Modify: `tests/snippetFiles.test.js` and `tests/SectionNav.test.jsx`: update the hard-coded key/id lists and the "five" test names.
- Modify: `tests/Level.test.jsx`: add the `l0` assertions and the App-level label assertions.
- Test: `tests/parity.test.js`: no code change; the first run creates the new `l0` snapshots.

**Approach:**
- Level data for `l0`:
  - `n: 0`, `key: 'l0'`, `title: 'Level 0 - Click Anything'`, `heading` along the lines of "Click anything, see JavaScript work", `difficulty: 'Warm-up'`, `meter: 0`, `url: 'click-anything.html'`, `labLabel: 'warm-up'`.
  - `intro`, `learn` chips (`addEventListener('click')`, `textContent`, `classList.toggle()`, `event.preventDefault()`, `style`, `forEach`), and 4 `tryIt` items. Examples:
    - "Add a `<blockquote>` and make it change colour when clicked."
    - "Make the button stop counting at 10."
    - "Which item would still open and close if you deleted script.js? Why?"
    - "Press Tab: you can't reach the paragraph. Add `tabindex="0"` and a `keydown` listener so Enter works too."
- `Level.jsx`: when `level.labLabel` is set, the lab label renders `level {n} · {labLabel}`. Otherwise nothing changes.
- `App.jsx`: compute `total` in `App` (not in the level data) from the levels with `n >= 1` (5), and pass it to each `Level`.
- If the shell has the `CI` environment variable set, the first run fails on the missing `l0` snapshots instead of writing them. In that case, create them with the `l0`-filtered update run described in Unit 3. The meter bar count stays 5 for every level.
- First test run in non-CI mode writes the `tests/fixtures/l0/*` snapshots. **Before accepting them, confirm the existing 25 snapshot files are byte-unchanged.** Then read the new `l0` snapshots once (they are what students will copy).

**Patterns to follow:**
- The existing `l5` entry for optional fields (`labNote`, `resetLabel`, `fixedHeight`).

**Test scenarios:**
- Happy path (`tests/Level.test.jsx`): rendering `l0` gives section id `level-0`, number `00`, heading text, difficulty "Warm-up", 5 meter bars with 0 `on`, and a lab label reading `level 0 · warm-up` (no "of").
- Happy path: the `l0` learn chips render 6 items, its intro is present, and it has 4 Try-it items.
- Regression (`tests/CodeBox.test.jsx`): with `l0` first in the data, every CodeBox test still targets Level 1 (`l1-tab-0`, "Level 1 - Button Clicks files", l1 fixtures).
- Edge case (R4): in the full `App`, Level 1's lab label still reads `level 1 of 5` and Level 5's reads `level 5 of 5 · refresh keeps your cart` (guards against `total` becoming 6).
- Happy path (`tests/snippetFiles.test.js`): the level keys are `['l0','l1','l2','l3','l4','l5']` in order, all with non-empty html/css/js. The `</script` guard now also covers `l0`.
- Happy path (`tests/SectionNav.test.jsx`): the observer targets are `level-0`…`level-5`. When `level-0` reports intersecting, the "00Click anything" link gets `on`.
- Integration (`tests/parity.test.js`): `l0` page.html, style.css, script.js, single.html and demo.html snapshots exist and pass. All 25 existing snapshots pass **unchanged**.
- Happy path (App shell test): the anchor ids include `level-0` inside `<main>`, before `level-1`.

**Verification:**
- The full suite is green, `tests/fixtures/l1`–`l5` are untouched, and 5 new files exist in `tests/fixtures/l0/`.

---

- [x] **Unit 3: Browser check and polish**

**Goal:** Confirm the section looks like the other levels and every click works inside the live demo.

**Requirements:** R1, R2, R3

**Dependencies:** Unit 2

**Files:**
- Modify (only if needed): `src/levels/l0/*`, `src/levels/index.jsx` (meter 0 → 1, `fixedHeight`)
- If the meter moves to 1, update the matching `l0` meter assertion in `tests/Level.test.jsx` in the same change.
- After any `l0` snippet edit, refresh **only** the `l0` snapshots (run update mode for the parity test filtered to `l0`, not the whole suite). Then confirm `tests/fixtures/l1`–`l5` are byte-unchanged (compare hashes; there is no git) and review the `l0` diff.

**Approach:**
- Run the dev server and check at desktop and mobile widths, in light and dark OS themes:
  - The Level 0 card matches the look of Level 1.
  - Clicking each of the 9 element types gives its effect plus a log line.
  - The `<details>` log line matches what is on screen (open ↔ "opened").
  - A click on the checkbox's label text logs only once.
  - "↻ Reset demo" clears everything back to the start.
  - The code tabs and both copy buttons work.
  - The nav shows "00 Click anything" first and highlights it on scroll.
- Decide the deferred questions: meter 0 vs 1, and whether `fixedHeight` is needed.

**Test expectation:** none beyond Unit 2. This unit is a visual and interaction check.

**Verification:**
- No console errors. Every element responds. The page above and below Level 0 is visually unchanged.

## System-Wide Impact

- **Interaction graph:** `levels` → `App` (`total`) → `Level` (label, meter) → `DemoFrame` / `CodeBox`. `SectionNav` gets a sixth link. The `total` change is the one shared-surface edit, and the R4 edge-case test guards it.
- **State lifecycle risks:** none. The Level 0 demo keeps state in memory only (no localStorage), and Reset reloads it clean.
- **Unchanged invariants:** the Level 1–5 snippet files, their 25 snapshots, ids, labels and numbering; `demoFallback.js`; `TopNav.jsx`.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| `total` regression turns every label into "of 6" | `App` computes the numbered-level count. A test checks "level 1 of 5" and "level 5 of 5 · …". |
| The first test run silently rewrites an existing snapshot | Never run in update mode in Unit 2. Missing files are written, but mismatches still fail. Check that `l1`–`l5` fixture files are unchanged before moving on. |
| The snippet grows too big for a "simple" lesson | One block per element, 3–6 lines each. The target is a `script.js` around 80–110 lines including comments. Trim items if it goes over. |
| Empty meter (0 bars) looks like a bug | Browser check in Unit 3, with a fallback to 1 bar. |
| `<details>` toggles natively, which may confuse students ("is this JS?"), and `.open` holds the old state inside the click handler | JS adds its own visible effect (summary text). The code reads `!details.open` with a comment. The browser check confirms the log matches the screen. The third Try-it item asks the question directly. |
| Teaching click handlers on non-focusable elements | A deliberate, commented choice plus a Try-it task to add keyboard support (user decision). |

## Documentation / Operational Notes

- Add `l0` to the README "Where things live" section. Nothing else changes for deployment.

## Sources & References

- Prior plan: `docs/plans/2026-11-25-001-refactor-react-vite-lesson-shell-plan.md`
- Pattern: `src/levels/l1/`, `src/levels/index.jsx`, `src/components/Level.jsx`, `src/App.jsx`

## Implementation Notes (2026-11-25)

- **Meter stays at 0 bars.** In the browser it reads as an intentional "warm-up" next to Level 1's single bar.
- **No `fixedHeight`.** Auto-fit handles it. The log's `min-height` was raised to 10.5em, so it no longer grows when it fills to 5 lines (147px empty and full).
- **Turtle "big" effect uses `font-size`, not `transform: scale`.** Scaling overlapped the caption; a font-size change reflows the layout.
- **Checks:**
  - 74 tests pass. 5 `l0` snapshots were written, then 3 were refreshed with an `l0`-filtered update. The `l1`–`l5` fixture hashes are identical before and after.
  - In Chrome, all 9 items gave their effect and a log line, with no errors. The `<details>` log matches the screen, and a click on the checkbox label logs once. Labels read "level 0 · warm-up" and "level 1 of 5"; the nav lists "00 Click anything" first.
