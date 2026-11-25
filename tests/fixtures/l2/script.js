// LEVEL 2: Reacting with likes and emoji

// ONE listener on the whole feed handles every post.
// This is called "event delegation".
const feed = document.querySelector('.feed');

feed.addEventListener('click', (event) => {
  // closest() finds the button even if you clicked the emoji or number inside it
  const likeBtn = event.target.closest('.like-btn');
  if (likeBtn) {
    toggleLike(likeBtn);
    return;
  }

  const reactBtn = event.target.closest('.react');
  if (reactBtn) {
    react(reactBtn);
  }
});

// ---- Likes: click once to like, click again to unlike ----
function toggleLike(button) {
  const post = button.closest('.post');
  const countEl = post.querySelector('.like-count');

  const isLiked = button.classList.toggle('liked');
  const count = Number(countEl.textContent);

  countEl.textContent = isLiked ? count + 1 : count - 1;
  button.textContent = isLiked ? '♥ Liked' : '♡ Like';
  button.setAttribute('aria-pressed', isLiked);
}

// ---- Reactions: only ONE reaction per post ----
function react(button) {
  const post = button.closest('.post');
  const current = post.querySelector('.react.active'); // my old reaction (or null)

  // 1. Remove my old reaction, if I had one
  if (current) {
    changeCount(current, -1);
    current.classList.remove('active');
  }

  // 2. If I clicked a different emoji, add the new one
  //    (if I clicked the same one, it stays removed)
  if (current !== button) {
    changeCount(button, +1);
    button.classList.add('active');
  }

  updateSummary(post);
}

function changeCount(button, amount) {
  const num = button.querySelector('.num');
  num.textContent = Number(num.textContent) + amount;
}

function updateSummary(post) {
  const active = post.querySelector('.react.active');
  const summary = post.querySelector('.summary');
  // dataset.emoji reads the data-emoji="..." attribute
  summary.textContent = active ? `You reacted ${active.dataset.emoji}` : '';
}