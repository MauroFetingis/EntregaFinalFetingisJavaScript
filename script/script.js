document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartCount = document.getElementById('cart-count');
    const searchBar = document.getElementById('search-bar');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = [];

    fetch('/products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
        });

    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.img}" alt="${product.nombre}">
                <h2>${product.nombre}</h2>
                <p>${product.desc}</p>
                <p><strong>$${product.precio}</strong></p>
                <button class="add-to-cart" data-id="${product.id}">Agregar al carrito</button>
            `;
            productList.appendChild(productDiv);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.id);
                addToCart(productId);
            });

            button.addEventListener('mouseover', (event) => {
                event.target.style.backgroundColor = getRandomColor();
            });

            button.addEventListener('mouseout', (event) => {
                event.target.style.backgroundColor = '';
            });
        });
    }

    function addToCart(productId) {
        const product = products.find(item => item.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.cantidad += 1;
        } else {
            const newCartItem = { ...product, cantidad: 1 };
            cart.push(newCartItem);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        const randomPosition = getRandomPosition();
        Toastify({
            text: "Producto agregado al carrito",
            duration: 3000,
            gravity: randomPosition.gravity,
            position: randomPosition.position,
            backgroundColor: "#007bff",
            stopOnFocus: true,
        }).showToast();
    }

    function updateCartCount() {
        cartCount.textContent = cart.reduce((acc, item) => acc + item.cantidad, 0);
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function getRandomPosition() {
        const gravities = ['top', 'bottom'];
        const positions = ['left', 'center', 'right'];
        return {
            gravity: gravities[Math.floor(Math.random() * gravities.length)],
            position: positions[Math.floor(Math.random() * positions.length)],
        };
    }

    function filterProducts(searchTerm) {
        const filteredProducts = products.filter(product => 
            product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.desc.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayProducts(filteredProducts);
    }

    searchBar.addEventListener('input', (event) => {
        const searchTerm = event.target.value;
        filterProducts(searchTerm);
    });

    updateCartCount();

    document.getElementById('cart').addEventListener('click', () => {
        if (cart.length === 0) {
            Swal.fire('El carrito está vacío', '', 'info');
        } else {
            Swal.fire({
                title: 'Carrito de compras',
                html: cart.map(item => `
                    <div>
                        <strong>${item.nombre}</strong> x ${item.cantidad} - $${item.precio * item.cantidad}
                    </div>
                `).join(''),
                showCancelButton: true,
                confirmButtonText: 'Comprar',
                cancelButtonText: 'Seguir comprando',
            }).then(result => {
                if (result.isConfirmed) {
                    localStorage.removeItem('cart');
                    Swal.fire('Compra realizada', '', 'success');
                    cart = [];
                    updateCartCount();
                }
            });
        }
    });
});