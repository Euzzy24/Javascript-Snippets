// Lesson content: a Level 0 warm-up and five numbered levels. The snippet
// code itself lives in the lN/ folders as plain files (vanilla HTML/CSS/JS —
// keep it that way: the lesson teaches DOM APIs, not React).
import { normalise } from '../lib/snippetFiles.js';

import l0Html from './l0/body.html?raw';
import l0Css from './l0/style.css?raw';
import l0Js from './l0/script.js?raw';
import l1Html from './l1/body.html?raw';
import l1Css from './l1/style.css?raw';
import l1Js from './l1/script.js?raw';
import l2Html from './l2/body.html?raw';
import l2Css from './l2/style.css?raw';
import l2Js from './l2/script.js?raw';
import l3Html from './l3/body.html?raw';
import l3Css from './l3/style.css?raw';
import l3Js from './l3/script.js?raw';
import l4Html from './l4/body.html?raw';
import l4Css from './l4/style.css?raw';
import l4Js from './l4/script.js?raw';
import l5Html from './l5/body.html?raw';
import l5Css from './l5/style.css?raw';
import l5Js from './l5/script.js?raw';

// Injected into every demo iframe as text. Never import it as a module.
import demoFallbackRaw from './demoFallback.js?raw';

export const demoFallback = demoFallbackRaw.replace(/\r\n?/g, '\n');

const src = (html, css, js) => ({ html: normalise(html), css: normalise(css), js: normalise(js) });

export const levels = [
  {
    n: 0,
    key: 'l0',
    title: 'Level 0 - Click Anything',
    heading: 'Click anything, see JavaScript work',
    difficulty: 'Warm-up',
    meter: 0,
    url: 'click-anything.html',
    labLabel: 'warm-up',
    intro: <>Plain HTML items: a heading, a paragraph, a link, list items, a checkbox, a picture, a table and more. Each one gets a few lines of JavaScript, so every click changes something and writes a line in the log.</>,
    learn: ["addEventListener('click')", 'textContent', 'classList.toggle()', 'event.preventDefault()', 'querySelectorAll + forEach', 'event.currentTarget'],
    tryIt: [
      <>Add a <code>{'<blockquote>'}</code> and make it change colour when clicked.</>,
      <>Make the button stop counting at 10.</>,
      <>Which item would still open and close if you deleted script.js? Why?</>,
      <>Press Tab: you can't reach the paragraph. Add <code>tabindex="0"</code> and a <code>keydown</code> listener so Enter works too.</>,
    ],
    ...src(l0Html, l0Css, l0Js),
  },
  {
    n: 1,
    key: 'l1',
    title: 'Level 1 - Button Clicks',
    heading: 'Click a button and do something',
    difficulty: 'Easy',
    meter: 1,
    url: 'button-clicks.html',
    intro: <>The basic pattern behind every interactive page: find an element, listen for an event, then change something on the screen.</>,
    learn: ['querySelector()', "addEventListener('click')", 'textContent', 'classList.toggle()', 'input.value'],
    tryIt: [
      <>Add a <code>−1</code> button. How do you stop the count from going below 0?</>,
      <>Make the number turn orange once the count reaches 5.</>,
      <>Pressing Enter also greets you. Find the line that makes that happen.</>,
    ],
    ...src(l1Html, l1Css, l1Js),
  },
  {
    n: 2,
    key: 'l2',
    title: 'Level 2 - Post Reactions',
    heading: 'React to posts with likes and emoji',
    difficulty: 'Easy to medium',
    meter: 2,
    url: 'reactions.html',
    intro: <>One click listener on the whole feed handles every post. Each person gets one reaction per post: click it again to remove it, or pick another to switch.</>,
    learn: ['event delegation', 'event.target.closest()', 'data-* attributes', 'toggle state', 'aria-pressed'],
    tryIt: [
      <>Copy a fourth post into the HTML. Do you need to change the JavaScript? Why not?</>,
      <>Add a ❤️ reaction button to every post.</>,
      <>Show the total number of reactions under each post.</>,
    ],
    ...src(l2Html, l2Css, l2Js),
  },
  {
    n: 3,
    key: 'l3',
    title: 'Level 3 - Add to Cart',
    heading: 'Add to cart',
    difficulty: 'Medium',
    meter: 3,
    url: 'add-to-cart.html',
    intro: <>Products live in an array, not in the HTML. JavaScript draws them, and one <code>renderCart()</code> function redraws the cart every time something changes. Product photos come free from Unsplash and load in students' own browsers; this preview shows drawn stand-ins.</>,
    learn: ['arrays of objects', "map().join('')", 'find()', 'filter()', 'reduce()', 'render function'],
    tryIt: [
      <>Add a new product by editing only the <code>products</code> array.</>,
      <>Limit each item to a maximum of 5 in the cart.</>,
      <>Show "You get free shipping!" when the total reaches ₱500.</>,
    ],
    ...src(l3Html, l3Css, l3Js),
  },
  {
    n: 4,
    key: 'l4',
    title: 'Level 4 - Checkout',
    heading: 'Checking out',
    difficulty: 'Medium to hard',
    meter: 4,
    url: 'checkout.html',
    intro: <>A checkout form that checks every field, recalculates the total when the delivery option changes, accepts promo codes (try <code>STUDENT10</code> or <code>LESS50</code>), and prints a receipt.</>,
    learn: ['submit + preventDefault()', 'regex validation', 'radio buttons', 'computed totals', 'escaping user input'],
    tryIt: [
      <>Add a <code>FREESHIP</code> promo code that makes shipping free.</>,
      <>Disable Express delivery when the subtotal is under ₱200.</>,
      <>Why does the receipt use <code>escapeHTML()</code> on the name? Type <code>{'<b>Ana</b>'}</code> and see.</>,
    ],
    ...src(l4Html, l4Css, l4Js),
  },
  {
    n: 5,
    key: 'l5',
    title: 'Level 5 - Mini Shop',
    heading: 'Mini shop that remembers the cart',
    difficulty: 'Hard',
    meter: 5,
    url: 'mini-shop.html',
    labNote: ' · refresh keeps your cart',
    resetLabel: '↻ Refresh demo',
    fixedHeight: 640,
    intro: <>Everything together: search, category filters, sorting, stock limits, a slide-in cart, a checkout dialog and toast messages. The cart is saved in <code>localStorage</code>, so it survives a page refresh. Photos load from Unsplash when the code runs on its own; this preview shows drawn stand-ins.</>,
    learn: ['one state object', 'filter + sort', 'localStorage', 'JSON.stringify / parse', '<dialog>', 'debounce'],
    tryIt: [
      <>Refresh the demo: the cart is still there. Find the two functions responsible.</>,
      <>Save each finished order to an "Order history" list in localStorage.</>,
      <>Add a wishlist button that works like the cart but has no quantities.</>,
    ],
    ...src(l5Html, l5Css, l5Js),
  },
];
