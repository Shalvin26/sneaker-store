// Update cart count on page load
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = totalItems;
    
    // Add bounce animation when count changes
    if (totalItems > 0) {
      badge.style.animation = 'none';
      setTimeout(() => {
        badge.style.animation = 'pulse 2s infinite';
      }, 10);
    }
  }
}

// Fetch and display all sneakers with smooth animations
async function loadSneakers() {
  try {
    const response = await fetch('/api/sneakers');
    const sneakers = await response.json();
    
    const grid = document.getElementById('sneakerGrid');
    grid.innerHTML = '';
    
    if (sneakers.length === 0) {
      grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.2rem; color: #666;">No sneakers available yet.</p>';
      return;
    }
    
    sneakers.forEach((sneaker, index) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.style.animationDelay = `${index * 0.1}s`; // Stagger animation
      
      // Click card to go to product page
      card.onclick = (e) => {
        // Don't navigate if clicking the quick add button
        if (!e.target.classList.contains('add-to-cart-quick')) {
          window.location.href = `product.html?id=${sneaker._id}`;
        }
      };
      
      card.innerHTML = `
        <img src="${sneaker.image}" alt="${sneaker.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x250?text=No+Image'">
        <div class="product-info">
          <p class="product-brand">${sneaker.brand}</p>
          <h3 class="product-name">${sneaker.name}</h3>
          <p class="product-price">₹${sneaker.price}</p>
          <p class="product-size">Size: ${sneaker.size}</p>
          ${sneaker.description ? `<p style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">${sneaker.description.substring(0, 80)}...</p>` : ''}
        </div>
        <button class="add-to-cart-quick" onclick="quickAddToCart(event, '${sneaker._id}', '${sneaker.name}', '${sneaker.brand}', ${sneaker.price}, ${sneaker.size}, '${sneaker.image}')">
          Quick Add 🛒
        </button>
      `;
      
      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading sneakers:', error);
  }
}

// Quick add to cart without going to product page
function quickAddToCart(event, id, name, brand, price, size, image) {
  event.stopPropagation(); // Prevent card click
  
  // Get existing cart
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if item exists
  const existingItemIndex = cart.findIndex(
    item => item.id === id && item.size === size
  );
  
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      brand: brand,
      price: price,
      size: size,
      quantity: 1,
      image: image
    });
  }
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count with animation
  updateCartCount();
  
  // Show feedback
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = '✓ Added!';
  button.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
  
  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = 'linear-gradient(135deg, #ff6b35, #f7931e)';
  }, 1500);
}

// Load sneakers and update cart count on page load
loadSneakers();
updateCartCount();