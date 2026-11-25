// LEVEL 4: Checking out

// 1. DATA: the cart from Level 3 (fixed here to keep things simple)
const cart = [
  { name: 'Spiral Notebook', price: 45,  qty: 3 },
  { name: 'Tumbler 500ml',   price: 299, qty: 1 },
  { name: 'Sticky Notes Pack', price: 85,  qty: 2 },
];

const SHIPPING = { standard: 50, express: 120, pickup: 0 };

const PROMOS = {
  STUDENT10: { type: 'percent', value: 10, label: '10% student discount' },
  LESS50:    { type: 'fixed',   value: 50, label: '₱50 off your order' },
};

let appliedPromo = null;

// 2. ELEMENTS
const form          = document.querySelector('#checkoutForm');
const summary       = document.querySelector('#summary');
const receipt       = document.querySelector('#receipt');
const summaryItems  = document.querySelector('#summaryItems');
const promoInput    = document.querySelector('#promoInput');
const promoMsg      = document.querySelector('#promoMsg');
const placeOrderBtn = document.querySelector('#placeOrder');

// 3. HELPERS
const peso = (n) =>
  '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Never put user text into innerHTML without escaping it
function escapeHTML(text) {
  return text.replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

const checked = (name) => document.querySelector(`input[name="${name}"]:checked`);

// 4. COMPUTE THE TOTALS
function getTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  let discount = 0;
  if (appliedPromo) {
    const promo = PROMOS[appliedPromo];
    discount = promo.type === 'percent'
      ? subtotal * promo.value / 100
      : Math.min(promo.value, subtotal);
  }

  const shipping = SHIPPING[checked('shipping').value];
  const total = subtotal - discount + shipping;
  return { subtotal, discount, shipping, total };
}

function renderSummary() {
  summaryItems.innerHTML = cart.map((item) => `
    <li><span>${item.qty} × ${item.name}</span><span>${peso(item.price * item.qty)}</span></li>
  `).join('');

  const t = getTotals();
  document.querySelector('#subtotal').textContent = peso(t.subtotal);
  document.querySelector('#discount').textContent = t.discount ? '−' + peso(t.discount) : peso(0);
  document.querySelector('#shipping').textContent = t.shipping ? peso(t.shipping) : 'Free';
  document.querySelector('#total').textContent    = peso(t.total);
  placeOrderBtn.textContent = `Place order · ${peso(t.total)}`;
}

// Re-compute when the delivery option changes
form.addEventListener('change', (event) => {
  if (event.target.name === 'shipping') renderSummary();
});

// 5. PROMO CODES
function applyPromo() {
  const code = promoInput.value.trim().toUpperCase();

  if (PROMOS[code]) {
    appliedPromo = code;
    promoMsg.textContent = `Applied: ${PROMOS[code].label}`;
    promoMsg.className = 'hint ok';
  } else {
    appliedPromo = null;
    promoMsg.textContent = code ? 'That code is not valid.' : 'Type a code first.';
    promoMsg.className = 'hint bad';
  }
  renderSummary();
}

document.querySelector('#applyPromo').addEventListener('click', applyPromo);
promoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') applyPromo();
});

// 6. VALIDATION: each rule returns true, or an error message
const rules = {
  fullName: (v) => v.length >= 2 || 'Please enter your full name.',
  email:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email, like ana@school.edu.ph',
  phone:    (v) => /^09\d{9}$/.test(v) || 'Use 11 digits starting with 09.',
  address:  (v) => v.length >= 10 || 'Please enter your complete address.',
};

function validateField(input) {
  const result = rules[input.id](input.value.trim());
  const errorEl = input.parentElement.querySelector('.error');

  if (result === true) {
    input.classList.remove('invalid');
    errorEl.textContent = '';
    return true;
  }
  input.classList.add('invalid');
  errorEl.textContent = result;
  return false;
}

// Check each field when the user leaves it
Object.keys(rules).forEach((id) => {
  document.getElementById(id).addEventListener('blur', (e) => validateField(e.target));
});

// 7. SUBMIT
form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page from reloading

  const results = Object.keys(rules).map((id) => validateField(document.getElementById(id)));
  if (!results.every(Boolean)) {
    form.querySelector('.invalid').focus(); // jump to the first problem
    return;
  }

  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = 'Processing…';
  setTimeout(showReceipt, 1000); // pretend we are talking to a server
});

// 8. RECEIPT
function showReceipt() {
  const t = getTotals();
  const orderNo = 'ORD-' + Date.now().toString().slice(-6);
  const name  = escapeHTML(document.getElementById('fullName').value.trim());
  const email = escapeHTML(document.getElementById('email').value.trim());

  receipt.innerHTML = `
    <h2>Order confirmed</h2>
    <p>Thank you, <strong>${name}</strong>! Your order number is <strong>${orderNo}</strong>.</p>
    <ul class="receipt-items">
      ${cart.map((i) => `<li><span>${i.qty} × ${i.name}</span><span>${peso(i.price * i.qty)}</span></li>`).join('')}
    </ul>
    <dl class="totals">
      <div><dt>Discount</dt><dd>−${peso(t.discount)}</dd></div>
      <div><dt>Shipping</dt><dd>${t.shipping ? peso(t.shipping) : 'Free'}</dd></div>
      <div class="grand"><dt>Total paid</dt><dd>${peso(t.total)}</dd></div>
    </dl>
    <p class="hint">Delivery: ${checked('shipping').dataset.label} · Payment: ${checked('payment').value}<br>
    A confirmation will be sent to ${email}.</p>
    <button type="button" id="newOrder" class="primary">Start a new order</button>
  `;

  form.hidden = true;
  summary.hidden = true;
  receipt.hidden = false;
  document.querySelector('#newOrder').addEventListener('click', resetCheckout);
}

function resetCheckout() {
  form.reset();
  appliedPromo = null;
  promoInput.value = '';
  promoMsg.textContent = '';
  placeOrderBtn.disabled = false;
  form.hidden = false;
  summary.hidden = false;
  receipt.hidden = true;
  renderSummary();
}

// 9. START
renderSummary();
