const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const totalMrp = document.getElementById('total-mrp');
const couponDiscount = document.getElementById('coupon-discount');
const totalAmount = document.getElementById('total-amount');

let cart = [];

// Fetch products from Fake Store API
fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(data => {
    displayProducts(data);
  });

// Display products
function displayProducts(products) {
  productList.innerHTML = '';
  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
    `;
    productList.appendChild(productElement);
  });
}

// Add item to cart
function addToCart(id, title, price) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity++;  // Increase quantity if item already exists in the cart
  } else {
    cart.push({ id, title, price, quantity: 1 });
  }
  updateCart();
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// Increase or Decrease item quantity in the cart
function changeQuantity(id, action) {
  cart = cart.map(item => {
    if (item.id === id) {
      if (action === 'increase') {
        item.quantity++;
      } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity--;
      }
    }
    return item;
  });
  updateCart();
}

// Update cart UI and totals
function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <p>${item.title}</p>
      <p>₹${item.price} x ${item.quantity}</p>
      <div class="cart-actions">
        <button onclick="changeQuantity(${item.id}, 'increase')">+</button>
        <button onclick="changeQuantity(${item.id}, 'decrease')">-</button>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });

  // Update price details
  totalMrp.textContent = total;
  const discount = Math.min(50, total * 0.1); // Applying a 10% discount, max ₹50
  couponDiscount.textContent = discount;
  totalAmount.textContent = total + 20 + 10 - discount; // Adding platform fee and shipping charges
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
      const filteredProducts = data.filter(product => product.title.toLowerCase().includes(query));
      displayProducts(filteredProducts);
    });
});