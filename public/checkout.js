// Load order summary
function loadOrderSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const orderItemsContainer = document.getElementById('orderItems');
  
  if (cart.length === 0) {
    alert('Your cart is empty');
    window.location.href = 'index.html';
    return;
  }
  
  let total = 0;
  orderItemsContainer.innerHTML = '';
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
      <div class="order-item-info">
        <p><strong>${item.brand} ${item.name}</strong></p>
        <p>Size: ${item.size} | Qty: ${item.quantity}</p>
      </div>
      <p>₹${itemTotal}</p>
    `;
    orderItemsContainer.appendChild(orderItem);
  });
  
  document.getElementById('orderTotal').textContent = `₹${total}`;
}

// Handle form submission
document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const orderData = {
    items: cart.map(item => ({
      sneaker: item.id,
      name: item.name,
      price: item.price,
      size: item.size,
      quantity: item.quantity,
      image: item.image
    })),
    totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    customerInfo: {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      pincode: document.getElementById('pincode').value
    }
  };
  
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Clear cart
      localStorage.removeItem('cart');
      
      // Show success message
      alert(`Order placed successfully! Order Number: ${data.orderNumber}`);
      
      // Redirect to home
      window.location.href = 'index.html';
    } else {
      alert('Order failed: ' + data.message);
    }
  } catch (error) {
    console.error('Order error:', error);
    alert('Failed to place order. Please try again.');
  }
});

// Load summary on page load
loadOrderSummary();