// DOM Elements
const successIcon = document.getElementById('successIcon');
const orderIdElement = document.getElementById('orderId');
const orderDateElement = document.getElementById('orderDate');
const customerNameElement = document.getElementById('customerName');
const customerLocationElement = document.getElementById('customerLocation');
const productNameElement = document.getElementById('productName');
const productCategoryElement = document.getElementById('productCategory');
const sellerNameElement = document.getElementById('sellerName');
const sellerLocationElement = document.getElementById('sellerLocation');
const distanceElement = document.getElementById('distance');
const deliveryTimeElement = document.getElementById('deliveryTime');
const orderTimeElement = document.getElementById('orderTime');
const trackBtn = document.getElementById('trackBtn');
const backBtn = document.getElementById('backBtn');

// Sample seller data for matching
const sellerData = {
    'laptop': { name: 'TechHub Electronics', location: 'Manhattan, NY', distance: '1.2 KM', deliveryTime: '30-45 mins' },
    'smartphone': { name: 'Digital World', location: 'Brooklyn, NY', distance: '2.1 KM', deliveryTime: '40-60 mins' },
    'tablet': { name: 'Gadget Store', location: 'Queens, NY', distance: '1.8 KM', deliveryTime: '35-50 mins' },
    'headphones': { name: 'Audio Plus', location: 'Bronx, NY', distance: '3.2 KM', deliveryTime: '50-70 mins' },
    'smartwatch': { name: 'Smart Tech Hub', location: 'Staten Island, NY', distance: '2.7 KM', deliveryTime: '45-65 mins' }
};

// Product categories
const productCategories = {
    'laptop': 'Electronics',
    'smartphone': 'Electronics',
    'tablet': 'Electronics', 
    'headphones': 'Accessories',
    'smartwatch': 'Wearables'
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    loadOrderDetails();
    setupAnimations();
    setupEventListeners();
    startStatusTimeline();
}

function loadOrderDetails() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Extract order data
    const orderData = {
        orderId: urlParams.get('orderId') || generateOrderId(),
        customerName: urlParams.get('customerName') || 'John Doe',
        customerLocation: urlParams.get('customerLocation') || 'New York, NY',
        product: urlParams.get('product') || 'laptop',
        sellerName: urlParams.get('sellerName'),
        sellerLocation: urlParams.get('sellerLocation'),
        distance: urlParams.get('distance')
    };
    
    // Update DOM elements
    updateOrderInformation(orderData);
}

function updateOrderInformation(orderData) {
    // Order information
    orderIdElement.textContent = '#' + orderData.orderId;
    orderDateElement.textContent = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Customer details
    customerNameElement.textContent = orderData.customerName;
    customerLocationElement.textContent = orderData.customerLocation;
    
    // Product information
    const productName = orderData.product.charAt(0).toUpperCase() + orderData.product.slice(1);
    productNameElement.textContent = productName;
    productCategoryElement.textContent = productCategories[orderData.product] || 'General';
    
    // Seller information (use provided data or fallback to sample data)
    // Seller information (use provided data or fallback to sample data)
const sellerInfo = orderData.sellerName ? {
    name: orderData.sellerName,
    location: orderData.sellerLocation || 'Near you',
    distance: orderData.distance ? orderData.distance + ' KM' : '1.5 KM',  // ✅ FIXED
    deliveryTime: calculateDeliveryTime(parseFloat(orderData.distance) || 1.5)
} : sellerData[orderData.product];

    sellerNameElement.textContent = sellerInfo.name;
    sellerLocationElement.textContent = sellerInfo.location;
    distanceElement.textContent = sellerInfo.distance;
    deliveryTimeElement.textContent = sellerInfo.deliveryTime;
    
    // Order time
    orderTimeElement.textContent = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
}

function calculateDeliveryTime(distance) {
    // Simple calculation: 15 minutes base + 10 minutes per km
    const baseTime = 15;
    const additionalTime = distance * 10;
    const totalMinutes = Math.ceil(baseTime + additionalTime);
    
    const minTime = totalMinutes;
    const maxTime = totalMinutes + 15;
    
    return `${minTime}-${maxTime} mins`;
}

function setupAnimations() {
    // Success icon animation
    setTimeout(() => {
        successIcon.classList.add('animate');
    }, 500);

    // Fade in text elements
    const textElements = document.querySelectorAll('.fade-in-text');
    textElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate');
        }, 800 + (index * 200));
    });

    // Fade in sections with stagger
    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('animate');
        }, 1200 + (index * 300));
    });
}

function setupEventListeners() {
    // Track button
    trackBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            showTrackingModal();
            this.style.transform = '';
        }, 150);
    });

    // Back button
    backBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            goBackToOrder();
        }, 150);
    });

    // Add hover effects for buttons
    [trackBtn, backBtn].forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function startStatusTimeline() {
    // Simulate status updates
    setTimeout(() => {
        updateTimelineStatus(1, 'Processing');
    }, 5000);
    
    setTimeout(() => {
        updateTimelineStatus(2, 'Out for Delivery');
    }, 15000);
}

function updateTimelineStatus(stepIndex, status) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems[stepIndex]) {
        timelineItems[stepIndex].classList.add('active');
        
        // Update time
        const timeElement = timelineItems[stepIndex].querySelector('small');
        timeElement.textContent = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Show notification
        showNotification(`Order status updated: ${status}`, 'info');
    }
}

function showTrackingModal() {
    // Create modal for tracking information
    const modal = document.createElement('div');
    modal.className = 'tracking-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Track Your Order</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="tracking-info">
                    <div class="tracking-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <h4>Current Location</h4>
                            <p>At seller's location - preparing your order</p>
                        </div>
                    </div>
                    <div class="tracking-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <h4>Estimated Delivery</h4>
                            <p>${deliveryTimeElement.textContent}</p>
                        </div>
                    </div>
                    <div class="tracking-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <h4>Contact Seller</h4>
                            <p>+1 (555) 123-4567</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .tracking-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(25px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            animation: modalSlideUp 0.3s ease;
        }
        
        @keyframes modalSlideUp {
            0% {
                opacity: 0;
                transform: translateY(30px) scale(0.9);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .modal-header h3 {
            color: white;
            font-size: 1.4rem;
            font-weight: 700;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: scale(1.1);
        }
        
        .tracking-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
        }
        
        .tracking-item i {
            color: #3b82f6;
            font-size: 1.5rem;
            width: 30px;
            text-align: center;
        }
        
        .tracking-item h4 {
            color: white;
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 0.3rem;
        }
        
        .tracking-item p {
            color: #d1d5db;
            font-size: 0.9rem;
        }
    `;
    
    // Add styles to document
    const styleElement = document.createElement('style');
    styleElement.textContent = modalStyles;
    document.head.appendChild(styleElement);
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeModal = () => {
        modal.style.animation = 'modalSlideUp 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.head.removeChild(styleElement);
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
}

function goBackToOrder() {
    // Add page transition effect
    document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
}

function showNotification(message, type = 'info') {
    // Create notification if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        
        // Add notification styles
        const notificationStyles = `
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
        
        const styleElement = document.createElement('style');
        styleElement.textContent = notificationStyles;
        document.head.appendChild(styleElement);
        
        document.body.appendChild(notification);
    }
    
    // Update notification
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.classList.add('show');
    
    // Auto hide
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Add page entrance animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        document.body.style.opacity = '1';
        document.body.style.transform = 'scale(1)';
    }, 100);
});

// Handle browser back button
window.addEventListener('popstate', function() {
    goBackToOrder();
});

// Add smooth scrolling
document.documentElement.style.scrollBehavior = 'smooth';