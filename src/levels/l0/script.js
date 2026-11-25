// LEVEL 0: Click anything
// Every block below does the same 3 steps:
//   1. FIND the element      (querySelector)
//   2. LISTEN for a click    (addEventListener)
//   3. CHANGE something      (text, class or style)
//
// Note: headings, paragraphs, list items, pictures and table rows only
// react to a mouse or touch. Real buttons and links also work with the
// keyboard (Tab, then Enter). See the "Try it" ideas to fix that.

// ---------- The log: writes what JavaScript just did ----------
const logList = document.querySelector('#log');

function log(message) {
  const empty = logList.querySelector('.empty');
  if (empty) empty.remove();            // first click: drop "Nothing yet"

  const item = document.createElement('li');
  item.textContent = message;
  logList.prepend(item);                // newest line on top

  if (logList.children.length > 5) {    // keep only the last 5 lines
    logList.lastElementChild.remove();
  }
}

// 1. Heading: change its text
const title = document.querySelector('#title');
const greetings = ['Hello!', 'Kumusta!', 'Hi there!'];
let greetingIndex = 0;

title.addEventListener('click', () => {
  greetingIndex = (greetingIndex + 1) % greetings.length;  // 0, 1, 2, 0, ...
  title.textContent = greetings[greetingIndex];
  log('<h2> heading: text is now "' + title.textContent + '"');
});

// 2. Paragraph: switch a class on and off
const note = document.querySelector('#note');

note.addEventListener('click', () => {
  const isOn = note.classList.toggle('highlight');
  log('<p> paragraph: highlight ' + (isOn ? 'on' : 'off'));
});

// 3. Button: count the clicks
const countBtn = document.querySelector('#countBtn');
let clicks = 0;

countBtn.addEventListener('click', () => {
  clicks = clicks + 1;
  countBtn.textContent = 'Clicked ' + clicks + ' times';
  log('<button>: clicked ' + clicks + ' times');
});

// 4. Link: stop it from leaving the page
const link = document.querySelector('#link');

link.addEventListener('click', (event) => {
  event.preventDefault();               // the browser does NOT follow the link
  log('<a> link: stayed on the page (preventDefault)');
});

// 5. List items: the same listener on each item
const todos = document.querySelectorAll('.todo li');

todos.forEach((li) => {
  li.addEventListener('click', (event) => {
    const item = event.currentTarget;   // the <li> that was clicked
    const isDone = item.classList.toggle('done');
    const text = item.textContent.replace('✓ ', '');
    item.textContent = isDone ? '✓ ' + text : text;
    log('<li> "' + text + '": ' + (isDone ? 'done' : 'not done'));
  });
});

// 6. Checkbox: read .checked and update the label
const lights = document.querySelector('#lights');
const lightsLabel = document.querySelector('#lightsLabel');

lights.addEventListener('click', () => {
  lightsLabel.textContent = lights.checked ? 'Lights are on' : 'Lights are off';
  log('<input type="checkbox">: checked is ' + lights.checked);
});

// 7. Picture: change its size with a class
const picture = document.querySelector('#picture');

picture.addEventListener('click', () => {
  const isBig = picture.classList.toggle('big');
  log('<figure> turtle: ' + (isBig ? 'big' : 'normal size'));
});

// 8. Table rows: highlight the clicked row, clear the others
const rows = document.querySelectorAll('tbody tr');

rows.forEach((row) => {
  row.addEventListener('click', (event) => {
    const clicked = event.currentTarget;
    rows.forEach((r) => {
      r.classList.remove('selected');
      r.cells[0].textContent = r.cells[0].textContent.replace('▶ ', '');
    });
    clicked.classList.add('selected');
    clicked.cells[0].textContent = '▶ ' + clicked.cells[0].textContent;
    log('<tr> row: selected ' + clicked.cells[0].textContent.replace('▶ ', ''));
  });
});

// 9. Details: HTML opens and closes it by itself.
// Our click runs just BEFORE the browser opens or closes it,
// so .open still holds the old state here. That's why we use !secret.open.
const secret = document.querySelector('#secret');
const secretSummary = document.querySelector('#secretSummary');

secretSummary.addEventListener('click', () => {
  const willOpen = !secret.open;
  secretSummary.textContent = willOpen ? 'Hide the secret' : 'Show the secret';
  log('<details>: ' + (willOpen ? 'opened' : 'closed') + ' (HTML did the opening)');
});
