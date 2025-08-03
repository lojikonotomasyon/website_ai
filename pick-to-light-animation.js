// Pick to Light Animation
class PickToLightAnimation {
    constructor() {
        this.currentItemIndex = 0;
        this.isAnimating = true; // Changed to true for auto-start
        this.pickOrder = [
            { id: 1, name: 'Ürün A', quantity: 2 },
            { id: 3, name: 'Ürün C', quantity: 3 },
            { id: 2, name: 'Ürün B', quantity: 1 },
            { id: 5, name: 'Ürün E', quantity: 2 },
            { id: 4, name: 'Ürün D', quantity: 1 },
            { id: 6, name: 'Ürün F', quantity: 1 }
        ];
        this.pickedItems = [];
        this.animationSpeed = 2000; // ms
        
        this.initializeElements();
        this.bindEvents();
        // Auto-start the animation
        this.startAnimation();
        
        // Add page visibility handling
        this.setupPageVisibilityHandling();
    }
    
    setupPageVisibilityHandling() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, pause animation
                this.resetAnimation();
            } else {
                // Page is visible, resume animation
                this.startAnimation();
            }
        });
    }
    
    initializeElements() {
        this.shelfCells = document.querySelectorAll('.shelf-cell');
        this.lightIndicators = document.querySelectorAll('.light-indicator');
        this.cartItems = document.getElementById('cartItems');
        this.pickStatus = document.getElementById('pickStatus');
        this.pickSpeed = document.getElementById('pickSpeed');
        this.pickAccuracy = document.getElementById('pickAccuracy');
        
        // Control buttons
        this.startButton = document.getElementById('startPickAnimation');
        this.resetButton = document.getElementById('resetPickAnimation');
        this.nextButton = document.getElementById('nextItem');
        this.completeButton = document.getElementById('completeOrder');
    }
    
    bindEvents() {
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.startAnimation());
        }
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.resetAnimation());
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextItem());
        }
        if (this.completeButton) {
            this.completeButton.addEventListener('click', () => this.completeOrder());
        }
        
        // Add click events to shelf cells
        this.shelfCells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.pickItem(index + 1));
        });
    }
    
    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentItemIndex = 0;
        this.pickedItems = [];
        this.updateStatus('Toplama başladı');
        this.updateSpeed('0');
        this.updateAccuracy('100');
        
        this.startButton.disabled = true;
        this.nextButton.disabled = false;
        this.completeButton.disabled = true;
        
        this.highlightCurrentItem();
    }
    
    resetAnimation() {
        this.isAnimating = false;
        this.currentItemIndex = 0;
        this.pickedItems = [];
        
        // Reset all indicators
        this.lightIndicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        this.shelfCells.forEach(cell => {
            cell.classList.remove('active');
        });
        
        // Clear cart
        this.cartItems.innerHTML = '';
        
        // Reset status
        this.updateStatus('Hazır');
        this.updateSpeed('0');
        this.updateAccuracy('100');
        
        // Reset buttons
        this.startButton.disabled = false;
        this.nextButton.disabled = true;
        this.completeButton.disabled = true;
    }
    
    nextItem() {
        if (!this.isAnimating || this.currentItemIndex >= this.pickOrder.length) return;
        
        this.highlightCurrentItem();
        this.updateStatus(`Toplanacak: ${this.pickOrder[this.currentItemIndex].name}`);
    }
    
    pickItem(itemId) {
        if (!this.isAnimating) return;
        
        const currentOrder = this.pickOrder[this.currentItemIndex];
        if (currentOrder && currentOrder.id === itemId) {
            // Correct item picked
            this.addToCart(currentOrder);
            this.pickedItems.push(currentOrder);
            
            // Move to next item
            this.currentItemIndex++;
            
            if (this.currentItemIndex < this.pickOrder.length) {
                this.highlightCurrentItem();
                this.updateStatus(`Toplanacak: ${this.pickOrder[this.currentItemIndex].name}`);
            } else {
                this.completeOrder();
            }
            
            // Update performance metrics
            const speed = Math.round((this.pickedItems.length / 6) * 300); // 300 items/hour base
            this.updateSpeed(speed.toString());
            this.updateAccuracy('100');
        } else {
            // Wrong item picked
            this.updateAccuracy('95');
            this.updateStatus('Yanlış ürün seçildi!');
        }
    }
    
    highlightCurrentItem() {
        // Remove all active states
        this.lightIndicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        this.shelfCells.forEach(cell => {
            cell.classList.remove('active');
        });
        
        if (this.currentItemIndex < this.pickOrder.length) {
            const currentOrder = this.pickOrder[this.currentItemIndex];
            const targetCell = document.querySelector(`[data-item-id="${currentOrder.id}"]`);
            const targetIndicator = targetCell.querySelector('.light-indicator');
            
            if (targetCell && targetIndicator) {
                targetCell.classList.add('active');
                targetIndicator.classList.add('active');
            }
        }
    }
    
    addToCart(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <i class="fas fa-box"></i>
            <span>${item.name} (${item.quantity} adet)</span>
        `;
        
        this.cartItems.appendChild(cartItem);
    }
    
    completeOrder() {
        if (this.pickedItems.length === this.pickOrder.length) {
            this.updateStatus('Sipariş tamamlandı!');
            this.updateSpeed('300');
            this.updateAccuracy('100');
            
            this.startButton.disabled = false;
            this.nextButton.disabled = true;
            this.completeButton.disabled = true;
            
            this.isAnimating = false;
            
            // Show completion animation
            setTimeout(() => {
                this.showCompletionMessage();
            }, 1000);
        } else {
            this.updateStatus('Tüm ürünler toplanmadı!');
        }
    }
    
    showCompletionMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--accent);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
        `;
        message.textContent = '🎉 Sipariş başarıyla tamamlandı!';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }
    
    updateStatus(status) {
        if (this.pickStatus) {
            this.pickStatus.textContent = status;
        }
    }
    
    updateSpeed(speed) {
        if (this.pickSpeed) {
            this.pickSpeed.textContent = `${speed} ürün/saat`;
        }
    }
    
    updateAccuracy(accuracy) {
        if (this.pickAccuracy) {
            this.pickAccuracy.textContent = `%${accuracy}`;
        }
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PickToLightAnimation();
});

// Add CSS for completion message animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style); 