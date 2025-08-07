// ===== ÜRETİM TAKİBİ ANİMASYONU JAVASCRIPT =====

class ProductionTrackingAnimation {
    constructor() {
        this.isRunning = true;
        this.productionRate = 125;
        this.qualityRate = 99.5;
        this.efficiencyRate = 87.3;
        this.totalProduction = 2847;
        this.productCounter = 0;
        this.defectiveCount = 0;
        this.qualityCount = 0;
        
        this.init();
    }
    
    init() {
        this.updateTime();
        this.updateMetrics();
        this.setupControls();
        this.startProduction();
        
        // Update time every second
        setInterval(() => {
            this.updateTime();
        }, 1000);
        
        // Update metrics every 2 seconds
        setInterval(() => {
            this.updateMetrics();
        }, 2000);
    }
    
    updateTime() {
        const timeElement = document.getElementById('production-time');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('tr-TR', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeElement.textContent = timeString;
        }
    }
    
    updateMetrics() {
        // Update production rate
        this.productionRate += Math.floor((Math.random() - 0.5) * 10);
        this.productionRate = Math.max(100, Math.min(150, this.productionRate));
        
        // Update quality rate
        this.qualityRate += (Math.random() - 0.5) * 0.5;
        this.qualityRate = Math.max(98.0, Math.min(100.0, this.qualityRate));
        
        // Update efficiency rate
        this.efficiencyRate += (Math.random() - 0.5) * 2;
        this.efficiencyRate = Math.max(80.0, Math.min(95.0, this.efficiencyRate));
        
        // Update total production
        this.totalProduction += Math.floor(Math.random() * 5);
        
        // Update DOM
        this.updateMetricElement('production-rate', this.productionRate);
        this.updateMetricElement('quality-rate', this.qualityRate.toFixed(1));
        this.updateMetricElement('efficiency-rate', this.efficiencyRate.toFixed(1));
        this.updateMetricElement('total-production', this.totalProduction.toLocaleString());
    }
    
    updateMetricElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    setupControls() {
        const startBtn = document.getElementById('start-production');
        const stopBtn = document.getElementById('stop-production');
        const resetBtn = document.getElementById('reset-production');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startProduction();
            });
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopProduction();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetProduction();
            });
        }
    }
    
    startProduction() {
        this.isRunning = true;
        this.updateStationStatus(1, 'Hazır');
        this.updateStationStatus(2, 'Çalışıyor');
        this.updateStationStatus(3, 'Kontrol');
        this.updateStationStatus(4, 'Hazır');
        
        // Start product generation
        this.generateProducts();
    }
    
    stopProduction() {
        this.isRunning = false;
        this.updateStationStatus(1, 'Durduruldu');
        this.updateStationStatus(2, 'Durduruldu');
        this.updateStationStatus(3, 'Durduruldu');
        this.updateStationStatus(4, 'Durduruldu');
    }
    
    resetProduction() {
        this.isRunning = false;
        this.productionRate = 125;
        this.qualityRate = 99.5;
        this.efficiencyRate = 87.3;
        this.totalProduction = 2847;
        this.productCounter = 0;
        this.defectiveCount = 0;
        this.qualityCount = 0;
        
        this.updateMetrics();
        this.updateStationStatus(1, 'Hazır');
        this.updateStationStatus(2, 'Çalışıyor');
        this.updateStationStatus(3, 'Kontrol');
        this.updateStationStatus(4, 'Hazır');
        
        // Clear products
        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            productsContainer.innerHTML = '';
        }
    }
    
    updateStationStatus(stationNumber, status) {
        const statusElement = document.getElementById(`station-${stationNumber}-status`);
        const station = document.querySelector(`[data-station="${stationNumber}"]`);
        const indicator = station?.querySelector('.station-indicator');
        
        if (statusElement) {
            statusElement.textContent = status;
        }
        
        if (station && indicator) {
            station.classList.remove('active');
            indicator.classList.remove('active');
            
            if (status === 'Çalışıyor' || status === 'Kontrol') {
                station.classList.add('active');
                indicator.classList.add('active');
            }
        }
    }
    
    generateProducts() {
        if (!this.isRunning) return;
        
        // Create new product
        this.createProduct();
        
        // Schedule next product
        const interval = (60 / this.productionRate) * 1000; // Convert to milliseconds
        setTimeout(() => {
            this.generateProducts();
        }, interval);
    }
    
    createProduct() {
        const productsContainer = document.getElementById('products-container');
        if (!productsContainer) return;
        
        this.productCounter++;
        
        const product = document.createElement('div');
        product.className = 'product';
        product.textContent = this.productCounter;
        
        // Random quality check
        const isDefective = Math.random() < (1 - this.qualityRate / 100);
        const isQuality = Math.random() < 0.3;
        
        if (isDefective) {
            product.classList.add('defective');
            this.defectiveCount++;
        } else if (isQuality) {
            product.classList.add('quality');
            this.qualityCount++;
        }
        
        productsContainer.appendChild(product);
        
        // Remove product after animation
        setTimeout(() => {
            if (product.parentNode) {
                product.parentNode.removeChild(product);
            }
        }, 4000);
        
        // Update QC lights
        this.updateQCLights(isDefective, isQuality);
    }
    
    updateQCLights(isDefective, isQuality) {
        const qcLights = document.querySelectorAll('.qc-light');
        
        // Reset all lights
        qcLights.forEach(light => {
            light.classList.remove('green', 'red', 'yellow');
        });
        
        // Set appropriate light
        if (isDefective) {
            qcLights[1].classList.add('red'); // Red light for defective
        } else if (isQuality) {
            qcLights[0].classList.add('green'); // Green light for quality
        } else {
            qcLights[2].classList.add('yellow'); // Yellow light for normal
        }
        
        // Reset lights after 1 second
        setTimeout(() => {
            qcLights.forEach(light => {
                light.classList.remove('green', 'red', 'yellow');
            });
        }, 1000);
    }
    
    // Random station status changes
    randomizeStationStatus() {
        if (!this.isRunning) return;
        
        const stations = [1, 2, 3, 4];
        const randomStation = stations[Math.floor(Math.random() * stations.length)];
        const statuses = ['Çalışıyor', 'Hazır', 'Beklemede', 'Hata'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        this.updateStationStatus(randomStation, randomStatus);
        
        // Schedule next randomization
        setTimeout(() => {
            this.randomizeStationStatus();
        }, Math.random() * 10000 + 5000); // 5-15 seconds
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const productionAnimation = document.querySelector('.production-hero-animation');
    if (productionAnimation) {
        const production = new ProductionTrackingAnimation();
        
        // Start random station changes after 10 seconds
        setTimeout(() => {
            production.randomizeStationStatus();
        }, 10000);
    }
}); 