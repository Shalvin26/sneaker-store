// Check authentication
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user || user.role !== 'admin') {
    alert('Access denied. Please login as admin.');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

checkAuth();

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});

// Load all orders
async function loadOrders() {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const orders = await response.json();
    displayOrders(orders);
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

// Display orders
function displayOrders(orders) {
  const container = document.getElementById('ordersContainer');
  
  if (orders.length === 0) {
    container.innerHTML = '<p>No orders yet.</p>';
    return;
  }
  
  container.innerHTML = '';
  
  orders.forEach(order => {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    orderCard.innerHTML = `
      <div class="order-header">
        <h3>Order #${order.orderNumber}</h3>
        <span class="order-status status-${order.status}">${order.status}</span>
      </div>
      <div class="order-details">
        <p><strong>Customer:</strong> ${order.customerInfo.name}</p>
        <p><strong>Email:</strong> ${order.customerInfo.email}</p>
        <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
        <p><strong>Address:</strong> ${order.customerInfo.address}, ${order.customerInfo.city}, ${order.customerInfo.state} - ${order.customerInfo.pincode}</p>
        <p><strong>Total:</strong> ₹${order.totalAmount}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
      <div class="order-items">
        <h4>Items:</h4>
        ${order.items.map(item => `
          <p>• ${item.name} (Size: ${item.size}) x ${item.quantity} = ₹${item.price * item.quantity}</p>
        `).join('')}
      </div>
      <div class="order-actions">
        <select onchange="updateStatus('${order._id}', this.value)">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
        <button onclick="deleteOrder('${order._id}')" class="delete-btn">Delete</button>
      </div>
    `;
    container.appendChild(orderCard);
  });
}

// Update order status
async function updateStatus(orderId, newStatus) {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (response.ok) {
      alert('Order status updated');
      loadOrders();
    }
  } catch (error) {
    console.error('Update error:', error);
  }
}

// Delete order
async function deleteOrder(orderId) {
  if (!confirm('Delete this order?')) return;
  
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      alert('Order deleted');
      loadOrders();
    }
  } catch (error) {
    console.error('Delete error:', error);
  }
}

// Load orders on page load
loadOrders();