//fetching if snealers amd displaying them on the page
async function loadSneakers() {
    try{
        const response = await fetch('/api/sneakers');
        const sneakers = await response.json();

        const grid= document.getElementById('sneakerGrid');
        grid.innerHTML='';

        if(sneakers.length===0){
            grid.innerHTML=
                  '<p style="text-align:center;grid-column:1/-1;font-size:1.2rem;color:#666">No sneakers available yet.</p>';
            return;
        }
      sneakers.forEach(sneaker => {
      const card = document.createElement('div');
      card.className = 'product-card';
      
      // Make card clickable - redirects to product detail page
      card.onclick = () => window.location.href = `product.html?id=${sneaker._id}`;
      card.style.cursor = 'pointer';
      
      card.innerHTML = `
        <img src="${sneaker.image}" alt="${sneaker.name}" class="product-image">
        <div class="product-info">
          <p class="product-brand">${sneaker.brand}</p>
          <h3 class="product-name">${sneaker.name}</h3>
          <p class="product-price">₹${sneaker.price}</p>
          <p class="product-size">Size: ${sneaker.size}</p>
        </div>
      `;
      grid.appendChild(card);
      });
     
  } catch (error) {
    console.error('Error loading sneakers:', error);
  }
}

// Load sneakers when page loads
loadSneakers();