// Miniload Shuttle Animation
class MiniloadShuttleAnimation {
    constructor() {
        this.isRunning = true; // Changed to true for auto-start
        this.isEmergencyStop = false;
        this.currentSpeed = 0;
        this.maxSpeed = 3; // m/dk
        this.batteryLevel = 100;
        this.currentPosition = { x: 600, y: 350 };
        this.targetPosition = { x: 600, y: 350 };
        this.carryingItem = null;
        this.animationSpeed = 2000;
        this.chargingInterval = null;
        this.operationQueue = [];
        this.currentOperation = null;
        
        // DOM elements
        this.shuttle = null;
        this.storageItems = [];
        this.rackSlots = [];
        this.ioSlot = null;
        this.chargingDock = null;
        
        this.init();
    }

    init() {
        this.shuttle = document.getElementById('shuttle');
        this.storageItems = document.querySelectorAll('.storage-item');
        this.rackSlots = document.querySelectorAll('.rack-slot');
        this.ioSlot = document.getElementById('ioSlot');
        this.chargingDock = document.querySelector('.charging-dock');
        
        this.setupEventListeners();
        this.positionItems();
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
        // Control buttons
        const startBtn = document.getElementById('startMiniloadAnimation');
        const stopBtn = document.getElementById('stopMiniloadAnimation');
        const resetBtn = document.getElementById('resetMiniloadAnimation');
        const emergencyBtn = document.getElementById('emergencyStop');

        if (startBtn) startBtn.addEventListener('click', () => this.startAnimation());
        if (stopBtn) stopBtn.addEventListener('click', () => this.stopAnimation());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetAnimation());
        if (emergencyBtn) emergencyBtn.addEventListener('click', () => this.emergencyStop());

        // Manual controls
        const manualUp = document.getElementById('manualUp');
        const manualDown = document.getElementById('manualDown');
        const manualLeft = document.getElementById('manualLeft');
        const manualRight = document.getElementById('manualRight');

        if (manualUp) manualUp.addEventListener('click', () => this.manualMove('up'));
        if (manualDown) manualDown.addEventListener('click', () => this.manualMove('down'));
        if (manualLeft) manualUp.addEventListener('click', () => this.manualMove('left'));
        if (manualRight) manualRight.addEventListener('click', () => this.manualMove('right'));

        // Storage items click
        this.storageItems.forEach(item => {
            item.addEventListener('click', () => {
                if (!this.isRunning && !this.carryingItem) {
                    this.highlightItem(item);
                }
            });
        });

