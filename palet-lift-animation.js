// Professional Palet Lift Animation JavaScript
class PaletLiftAnimation {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.speed = 1;
        this.currentLevel = 1;
        this.currentLoad = 0;
        this.cycleCount = 0;
        this.totalCycles = 0;
        this.startTime = null;
        this.cycleTimes = [];
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        // Control buttons
        this.startBtn = document.getElementById('startPaletAnimation');
        this.pauseBtn = document.getElementById('pausePaletAnimation');
        this.resetBtn = document.getElementById('resetPaletAnimation');
        this.speedSlider = document.getElementById('liftSpeedSlider');
        this.speedValue = document.getElementById('liftSpeedValue');

        // Lift controls
        this.upBtn = document.getElementById('upBtn');
        this.downBtn = document.getElementById('downBtn');
        this.emergencyBtn = document.getElementById('emergencyBtn');

        // System elements
        this.liftStructure = document.querySelector('.lift-structure');
        this.liftPlatform = document.querySelector('.lift-platform');
        this.groundLevel = document.querySelector('.ground-level');
        this.upperLevel = document.querySelector('.upper-level');
        this.safetySystems = document.querySelector('.safety-systems');
        this.pallets = document.querySelectorAll('.pallet');

        // Control panel displays
        this.liftStatus = document.getElementById('liftStatus');
        this.currentLevelDisplay = document.getElementById('currentLevel');
        this.currentLoadDisplay = document.getElementById('currentLoad');
        this.cycleCountDisplay = document.getElementById('cycleCount');

        // Performance indicators
        this.totalCyclesDisplay = document.getElementById('totalCycles');
        this.avgCycleTimeDisplay = document.getElementById('avgCycleTime');
        this.safetyScoreDisplay = document.getElementById('safetyScore');

