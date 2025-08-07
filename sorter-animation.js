// ===== SORTER ANİMASYONU JAVASCRIPT =====

class SorterAnimation {
    constructor() {
        this.isRunning = true;
        this.animationSpeed = 1;
        this.totalProducts = 0;
        this.products = [];
        this.basketCounts = {
            box: 0,
            envelope: 0,
            tote: 0,
            package: 0
        };
        this.lastProductTime = 0;
        this.animationId = null;
        
        // Responsive position calculations
        this.updateResponsiveSettings();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateResponsiveSettings();
        });
        
        this.init();
    }
    
    updateResponsiveSettings() {
        this.isMobile = window.innerWidth <= 768;
        this.basketPositions = this.isMobile ? {
            box: { x: 15, y: 85 },
            envelope: { x: 35, y: 85 },
            tote: { x: 55, y: 85 },
            package: { x: 75, y: 85 }
        } : {
            box: { x: 20, y: 85 },
            envelope: { x: 40, y: 85 },
            tote: { x: 60, y: 85 },
            package: { x: 80, y: 85 }
        };
        
        this.divertorPositions = this.isMobile ? [
            { x: 20, y: 30 },
            { x: 45, y: 30 },
            { x: 70, y: 30 },
            { x: 95, y: 30 }
        ] : [
            { x: 25, y: 30 },
            { x: 50, y: 30 },
            { x: 75, y: 30 },
            { x: 100, y: 30 }
        ];
    }
    
    init() {
        this.setupControls();
        this.setupPageVisibilityHandling();
        
        // Initialize belt animation speed (faster than product speed)
        const beltSurface = document.querySelector('.belt-surface');
        if (beltSurface) {
            const beltSpeed = this.isMobile ? 0.8 : 1; // Slower on mobile
            beltSurface.style.animationDuration = (beltSpeed / this.animationSpeed) + 's';
        }
        
        this.startAnimation();
        this.updateDashboard();
    }
    
    setupControls() {
        const pauseBtn = document.getElementById('pause-btn');
        const speedSlider = document.getElementById('speed-slider');
        const speedDisplay = document.getElementById('speed-display');
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.togglePause();
            });
        }
        
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.updateAnimationSpeed(parseFloat(e.target.value));
                if (speedDisplay) {
                    speedDisplay.textContent = e.target.value + 'x';
                }
            });
        }
    }
    
    setupPageVisibilityHandling() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isRunning = false;
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                }
            } else {
                if (!this.isRunning) {
                    this.isRunning = true;
                    this.startAnimation();
                }
            }
        });
    }
    
    togglePause() {
        this.isRunning = !this.isRunning;
        const pauseBtn = document.getElementById('pause-btn');
        
        if (pauseBtn) {
            if (this.isRunning) {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                pauseBtn.classList.remove('paused');
                this.startAnimation();
            } else {
                pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                pauseBtn.classList.add('paused');
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                }
            }
        }
    }
    
    updateAnimationSpeed(speed) {
        this.animationSpeed = speed;
        
        // Update belt animation speed (faster than product speed)
        const beltSurface = document.querySelector('.belt-surface');
        if (beltSurface) {
            const beltSpeed = this.isMobile ? 0.8 : 1; // Slower on mobile
            beltSurface.style.animationDuration = (beltSpeed / speed) + 's';
        }
        
        // Update roller animation speed
        const rollers = document.querySelectorAll('.roller');
        rollers.forEach(roller => {
            const rollerSpeed = this.isMobile ? 3 : 2; // Slower on mobile
            roller.style.animationDuration = (rollerSpeed / speed) + 's';
        });
    }
    
    startAnimation() {
        if (!this.isRunning) return;
        
        const animate = (currentTime) => {
            if (!this.isRunning) return;
            
            // Create products at intervals
            if (currentTime - this.lastProductTime > (2000 / this.animationSpeed)) {
                this.createProduct();
                this.lastProductTime = currentTime;
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    createProduct() {
        const productTypes = ['box', 'envelope', 'tote', 'package'];
        const randomType = productTypes[Math.floor(Math.random() * productTypes.length)];
        
        const product = document.createElement('div');
        product.className = `product ${randomType}`;
        product.dataset.type = randomType; // Store the type in dataset
        product.style.left = '0%';
        product.style.top = '50%';
        product.style.transform = 'translateY(-50%)';
        
        // Adjust product speed for mobile
        const productSpeed = this.isMobile ? 5 : 4; // Slower on mobile
        product.style.transition = `left ${productSpeed / this.animationSpeed}s linear`;
        
        const label = document.createElement('div');
        label.className = 'product-label';
        label.textContent = randomType.charAt(0).toUpperCase();
        product.appendChild(label);
        
        const conveyorBelt = document.querySelector('.conveyor-belt');
        if (conveyorBelt) {
            conveyorBelt.appendChild(product);
            this.products.push({ element: product, type: randomType });
            
            // Use requestAnimationFrame for smoother animations
            requestAnimationFrame(() => {
                product.style.left = '100%';
            });
            
            // Check for drop when product reaches divertor position
            this.checkForDrop(product, randomType);
        }
    }
    
    checkForDrop(product, type) {
        const divertor = document.querySelector(`.divertor[data-type="${type}"]`);
        if (!divertor) return;
        
        const divertorRect = divertor.getBoundingClientRect();
        const conveyorRect = document.querySelector('.conveyor-belt').getBoundingClientRect();
        const divertorX = divertorRect.left - conveyorRect.left;
        const dropX = (divertorX / conveyorRect.width) * 100;
        
        // Check if product has reached the divertor position
        const checkPosition = () => {
            const productRect = product.getBoundingClientRect();
            const productX = productRect.left - conveyorRect.left;
            const productXPercent = (productX / conveyorRect.width) * 100;
            
            if (productXPercent >= dropX - 5 && productXPercent <= dropX + 5) {
                // Product has reached divertor position, drop it
                this.dropProduct(product, type);
            } else if (productXPercent < 100) {
                // Continue checking
                requestAnimationFrame(checkPosition);
            }
        };
        
        requestAnimationFrame(checkPosition);
    }
    
    dropProduct(product, type) {
        // Get the actual product type from the product element
        const actualType = product.dataset.type || type;
        
        // Find the correct divertor based on actual product type
        const divertor = document.querySelector(`.divertor[data-type="${actualType}"]`);
        
        if (divertor) {
            // Get divertor position
            const divertorRect = divertor.getBoundingClientRect();
            const conveyorRect = document.querySelector('.conveyor-belt').getBoundingClientRect();
            const divertorX = divertorRect.left - conveyorRect.left;
            const divertorY = divertorRect.top - conveyorRect.top;
            
            // Activate divertor
            divertor.classList.add('active');
            
            // Stop the left animation first
            product.style.transition = 'none';
            
            // Move product to divertor position
            const dropX = (divertorX / conveyorRect.width) * 100; // Convert to percentage
            product.style.left = `${dropX}%`;
            
            // Force a reflow to apply the position change
            product.offsetHeight;
            
            // Now apply the drop animation
            product.style.transition = `all ${0.6 / this.animationSpeed}s ease-in`;
            product.style.transform = `translate3d(0, 80px, 0) scale(0.5)`;
            product.style.opacity = '0';
            
            // Update basket count
            this.basketCounts[actualType]++;
            this.updateBasketCount(actualType);
            
            // Deactivate divertor
            setTimeout(() => {
                divertor.classList.remove('active');
            }, 600 / this.animationSpeed);
            
            // Remove product
            setTimeout(() => {
                if (product.parentNode) {
                    product.parentNode.removeChild(product);
                }
                this.products = this.products.filter(p => p.element !== product);
            }, 600 / this.animationSpeed);
        }
    }
    
    updateBasketCount(type) {
        const basket = document.querySelector(`.drop-basket[data-type="${type}"] .basket-count`);
        if (basket) {
            basket.textContent = this.basketCounts[type];
        }
    }
    
    updateDashboard() {
        setInterval(() => {
            if (!this.isRunning) return;
            
            const speedValue = document.getElementById('speed-value');
            const capacityValue = document.getElementById('capacity-value');
            const efficiencyValue = document.getElementById('efficiency-value');
            const totalValue = document.getElementById('total-value');
            
            if (speedValue) {
                speedValue.textContent = Math.round(60 * this.animationSpeed);
            }
            
            if (capacityValue) {
                capacityValue.textContent = Math.round(1200 * this.animationSpeed);
            }
            
            if (efficiencyValue) {
                efficiencyValue.textContent = (98.5 + Math.random() * 1).toFixed(1);
            }
            
            if (totalValue) {
                this.totalProducts++;
                totalValue.textContent = this.totalProducts;
            }
        }, 1000);
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SorterAnimation();
}); 