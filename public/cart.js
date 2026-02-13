// Load cart items
function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  
  if (cart.length === 0) {
    cartItemsContainer.style.display = 'none';
    document.querySelector('.cart-summary').style.display = 'none';
    emptyCart.style.display = 'block';
    return;
  }
  
  cartItemsContainer.innerHTML = '';
  let subtotal = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h3>${item.brand} ${item.name}</h3>
        <p>Size: ${item.size}</p>
        <p class="cart-item-price">₹${item.price}</p>
      </div>
      <div class="cart-item-quantity">
        <button onclick="updateQuantity(${index}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${index}, 1)">+</button>
      </div>
      <div class="cart-item-total">
        <p>₹${itemTotal}</p>
        <button onclick="removeItem(${index})" class="remove-btn">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });
  
  // Update summary
  document.getElementById('subtotal').textContent = `₹${subtotal}`;
  document.getElementById('total').textContent = `₹${subtotal}`;
}

// Update item quantity
function updateQuantity(index, change) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart[index].quantity += change;
  
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

// Remove item from cart
function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

// Proceed to checkout
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }
  window.location.href = 'checkout.html';
});

// Load cart on page load
loadCart();