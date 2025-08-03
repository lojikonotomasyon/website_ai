// Continuous Lift Animation
class ContinuousLiftAnimation {
    constructor() {
        this.isRunning = true; // Changed to true for auto-start
        this.isEmergencyStop = false;
        this.currentSpeed = 0;
        this.maxSpeed = 1.5;
        this.animationSpeed = 2000; // ms per cycle
        this.packages = [];
        this.platforms = [];
        this.outputSlots = [];
        this.animationId = null;
        this.currentPackageIndex = 0;
        this.platformIndex = 0;

        this.init();
    }

    init() {
        this.packages = document.querySelectorAll('.package');
        this.platforms = document.querySelectorAll('.lift-platform');
        this.outputSlots = document.querySelectorAll('.output-slot');

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
        const startBtn = document.getElementById('startContinuousAnimation');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startAnimation());
        }

        // Reset button
        const resetBtn = document.getElementById('resetContinuousAnimation');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetAnimation());
        }

        // Speed controls
        const speedUpBtn = document.getElementById('speedUp');
        if (speedUpBtn) {
            speedUpBtn.addEventListener('click', () => this.speedUp());
        }

        const slowDownBtn = document.getElementById('slowDown');
        if (slowDownBtn) {
            slowDownBtn.addEventListener('click', () => this.slowDown());
        }

        // Emergency stop
        const emergencyBtn = document.getElementById('emergencyStopContinuous');
        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.emergencyStop());
        }

        // Package click effects
        this.packages.forEach(pkg => {
            pkg.addEventListener('click', () => {
                if (!this.isRunning) {
                    this.highlightPackage(pkg);
                }
            });
        });

        // Platform hover effects
        this.platforms.forEach(platform => {
            platform.addEventListener('mouseenter', () => {
                if (!this.isRunning) {
                    platform.style.transform = 'scale(1.1)';
                    platform.style.boxShadow = '0 0 20px rgba(255, 165, 0, 0.8)';
                }
            });

            platform.addEventListener('mouseleave', () => {
                platform.style.transform = 'scale(1)';
                platform.style.boxShadow = 'none';
            });
        });

        // Output slot hover effects
        this.outputSlots.forEach(slot => {
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
        this.currentPackageIndex = 0;
        this.platformIndex = 0;
        this.currentSpeed = this.maxSpeed;

        this.updateIndicators();
        this.updateButtonStates();

        // Start the continuous animation cycle
        this.animateCycle();
    }

    animateCycle() {
        if (!this.isRunning || this.isEmergencyStop) {
            this.stopAnimation();
            return;
        }

        if (this.currentPackageIndex >= this.packages.length) {
            // All packages processed, reset
            this.currentPackageIndex = 0;
            this.platformIndex = 0;
            this.resetPackages();
        }

        const currentPkg = this.packages[this.currentPackageIndex];
        const currentPlatform = this.platforms[this.platformIndex];
        const targetSlot = this.outputSlots[this.currentPackageIndex];

        if (currentPkg && currentPlatform && targetSlot) {
            this.movePackageToPlatform(currentPkg, currentPlatform, () => {
                this.liftPackage(currentPkg, currentPlatform, () => {
                    this.movePackageToOutput(currentPkg, targetSlot, () => {
                        this.currentPackageIndex++;
                        this.platformIndex = (this.platformIndex + 1) % this.platforms.length;
                        
                        // Continue the cycle
                        setTimeout(() => this.animateCycle(), this.animationSpeed / 4);
                    });
                });
            });
        }
    }

    movePackageToPlatform(pkg, platform, callback) {
        const platformRect = platform.getBoundingClientRect();
        const packageRect = pkg.getBoundingClientRect();

        const deltaX = platformRect.left - packageRect.left;
        const deltaY = platformRect.top - packageRect.top;

        pkg.style.transition = `transform ${this.animationSpeed / 2}ms ease-in-out`;
        pkg.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        setTimeout(() => {
            pkg.style.opacity = '0.7';
            if (callback) callback();
        }, this.animationSpeed / 2);
    }

    liftPackage(pkg, platform, callback) {
        platform.classList.add('moving');
        pkg.style.transition = `transform ${this.animationSpeed}ms ease-in-out`;
        pkg.style.transform = 'translateY(-200px)';

        // Update platform indicator
        const indicator = platform.querySelector('.platform-indicator i');
        if (indicator) {
            indicator.className = 'fas fa-arrow-down';
        }

        setTimeout(() => {
            platform.classList.remove('moving');
            if (callback) callback();
        }, this.animationSpeed);
    }

    movePackageToOutput(pkg, slot, callback) {
        const slotRect = slot.getBoundingClientRect();
        const packageRect = pkg.getBoundingClientRect();

        const deltaX = slotRect.left - packageRect.left;
        const deltaY = slotRect.top - packageRect.top;

        pkg.style.transition = `transform ${this.animationSpeed / 2}ms ease-in-out`;
        pkg.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        setTimeout(() => {
            pkg.style.opacity = '1';
            slot.classList.add('filled');
            slot.appendChild(pkg);
            pkg.style.transform = 'none';
            pkg.style.position = 'static';

            if (callback) callback();
        }, this.animationSpeed / 2);
    }

    resetPackages() {
        this.packages.forEach((pkg, index) => {
            const originalContainer = document.querySelector('.input-conveyor');
            pkg.style.transition = 'all 0.5s ease-in-out';
            pkg.style.transform = 'none';
            pkg.style.opacity = '1';
            pkg.style.position = 'static';

            originalContainer.appendChild(pkg);
        });

        this.outputSlots.forEach(slot => {
            slot.classList.remove('filled');
        });

        this.platforms.forEach(platform => {
            const indicator = platform.querySelector('.platform-indicator i');
            if (indicator) {
                indicator.className = 'fas fa-arrow-up';
            }
        });
    }

    speedUp() {
        if (this.animationSpeed > 500) {
            this.animationSpeed -= 200;
            this.currentSpeed = Math.min(this.currentSpeed + 0.2, this.maxSpeed);
            this.updateIndicators();
        }
    }

    slowDown() {
        if (this.animationSpeed < 4000) {
            this.animationSpeed += 200;
            this.currentSpeed = Math.max(this.currentSpeed - 0.2, 0);
            this.updateIndicators();
        }
    }

    emergencyStop() {
        this.isEmergencyStop = true;
        this.isRunning = false;
        this.currentSpeed = 0;

        // Stop all animations
        this.packages.forEach(pkg => {
            pkg.style.transition = 'none';
        });

        this.platforms.forEach(platform => {
            platform.style.transition = 'none';
        });

        this.updateIndicators();
        this.updateButtonStates();

        // Flash emergency indicator
        const statusElement = document.getElementById('continuousStatus');
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
        this.currentPackageIndex = 0;
        this.platformIndex = 0;
        this.animationSpeed = 2000;
        this.currentSpeed = 0;

        this.resetPackages();
        this.updateIndicators();
        this.updateButtonStates();
    }

    highlightPackage(pkg) {
        pkg.style.transform = 'scale(1.2)';
        pkg.style.boxShadow = '0 0 20px rgba(255, 165, 0, 0.8)';

        setTimeout(() => {
            pkg.style.transform = 'scale(1)';
            pkg.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        }, 500);
    }

    updateIndicators() {
        const speedElement = document.getElementById('continuousSpeed');
        const capacityElement = document.getElementById('continuousCapacity');
        const statusElement = document.getElementById('continuousStatus');

        if (speedElement) {
            speedElement.textContent = `${this.currentSpeed.toFixed(1)} m/s`;
        }

        if (capacityElement) {
            const capacity = Math.round((3600 / this.animationSpeed) * this.packages.length);
            capacityElement.textContent = `${capacity} paket/saat`;
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
        const startBtn = document.getElementById('startContinuousAnimation');
        const resetBtn = document.getElementById('resetContinuousAnimation');
        const speedUpBtn = document.getElementById('speedUp');
        const slowDownBtn = document.getElementById('slowDown');
        const emergencyBtn = document.getElementById('emergencyStopContinuous');

        if (startBtn) {
            startBtn.disabled = this.isRunning;
            startBtn.style.opacity = this.isRunning ? '0.5' : '1';
        }

        if (resetBtn) {
            resetBtn.disabled = this.isRunning;
            resetBtn.style.opacity = this.isRunning ? '0.5' : '1';
        }

        if (speedUpBtn) {
            speedUpBtn.disabled = this.isRunning || this.animationSpeed <= 500;
            speedUpBtn.style.opacity = (this.isRunning || this.animationSpeed <= 500) ? '0.5' : '1';
        }

        if (slowDownBtn) {
            slowDownBtn.disabled = this.isRunning || this.animationSpeed >= 4000;
            slowDownBtn.style.opacity = (this.isRunning || this.animationSpeed >= 4000) ? '0.5' : '1';
        }

        if (emergencyBtn) {
            emergencyBtn.disabled = !this.isRunning;
            emergencyBtn.style.opacity = this.isRunning ? '1' : '0.5';
        }
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContinuousLiftAnimation();
}); 