        // Rack slots hover
        this.rackSlots.forEach(slot => {
            slot.addEventListener('mouseenter', () => {
                if (!this.isRunning) {
                    slot.classList.add('highlighted');
                }
            });

            slot.addEventListener('mouseleave', () => {
                slot.classList.remove('highlighted');
            });
        });
    }

    positionItems() {
        // Use CSS-based positioning instead of getBoundingClientRect to avoid forced reflow
        this.storageItems.forEach(item => {
            const slotId = item.getAttribute('data-slot');
            const slot = document.querySelector(`[data-slot="${slotId}"]`);
            
            if (slot) {
                // Use CSS positioning instead of JavaScript calculations
                item.style.position = 'absolute';
                item.style.left = '50%';
                item.style.top = '50%';
                item.style.transform = 'translate(-50%, -50%)';
                
                slot.classList.add('occupied');
            }
        });
    }

    startAnimation() {
        if (this.isRunning || this.isEmergencyStop) return;

        this.isRunning = true;
        this.currentSpeed = this.maxSpeed;
        this.batteryLevel = Math.max(20, this.batteryLevel); // Ensure minimum battery

        this.updateIndicators();
        this.updateButtonStates();

        // Start automatic operations
        this.startAutomaticOperations();
    }

    startAutomaticOperations() {
        if (!this.isRunning || this.isEmergencyStop) return;

        // Create operation sequence
        const operations = [
            { type: 'pickup', itemId: 1, slotId: '1-1' },
            { type: 'store', slotId: '2-2' },
            { type: 'pickup', itemId: 2, slotId: '2-3' },
            { type: 'deliver', slotId: 'io' },
            { type: 'pickup', itemId: 3, slotId: '3-5' },
            { type: 'store', slotId: '4-1' },
            { type: 'charge' }
        ];

        this.operationQueue = [...operations];
        this.executeNextOperation();
    }

    executeNextOperation() {
        if (!this.isRunning || this.isEmergencyStop || this.operationQueue.length === 0) {
            this.stopAnimation();
            return;
        }

        this.currentOperation = this.operationQueue.shift();
        
        switch (this.currentOperation.type) {
            case 'pickup':
                this.pickupItem(this.currentOperation.itemId, this.currentOperation.slotId);
                break;
            case 'store':
                this.storeItem(this.currentOperation.slotId);
                break;
            case 'deliver':
                this.deliverItem();
                break;
            case 'charge':
                this.startCharging();
                break;
        }
    }

    pickupItem(itemId, slotId) {
        const item = document.querySelector(`[data-item="${itemId}"]`);
        const slot = document.querySelector(`[data-slot="${slotId}"]`);
        
        if (!item || !slot) {
            this.executeNextOperation();
            return;
        }

        // Move shuttle to item position
        const itemRect = item.getBoundingClientRect();
        const containerRect = document.querySelector('.miniload-animation').getBoundingClientRect();
        
        this.targetPosition = {
            x: itemRect.left - containerRect.left + itemRect.width / 2 - 60,
            y: itemRect.top - containerRect.top + itemRect.height / 2 - 40
        };

        this.moveShuttle(() => {
            // Pickup animation
            this.shuttle.classList.add('lifting');
            item.classList.add('moving');
            
            setTimeout(() => {
                // Attach item to shuttle
                this.carryingItem = item;
                item.style.position = 'absolute';
                item.style.left = '25px';
                item.style.top = '-40px';
                item.style.zIndex = '20';
                
                slot.classList.remove('occupied');
                this.shuttle.classList.remove('lifting');
                item.classList.remove('moving');
                
                this.updateIndicators();
                this.executeNextOperation();
            }, 1000);
        });
    }

    storeItem(slotId) {
        if (!this.carryingItem) {
            this.executeNextOperation();
            return;
        }

        const slot = document.querySelector(`[data-slot="${slotId}"]`);
        if (!slot) {
            this.executeNextOperation();
            return;
        }

        // Move shuttle to target slot
        const slotRect = slot.getBoundingClientRect();
        const containerRect = document.querySelector('.miniload-animation').getBoundingClientRect();
        
        this.targetPosition = {
            x: slotRect.left - containerRect.left + slotRect.width / 2 - 60,
            y: slotRect.top - containerRect.top + slotRect.height / 2 - 40
        };

        this.moveShuttle(() => {
            // Store animation
            this.shuttle.classList.add('lifting');
            this.carryingItem.classList.add('moving');
            
            setTimeout(() => {
                // Place item in slot
                const slotRect = slot.getBoundingClientRect();
                const containerRect = document.querySelector('.miniload-animation').getBoundingClientRect();
                
                this.carryingItem.style.left = `${slotRect.left - containerRect.left + slotRect.width / 2 - 35}px`;
                this.carryingItem.style.top = `${slotRect.top - containerRect.top + slotRect.height / 2 - 30}px`;
                this.carryingItem.style.zIndex = '5';
                
                slot.classList.add('occupied');
                this.carryingItem = null;
                this.shuttle.classList.remove('lifting');
                this.carryingItem.classList.remove('moving');
                
                this.updateIndicators();
                this.executeNextOperation();
            }, 1000);
        });
    }

    deliverItem() {
        if (!this.carryingItem) {
            this.executeNextOperation();
            return;
        }

        // Move shuttle to I/O station
        this.targetPosition = { x: 650, y: 100 };

        this.moveShuttle(() => {
            // Deliver animation
            this.shuttle.classList.add('lifting');
            this.carryingItem.classList.add('moving');
            
            setTimeout(() => {
                // Place item in I/O slot
                this.carryingItem.style.left = '35px';
                this.carryingItem.style.top = '15px';
                this.carryingItem.style.zIndex = '5';
                
                this.ioSlot.appendChild(this.carryingItem);
                this.ioSlot.classList.add('filled');
                this.carryingItem = null;
                this.shuttle.classList.remove('lifting');
                this.carryingItem.classList.remove('moving');
                
                this.updateIndicators();
                this.executeNextOperation();
            }, 1000);
        });
    }

    startCharging() {
        // Move shuttle to charging station
        this.targetPosition = { x: 650, y: 50 };

        this.moveShuttle(() => {
            this.chargingDock.classList.add('charging');
            const chargingStatus = document.getElementById('chargingStatus');
            if (chargingStatus) chargingStatus.textContent = 'ŞARJ EDİLİYOR';

            // Simulate charging
            this.chargingInterval = setInterval(() => {
                this.batteryLevel = Math.min(100, this.batteryLevel + 5);
                this.updateIndicators();

                if (this.batteryLevel >= 100) {
                    clearInterval(this.chargingInterval);
                    this.chargingDock.classList.remove('charging');
                    if (chargingStatus) chargingStatus.textContent = 'HAZIR';
                    
                    // Continue operations
                    setTimeout(() => this.executeNextOperation(), 1000);
                }
            }, 500);
        });
    }

    moveShuttle(callback) {
        if (!this.shuttle) return;

        const deltaX = this.targetPosition.x - this.currentPosition.x;
        const deltaY = this.targetPosition.y - this.currentPosition.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const duration = (distance / 100) * (this.animationSpeed / this.currentSpeed);

        // Use transform instead of left/top to avoid layout thrashing
        this.shuttle.style.transition = `transform ${duration}ms ease-in-out`;
        this.shuttle.style.transform = `translate(${this.targetPosition.x}px, ${this.targetPosition.y}px)`;

        this.shuttle.classList.add('moving');

        setTimeout(() => {
            this.currentPosition = { ...this.targetPosition };
            this.shuttle.classList.remove('moving');
            this.batteryLevel = Math.max(0, this.batteryLevel - 1);
            this.updateIndicators();
            
            if (callback) callback();
        }, duration);
    }

    manualMove(direction) {
        if (this.isRunning || this.isEmergencyStop) return;

        const step = 50;
        switch (direction) {
            case 'up':
                this.targetPosition.y = Math.max(50, this.currentPosition.y - step);
                break;
            case 'down':
                this.targetPosition.y = Math.min(550, this.currentPosition.y + step);
                break;
            case 'left':
                this.targetPosition.x = Math.max(50, this.currentPosition.x - step);
                break;
            case 'right':
                this.targetPosition.x = Math.min(650, this.currentPosition.x + step);
                break;
        }

        this.moveShuttle();
    }

    emergencyStop() {
        this.isEmergencyStop = true;
        this.isRunning = false;
        this.currentSpeed = 0;

        if (this.chargingInterval) {
            clearInterval(this.chargingInterval);
        }

        this.chargingDock.classList.remove('charging');
        const chargingStatus = document.getElementById('chargingStatus');
        if (chargingStatus) chargingStatus.textContent = 'ACİL DUR!';

        this.updateIndicators();
        this.updateButtonStates();
    }

    stopAnimation() {
        this.isRunning = false;
        this.currentSpeed = 0;
        this.operationQueue = [];
        this.currentOperation = null;

        if (this.chargingInterval) {
            clearInterval(this.chargingInterval);
        }

        this.updateIndicators();
        this.updateButtonStates();
    }

    resetAnimation() {
        this.stopAnimation();
        this.isEmergencyStop = false;
        this.batteryLevel = 100;
        this.currentPosition = { x: 600, y: 350 };
        this.targetPosition = { x: 600, y: 350 };
        this.carryingItem = null;

        // Reset shuttle position
        if (this.shuttle) {
            this.shuttle.style.transform = 'translate(600px, 350px)';
            this.shuttle.style.transition = 'none';
        }

        // Reset items to original positions
        this.positionItems();

        // Reset I/O slot
        if (this.ioSlot) {
            this.ioSlot.classList.remove('filled');
            this.ioSlot.innerHTML = '';
        }

        // Reset charging station
        this.chargingDock.classList.remove('charging');
        const chargingStatus = document.getElementById('chargingStatus');
        if (chargingStatus) chargingStatus.textContent = 'HAZIR';

        this.updateIndicators();
        this.updateButtonStates();
    }

    highlightItem(item) {
        item.style.transform = 'scale(1.2)';
        item.style.boxShadow = '0 0 20px rgba(255, 165, 0, 0.8)';

        setTimeout(() => {
            item.style.transform = 'scale(1)';
            item.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
        }, 1000);
    }

    updateIndicators() {
        // Batch DOM updates to reduce layout thrashing
        requestAnimationFrame(() => {
            // Update battery indicator
            const batteryIndicator = document.getElementById('batteryIndicator');
            const batteryIndicator2 = document.getElementById('batteryIndicator2');
            if (batteryIndicator) batteryIndicator.textContent = `${this.batteryLevel}%`;
            if (batteryIndicator2) batteryIndicator2.textContent = `${this.batteryLevel}%`;

            // Update status indicator
            const statusIndicator = document.getElementById('statusIndicator');
            const statusIndicator2 = document.getElementById('statusIndicator2');
            let status = 'HAZIR';
            if (this.isEmergencyStop) status = 'ACİL DUR!';
            else if (this.isRunning) status = 'ÇALIŞIYOR';
            
            if (statusIndicator) statusIndicator.textContent = status;
            if (statusIndicator2) statusIndicator2.textContent = status;

            // Update speed indicator
            const speedIndicator = document.getElementById('speedIndicator');
            const speedIndicator2 = document.getElementById('speedIndicator2');
            if (speedIndicator) speedIndicator.textContent = `${this.currentSpeed} m/dk`;
            if (speedIndicator2) speedIndicator2.textContent = `${this.currentSpeed} m/dk`;

            // Update load indicator
            const loadIndicator = document.getElementById('loadIndicator');
            const loadCount = this.carryingItem ? 1 : 0;
            if (loadIndicator) loadIndicator.textContent = `${loadCount} / 1`;

            // Update shuttle status
            const shuttleStatus = document.querySelector('.shuttle-status');
            if (shuttleStatus) {
                if (this.isEmergencyStop) {
                    shuttleStatus.textContent = 'ACİL DUR!';
                    shuttleStatus.style.color = '#e74c3c';
                } else if (this.isRunning) {
                    shuttleStatus.textContent = 'ÇALIŞIYOR';
                    shuttleStatus.style.color = '#27ae60';
                } else {
                    shuttleStatus.textContent = 'HAZIR';
                    shuttleStatus.style.color = '#3498db';
                }
            }
        });
    }

    updateButtonStates() {
        const startBtn = document.getElementById('startMiniloadAnimation');
        const stopBtn = document.getElementById('stopMiniloadAnimation');
        const resetBtn = document.getElementById('resetMiniloadAnimation');
        const emergencyBtn = document.getElementById('emergencyStop');

        if (startBtn) {
            startBtn.disabled = this.isRunning || this.isEmergencyStop;
            startBtn.style.opacity = (this.isRunning || this.isEmergencyStop) ? '0.5' : '1';
        }

        if (stopBtn) {
            stopBtn.disabled = !this.isRunning;
            stopBtn.style.opacity = this.isRunning ? '1' : '0.5';
        }

        if (resetBtn) {
            resetBtn.disabled = this.isRunning;
            resetBtn.style.opacity = this.isRunning ? '0.5' : '1';
        }

        if (emergencyBtn) {
            emergencyBtn.disabled = !this.isRunning;
            emergencyBtn.style.opacity = this.isRunning ? '1' : '0.5';
        }

        // Manual controls
        const manualBtns = document.querySelectorAll('.manual-btn');
        manualBtns.forEach(btn => {
            btn.disabled = this.isRunning || this.isEmergencyStop;
            btn.style.opacity = (this.isRunning || this.isEmergencyStop) ? '0.5' : '1';
        });
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MiniloadShuttleAnimation();
}); 