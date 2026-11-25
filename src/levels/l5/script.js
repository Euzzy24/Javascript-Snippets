// LEVEL 5: Mini shop (search, filter, sort, stock, saved cart, checkout)
// PRODUCT PHOTOS
// For this demo, we just used unsplash but ofcourse you can use your own images.
// The "photo" function below builds a URL for each photo, and the "pictures" object stores them in a way that makes it easy to assign to each product. You can replace the Unsplash URLs with your own image paths if you like.
// You can save yours in an "images" folder and write
// image: 'images/notebook.jpg' in the products list instead.
const photo = (id) =>
  `https://images.unsplash.com/${id}?w=400&h=275&fit=crop&auto=format&q=70`;

const pictures = {
  notebook: photo("photo-1562217199-6e6d4cd031f5"),
  pens: photo("photo-1567855354833-ac2c4f967b0c"),
  calculator: photo("photo-1511377107391-116a9d5d20b5"),
  usb: photo("photo-1581068466660-e6585b8afa97"),
  earphones: photo("photo-1555679792-6783ef0bbf61"),
  powerbank: photo("photo-1587133454235-762b65c9f5c0"),
  notes: photo("photo-1683739147682-607fb8e24e3f"),
  tumbler: photo("photo-1544003484-3cd181d17917"),
  hoodie: photo("photo-1547954569-06aabe3b39b1"),
};

// ========== 1. DATA ==========
const products = [
  {
    id: 1,
    name: "Spiral Notebook",
    category: "Supplies",
    price: 45,
    stock: 20,
    image: pictures.notebook,
  },
  {
    id: 2,
    name: "Ballpen Set (5)",
    category: "Supplies",
    price: 60,
    stock: 15,
    image: pictures.pens,
  },
  {
    id: 3,
    name: "Scientific Calculator",
    category: "Supplies",
    price: 650,
    stock: 4,
    image: pictures.calculator,
  },
  {
    id: 4,
    name: "USB Flash Drive 32GB",
    category: "Gadgets",
    price: 250,
    stock: 8,
    image: pictures.usb,
  },
  {
    id: 5,
    name: "Wired Earphones",
    category: "Gadgets",
    price: 199,
    stock: 6,
    image: pictures.earphones,
  },
  {
    id: 6,
    name: "Power Bank 10000mAh",
    category: "Gadgets",
    price: 899,
    stock: 3,
    image: pictures.powerbank,
  },
  {
    id: 7,
    name: "Sticky Notes Pack",
    category: "Supplies",
    price: 85,
    stock: 25,
    image: pictures.notes,
  },
  {
    id: 8,
    name: "Tumbler 500ml",
    category: "Merch",
    price: 299,
    stock: 5,
    image: pictures.tumbler,
  },
  {
    id: 9,
    name: "Campus Hoodie",
    category: "Merch",
    price: 750,
    stock: 0,
    image: pictures.hoodie,
  },
];

// ========== 2. STATE (everything that can change) ==========
const STORAGE_KEY = "campusShopCart";

const state = {
  search: "",
  category: "All",
  sort: "featured",
  cart: loadCart(), // [{ id, qty }]
};

// ========== 3. ELEMENTS ==========
const $ = (selector) => document.querySelector(selector);
const grid = $("#productGrid");
const categories = $("#categories");
const resultInfo = $("#resultInfo");
const cartCount = $("#cartCount");
const cartItems = $("#cartItems");
const subtotalEl = $("#subtotal");
const drawer = $("#cartDrawer");
const overlay = $("#overlay");
const checkoutBtn = $("#checkoutBtn");
const dialog = $("#checkoutDialog");
const form = $("#checkoutForm");
const orderDone = $("#orderDone");
const toast = $("#toast");

// ========== 4. HELPERS ==========
const peso = (n) =>
  "₱" +
  n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const findProduct = (id) => products.find((p) => p.id === id);
const cartItem = (id) => state.cart.find((i) => i.id === id);
const qtyInCart = (id) => (cartItem(id) ? cartItem(id).qty : 0);

function escapeHTML(text) {
  return text.replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ],
  );
}

function getSubtotal() {
  return state.cart.reduce(
    (sum, i) => sum + findProduct(i.id).price * i.qty,
    0,
  );
}

// localStorage only stores text, so we use JSON
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
  } catch (error) {
    // storage may be blocked (private mode); the shop still works
  }
}

// Wait until the user stops typing before searching
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