        // Safety gates
        this.safetyGates = document.querySelectorAll('.gate');
        this.levelIndicator = document.querySelector('.level-text');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startAnimation());
        this.pauseBtn.addEventListener('click', () => this.pauseAnimation());
        this.resetBtn.addEventListener('click', () => this.resetAnimation());
        this.speedSlider.addEventListener('input', (e) => this.setSpeed(e.target.value));
        
        this.upBtn.addEventListener('click', () => this.moveUp());
        this.downBtn.addEventListener('click', () => this.moveDown());
        this.emergencyBtn.addEventListener('click', () => this.emergencyStop());
        
        // Pallet click events
        this.pallets.forEach(pallet => {
            pallet.addEventListener('click', () => this.selectPallet(pallet));
        });
    }

    startAnimation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        
        this.updateStatus('RUNNING');
        this.activateSystem();
        this.startAutomaticOperation();
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
    }

    pauseAnimation() {
        if (!this.isRunning) return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.updateStatus('PAUSED');
            this.deactivateSystem();
            this.pauseBtn.innerHTML = '<i class="fas fa-play"></i><span>Devam</span>';
        } else {
            this.updateStatus('RUNNING');
            this.activateSystem();
            this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>Duraklat</span>';
        }
    }

    resetAnimation() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentLevel = 1;
        this.currentLoad = 0;
        this.cycleCount = 0;
        
        this.updateStatus('READY');
        this.deactivateSystem();
        this.resetLiftPosition();
        this.resetPallets();
        this.updateDisplay();
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>Duraklat</span>';
    }

    setSpeed(value) {
        this.speed = parseFloat(value);
        this.speedValue.textContent = this.speed + 'x';
        
        if (this.isRunning && !this.isPaused) {
            this.updateAnimationSpeed();
        }
    }

    activateSystem() {
        this.liftStructure.classList.add('active');
        this.groundLevel.classList.add('active');
        this.upperLevel.classList.add('active');
        this.safetySystems.classList.add('active');
    }

    deactivateSystem() {
        this.liftStructure.classList.remove('active');
        this.groundLevel.classList.remove('active');
        this.upperLevel.classList.remove('active');
        this.safetySystems.classList.remove('active');
    }

    startAutomaticOperation() {
        this.performLiftCycle();
    }

    performLiftCycle() {
        if (!this.isRunning || this.isPaused) return;

        const cycleStartTime = Date.now();
        
        // Find available pallets
        const groundPallets = Array.from(this.pallets).filter(p => 
            p.closest('.ground-level') && !p.classList.contains('moving')
        );
        const upperPallets = Array.from(this.pallets).filter(p => 
            p.closest('.upper-level') && !p.classList.contains('moving')
        );

        if (groundPallets.length > 0) {
            this.movePalletUp(groundPallets[0], cycleStartTime);
        } else if (upperPallets.length > 0) {
            this.movePalletDown(upperPallets[0], cycleStartTime);
        } else {
            // All pallets moved, complete cycle
            this.completeCycle(cycleStartTime);
        }
    }

    movePalletUp(pallet, cycleStartTime) {
        const weight = parseInt(pallet.dataset.weight);
        
        // Update load
        this.currentLoad = weight;
        this.updateDisplay();
        
        // Move pallet to platform
        this.movePalletToPlatform(pallet, () => {
            // Move lift up
            this.moveLiftToLevel(2, () => {
                // Move pallet to upper level
                this.movePalletToLevel(pallet, 'upper', () => {
                    this.currentLoad = 0;
                    this.updateDisplay();
                    this.performLiftCycle();
                });
            });
        });
    }

    movePalletDown(pallet, cycleStartTime) {
        const weight = parseInt(pallet.dataset.weight);
        
        // Update load
        this.currentLoad = weight;
        this.updateDisplay();
        
        // Move pallet to platform
        this.movePalletToPlatform(pallet, () => {
            // Move lift down
            this.moveLiftToLevel(1, () => {
                // Move pallet to ground level
                this.movePalletToLevel(pallet, 'ground', () => {
                    this.currentLoad = 0;
                    this.updateDisplay();
                    this.performLiftCycle();
                });
            });
        });
    }

    movePalletToPlatform(pallet, callback) {
        pallet.classList.add('moving');
        
        setTimeout(() => {
            // Simulate pallet moving to platform
            callback();
        }, 1000 / this.speed);
    }

    moveLiftToLevel(level, callback) {
        const targetTop = level === 1 ? 300 : 100;
        this.currentLevel = level;
        
        this.liftPlatform.style.top = targetTop + 'px';
        this.levelIndicator.textContent = `LEVEL ${level}`;
        
        // Open safety gates
        this.openSafetyGates();
        
        setTimeout(() => {
            // Close safety gates
            this.closeSafetyGates();
            callback();
        }, 2000 / this.speed);
    }

    movePalletToLevel(pallet, level, callback) {
        const targetLevel = level === 'upper' ? this.upperLevel : this.groundLevel;
        const targetQueue = targetLevel.querySelector('.pallet-queue');
        
        targetQueue.appendChild(pallet);
        pallet.classList.remove('moving');
        
        setTimeout(callback, 500 / this.speed);
    }

    openSafetyGates() {
        this.safetyGates.forEach(gate => {
            gate.classList.add('open');
        });
    }

    closeSafetyGates() {
        this.safetyGates.forEach(gate => {
            gate.classList.remove('open');
        });
    }

    moveUp() {
        if (this.currentLevel < 2) {
            this.moveLiftToLevel(this.currentLevel + 1, () => {});
        }
    }

    moveDown() {
        if (this.currentLevel > 1) {
            this.moveLiftToLevel(this.currentLevel - 1, () => {});
        }
    }

    emergencyStop() {
        this.isRunning = false;
        this.isPaused = false;
        this.updateStatus('EMERGENCY STOP');
        this.deactivateSystem();
        this.closeSafetyGates();
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }

    selectPallet(pallet) {
        if (!this.isRunning || this.isPaused) return;
        
        // Highlight selected pallet
        this.pallets.forEach(p => p.classList.remove('selected'));
        pallet.classList.add('selected');
        
        // Show pallet info
        const weight = pallet.dataset.weight;
        const id = pallet.dataset.id;
        console.log(`Selected pallet ${id} with weight ${weight}kg`);
    }

    completeCycle(cycleStartTime) {
        const cycleTime = (Date.now() - cycleStartTime) / 1000;
        this.cycleTimes.push(cycleTime);
        this.totalCycles++;
        
        this.updatePerformanceIndicators();
        
        // Continue with next cycle after delay
        setTimeout(() => {
            if (this.isRunning && !this.isPaused) {
                this.performLiftCycle();
            }
        }, 2000 / this.speed);
    }

    resetLiftPosition() {
        this.liftPlatform.style.top = '300px';
        this.levelIndicator.textContent = 'LEVEL 1';
        this.closeSafetyGates();
    }

    resetPallets() {
        this.pallets.forEach(pallet => {
            pallet.classList.remove('moving', 'selected');
        });
    }

    updateDisplay() {
        this.currentLevelDisplay.textContent = this.currentLevel;
        this.currentLoadDisplay.textContent = this.currentLoad + ' kg';
        this.cycleCountDisplay.textContent = this.cycleCount;
    }

    updateStatus(status) {
        this.liftStatus.textContent = status;
    }

    updatePerformanceIndicators() {
        this.totalCyclesDisplay.textContent = this.totalCycles;
        
        if (this.cycleTimes.length > 0) {
            const avgTime = (this.cycleTimes.reduce((a, b) => a + b, 0) / this.cycleTimes.length).toFixed(1);
            this.avgCycleTimeDisplay.textContent = avgTime + 's';
        }
        
        // Calculate safety score (simplified)
        const safetyScore = Math.max(95, 100 - (this.totalCycles * 0.1));
        this.safetyScoreDisplay.textContent = '%' + safetyScore.toFixed(0);
    }

    updateAnimationSpeed() {
        // Update CSS animation speed based on speed multiplier
        const elements = [this.liftStructure, this.groundLevel, this.upperLevel];
        elements.forEach(element => {
            element.style.animationDuration = `${3 / this.speed}s`;
        });
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PaletLiftAnimation();
}); 