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
if (!checkAuth()) {
  // Redirect handled in checkAuth
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});

// Load all sneakers for admin
async function loadAdminSneakers() {
  try {
    const response = await fetch('/api/sneakers');
    const sneakers = await response.json();
    
    const grid = document.getElementById('adminSneakerGrid');
    grid.innerHTML = '';
    
    if (sneakers.length === 0) {
      grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No sneakers yet. Add your first one!</p>';
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
          ${sneaker.description ? `<p style="color: #666; font-size: 0.9rem;">${sneaker.description}</p>` : ''}
          <button class="delete-btn" onclick="deleteSneaker('${sneaker._id}')">Delete</button>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading sneakers:', error);
  }
}

// Add new sneaker
// Image preview
document.getElementById('imageFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('imagePreview');
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// Add sneaker with file upload
document.getElementById('addSneakerform').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem('token');
  const successMsg = document.getElementById('successMsg');
  
  // Upload image first
  const imageFile = document.getElementById('imageFile').files[0];
  let imagePath = '';
  
  if (imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    console.log('Upload status:', uploadResponse.status); // DEBUG
    
    // Check if response is actually JSON
    const contentType = uploadResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Upload response is not JSON'); // DEBUG
      successMsg.textContent = 'Upload error: Invalid response';
      successMsg.style.color = '#ff4444';
      return;
    }
    
    const uploadData = await uploadResponse.json();
    console.log('Upload data:', uploadData); // DEBUG
    
    if (!uploadResponse.ok) {
      successMsg.textContent = 'Image upload failed: ' + uploadData.message;
      successMsg.style.color = '#ff4444';
      return;
    }
    
    imagePath = uploadData.imagePath;
    console.log('Image path:', imagePath); // DEBUG
    
  } catch (error) {
    console.error('Upload catch error:', error); // DEBUG - THIS IS KEY
    successMsg.textContent = 'Upload error: ' + error.message;
    successMsg.style.color = '#ff4444';
    return;
  }
}
  
  // Create sneaker
  const sneakerData = {
    name: document.getElementById('name').value,
    brand: document.getElementById('brand').value,
    price: document.getElementById('price').value,
    size: document.getElementById('size').value,
    image: imagePath,
    description: document.getElementById('description').value
  };
  
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
    
    if (response.ok) {
      successMsg.textContent = 'Sneaker added successfully!';
      successMsg.style.color = '#00cc44';
      
      document.getElementById('addSneakerForm').reset();
      document.getElementById('imagePreview').style.display = 'none';
      
      loadAdminSneakers();
      
      setTimeout(() => {
        successMsg.textContent = '';
      }, 3000);
    } else {
      successMsg.textContent = data.message;
      successMsg.style.color = '#ff4444';
    }
  } catch (error) {
    successMsg.textContent = 'Failed to add sneaker';
    successMsg.style.color = '#ff4444';
  }
});

// Delete sneaker
async function deleteSneaker(id) {
  if (!confirm('Are you sure you want to delete this sneaker?')) {
    return;
  }
  
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`/api/sneakers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      loadAdminSneakers();
    } else {
      alert('Failed to delete sneaker');
    }
  } catch (error) {
    alert('Error deleting sneaker');
  }
}

// Load sneakers on page load
loadAdminSneakers();