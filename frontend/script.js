// DOM Elements
const mobileToggle = document.getElementById('mobileToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const orderForm = document.getElementById('orderForm');
const headerTitle = document.querySelector('.header-title');
const submitBtn = document.querySelector('.submit-btn');

// Sample data for sellers
const sellerData = [
    { name: 'TechHub Electronics', lat: 26.9200, lng: 75.7900, products: ['laptop', 'smartphone', 'tablet'] },
    { name: 'Digital World', lat: 26.9100, lng: 75.7800, products: ['headphones', 'smartwatch', 'smartphone'] },
    { name: 'Gadget Store', lat: 26.9250, lng: 75.7950, products: ['laptop', 'tablet', 'headphones'] },
    { name: 'Electronics Plus', lat: 26.9180, lng: 75.7920, products: ['smartphone', 'smartwatch', 'tablet'] }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupMobileNavigation();
    setupNavigationItems();
    setupFormInteractions();
    setupFormSubmission();
    animateStatsCards();
    setupEntranceAnimations();
}

// Mobile Navigation
function setupMobileNavigation() {
    mobileToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);
}

function toggleSidebar() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
}

// Navigation Items
function setupNavigationItems() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Update header title based on selected item
            const itemText = item.textContent.trim().replace(/\d+/g, '').trim();
            headerTitle.textContent = itemText;
            
            // Handle different navigation actions
            handleNavigationAction(itemText);
        });
    });
}

function handleNavigationAction(itemText) {
    const contentArea = document.querySelector('.content-area');
    
    switch(itemText) {
        case 'Dashboard':
            showDashboardContent();
            break;
        case 'Place Order':
            showOrderForm();
            break;
        case 'Order History':
            showOrderHistory();
            break;
        case 'Sellers':
            showSellersManagement();
            break;
        case 'Customers':
            showCustomersManagement();
            break;
        default:
            showComingSoon(itemText);
    }
}

function showDashboardContent() {
    // Dashboard is already shown by default
    console.log('Dashboard view activated');
}

function showOrderForm() {
    console.log('Order form view activated');
}

function showOrderHistory() {
    console.log('Order history view activated');
}

function showSellersManagement() {
    console.log('Sellers management view activated');
}

function showCustomersManagement() {
    console.log('Customers management view activated');
}

function showComingSoon(feature) {
    console.log(`${feature} feature coming soon`);
}

// Form Interactions
function setupFormInteractions() {
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        // Focus effects
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-3px) scale(1.02)';
            this.parentElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        // Blur effects
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0) scale(1)';
        });
        
        // Input validation
        input.addEventListener('input', validateInput);
    });
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Remove previous validation classes
    input.classList.remove('valid', 'invalid');
    
    if (input.type === 'text' && input.id === 'customerName') {
        if (value.length >= 2) {
            input.classList.add('valid');
        } else if (value.length > 0) {
            input.classList.add('invalid');
        }
    } else if (input.type === 'text' && input.id === 'customerLocation') {
        if (value.length >= 3) {
            input.classList.add('valid');
        } else if (value.length > 0) {
            input.classList.add('invalid');
        }
    } else if (input.tagName === 'SELECT') {
        if (value) {
            input.classList.add('valid');
        }
    }
}

// Form Submission
function setupFormSubmission() {
    orderForm.addEventListener('submit', handleFormSubmission);
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = {
        customerName: document.getElementById('customerName').value.trim(),
        customerLocation: document.getElementById('customerLocation').value.trim(),
        product: document.getElementById('productSelect').value
    };
    
    // Show loading state
    setLoadingState(true);
    
    // Validate form
    if (!validateForm(formData)) {
        setLoadingState(false);
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        processOrder(formData);
        setLoadingState(false);
    }, 2000);
}

function validateForm(formData) {
    let isValid = true;
    
    if (!formData.customerName || formData.customerName.length < 2) {
        showNotification('Please enter a valid customer name (at least 2 characters)', 'error');
        document.getElementById('customerName').focus();
        isValid = false;
    } else if (!formData.customerLocation || formData.customerLocation.length < 3) {
        showNotification('Please enter a valid customer location', 'error');
        document.getElementById('customerLocation').focus();
        isValid = false;
    } else if (!formData.product) {
        showNotification('Please select a product', 'error');
        document.getElementById('productSelect').focus();
        isValid = false;
    }
    
    return isValid;
}

function processOrder(formData) {
    // Find nearest seller (simplified logic)
    const availableSellers = sellerData.filter(seller => 
        seller.products.includes(formData.product)
    );
    
    if (availableSellers.length === 0) {
        showNotification(`No sellers available for ${formData.product}`, 'error');
        return;
    }
    
    const nearestSeller = availableSellers[0]; // Simplified - just take first available
    const orderId = generateOrderId();
    
    // Show success message
    showNotification('Order placed successfully! Redirecting...', 'success');
    
    // Update stats (simulate)
    updateOrderStats();
    
    // Reset form
    orderForm.reset();

    console.log('Order processed:', {
        orderId,
        customer: formData.customerName,
        location: formData.customerLocation,
        product: formData.product,
        seller: nearestSeller.name
    });

    // ✅ Redirect to confirmation page with details
    const params = new URLSearchParams({
        orderId,
        customerName: formData.customerName,
        customerLocation: formData.customerLocation,
        product: formData.product,
        sellerName: nearestSeller.name
    });

    setTimeout(() => {
        window.location.href = `confirmation.html?${params.toString()}`;
    }, 1500); // delay for notification
}

function generateOrderId() {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function setLoadingState(loading) {
    if (loading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Notifications
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = createNotificationElement();
        document.body.appendChild(notification);
    }
    
    // Update notification content
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.classList.add('show');
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function createNotificationElement() {
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = 'notification';
    
    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            z-index: 1002;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification.success {
            background: rgba(16, 185, 129, 0.9);
        }
        .notification.error {
            background: rgba(239, 68, 68, 0.9);
        }
        .notification.info {
            background: rgba(59, 130, 246, 0.9);
        }
    `;
    document.head.appendChild(style);
    
    return notification;
}

// Stats Animation
function animateStatsCards() {
    setTimeout(() => {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 600);
}

function updateOrderStats() {
    const totalOrdersElement = document.querySelector('.stat-card:first-child .stat-value');
    if (totalOrdersElement) {
        const currentValue = parseInt(totalOrdersElement.textContent);
        totalOrdersElement.textContent = currentValue + 1;
        
        // Add animation effect
        totalOrdersElement.style.transform = 'scale(1.2)';
        totalOrdersElement.style.color = '#10b981';
        setTimeout(() => {
            totalOrdersElement.style.transform = 'scale(1)';
            totalOrdersElement.style.color = '#ffffff';
        }, 500);
    }
}

// Entrance Animations
function setupEntranceAnimations() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Initial state
    sidebar.style.transform = 'translateX(-100%)';
    mainContent.style.opacity = '0';
    
    // Animate in
    setTimeout(() => {
        sidebar.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        sidebar.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            mainContent.style.transition = 'opacity 0.6s ease';
            mainContent.style.opacity = '1';
        }, 400);
    }, 200);
}

// Utility Functions
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Add CSS for form validation states
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .form-input.valid {
        border-color: #10b981;
        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
    }
    
    .form-input.invalid {
        border-color: #ef4444;
        box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
        animation: inputShake 0.5s ease-in-out;
    }
    
    @keyframes inputShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(validationStyles);

// Handle window resize for mobile responsiveness
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';