// ========== 5. RENDER ==========
function getVisibleProducts() {
  const term = state.search.toLowerCase();

  let list = products.filter(
    (p) =>
      (state.category === "All" || p.category === state.category) &&
      p.name.toLowerCase().includes(term),
  );

  // [...list] makes a copy so we never re-order the original array
  if (state.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (state.sort === "name")
    list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function renderCategories() {
  const names = ["All", ...new Set(products.map((p) => p.category))];
  categories.innerHTML = names
    .map(
      (name) => `
    <button class="chip ${name === state.category ? "active" : ""}" data-category="${name}">${name}</button>
  `,
    )
    .join("");
}

function renderProducts() {
  const list = getVisibleProducts();
  resultInfo.textContent = `Showing ${list.length} of ${products.length} products`;

  if (list.length === 0) {
    grid.innerHTML = `<p class="empty">No products match "${escapeHTML(state.search)}".</p>`;
    return;
  }

  grid.innerHTML = list
    .map((p) => {
      const inCart = qtyInCart(p.id);
      const left = p.stock - inCart;

      let label = "Add to cart";
      if (p.stock === 0) label = "Out of stock";
      else if (left === 0) label = "All in your cart";

      return `
      <article class="product">
        <img class="thumb" src="${p.image}" alt="${p.name}">
        ${inCart ? `<span class="in-cart">${inCart} in cart</span>` : ""}
        <span class="cat">${p.category}</span>
        <h3>${p.name}</h3>
        <p class="price">${peso(p.price)}</p>
        <p class="stock ${p.stock <= 3 ? "low" : ""}">
          ${p.stock === 0 ? "Sold out" : `${p.stock} in stock`}
        </p>
        <button class="add-btn" data-id="${p.id}" ${left <= 0 ? "disabled" : ""}>${label}</button>
      </article>`;
    })
    .join("");
}

function renderCart() {
  const totalQty = state.cart.reduce((sum, i) => sum + i.qty, 0);
  cartCount.textContent = totalQty;

  if (state.cart.length === 0) {
    cartItems.innerHTML = '<li class="empty-cart">Your cart is empty.</li>';
  } else {
    cartItems.innerHTML = state.cart
      .map((item) => {
        const p = findProduct(item.id);
        return `
        <li>
          <strong class="item-name"><img class="mini" src="${p.image}" alt="">${p.name}</strong>
          <span>${peso(p.price * item.qty)}</span>
          <div class="qty">
            <button data-action="minus" data-id="${p.id}" aria-label="Remove one">−</button>
            <span>${item.qty}</span>
            <button data-action="plus" data-id="${p.id}" aria-label="Add one">+</button>
          </div>
          <button class="remove" data-action="remove" data-id="${p.id}">Remove</button>
        </li>`;
      })
      .join("");
  }

  subtotalEl.textContent = peso(getSubtotal());
  checkoutBtn.disabled = state.cart.length === 0;
}

function render() {
  renderCategories();
  renderProducts();
  renderCart();
}

// ========== 6. ACTIONS ==========
function addToCart(id) {
  const p = findProduct(id);
  const item = cartItem(id);

  if (qtyInCart(id) >= p.stock) {
    showToast(`Sorry, only ${p.stock} left for ${p.name}.`);
    return;
  }

  if (item) item.qty++;
  else state.cart.push({ id, qty: 1 });

  saveCart();
  render();
  showToast(`${p.name} added to cart`);

  cartCount.classList.remove("pop");
  void cartCount.offsetWidth;
  cartCount.classList.add("pop");
}

function changeQty(id, amount) {
  const item = cartItem(id);
  const p = findProduct(id);

  if (amount > 0 && item.qty >= p.stock) {
    showToast("No more stock available.");
    return;
  }

  item.qty += amount;
  if (item.qty <= 0) {
    removeItem(id);
    return;
  }
  saveCart();
  render();
}

function removeItem(id) {
  state.cart = state.cart.filter((i) => i.id !== id);
  saveCart();
  render();
}

function openCart() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  $("#closeCart").focus();
}

function closeCart() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
}

// ========== 7. EVENTS ==========
$("#search").addEventListener(
  "input",
  debounce((e) => {
    state.search = e.target.value.trim();
    renderProducts();
  }, 250),
);

$("#sort").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderProducts();
});

categories.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  state.category = chip.dataset.category;
  renderCategories();
  renderProducts();
});

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (btn) addToCart(Number(btn.dataset.id));
});

cartItems.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === "plus") changeQty(id, 1);
  if (btn.dataset.action === "minus") changeQty(id, -1);
  if (btn.dataset.action === "remove") removeItem(id);
});

$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && drawer.classList.contains("open")) closeCart();
});

// ---- Checkout ----
checkoutBtn.addEventListener("click", () => {
  closeCart();
  $("#dialogTotal").textContent = peso(getSubtotal());
  $("#formError").textContent = "";
  form.hidden = false;
  orderDone.hidden = true;
  dialog.showModal();
});

$("#cancelCheckout").addEventListener("click", () => dialog.close());

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#custName").value.trim();
  const phone = $("#custPhone").value.trim();
  const pay = $("#custPay").value;

  if (name.length < 2)
    return ($("#formError").textContent = "Please enter your name.");
  if (!/^09\d{9}$/.test(phone))
    return ($("#formError").textContent =
      "Mobile number must be 11 digits starting with 09.");

  const orderNo = "ORD-" + Date.now().toString().slice(-6);
  // textContent is safe for user input: no escaping needed
  $("#orderText").textContent =
    `Thank you, ${name}! Order ${orderNo} (${peso(getSubtotal())}) will be paid via ${pay}.`;

  state.cart = [];
  saveCart();
  render();

  form.reset();
  form.hidden = true;
  orderDone.hidden = false;
});

$("#doneBtn").addEventListener("click", () => {
  dialog.close();
  showToast("Order placed successfully");
});

// ========== 8. START ==========
render();
