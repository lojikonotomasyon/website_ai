// Professional Sorter Animation JavaScript
class SorterAnimation {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.speed = 1;
        this.processedCount = 0;
        this.startTime = null;
        this.animationInterval = null;
        this.packageInterval = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        // Control buttons
        this.startBtn = document.getElementById('startAnimation');
        this.pauseBtn = document.getElementById('pauseAnimation');
        this.resetBtn = document.getElementById('resetAnimation');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');

        // System elements
        this.conveyorBelt = document.querySelector('.conveyor-belt');
        this.scannerStation = document.querySelector('.scanner-station');
        this.divertorArms = document.querySelectorAll('.divertor-arm');
        this.outputLanes = document.querySelectorAll('.output-lane');
        this.packages = document.querySelectorAll('.package');

        // Control panel
        this.statusValue = document.querySelector('.status-value');
        this.speedDisplay = document.querySelector('.status-line:nth-child(2) .status-value');
        this.totalDisplay = document.querySelector('.status-line:nth-child(3) .status-value');

        // Performance indicators
        this.processedCountDisplay = document.getElementById('processedCount');
        this.speedIndicator = document.getElementById('speedIndicator');
        this.accuracyIndicator = document.getElementById('accuracyIndicator');

        // Lane counters
        this.laneCounters = document.querySelectorAll('.lane-counter');
        this.sortedPackages = document.querySelectorAll('.sorted-packages');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startAnimation());
        this.pauseBtn.addEventListener('click', () => this.pauseAnimation());
        this.resetBtn.addEventListener('click', () => this.resetAnimation());
        this.speedSlider.addEventListener('input', (e) => this.setSpeed(e.target.value));
    }

    startAnimation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        
        this.updateStatus('RUNNING');
        this.activateSystem();
        this.startPackageFlow();
        
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
        this.processedCount = 0;
        
        this.updateStatus('READY');
        this.deactivateSystem();
        this.resetPackages();
        this.resetCounters();
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
        // Activate conveyor belt
        this.conveyorBelt.classList.add('active');
        
        // Activate scanner
        this.scannerStation.classList.add('active');
        
        // Activate output lanes
        this.outputLanes.forEach(lane => lane.classList.add('active'));
    }

    deactivateSystem() {
        // Deactivate conveyor belt
        this.conveyorBelt.classList.remove('active');
        
        // Deactivate scanner
        this.scannerStation.classList.remove('active');
        
        // Deactivate output lanes
        this.outputLanes.forEach(lane => lane.classList.remove('active'));
    }

    startPackageFlow() {
        const packageDelay = 2000 / this.speed;
        
        this.packageInterval = setInterval(() => {
            if (!this.isPaused) {
                this.processNextPackage();
            }
        }, packageDelay);
    }

    processNextPackage() {
        const package = this.getNextPackage();
        if (!package) return;

        const destination = package.dataset.destination;
        const packageType = package.dataset.type;
        
        // Start package movement
        package.classList.add('moving');
        
        // Simulate scanning
        setTimeout(() => {
            this.activateScanner();
        }, 1000 / this.speed);
        
        // Activate divertor
        setTimeout(() => {
            this.activateDivertor(destination);
        }, 2000 / this.speed);
        
        // Complete sorting
        setTimeout(() => {
            this.completeSorting(package, destination, packageType);
        }, 3000 / this.speed);
    }

    getNextPackage() {
        const packages = Array.from(this.packages);
        const availablePackage = packages.find(pkg => !pkg.classList.contains('moving'));
        return availablePackage;
    }

    activateScanner() {
        // Scanner animation is handled by CSS
        // Additional visual feedback can be added here
    }

    activateDivertor(destination) {
        const divertorArm = document.querySelector(`[data-target="${destination}"]`);
        if (divertorArm) {
            divertorArm.classList.add('active');
            
            setTimeout(() => {
                divertorArm.classList.remove('active');
            }, 500 / this.speed);
        }
    }

    completeSorting(package, destination, packageType) {
        // Remove package from conveyor
        package.classList.remove('moving');
        package.style.left = '-60px';
        
        // Add to sorted packages
        this.addToSortedPackages(destination, packageType);
        
        // Update counters
        this.updateCounters(destination);
        this.processedCount++;
        
        // Update display
        this.updateDisplay();
        
        // Check if all packages are processed
        if (this.processedCount >= this.packages.length) {
            this.completeAnimation();
        }
    }

    addToSortedPackages(destination, packageType) {
        const lane = document.querySelector(`.lane-${destination.toLowerCase()}`);
        const sortedPackages = lane.querySelector('.sorted-packages');
        
        const sortedPackage = document.createElement('div');
        sortedPackage.className = 'sorted-package';
        sortedPackage.innerHTML = `
            <div class="package-body ${packageType}">
                <div class="barcode"></div>
                <div class="package-label">${packageType.toUpperCase()}</div>
            </div>
        `;
        
        sortedPackages.appendChild(sortedPackage);
        
        // Animate package appearance
        setTimeout(() => {
            sortedPackage.style.opacity = '1';
            sortedPackage.style.transform = 'scale(1)';
        }, 100);
    }

    updateCounters(destination) {
        const laneIndex = destination === 'A' ? 0 : destination === 'B' ? 1 : 2;
        const counter = this.laneCounters[laneIndex];
        const currentCount = parseInt(counter.textContent);
        counter.textContent = currentCount + 1;
    }

    resetPackages() {
        this.packages.forEach(package => {
            package.classList.remove('moving');
            package.style.left = '-60px';
        });
    }

    resetCounters() {
        this.laneCounters.forEach(counter => {
            counter.textContent = '0';
        });
        
        this.sortedPackages.forEach(container => {
            container.innerHTML = '';
        });
    }

    updateDisplay() {
        // Update performance indicators
        this.processedCountDisplay.textContent = this.processedCount;
        
        // Calculate and update speed
        if (this.startTime && this.processedCount > 0) {
            const elapsed = (Date.now() - this.startTime) / 1000; // seconds
            const packagesPerHour = Math.round((this.processedCount / elapsed) * 3600);
            this.speedIndicator.textContent = packagesPerHour + ' p/h';
        }
        
        // Update total count
        this.totalDisplay.textContent = this.processedCount;
    }

    updateStatus(status) {
        this.statusValue.textContent = status;
    }

    updateAnimationSpeed() {
        // Update CSS animation speed based on speed multiplier
        const elements = [this.conveyorBelt, this.scannerStation, ...this.outputLanes];
        elements.forEach(element => {
            element.style.animationDuration = `${2 / this.speed}s`;
        });
    }

    completeAnimation() {
        clearInterval(this.packageInterval);
        this.updateStatus('COMPLETED');
        
        setTimeout(() => {
            this.resetAnimation();
        }, 3000);
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SorterAnimation();
}); 