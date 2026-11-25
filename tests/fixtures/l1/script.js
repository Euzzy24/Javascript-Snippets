// LEVEL 1: Click a button and do something

// 1. Select the elements we will use
const countEl   = document.querySelector('#count');
const clickBtn  = document.querySelector('#clickBtn');
const resetBtn  = document.querySelector('#resetBtn');
const themeBtn  = document.querySelector('#themeBtn');
const nameInput = document.querySelector('#nameInput');
const greetBtn  = document.querySelector('#greetBtn');
const greeting  = document.querySelector('#greeting');
const message   = document.querySelector('#message');

// 2. A variable that remembers how many clicks
let count = 0;

// 3. Show the number on the screen, with a small bounce
function showCount() {
  countEl.textContent = count;
  countEl.classList.remove('bump');
  void countEl.offsetWidth; // trick to restart the animation
  countEl.classList.add('bump');
}

// 4. Listen for clicks
clickBtn.addEventListener('click', () => {
  count++;
  showCount();
  if (count === 10) {
    showMessage('Ten clicks! You are on fire.');
  }
});

resetBtn.addEventListener('click', () => {
  count = 0;
  showCount();
  showMessage('Counter reset.');
});

themeBtn.addEventListener('click', () => {
  // toggle() adds the class if missing, removes it if present
  const isDark = document.body.classList.toggle('dark');
  themeBtn.textContent = isDark ? 'Light mode' : 'Dark mode';
});

// 5. Read what the user typed
function greet() {
  const name = nameInput.value.trim();

  if (name === '') {
    showMessage('Please type your name first.', true);
    nameInput.focus();
    return; // stop here
  }

  greeting.textContent = `Hello, ${name}!`;
  showMessage(`Nice to meet you, ${name}.`);
  nameInput.value = '';
}

greetBtn.addEventListener('click', greet);

nameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') greet();
});

// 6. One helper for messages (green = OK, red = error)
function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('error', isError);
}