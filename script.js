document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    const existingCustomerSelect = document.getElementById('existingCustomer');
    const newCustomerNameInput = document.getElementById('newCustomerName');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const productSelect = document.getElementById('product');
    const submitBtn = document.getElementById('submitBtn');
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    const alertClose = document.getElementById('alertClose');

    // Sample customer data
    const customerData = {
        'john_doe': { name: 'John Doe', lat: 26.9124, lng: 75.7873 },
        'jane_smith': { name: 'Jane Smith', lat: 26.9200, lng: 75.8000 },
        'mike_johnson': { name: 'Mike Johnson', lat: 26.9300, lng: 75.7900 },
        'sarah_wilson': { name: 'Sarah Wilson', lat: 26.9150, lng: 75.7950 }
    };

    // Sample seller data
    const sellerData = [
        { name: 'TechHub Electronics', lat: 26.9200, lng: 75.7900, products: ['laptop', 'smartphone', 'tablet'] },
        { name: 'Digital World', lat: 26.9100, lng: 75.7800, products: ['headphones', 'smartwatch', 'smartphone'] },
        { name: 'Gadget Store', lat: 26.9250, lng: 75.7950, products: ['laptop', 'tablet', 'headphones'] },
        { name: 'Electronics Plus', lat: 26.9180, lng: 75.7920, products: ['smartphone', 'smartwatch', 'tablet'] }
    ];

    // Animation on form load
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(30px)';
        setTimeout(() => {
            group.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 150 + 300);
    });

    // Live validation for all inputs
    const allInputs = [existingCustomerSelect, newCustomerNameInput, latitudeInput, longitudeInput, productSelect];
    
    allInputs.forEach(input => {
        input.addEventListener('input', validateInput);
        input.addEventListener('blur', validateInput);
        input.addEventListener('focus', function() {
            this.classList.remove('invalid');
        });
    });

    function validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        
        // Remove previous validation classes
        input.classList.remove('valid', 'invalid');
        
        if (input === existingCustomerSelect) {
            if (value && customerData[value]) {
                input.classList.add('valid');
            }
        } else if (input === newCustomerNameInput) {
            if (value.length >= 2) {
                input.classList.add('valid');
            } else if (value.length > 0) {
                input.classList.add('invalid');
            }
        } else if (input === latitudeInput || input === longitudeInput) {
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue !== 0) {
                if (input === latitudeInput && numValue >= -90 && numValue <= 90) {
                    input.classList.add('valid');
                } else if (input === longitudeInput && numValue >= -180 && numValue <= 180) {
                    input.classList.add('valid');
                } else if (value.length > 0) {
                    input.classList.add('invalid');
                }
            } else if (value.length > 0) {
                input.classList.add('invalid');
            }
        } else if (input === productSelect) {
            if (value) {
                input.classList.add('valid');
            }
        }
    }

    // Handle existing customer selection
    existingCustomerSelect.addEventListener('change', function() {
        const selectedCustomer = this.value;
        if (selectedCustomer && customerData[selectedCustomer]) {
            const customer = customerData[selectedCustomer];
            newCustomerNameInput.value = '';
            newCustomerNameInput.classList.remove('valid', 'invalid');
            latitudeInput.value = customer.lat;
            longitudeInput.value = customer.lng;
            
            // Trigger validation for coordinates
            latitudeInput.classList.add('valid');
            longitudeInput.classList.add('valid');
        } else {
            latitudeInput.value = '';
            longitudeInput.value = '';
            latitudeInput.classList.remove('valid', 'invalid');
            longitudeInput.classList.remove('valid', 'invalid');
        }
    });

    // Clear existing customer when typing new customer name
    newCustomerNameInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            existingCustomerSelect.value = '';
            existingCustomerSelect.classList.remove('valid', 'invalid');
        }
    });

    // Enhanced alert functions
    function showAlert(message, type = 'error') {
        alertMessage.textContent = message;
        alertBox.className = `alert-box ${type} show`;
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideAlert();
        }, 5000);
        
        // Add shake animation for errors
        if (type === 'error') {
            alertBox.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                alertBox.style.animation = '';
            }, 500);
        }
    }

    function hideAlert() {
        alertBox.classList.remove('show');
    }

    // Add shake animation keyframes via JavaScript
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);

    alertClose.addEventListener('click', hideAlert);

    // Calculate distance between two points (Haversine formula)
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

    // Find nearest seller
    function findNearestSeller(customerLat, customerLng, product) {
        const availableSellers = sellerData.filter(seller => 
            seller.products.includes(product)
        );

        if (availableSellers.length === 0) {
            return null;
        }

        let nearestSeller = null;
        let minDistance = Infinity;

        availableSellers.forEach(seller => {
            const distance = calculateDistance(customerLat, customerLng, seller.lat, seller.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearestSeller = { ...seller, distance: distance.toFixed(2) };
            }
        });

        return nearestSeller;
    }

    // Generate order ID
    function generateOrderId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }

    // Enhanced button loading animation
    function setLoadingState(loading) {
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.style.transform = 'scale(0.98)';
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.style.transform = '';
        }
    }

    // Form validation and submission
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show loading state
        setLoadingState(true);

        // Add realistic delay for better UX
        setTimeout(() => {
            const existingCustomer = existingCustomerSelect.value;
            const newCustomerName = newCustomerNameInput.value.trim();
            const latitude = parseFloat(latitudeInput.value);
            const longitude = parseFloat(longitudeInput.value);
            const product = productSelect.value;

            // Reset loading state
            setLoadingState(false);

            // Validation with enhanced messages
            if (!product) {
                showAlert('Please select a product to continue', 'error');
                productSelect.focus();
                productSelect.classList.add('invalid');
                return;
            }

            let customerName, customerLat, customerLng;

            // Determine customer details
            if (newCustomerName) {
                // New customer validation
                if (newCustomerName.length < 2) {
                    showAlert('Customer name must be at least 2 characters long', 'error');
                    newCustomerNameInput.focus();
                    newCustomerNameInput.classList.add('invalid');
                    return;
                }
                if (!latitude || !longitude) {
                    showAlert('Please enter both latitude and longitude for the new customer', 'error');
                    (!latitude ? latitudeInput : longitudeInput).focus();
                    return;
                }
                if (isNaN(latitude) || isNaN(longitude)) {
                    showAlert('Please enter valid numeric values for coordinates', 'error');
                    return;
                }
                if (latitude < -90 || latitude > 90) {
                    showAlert('Latitude must be between -90 and 90 degrees', 'error');
                    latitudeInput.focus();
                    latitudeInput.classList.add('invalid');
                    return;
                }
                if (longitude < -180 || longitude > 180) {
                    showAlert('Longitude must be between -180 and 180 degrees', 'error');
                    longitudeInput.focus();
                    longitudeInput.classList.add('invalid');
                    return;
                }
                customerName = newCustomerName;
                customerLat = latitude;
                customerLng = longitude;
            } else if (existingCustomer) {
                // Existing customer
                const customer = customerData[existingCustomer];
                customerName = customer.name;
                customerLat = customer.lat;
                customerLng = customer.lng;
            } else {
                showAlert('Please either select an existing customer or enter new customer details', 'error');
                existingCustomerSelect.focus();
                return;
            }

            // Find nearest seller
            const nearestSeller = findNearestSeller(customerLat, customerLng, product);

            if (!nearestSeller) {
                showAlert(`Sorry, no sellers available for ${product} in your area`, 'error');
                return;
            }

            // Success feedback
            showAlert('Order processed successfully! Redirecting...', 'success');

            // Generate order details
            const orderId = generateOrderId();
            const customerLocation = `${customerLat}, ${customerLng}`;
            const sellerLocation = `${nearestSeller.lat}, ${nearestSeller.lng}`;

            // Create URL parameters for confirmation page
            const params = new URLSearchParams({
                orderId: orderId,
                customerName: customerName,
                customerLocation: customerLocation,
                productName: product.charAt(0).toUpperCase() + product.slice(1),
                sellerName: nearestSeller.name,
                sellerLocation: sellerLocation,
                distance: nearestSeller.distance
            });

            // Redirect with smooth transition
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.3s ease';
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = `confirmation.html?${params.toString()}`;
                }, 300);
            }, 1500);

        }, 1500); // Simulate processing time
    });

    // Enhanced input interactions
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-3px) scale(1.02)';
            this.parentElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced tooltip interactions
    const tooltips = document.querySelectorAll('.tooltip-icon');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-50%) scale(1.3) rotate(720deg)';
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        tooltip.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';
        });
    });

    // Add microinteractions for form elements
    const inputContainers = document.querySelectorAll('.input-container');
    inputContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            if (!this.querySelector('.form-input').matches(':focus')) {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'transform 0.3s ease';
                this.style.filter = 'brightness(1.1)';
            }
        });
        
        container.addEventListener('mouseleave', function() {
            if (!this.querySelector('.form-input').matches(':focus')) {
                this.style.transform = 'translateY(0)';
                this.style.filter = 'brightness(1)';
            }
        });
    });

    // Add smooth page transitions
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href && this.href.includes('.html')) {
                e.preventDefault();
                document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                document.body.style.opacity = '0';
                document.body.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    window.location.href = this.href;
                }, 300);
            }
        });
    });

    // Add entrance animation for form elements
    setTimeout(() => {
        const card = document.querySelector('.form-card');
        if (card) {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.opacity = '1';
        }
    }, 100);
});