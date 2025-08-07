// ===== PALLET LİFT ANİMASYONU JAVASCRIPT =====

class PalletLiftAnimation {
    constructor() {
        this.currentFloor = 1;
        this.targetFloor = 1;
        this.isMoving = false;
        this.isAutoMode = false;
        this.autoInterval = null;
        this.animationId = null;
        
        // Responsive floor height calculations
        this.isMobile = window.innerWidth <= 768;
        this.floorHeights = this.isMobile ? {
            1: 15,
            2: 110,
            3: 205,
            4: 300
        } : {
            1: 20,
            2: 150,
            3: 280,
            4: 410
        };
        
        this.init();
    }
    
    init() {
        this.setupControls();
        this.updateDisplay();
        this.startAutoMode();
    }
    
    setupControls() {
        // Floor buttons
        const floorButtons = document.querySelectorAll('.floor-btn');
        floorButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const floor = parseInt(btn.dataset.floor);
                this.goToFloor(floor);
            });
        });
        
        // Control buttons
        const emergencyStop = document.getElementById('emergency-stop');
        const autoMode = document.getElementById('auto-mode');
        
        if (emergencyStop) {
            emergencyStop.addEventListener('click', () => {
                this.emergencyStop();
            });
        }
        
        if (autoMode) {
            autoMode.addEventListener('click', () => {
                this.toggleAutoMode();
            });
        }
    }
    
    goToFloor(floor) {
        if (this.isMoving || floor === this.currentFloor) return;
        
        this.targetFloor = floor;
        this.isMoving = true;
        this.updateStatus('Hareket Ediyor');
        
        // Update floor buttons
        document.querySelectorAll('.floor-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-floor="${floor}"]`).classList.add('active');
        
        // Update floors
        document.querySelectorAll('.floor').forEach(floorEl => {
            floorEl.classList.remove('active');
        });
        document.querySelector(`[data-floor="${floor}"]`).classList.add('active');
        
        // Move lift platform with hardware acceleration
        const liftPlatform = document.getElementById('lift-platform');
        const pallet = document.getElementById('pallet');
        const counterweight = document.getElementById('counterweight');
        
        if (liftPlatform && pallet && counterweight) {
            const targetHeight = this.floorHeights[floor];
            
            // Use transform3d for hardware acceleration
            liftPlatform.style.transform = `translate3d(0, 0, 0)`;
            liftPlatform.style.bottom = `${targetHeight}px`;
            
            pallet.style.transform = `translate3d(0, 0, 0)`;
            pallet.style.bottom = `${targetHeight + 20}px`;
            
            counterweight.style.transform = `translate3d(0, 0, 0)`;
            counterweight.style.top = `${this.floorHeights[4] - targetHeight}px`;
        }
        
        // Open doors after movement
        setTimeout(() => {
            this.openDoors(floor);
            this.currentFloor = floor;
            this.isMoving = false;
            this.updateStatus('Hazır');
            this.updateDisplay();
        }, 3000);
    }
    
    openDoors(floor) {
        const floorElement = document.querySelector(`[data-floor="${floor}"]`);
        if (floorElement) {
            const leftDoor = floorElement.querySelector('.left-door');
            const rightDoor = floorElement.querySelector('.right-door');
            
            if (leftDoor && rightDoor) {
                leftDoor.classList.add('open');
                rightDoor.classList.add('open');
                
                // Close doors after delay
                setTimeout(() => {
                    leftDoor.classList.remove('open');
                    rightDoor.classList.remove('open');
                }, 2000);
            }
        }
    }
    
    emergencyStop() {
        this.isMoving = false;
        this.isAutoMode = false;
        this.updateStatus('Acil Durum');
        
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Reset auto mode button
        const autoModeBtn = document.getElementById('auto-mode');
        if (autoModeBtn) {
            autoModeBtn.classList.remove('active');
        }
    }
    
    toggleAutoMode() {
        this.isAutoMode = !this.isAutoMode;
        const autoModeBtn = document.getElementById('auto-mode');
        
        if (autoModeBtn) {
            if (this.isAutoMode) {
                autoModeBtn.classList.add('active');
                this.startAutoMode();
            } else {
                autoModeBtn.classList.remove('active');
                if (this.autoInterval) {
                    clearInterval(this.autoInterval);
                    this.autoInterval = null;
                }
            }
        }
    }
    
    startAutoMode() {
        if (!this.isAutoMode) return;
        
        this.autoInterval = setInterval(() => {
            if (!this.isMoving) {
                const randomFloor = Math.floor(Math.random() * 4) + 1;
                this.goToFloor(randomFloor);
            }
        }, 5000);
    }
    
    updateStatus(status) {
        const statusElement = document.getElementById('status-value');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }
    
    updateDisplay() {
        const currentFloorElement = document.getElementById('current-floor');
        const targetFloorElement = document.getElementById('target-floor');
        const directionElement = document.getElementById('direction');
        
        if (currentFloorElement) {
            currentFloorElement.textContent = this.currentFloor;
        }
        
        if (targetFloorElement) {
            targetFloorElement.textContent = this.targetFloor;
        }
        
        if (directionElement) {
            if (this.isMoving) {
                directionElement.textContent = this.targetFloor > this.currentFloor ? 'Yukarı' : 'Aşağı';
            } else {
                directionElement.textContent = 'Durdu';
            }
        }
    }
    
    updatePerformanceIndicators() {
        setInterval(() => {
            const speedElement = document.getElementById('speed-value');
            const capacityElement = document.getElementById('capacity-value');
            const efficiencyElement = document.getElementById('efficiency-value');
            const uptimeElement = document.getElementById('uptime-value');
            
            if (speedElement) {
                speedElement.textContent = this.isMoving ? '2.5 m/s' : '0 m/s';
            }
            
            if (capacityElement) {
                capacityElement.textContent = Math.floor(Math.random() * 50) + 150;
            }
            
            if (efficiencyElement) {
                efficiencyElement.textContent = (95 + Math.random() * 5).toFixed(1) + '%';
            }
            
            if (uptimeElement) {
                uptimeElement.textContent = (99.5 + Math.random() * 0.5).toFixed(2) + '%';
            }
        }, 1000);
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animation = new PalletLiftAnimation();
    animation.updatePerformanceIndicators();
}); 