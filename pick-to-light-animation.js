// ===== PICK-TO-LIGHT ANİMASYONU JAVASCRIPT =====

class PickToLightAnimation {
    constructor() {
        this.isRunning = false;
        this.currentStation = 0;
        this.completedPicks = 0;
        this.errorCount = 0;
        this.pickSequence = [];
        this.currentPick = 0;
        
        this.init();
    }
    
    init() {
        this.setupControls();
        this.generatePickSequence();
        this.updateDisplay();
    }
    
    setupControls() {
        const startBtn = document.getElementById('start-pick');
        const stopBtn = document.getElementById('stop-pick');
        const resetBtn = document.getElementById('reset-pick');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startPicking();
            });
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopPicking();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetPicking();
            });
        }
    }
    
    generatePickSequence() {
        this.pickSequence = [];
        const stations = [1, 2, 3, 4];
        
        // Generate random pick sequence
        for (let i = 0; i < 8; i++) {
            const randomStation = stations[Math.floor(Math.random() * stations.length)];
            const randomQuantity = Math.floor(Math.random() * 5) + 1;
            this.pickSequence.push({
                station: randomStation,
                quantity: randomQuantity
            });
        }
    }
    
    startPicking() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.currentPick = 0;
        this.updateStatus('Toplama Başladı');
        this.processNextPick();
    }
    
    stopPicking() {
        this.isRunning = false;
        this.updateStatus('Durduruldu');
        this.deactivateAllStations();
    }
    
    resetPicking() {
        this.isRunning = false;
        this.completedPicks = 0;
        this.errorCount = 0;
        this.currentPick = 0;
        this.generatePickSequence();
        this.updateStatus('Sıfırlandı');
        this.updateDisplay();
        this.deactivateAllStations();
        this.resetCartPosition();
    }
    
    processNextPick() {
        if (!this.isRunning || this.currentPick >= this.pickSequence.length) {
            this.isRunning = false;
            this.updateStatus('Tamamlandı');
            this.deactivateAllStations();
            return;
        }
        
        const pick = this.pickSequence[this.currentPick];
        this.activateStation(pick.station, pick.quantity);
        this.moveCartToStation(pick.station);
        
        // Simulate pick completion
        setTimeout(() => {
            if (this.isRunning) {
                this.completePick(pick.station);
                this.currentPick++;
                this.processNextPick();
            }
        }, 3000);
    }
    
    activateStation(stationNumber, quantity) {
        // Deactivate all stations first
        this.deactivateAllStations();
        
        // Activate target station
        const station = document.querySelector(`[data-station="${stationNumber}"]`);
        const lightIndicator = station.querySelector('.light-indicator');
        const productSlot = station.querySelector('.product-slot');
        const quantityDisplay = station.querySelector('.quantity-display');
        
        if (station && lightIndicator && productSlot && quantityDisplay) {
            station.classList.add('active');
            lightIndicator.classList.add('active');
            productSlot.classList.add('active');
            quantityDisplay.textContent = quantity;
        }
    }
    
    deactivateAllStations() {
        const stations = document.querySelectorAll('.station');
        stations.forEach(station => {
            station.classList.remove('active');
            const lightIndicator = station.querySelector('.light-indicator');
            const productSlot = station.querySelector('.product-slot');
            if (lightIndicator) lightIndicator.classList.remove('active');
            if (productSlot) productSlot.classList.remove('active');
        });
    }
    
    moveCartToStation(stationNumber) {
        const cart = document.getElementById('pick-cart');
        if (cart) {
            // Calculate position based on station
            const positions = {
                1: { left: '25%', bottom: '20px' },
                2: { left: '40%', bottom: '20px' },
                3: { left: '55%', bottom: '20px' },
                4: { left: '70%', bottom: '20px' }
            };
            
            const position = positions[stationNumber];
            if (position) {
                cart.style.left = position.left;
                cart.style.bottom = position.bottom;
            }
        }
    }
    
    resetCartPosition() {
        const cart = document.getElementById('pick-cart');
        if (cart) {
            cart.style.left = '20px';
            cart.style.bottom = '20px';
        }
    }
    
    completePick(stationNumber) {
        this.completedPicks++;
        
        // Simulate occasional errors
        if (Math.random() < 0.1) {
            this.errorCount++;
        }
        
        this.updateDisplay();
        this.updateStatus(`A${stationNumber} Tamamlandı`);
    }
    
    updateStatus(status) {
        const statusElement = document.getElementById('pick-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }
    
    updateDisplay() {
        const completedElement = document.getElementById('completed-picks');
        const errorElement = document.getElementById('error-count');
        const efficiencyElement = document.getElementById('pick-efficiency');
        
        if (completedElement) {
            completedElement.textContent = this.completedPicks;
        }
        
        if (errorElement) {
            errorElement.textContent = this.errorCount;
        }
        
        if (efficiencyElement) {
            const totalPicks = this.completedPicks + this.errorCount;
            const efficiency = totalPicks > 0 ? ((this.completedPicks / totalPicks) * 100) : 98.5;
            efficiencyElement.textContent = efficiency.toFixed(1);
        }
    }
    
    updatePerformanceIndicators() {
        setInterval(() => {
            const speedElement = document.getElementById('pick-speed');
            const accuracyElement = document.getElementById('pick-accuracy');
            
            if (speedElement) {
                speedElement.textContent = this.isRunning ? '800' : '0';
            }
            
            if (accuracyElement) {
                const accuracy = 99.9 - (this.errorCount * 0.1);
                accuracyElement.textContent = Math.max(99.0, accuracy).toFixed(1);
            }
        }, 1000);
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const pickToLightAnimation = document.querySelector('.pick-to-light-hero-animation');
    if (pickToLightAnimation) {
        const pickToLight = new PickToLightAnimation();
        pickToLight.updatePerformanceIndicators();
    }
}); 