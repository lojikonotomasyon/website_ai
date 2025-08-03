// Professional Sorter Animation System
class ProfessionalSorter {
    constructor() {
        this.isRunning = true; // Changed to true for auto-start
        this.packages = [];
        this.laneCounts = { 1: 0, 2: 0, 3: 0 };
        this.currentSpeed = 120;
        this.capacity = 5000;
        this.accuracy = 99.8;
        this.packageId = 1;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.createInitialPackages();
        // Auto-start the animation
        this.start();
        
        // Add page visibility handling
        this.setupPageVisibilityHandling();
    }

    setupPageVisibilityHandling() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, pause animation
                this.stop();
            } else {
                // Page is visible, resume animation
                this.start();
            }
        });
    }

    bindEvents() {
        // Removed manual control buttons - animation starts automatically
        const speedControl = document.getElementById('speedControl');

        if (speedControl) {
            speedControl.addEventListener('input', (e) => {
                this.setSpeed(e.target.value);
                const speedDisplay = document.getElementById('speedDisplay');
                if (speedDisplay) speedDisplay.textContent = `${e.target.value} m/min`;
            });
        }
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.updateStatus('RUNNING');
        this.startConveyor();
        this.startPackageGeneration();
        this.startScanner();
    }

    stop() {
        this.isRunning = false;
        this.updateStatus('STOPPED');
        this.stopConveyor();
        this.stopPackageGeneration();
        this.stopScanner();
    }

    reset() {
        this.stop();
        this.clearPackages();
        this.resetLaneCounts();
        this.updateDisplay();
        this.createInitialPackages();
    }

    setSpeed(speed) {
        this.currentSpeed = parseInt(speed);
        this.updateDisplay();
    }

    startConveyor() {
        const belt = document.querySelector('.conveyor-belt');
        if (belt) {
            belt.style.animationPlayState = 'running';
        }
        
        const laneBelts = document.querySelectorAll('.lane-belt');
        laneBelts.forEach(belt => {
            belt.style.animationPlayState = 'running';
        });
    }

    stopConveyor() {
        const belt = document.querySelector('.conveyor-belt');
        if (belt) {
            belt.style.animationPlayState = 'paused';
        }
        
        const laneBelts = document.querySelectorAll('.lane-belt');
        laneBelts.forEach(belt => {
            belt.style.animationPlayState = 'paused';
        });
    }

    startPackageGeneration() {
        this.packageInterval = setInterval(() => {
            if (this.isRunning) {
                this.createPackage();
            }
        }, 1500); // Daha sık paket oluştur
    }

    stopPackageGeneration() {
        if (this.packageInterval) {
            clearInterval(this.packageInterval);
        }
    }

    startScanner() {
        this.scannerInterval = setInterval(() => {
            if (this.isRunning) {
                this.scanPackage();
            }
        }, 800);
        
        // Activate scanner light
        const scannerLight = document.getElementById('scannerLight');
        if (scannerLight) {
            scannerLight.classList.add('active');
        }
    }

    stopScanner() {
        if (this.scannerInterval) {
            clearInterval(this.scannerInterval);
        }
        
        // Deactivate scanner light
        const scannerLight = document.getElementById('scannerLight');
        if (scannerLight) {
            scannerLight.classList.remove('active');
        }
    }

    createPackage() {
        const pkg = {
            id: this.packageId++,
            type: this.getRandomPackageType(),
            lane: Math.floor(Math.random() * 3) + 1,
            x: -150, // Ana conveyor'ın daha gerisinden başla
            y: 15,
            element: null
        };

        this.packages.push(pkg);
        this.renderPackage(pkg);
        this.animatePackage(pkg);
    }

    getRandomPackageType() {
        const types = ['box', 'envelope', 'tote'];
        return types[Math.floor(Math.random() * types.length)];
    }

    renderPackage(pkg) {
        const mainConveyor = document.querySelector('.main-conveyor');
        if (!mainConveyor) return;

        const packageElement = document.createElement('div');
        packageElement.className = 'package';
        packageElement.id = `package-${pkg.id}`;
        packageElement.style.left = `${pkg.x}px`;
        packageElement.style.top = `${pkg.y}px`;
        packageElement.textContent = pkg.id;
        
        // Add package type styling
        packageElement.classList.add(`package-${pkg.type}`);
        
        mainConveyor.appendChild(packageElement);
        pkg.element = packageElement;
    }

    animatePackage(pkg) {
        if (!pkg.element) return;

        const animationDuration = Math.max(2, (60000 / this.currentSpeed) * 0.3); // Daha hızlı animasyon
        
        pkg.element.style.transition = `left ${animationDuration}s linear`;
        pkg.element.style.left = '50%';

        // Trigger sorting at the center
        setTimeout(() => {
            this.sortPackage(pkg);
        }, animationDuration * 1000 * 0.6);

        // Remove package after animation
        setTimeout(() => {
            this.removePackage(pkg);
        }, animationDuration * 1000);
    }

    sortPackage(pkg) {
        // Activate divertor
        this.activateDivertor(pkg.lane);
        
        // Move package to output lane
        this.moveToOutputLane(pkg);
        
        // Update lane count
        this.laneCounts[pkg.lane]++;
        this.updateLaneCount(pkg.lane);
    }

    activateDivertor(lane) {
        const divertor = document.querySelector(`.divertor-arm[data-lane="${lane}"]`);
        if (divertor) {
            // Reset all divertors first
            document.querySelectorAll('.divertor-arm').forEach(d => {
                const laneNum = d.dataset.lane;
                const rotation = laneNum === "1" ? -30 : laneNum === "2" ? 0 : 30;
                d.style.transform = `rotate(${rotation}deg)`;
                d.style.background = '';
            });
            
            // Activate the target divertor with correct rotation
            let rotation;
            switch(lane) {
                case 1:
                    rotation = -30;
                    break;
                case 2:
                    rotation = 0;
                    break;
                case 3:
                    rotation = 30;
                    break;
                default:
                    rotation = 0;
            }
            
            divertor.style.transform = `rotate(${rotation}deg)`;
            divertor.style.background = 'rgba(231, 76, 60, 0.3)';
            
            setTimeout(() => {
                divertor.style.background = '';
            }, 500);
        }
    }

    moveToOutputLane(pkg) {
        if (!pkg.element) return;

        const laneElement = document.querySelector(`.output-lane[data-lane="${pkg.lane}"]`);
        if (laneElement) {
            const laneRect = laneElement.getBoundingClientRect();
            const mainConveyor = document.querySelector('.main-conveyor');
            const conveyorRect = mainConveyor.getBoundingClientRect();
            
            // Calculate correct position for each lane
            let targetX, targetY;
            switch(pkg.lane) {
                case 1: // Sol lane
                    targetX = laneRect.left - conveyorRect.left + 30;
                    targetY = laneRect.top - conveyorRect.top + laneRect.height / 2 - 15;
                    break;
                case 2: // Orta lane
                    targetX = laneRect.left - conveyorRect.left + laneRect.width / 2 - 20;
                    targetY = laneRect.top - conveyorRect.top + laneRect.height / 2 - 15;
                    break;
                case 3: // Sağ lane
                    targetX = laneRect.right - conveyorRect.left - 50;
                    targetY = laneRect.top - conveyorRect.top + laneRect.height / 2 - 15;
                    break;
                default:
                    targetX = laneRect.left - conveyorRect.left + laneRect.width / 2 - 20;
                    targetY = laneRect.top - conveyorRect.top + laneRect.height / 2 - 15;
            }
            
            pkg.element.style.transition = 'all 1s ease-in-out';
            pkg.element.style.left = `${targetX}px`;
            pkg.element.style.top = `${targetY}px`;
            pkg.element.style.transform = 'scale(0.8)';
        }
    }

    removePackage(pkg) {
        if (pkg.element) {
            pkg.element.remove();
        }
        this.packages = this.packages.filter(p => p.id !== pkg.id);
    }

    scanPackage() {
        const scannerText = document.getElementById('scannerText');
        if (scannerText) {
            const scanMessages = ['SCANNING...', 'READING...', 'PROCESSING...', 'SORTING...'];
            const randomMessage = scanMessages[Math.floor(Math.random() * scanMessages.length)];
            scannerText.textContent = randomMessage;
        }
    }

    createInitialPackages() {
        // Create 3 initial packages
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createPackage();
            }, i * 1000);
        }
    }

    clearPackages() {
        this.packages.forEach(pkg => {
            if (pkg.element) {
                pkg.element.remove();
            }
        });
        this.packages = [];
    }

    resetLaneCounts() {
        this.laneCounts = { 1: 0, 2: 0, 3: 0 };
        this.updateAllLaneCounts();
    }

    updateLaneCount(lane) {
        const countElement = document.getElementById(`lane${lane}Count`);
        if (countElement) {
            countElement.textContent = this.laneCounts[lane];
        }
    }

    updateAllLaneCounts() {
        Object.keys(this.laneCounts).forEach(lane => {
            this.updateLaneCount(lane);
        });
    }

    updateDisplay() {
        const speedElement = document.getElementById('speedValue');
        const capacityElement = document.getElementById('capacityValue');
        const accuracyElement = document.getElementById('accuracyValue');
        const processedElement = document.getElementById('processedCount');
        const speedIndicator = document.getElementById('speedIndicator');
        const accuracyIndicator = document.getElementById('accuracyIndicator');

        if (speedElement) speedElement.textContent = `${this.currentSpeed} m/min`;
        if (capacityElement) capacityElement.textContent = `${this.capacity} pcs/hr`;
        if (accuracyElement) accuracyElement.textContent = `${this.accuracy}%`;
        
        // Update performance indicators
        const totalProcessed = Object.values(this.laneCounts).reduce((a, b) => a + b, 0);
        if (processedElement) processedElement.textContent = totalProcessed;
        if (speedIndicator) speedIndicator.textContent = `${this.currentSpeed} m/min`;
        if (accuracyIndicator) accuracyIndicator.textContent = `%${this.accuracy}`;
    }

    updateStatus(status) {
        const statusElement = document.getElementById('statusValue');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.style.color = status === 'RUNNING' ? '#2ecc71' : '#e74c3c';
        }
    }
}

// Initialize the sorter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalSorter();
}); 