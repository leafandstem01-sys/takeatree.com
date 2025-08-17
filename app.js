// Plant Store Application JavaScript

class PlantStore {
    constructor() {
        this.plants = [
            {
                id: 1,
                name: "Sansevieria",
                price: 25.00,
                category: "Indoor",
                image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400",
                description: "Easy care snake plant, perfect for beginners"
            },
            {
                id: 2,
                name: "Opuntia",
                price: 15.00,
                category: "Cacti",
                image: "https://images.unsplash.com/photo-1509590080855-6c5c65b5dd55?w=400",
                description: "Beautiful prickly pear cactus"
            },
            {
                id: 3,
                name: "Calca papaya",
                price: 35.00,
                category: "Outdoor",
                image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
                description: "Fast growing papaya plant"
            },
            {
                id: 4,
                name: "Luxuriana",
                price: 45.00,
                category: "Indoor",
                image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400",
                description: "Luxurious indoor plant with broad leaves"
            },
            {
                id: 5,
                name: "Monstera",
                price: 55.00,
                category: "Indoor",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                description: "Popular Swiss cheese plant"
            },
            {
                id: 6,
                name: "Cycas",
                price: 65.00,
                category: "Outdoor",
                image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
                description: "Ancient cycad palm plant"
            },
            {
                id: 7,
                name: "Fiddle Leaf Fig",
                price: 75.00,
                category: "Indoor",
                image: "https://images.unsplash.com/photo-1508022810467-9e8d6142c68b?w=400",
                description: "Statement plant with large glossy leaves"
            },
            {
                id: 8,
                name: "ZZ Plant",
                price: 30.00,
                category: "Indoor",
                image: "https://images.unsplash.com/photo-1493689485253-6d2649da9029?w=400",
                description: "Low maintenance zamioculcas zamiifolia"
            }
        ];

        this.cart = [];
        this.currentPage = 'home';
        this.currentFilter = 'all';
        this.isLoggedIn = false;

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadFeaturedProducts();
        this.loadAllProducts();
        this.updateCartCount();
        this.showPage('home');
    }

