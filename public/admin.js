// Check if user is logged in and is admin
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

// Check auth on page load
checkAuth();

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });
}

// Load all sneakers for admin
async function loadAdminSneakers() {
  try {
    const response = await fetch('/api/sneakers');
    const sneakers = await response.json();
    
    const grid = document.getElementById('adminSneakerGrid');
    
    if (!grid) {
      console.error('Grid element not found!');
      return;
    }
    
    grid.innerHTML = '';
    
    if (sneakers.length === 0) {
      grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem; color: #999;">No sneakers yet. Add your first one!</p>';
      return;
    }
    
    sneakers.forEach(sneaker => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${sneaker.image}" alt="${sneaker.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x250?text=No+Image'">
        <div class="product-info">
          <p class="product-brand">${sneaker.brand}</p>
          <h3 class="product-name">${sneaker.name}</h3>
          <p class="product-price">₹${sneaker.price}</p>
          <p class="product-size">Size: ${sneaker.size}</p>
          ${sneaker.description ? `<p style="color: #999; font-size: 0.9rem; margin-top: 0.5rem;">${sneaker.description}</p>` : ''}
          <button class="delete-btn" data-id="${sneaker._id}">Delete</button>
        </div>
      `;
      
      // Add delete event listener
      const deleteBtn = card.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => deleteSneaker(sneaker._id));
      
      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading sneakers:', error);
  }
}

// Image preview
const imageFileInput = document.getElementById('imageFile');
if (imageFileInput) {
  imageFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.getElementById('imagePreview');
        if (preview) {
          preview.src = e.target.result;
          preview.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

// Add new sneaker
const addSneakerForm = document.getElementById('addSneakerform');
if (addSneakerForm) {
  addSneakerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const successMsg = document.getElementById('successMsg');
    
    if (!token) {
      alert('Session expired. Please login again.');
      window.location.href = 'login.html';
      return;
    }
    
    console.log('Form submitted');
    
    // Get the image file
    const imageFile = document.getElementById('imageFile').files[0];
    let imagePath = '';
    
    // Upload image first if file is selected
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      try {
        console.log('Uploading image...');
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        console.log('Upload status:', uploadResponse.status);
        console.log('Upload headers:', uploadResponse.headers);
        
        // Check if response is JSON
        const contentType = uploadResponse.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await uploadResponse.text();
          console.error('Non-JSON response:', textResponse);
          successMsg.textContent = 'Upload failed: Server returned non-JSON response';
          successMsg.style.color = '#d32f2f';
          return;
        }
        
        const uploadData = await uploadResponse.json();
        console.log('Upload data:', uploadData);
        
        if (!uploadResponse.ok) {
          successMsg.textContent = 'Image upload failed: ' + (uploadData.message || 'Unknown error');
          successMsg.style.color = '#d32f2f';
          return;
        }
        
        imagePath = uploadData.imagePath;
        console.log('Image path:', imagePath);
        
      } catch (error) {
        console.error('Upload catch error:', error);
        successMsg.textContent = 'Upload error: ' + error.message;
        successMsg.style.color = '#d32f2f';
        return;
      }
    } else {
      successMsg.textContent = 'Please select an image';
      successMsg.style.color = '#d32f2f';
      return;
    }
    
    // Create sneaker with uploaded image
    const sneakerData = {
      name: document.getElementById('name').value,
      brand: document.getElementById('brand').value,
      price: document.getElementById('price').value,
      size: document.getElementById('size').value,
      image: imagePath,
      description: document.getElementById('description').value
    };
    
    console.log('Sneaker data:', sneakerData);
    
    try {
      const response = await fetch('/api/sneakers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sneakerData)
      });
      
      const data = await response.json();
      console.log('Add sneaker response:', data);
      
      if (response.ok) {
        successMsg.textContent = 'Sneaker added successfully!';
        successMsg.style.color = '#388e3c';
        
        // Clear form
        addSneakerForm.reset();
        const preview = document.getElementById('imagePreview');
        if (preview) preview.style.display = 'none';
        
        // Reload sneakers
        loadAdminSneakers();
        
        setTimeout(() => {
          successMsg.textContent = '';
        }, 3000);
      } else {
        successMsg.textContent = 'Failed to add sneaker: ' + (data.message || 'Unknown error');
        successMsg.style.color = '#d32f2f';
      }
    } catch (error) {
      console.error('Add sneaker error:', error);
      successMsg.textContent = 'Failed to add sneaker: ' + error.message;
      successMsg.style.color = '#d32f2f';
    }
  });
}

// Delete sneaker
async function deleteSneaker(id) {
  if (!confirm('Are you sure you want to delete this sneaker?')) {
    return;
  }
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('Session expired. Please login again.');
    window.location.href = 'login.html';
    return;
  }
  
  console.log('Deleting sneaker:', id);
  
  try {
    const response = await fetch(`/api/sneakers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Delete response status:', response.status);
    
    if (response.ok) {
      loadAdminSneakers();
    } else {
      const data = await response.json();
      alert('Failed to delete sneaker: ' + (data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Delete error:', error);
    alert('Error deleting sneaker: ' + error.message);
  }
}

// Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = totalItems;
  }
}

// Navbar scroll animation
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Load sneakers and update cart on page load
loadAdminSneakers();
updateCartCount();