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
        this.isMobile = window.innerWidth <= 768;
        this.basketPositions = this.isMobile ? {
            box: { x: 20, y: 85 },
            envelope: { x: 45, y: 85 },
            tote: { x: 70, y: 85 },
            package: { x: 95, y: 85 }
        } : {
            box: { x: 25, y: 85 },
            envelope: { x: 50, y: 85 },
            tote: { x: 75, y: 85 },
            package: { x: 100, y: 85 }
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
        
        this.init();
    }
    
    init() {
        this.setupControls();
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
        
        // Update belt animation speed
        const beltSurface = document.querySelector('.belt-surface');
        if (beltSurface) {
            beltSurface.style.animationDuration = (8 / speed) + 's';
        }
        
        // Update roller animation speed
        const rollers = document.querySelectorAll('.roller');
        rollers.forEach(roller => {
            roller.style.animationDuration = (2 / speed) + 's';
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
        product.style.left = '0%';
        product.style.top = '50%';
        product.style.transform = 'translateY(-50%)';
        product.style.transition = `left ${3 / this.animationSpeed}s linear`;
        
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
            
            // Check for drop
            setTimeout(() => {
                this.dropProduct(product, randomType);
            }, 3000 / this.animationSpeed);
        }
    }
    
    dropProduct(product, type) {
        const divertor = document.querySelector(`[data-type="${type}"]`);
        if (divertor) {
            // Activate divertor
            divertor.classList.add('active');
            
            // Drop animation with transform3d for hardware acceleration
            product.style.transition = `all ${0.5 / this.animationSpeed}s ease-in`;
            product.style.transform = 'translate3d(0, 100px, 0) scale(0.8)';
            product.style.opacity = '0';
            
            // Update basket count
            this.basketCounts[type]++;
            this.updateBasketCount(type);
            
            // Deactivate divertor
            setTimeout(() => {
                divertor.classList.remove('active');
            }, 500 / this.animationSpeed);
            
            // Remove product
            setTimeout(() => {
                if (product.parentNode) {
                    product.parentNode.removeChild(product);
                }
                this.products = this.products.filter(p => p.element !== product);
            }, 500 / this.animationSpeed);
        }
    }
    
    updateBasketCount(type) {
        const basket = document.querySelector(`[data-type="${type}"] .basket-count`);
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