    setupNavigation() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-page')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.showPage(page);
            }
        });

        // Handle footer navigation
        document.querySelectorAll('footer a[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.showPage(page);
            });
        });
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContact(e));
        }

        // Checkout form
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleCheckout(e));
        }

        // Product filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterProducts(e));
        });

        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');

        // Load page-specific content
        if (pageId === 'cart') {
            this.loadCart();
        } else if (pageId === 'checkout') {
            this.loadCheckout();
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadFeaturedProducts() {
        const container = document.getElementById('featured-products-grid');
        if (!container) return;

        // Show first 6 products as featured
        const featuredPlants = this.plants.slice(0, 6);
        container.innerHTML = featuredPlants.map(plant => this.createProductCard(plant)).join('');

        // Add event listeners to add-to-cart buttons with proper binding
        this.setupAddToCartButtons(container);
    }

    loadAllProducts() {
        const container = document.getElementById('all-products-grid');
        if (!container) return;

        this.renderProducts(this.plants);
    }

    renderProducts(products) {
        const container = document.getElementById('all-products-grid');
        if (!container) return;

        container.innerHTML = products.map(plant => this.createProductCard(plant)).join('');

        // Add event listeners to add-to-cart buttons with proper binding
        this.setupAddToCartButtons(container);
    }

    setupAddToCartButtons(container) {
        container.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const plantId = parseInt(e.target.dataset.id);
                this.addToCart(plantId);
            });
        });
    }

    createProductCard(plant) {
        return `
            <div class="product-card">
                <img src="${plant.image}" alt="${plant.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${plant.name}</h3>
                    <p class="product-description">${plant.description}</p>
                    <div class="product-price">$${plant.price.toFixed(2)}</div>
                    <button class="add-to-cart" data-id="${plant.id}">Add to Cart</button>
                </div>
            </div>
        `;
    }

    filterProducts(e) {
        // Remove active class from all filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        e.target.classList.add('active');

        const filter = e.target.dataset.filter;
        this.currentFilter = filter;

        let filteredPlants;
        if (filter === 'all') {
            filteredPlants = this.plants;
        } else {
            filteredPlants = this.plants.filter(plant => plant.category === filter);
        }

        this.renderProducts(filteredPlants);
    }

    addToCart(plantId) {
        const plant = this.plants.find(p => p.id === plantId);
        if (!plant) return;

        const existingItem = this.cart.find(item => item.id === plantId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...plant,
                quantity: 1
            });
        }

        // Force update cart count immediately
        this.forceUpdateCartCount();
        this.showNotification(`${plant.name} added to cart!`);
    }

    removeFromCart(plantId) {
        this.cart = this.cart.filter(item => item.id !== plantId);
        this.forceUpdateCartCount();
        this.loadCart();
    }

    updateQuantity(plantId, change) {
        const item = this.cart.find(item => item.id === plantId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(plantId);
        } else {
            this.forceUpdateCartCount();
            this.loadCart();
        }
    }

    updateCartCount() {
        this.forceUpdateCartCount();
    }

    forceUpdateCartCount() {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            const cartCount = document.getElementById('cart-count');
            if (cartCount) {
                const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems.toString();
            }
        }, 10);
    }

    loadCart() {
        const cartItems = document.getElementById('cart-items');
        const cartEmpty = document.getElementById('cart-empty');
        const cartSummary = document.getElementById('cart-summary');
        const cartTotal = document.getElementById('cart-total');

        if (this.cart.length === 0) {
            cartItems.innerHTML = '';
            cartEmpty.classList.remove('hidden');
            cartSummary.classList.add('hidden');
        } else {
            cartEmpty.classList.add('hidden');
            cartSummary.classList.remove('hidden');

            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                    </div>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="app.removeFromCart(${item.id})">Remove</button>
                </div>
            `).join('');

            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = total.toFixed(2);
        }
    }

    loadCheckout() {
        const checkoutItems = document.getElementById('checkout-items');
        if (!checkoutItems) return;

        if (this.cart.length === 0) {
            checkoutItems.innerHTML = '<p>Your cart is empty. Please add items before checkout.</p>';
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        checkoutItems.innerHTML = `
            ${this.cart.map(item => `
                <div class="checkout-item">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
            <div class="checkout-item">
                <span><strong>Total:</strong></span>
                <span><strong>$${total.toFixed(2)}</strong></span>
            </div>
        `;
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Simple validation
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate login
        this.isLoggedIn = true;
        this.showNotification('Login successful!', 'success');
        
        // Reset form
        e.target.reset();
        
        // Redirect to home
        setTimeout(() => {
            this.showPage('home');
        }, 1500);
    }

    handleContact(e) {
        e.preventDefault();
        
        // Simulate form submission
        this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        e.target.reset();
    }

    handleCheckout(e) {
        e.preventDefault();

        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        // Simulate order processing
        this.showNotification('Order placed successfully! Thank you for your purchase.', 'success');
        
        // Clear cart
        this.cart = [];
        this.forceUpdateCartCount();
        
        // Reset form
        e.target.reset();
        
        // Redirect to home
        setTimeout(() => {
            this.showPage('home');
        }, 2000);
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 500;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application
const app = new PlantStore();

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
        app.showPage(e.state.page);
    }
});

// Handle initial page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if there's a hash in the URL
    const hash = window.location.hash.substring(1);
    if (hash) {
        app.showPage(hash);
    }
    
    // Ensure cart count is updated after DOM is fully loaded
    setTimeout(() => {
        app.forceUpdateCartCount();
    }, 100);
});

// Add some smooth scrolling behavior for internal links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Handle mobile menu
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
});

// Add CSS for image loading animation
const style = document.createElement('style');
style.textContent = `
    img {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img.loaded {
        opacity: 1;
    }
    
    .nav-menu {
        transition: all 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            right: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: var(--color-surface);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 50px;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            z-index: 999;
        }
        
        .nav-menu.active {
            right: 0;
        }
        
        .nav-menu li {
            margin: 20px 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
