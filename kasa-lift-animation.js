// Kasa Lift Animation
class KasaLiftAnimation {
    constructor() {
        this.isRunning = true; // Changed to true for auto-start
        this.isEmergencyStop = false;
        this.currentSpeed = 0;
        this.maxSpeed = 1.0;
        this.kasas = [];
        this.slots = [];
        this.liftPlatform = null;
        this.animationId = null;
        this.currentKasaIndex = 0;
        this.liftPosition = 0; // 0: ground, 1: upper
        this.animationSpeed = 1000; // ms per cycle
        
        this.init();
    }
    
    init() {
        this.kasas = document.querySelectorAll('.kasa');
        this.slots = document.querySelectorAll('.kasa-slot');
        this.liftPlatform = document.querySelector('.lift-platform');
        
        this.setupEventListeners();
        this.updateIndicators();
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
                this.stopAnimation();
            } else {
                // Page is visible, resume animation
                this.startAnimation();
            }
        });
    }
    
    setupEventListeners() {
        // Start button
        const startBtn = document.getElementById('startKasaAnimation');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startAnimation());
        }
        
        // Reset button
        const resetBtn = document.getElementById('resetKasaAnimation');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetAnimation());
        }
        
        // Manual controls
        const manualUpBtn = document.getElementById('manualUp');
        if (manualUpBtn) {
            manualUpBtn.addEventListener('click', () => this.manualUp());
        }
        
        const manualDownBtn = document.getElementById('manualDown');
        if (manualDownBtn) {
            manualDownBtn.addEventListener('click', () => this.manualDown());
        }
        
        // Emergency stop
        const emergencyBtn = document.getElementById('emergencyStop');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.emergencyStop());
        }
        
        // Kasa click effects
        this.kasas.forEach(kasa => {
            kasa.addEventListener('click', () => {
                if (!this.isRunning) {
                    this.highlightKasa(kasa);
                }
            });
        });
        
        // Slot hover effects
        this.slots.forEach(slot => {
            slot.addEventListener('mouseenter', () => {
                if (!this.isRunning) {
                    slot.style.backgroundColor = 'rgba(255, 165, 0, 0.3)';
                }
            });
            
            slot.addEventListener('mouseleave', () => {
                slot.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
        });
    }
    
    startAnimation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isEmergencyStop = false;
        this.currentKasaIndex = 0;
        this.updateIndicators();
        
        // Update button states
        this.updateButtonStates();
        
        // Start the animation cycle
        this.animateCycle();
    }
    
    animateCycle() {
        if (!this.isRunning || this.isEmergencyStop) {
            this.stopAnimation();
            return;
        }
        
        if (this.currentKasaIndex >= this.kasas.length) {
            // All kasas processed, reset
            this.currentKasaIndex = 0;
            this.resetKasas();
        }
        
        const currentKasa = this.kasas[this.currentKasaIndex];
        const targetSlot = this.slots[this.currentKasaIndex];
        
        if (currentKasa && targetSlot) {
            this.moveKasaToLift(currentKasa, () => {
                this.liftKasa(() => {
                    this.moveKasaToSlot(currentKasa, targetSlot, () => {
                        this.currentKasaIndex++;
                        setTimeout(() => this.animateCycle(), 500);
                    });
                });
            });
        }
    }
    
    moveKasaToLift(kasa, callback) {
        const liftRect = this.liftPlatform.getBoundingClientRect();
        const kasaRect = kasa.getBoundingClientRect();
        
        const deltaX = liftRect.left - kasaRect.left;
        const deltaY = liftRect.top - kasaRect.top;
        
        kasa.style.transition = `transform ${this.animationSpeed / 2}ms ease-in-out`;
        kasa.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        
        setTimeout(() => {
            kasa.style.opacity = '0.7';
            if (callback) callback();
        }, this.animationSpeed / 2);
    }
    
    liftKasa(callback) {
        this.liftPosition = 1;
        this.currentSpeed = this.maxSpeed;
        
        this.liftPlatform.style.transition = `transform ${this.animationSpeed}ms ease-in-out`;
        this.liftPlatform.style.transform = 'translateY(-200px)';
        
        // Update lift indicator
        const indicator = this.liftPlatform.querySelector('.lift-indicator i');
        if (indicator) {
            indicator.className = 'fas fa-arrow-down';
        }
        
        setTimeout(() => {
            this.currentSpeed = 0;
            if (callback) callback();
        }, this.animationSpeed);
    }
    
    moveKasaToSlot(kasa, slot, callback) {
        const slotRect = slot.getBoundingClientRect();
        const liftRect = this.liftPlatform.getBoundingClientRect();
        
        const deltaX = slotRect.left - liftRect.left;
        const deltaY = slotRect.top - liftRect.top;
        
        kasa.style.transition = `transform ${this.animationSpeed / 2}ms ease-in-out`;
        kasa.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        
        setTimeout(() => {
            kasa.style.opacity = '1';
            slot.style.backgroundColor = 'rgba(255, 165, 0, 0.5)';
            slot.appendChild(kasa);
            kasa.style.transform = 'none';
            kasa.style.position = 'static';
            
            if (callback) callback();
        }, this.animationSpeed / 2);
    }
    
    resetKasas() {
        this.kasas.forEach((kasa, index) => {
            const originalContainer = document.querySelector('.ground-level .kasa-container');
            kasa.style.transition = 'all 0.5s ease-in-out';
            kasa.style.transform = 'none';
            kasa.style.opacity = '1';
            kasa.style.position = 'static';
            
            originalContainer.appendChild(kasa);
        });
        
        this.slots.forEach(slot => {
            slot.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        this.liftPosition = 0;
        this.liftPlatform.style.transition = 'transform 0.5s ease-in-out';
        this.liftPlatform.style.transform = 'translateY(0)';
        
        const indicator = this.liftPlatform.querySelector('.lift-indicator i');
        if (indicator) {
            indicator.className = 'fas fa-arrow-up';
        }
    }
    
    manualUp() {
        if (this.isRunning || this.liftPosition === 1) return;
        
        this.liftPosition = 1;
        this.currentSpeed = this.maxSpeed;
        
        this.liftPlatform.style.transition = 'transform 1s ease-in-out';
        this.liftPlatform.style.transform = 'translateY(-200px)';
        
        const indicator = this.liftPlatform.querySelector('.lift-indicator i');
        if (indicator) {
            indicator.className = 'fas fa-arrow-down';
        }
        
        setTimeout(() => {
            this.currentSpeed = 0;
            this.updateIndicators();
        }, 1000);
    }
    
    manualDown() {
        if (this.isRunning || this.liftPosition === 0) return;
        
        this.liftPosition = 0;
        this.currentSpeed = this.maxSpeed;
        
        this.liftPlatform.style.transition = 'transform 1s ease-in-out';
        this.liftPlatform.style.transform = 'translateY(0)';
        
        const indicator = this.liftPlatform.querySelector('.lift-indicator i');
        if (indicator) {
            indicator.className = 'fas fa-arrow-up';
        }
        
        setTimeout(() => {
            this.currentSpeed = 0;
            this.updateIndicators();
        }, 1000);
    }
    
    emergencyStop() {
        this.isEmergencyStop = true;
        this.isRunning = false;
        this.currentSpeed = 0;
        
        // Stop all animations
        this.liftPlatform.style.transition = 'none';
        this.kasas.forEach(kasa => {
            kasa.style.transition = 'none';
        });
        
        this.updateIndicators();
        this.updateButtonStates();
        
        // Flash emergency indicator
        const statusElement = document.getElementById('kasaStatus');
        if (statusElement) {
            statusElement.textContent = 'ACİL DUR!';
            statusElement.style.color = '#ff4444';
            
            setTimeout(() => {
                statusElement.textContent = 'Hazır';
                statusElement.style.color = '#00aa00';
            }, 3000);
        }
    }
    
    stopAnimation() {
        this.isRunning = false;
        this.currentSpeed = 0;
        this.updateIndicators();
        this.updateButtonStates();
    }
    
    resetAnimation() {
        this.stopAnimation();
        this.isEmergencyStop = false;
        this.currentKasaIndex = 0;
        this.liftPosition = 0;
        
        this.resetKasas();
        this.updateIndicators();
        this.updateButtonStates();
    }
    
    highlightKasa(kasa) {
        kasa.style.transform = 'scale(1.1)';
        kasa.style.boxShadow = '0 0 20px rgba(255, 165, 0, 0.8)';
        
        setTimeout(() => {
            kasa.style.transform = 'scale(1)';
            kasa.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        }, 500);
    }
    
    updateIndicators() {
        const speedElement = document.getElementById('kasaSpeed');
        const capacityElement = document.getElementById('kasaCapacity');
        const statusElement = document.getElementById('kasaStatus');
        
        if (speedElement) {
            speedElement.textContent = `${this.currentSpeed.toFixed(1)} m/s`;
        }
        
        if (capacityElement) {
            capacityElement.textContent = `${this.kasas.length} kasa`;
        }
        
        if (statusElement) {
            if (this.isEmergencyStop) {
                statusElement.textContent = 'ACİL DUR!';
                statusElement.style.color = '#ff4444';
            } else if (this.isRunning) {
                statusElement.textContent = 'Çalışıyor';
                statusElement.style.color = '#00aa00';
            } else {
                statusElement.textContent = 'Hazır';
                statusElement.style.color = '#00aa00';
            }
        }
    }
    
    updateButtonStates() {
        const startBtn = document.getElementById('startKasaAnimation');
        const resetBtn = document.getElementById('resetKasaAnimation');
        const manualUpBtn = document.getElementById('manualUp');
        const manualDownBtn = document.getElementById('manualDown');
        const emergencyBtn = document.getElementById('emergencyStop');
        
        if (startBtn) {
            startBtn.disabled = this.isRunning;
            startBtn.style.opacity = this.isRunning ? '0.5' : '1';
        }
        
        if (resetBtn) {
            resetBtn.disabled = this.isRunning;
            resetBtn.style.opacity = this.isRunning ? '0.5' : '1';
        }
        
        if (manualUpBtn) {
            manualUpBtn.disabled = this.isRunning || this.liftPosition === 1;
            manualUpBtn.style.opacity = (this.isRunning || this.liftPosition === 1) ? '0.5' : '1';
        }
        
        if (manualDownBtn) {
            manualDownBtn.disabled = this.isRunning || this.liftPosition === 0;
            manualDownBtn.style.opacity = (this.isRunning || this.liftPosition === 0) ? '0.5' : '1';
        }
        
        if (emergencyBtn) {
            emergencyBtn.disabled = !this.isRunning;
            emergencyBtn.style.opacity = this.isRunning ? '1' : '0.5';
        }
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KasaLiftAnimation();
}); 