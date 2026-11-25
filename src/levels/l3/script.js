// LEVEL 3: Adding to cart

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
  tumbler: photo("photo-1544003484-3cd181d17917"),
  usb: photo("photo-1581068466660-e6585b8afa97"),
  notes: photo("photo-1683739147682-607fb8e24e3f"),
  earphones: photo("photo-1555679792-6783ef0bbf61"),
};

// 1. DATA: products live in an array of objects
const products = [
  { id: 1, name: "Spiral Notebook", price: 45, image: pictures.notebook },
  { id: 2, name: "Ballpen Set (5)", price: 60, image: pictures.pens },
  { id: 3, name: "Tumbler 500ml", price: 299, image: pictures.tumbler },
  { id: 4, name: "USB Flash Drive 32GB", price: 250, image: pictures.usb },
  { id: 5, name: "Sticky Notes Pack", price: 85, image: pictures.notes },
  { id: 6, name: "Wired Earphones", price: 199, image: pictures.earphones },
];

// The cart only stores the product id and quantity
let cart = []; // e.g. [{ id: 3, qty: 2 }]

// 2. ELEMENTS
const productList = document.querySelector("#productList");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const emptyMsg = document.querySelector("#emptyMsg");
const clearBtn = document.querySelector("#clearCart");

// 3. HELPERS
const peso = (amount) =>
  "₱" +
  amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const findProduct = (id) => products.find((p) => p.id === id);

// 4. SHOW THE PRODUCTS (map turns each object into HTML)
function renderProducts() {
  productList.innerHTML = products
    .map(
      (p) => `
    <div class="product">
      <img class="thumb" src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">${peso(p.price)}</p>
      <button class="add-btn" data-id="${p.id}">Add to cart</button>
    </div>
  `,
    )
    .join("");
}

// 5. CART ACTIONS
function addToCart(id) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty++; // already in cart: add one more
  } else {
    cart.push({ id, qty: 1 }); // new item
  }
  renderCart();
}

function changeQty(id, amount) {
  const item = cart.find((i) => i.id === id);
  item.qty += amount;
  if (item.qty <= 0) removeItem(id);
  else renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
}

// 6. DRAW THE CART (called after EVERY change)
function renderCart() {
  cartItems.innerHTML = cart
    .map((item) => {
      const p = findProduct(item.id);
      return `
      <li>
        <span class="name"><img class="mini" src="${p.image}" alt="">${p.name}</span>
        <div class="qty">
          <button data-action="minus" data-id="${p.id}" aria-label="Remove one">−</button>
          <span>${item.qty}</span>
          <button data-action="plus" data-id="${p.id}" aria-label="Add one">+</button>
        </div>
        <span class="line-total">${peso(p.price * item.qty)}</span>
        <button class="remove" data-action="remove" data-id="${p.id}" aria-label="Remove ${p.name}">✕</button>
      </li>`;
    })
    .join("");

  // reduce() adds everything up
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = cart.reduce(
    (sum, i) => sum + findProduct(i.id).price * i.qty,
    0,
  );

  cartCount.textContent = totalQty;
  cartTotal.textContent = peso(total);
  emptyMsg.hidden = cart.length > 0;
  clearBtn.disabled = cart.length === 0;
}

// 7. EVENTS
productList.addEventListener("click", (event) => {
  const btn = event.target.closest(".add-btn");
  if (!btn) return;

  addToCart(Number(btn.dataset.id));

  // quick feedback on the button
  btn.textContent = "Added ✓";
  btn.classList.add("added");
  setTimeout(() => {
    btn.textContent = "Add to cart";
    btn.classList.remove("added");
  }, 800);
});

cartItems.addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (btn.dataset.action === "plus") changeQty(id, 1);
  if (btn.dataset.action === "minus") changeQty(id, -1);
  if (btn.dataset.action === "remove") removeItem(id);
});

clearBtn.addEventListener("click", () => {
  cart = [];
  renderCart();
});

// 8. START
renderProducts();
renderCart();
