// ===== MINILOAD ANİMASYONU JAVASCRIPT =====

class MiniloadAnimation {
    constructor() {
        this.isRunning = false;
        this.storedCount = 0;
        this.retrievedCount = 0;
        this.animationId = null;
        
        // Responsive position calculations
        this.isMobile = window.innerWidth <= 768;
        this.currentPosition = this.isMobile ? { x: 50, y: 15 } : { x: 50, y: 20 };
        this.targetPosition = this.isMobile ? { x: 50, y: 15 } : { x: 50, y: 20 };
        
        this.init();
    }
    
    init() {
        this.setupControls();
        this.updateDisplay();
    }
    
    setupControls() {
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        const resetBtn = document.getElementById('reset-btn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startAnimation();
            });
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopAnimation();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetAnimation();
            });
        }
    }
    
    startAnimation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.updateStatus('Çalışıyor');
        this.animateShuttle();
    }
    
    stopAnimation() {
        this.isRunning = false;
        this.updateStatus('Durduruldu');
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    resetAnimation() {
        this.isRunning = false;
        this.storedCount = 0;
        this.retrievedCount = 0;
        this.currentPosition = this.isMobile ? { x: 50, y: 15 } : { x: 50, y: 20 };
        this.targetPosition = this.isMobile ? { x: 50, y: 15 } : { x: 50, y: 20 };
        this.updateStatus('Sıfırlandı');
        this.updateDisplay();
        this.resetShuttlePosition();
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animateShuttle() {
        if (!this.isRunning) return;
        
        // Random target position with responsive calculations
        const rackX = Math.random() > 0.5 ? 25 : 75;
        const levelY = this.isMobile ? 
            Math.floor(Math.random() * 4) * 15 + 15 : 
            Math.floor(Math.random() * 4) * 20 + 20;
        
        this.targetPosition = { x: rackX, y: levelY };
        
        // Move shuttle with hardware acceleration
        this.moveShuttle(this.targetPosition);
        
        // Simulate storage/retrieval
        setTimeout(() => {
            if (Math.random() > 0.5) {
                this.storedCount++;
                this.updateStatus('Depolanıyor');
            } else {
                this.retrievedCount++;
                this.updateStatus('Alınıyor');
            }
            this.updateDisplay();
            
            // Continue animation
            setTimeout(() => {
                if (this.isRunning) {
                    this.animateShuttle();
                }
            }, 2000);
        }, 1500);
    }
    
    moveShuttle(targetPos) {
        const shuttle = document.getElementById('shuttle');
        if (shuttle) {
            // Use transform3d for hardware acceleration
            shuttle.style.transform = `translate3d(${targetPos.x}%, ${targetPos.y}%, 0)`;
            this.currentPosition = targetPos;
        }
    }
    
    resetShuttlePosition() {
        const shuttle = document.getElementById('shuttle');
        if (shuttle) {
            shuttle.style.transform = `translate3d(50%, ${this.isMobile ? '15%' : '20%'}, 0)`;
            this.currentPosition = this.isMobile ? { x: 50, y: 15 } : { x: 50, y: 20 };
        }
    }
    
    updateStatus(status) {
        const statusElement = document.getElementById('status-value');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }
    
    updateDisplay() {
        const storedElement = document.getElementById('stored-value');
        const retrievedElement = document.getElementById('retrieved-value');
        const totalElement = document.getElementById('total-value');
        
        if (storedElement) {
            storedElement.textContent = this.storedCount;
        }
        
        if (retrievedElement) {
            retrievedElement.textContent = this.retrievedCount;
        }
        
        if (totalElement) {
            totalElement.textContent = this.storedCount + this.retrievedCount;
        }
    }
    
    updatePerformanceIndicators() {
        setInterval(() => {
            const speedElement = document.getElementById('speed-value');
            const capacityElement = document.getElementById('capacity-value');
            const efficiencyElement = document.getElementById('efficiency-value');
            const uptimeElement = document.getElementById('uptime-value');
            
            if (speedElement) {
                speedElement.textContent = this.isRunning ? '3.2 m/s' : '0 m/s';
            }
            
            if (capacityElement) {
                capacityElement.textContent = Math.floor(Math.random() * 100) + 200;
            }
            
            if (efficiencyElement) {
                efficiencyElement.textContent = (96 + Math.random() * 4).toFixed(1) + '%';
            }
            
            if (uptimeElement) {
                uptimeElement.textContent = (99.8 + Math.random() * 0.2).toFixed(2) + '%';
            }
        }, 1000);
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animation = new MiniloadAnimation();
    animation.updatePerformanceIndicators();
}); 