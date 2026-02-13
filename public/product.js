// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

let currentProduct = null;
let selectedSize = null;
let quantity = 1;

// Load product details
async function loadProduct() {
  try {
    const response = await fetch(`/api/sneakers/${productId}`);
    const product = await response.json();
    
    currentProduct = product;
    displayProduct(product);
  } catch (error) {
    console.error('Error loading product:', error);
    alert('Product not found');
    window.location.href = 'index.html';
  }
}

// Display product on page
function displayProduct(product) {
  document.getElementById('productImage').src = product.image;
  document.getElementById('productBrand').textContent = product.brand;
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productPrice').textContent = `₹${product.price}`;
  document.getElementById('productDescription').textContent = product.description || 'No description available.';
  
  // Display available sizes (if array exists, otherwise show single size)
  const sizeOptions = document.getElementById('sizeOptions');
  const sizes = product.availableSizes && product.availableSizes.length > 0 
    ? product.availableSizes 
    : [product.size];
  
  sizes.forEach(size => {
    const sizeBtn = document.createElement('button');
    sizeBtn.className = 'size-btn';
    sizeBtn.textContent = size;
    sizeBtn.onclick = () => selectSize(size, sizeBtn);
    sizeOptions.appendChild(sizeBtn);
  });
  
  // Auto-select first size
  if (sizes.length > 0) {
    selectSize(sizes[0], sizeOptions.firstChild);
  }
  
  // Display specifications if available
  if (product.specifications) {
    const specsList = document.getElementById('specsList');
    specsList.innerHTML = `
      ${product.specifications.weight ? `<p><strong>Weight:</strong> ${product.specifications.weight}</p>` : ''}
      ${product.specifications.sole ? `<p><strong>Sole:</strong> ${product.specifications.sole}</p>` : ''}
      ${product.specifications.technology ? `<p><strong>Technology:</strong> ${product.specifications.technology}</p>` : ''}
      ${product.color ? `<p><strong>Color:</strong> ${product.color}</p>` : ''}
      ${product.material ? `<p><strong>Material:</strong> ${product.material}</p>` : ''}
    `;
  }
}

// Select size
function selectSize(size, button) {
  // Remove active class from all buttons
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to selected button
  button.classList.add('active');
  selectedSize = size;
}

// Quantity controls
document.getElementById('increaseQty').addEventListener('click', () => {
  quantity++;
  document.getElementById('quantity').textContent = quantity;
});

document.getElementById('decreaseQty').addEventListener('click', () => {
  if (quantity > 1) {
    quantity--;
    document.getElementById('quantity').textContent = quantity;
  }
});

// Add to cart
document.getElementById('addToCartBtn').addEventListener('click', () => {
  if (!selectedSize) {
    alert('Please select a size');
    return;
  }
  
  // Get existing cart or create new one
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex(
    item => item.id === currentProduct._id && item.size === selectedSize
  );
  
  if (existingItemIndex > -1) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.push({
      id: currentProduct._id,
      name: currentProduct.name,
      brand: currentProduct.brand,
      price: currentProduct.price,
      size: selectedSize,
      quantity: quantity,
      image: currentProduct.image
    });
  }
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count
  updateCartCount();
  
  // Show success message
  alert('Added to cart!');
  
  // Optional: Redirect to cart
  // window.location.href = 'cart.html';
});

// Update cart count in navbar
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

// Load product on page load
loadProduct();
updateCartCount();