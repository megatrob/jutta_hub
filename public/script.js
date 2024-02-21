// Change your event handlers
function showNikeProducts(event) {
  event.preventDefault();
  fetch('/api/products/nike')
    .then(response => response.json())
    .then(products => renderProducts(products));
}

function showOtherProducts(event) {
  event.preventDefault();
  fetch('/api/products/other')
    .then(response => response.json())
    .then(products => renderProducts(products));
}
// Add a new function to render products
function renderProducts(products) {
  console.log('Rendering products:', products);

  const productsContainer = document.getElementById('productsContainer');
  productsContainer.innerHTML = `
    <div class="container">
      <div class="row">
        ${products.map(product => `
          <div class="col">
            <img src="${product.image}" alt="${product.name}">
            <div class="text"><p>${product.name} <br> $${product.price}</p></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

