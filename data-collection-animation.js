// ===== VERİ TOPLAMA ANİMASYONU JAVASCRIPT =====

class DataCollectionAnimation {
    constructor() {
        this.isRunning = true;
        this.dataRate = 1247;
        this.connectionCount = 24;
        this.storageUsed = 67.3;
        this.uptime = 99.9;
        
        this.sensorData = {
            temp1: { value: 24.5, unit: '°C', min: 20, max: 30 },
            pressure1: { value: 2.3, unit: ' bar', min: 1, max: 5 },
            flow1: { value: 150, unit: ' L/min', min: 100, max: 200 },
            level1: { value: 75, unit: '%', min: 0, max: 100 }
        };
        
        this.init();
    }
    
    init() {
        this.updateTime();
        this.updateMetrics();
        this.updateSensorData();
        this.setupControls();
        
        // Update time every second
        setInterval(() => {
            this.updateTime();
        }, 1000);
        
        // Update sensor data every 2 seconds
        setInterval(() => {
            this.updateSensorData();
        }, 2000);
        
        // Update metrics every 3 seconds
        setInterval(() => {
            this.updateMetrics();
        }, 3000);
    }
    
    updateTime() {
        const timeElement = document.getElementById('network-time');
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
    
    updateSensorData() {
        Object.keys(this.sensorData).forEach(sensorId => {
            const sensor = this.sensorData[sensorId];
            
            // Random value change
            const change = (Math.random() - 0.5) * 2;
            sensor.value += change;
            
            // Keep within bounds
            sensor.value = Math.max(sensor.min, Math.min(sensor.max, sensor.value));
            
            // Update DOM
            const valueElement = document.getElementById(`${sensorId}-value`);
            if (valueElement) {
                valueElement.textContent = `${sensor.value.toFixed(1)}${sensor.unit}`;
            }
            
            // Update sensor status
            const sensorNode = document.querySelector(`[data-sensor="${sensorId}"]`);
            if (sensorNode) {
                sensorNode.classList.add('active');
            }
        });
    }
    
    updateMetrics() {
        // Update data rate
        this.dataRate += Math.floor((Math.random() - 0.5) * 50);
        this.dataRate = Math.max(1000, Math.min(1500, this.dataRate));
        
        // Update connection count
        this.connectionCount += Math.floor((Math.random() - 0.5) * 2);
        this.connectionCount = Math.max(20, Math.min(30, this.connectionCount));
        
        // Update storage used
        this.storageUsed += (Math.random() - 0.5) * 1;
        this.storageUsed = Math.max(60, Math.min(80, this.storageUsed));
        
        // Update uptime (slowly decrease)
        this.uptime -= Math.random() * 0.01;
        this.uptime = Math.max(99.0, this.uptime);
        
        // Update DOM
        this.updateMetricElement('data-rate', this.dataRate.toLocaleString());
        this.updateMetricElement('connection-count', this.connectionCount);
        this.updateMetricElement('storage-used', this.storageUsed.toFixed(1));
        this.updateMetricElement('uptime', this.uptime.toFixed(1));
    }
    
    updateMetricElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    setupControls() {
        const startBtn = document.getElementById('start-collection');
        const stopBtn = document.getElementById('stop-collection');
        const exportBtn = document.getElementById('export-data');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startCollection();
            });
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopCollection();
            });
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
    }
    
    startCollection() {
        this.isRunning = true;
        this.updateGatewayStatus('Aktif');
        this.updateProcessorStatus('Çalışıyor');
        this.updateDatabaseStatus('Kaydediliyor');
        
        // Activate all sensors
        document.querySelectorAll('.sensor-node').forEach(node => {
            node.classList.add('active');
        });
        
        // Visual feedback
        document.body.style.filter = 'none';
    }
    
    stopCollection() {
        this.isRunning = false;
        this.updateGatewayStatus('Durduruldu');
        this.updateProcessorStatus('Durduruldu');
        this.updateDatabaseStatus('Durduruldu');
        
        // Deactivate all sensors
        document.querySelectorAll('.sensor-node').forEach(node => {
            node.classList.remove('active');
        });
        
        // Visual feedback
        document.body.style.filter = 'grayscale(30%)';
    }
    
    exportData() {
        // Simulate data export
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            const originalText = exportBtn.innerHTML;
            exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>DİŞA AKTARILIYOR...</span>';
            exportBtn.style.background = '#f59e0b';
            
            setTimeout(() => {
                exportBtn.innerHTML = '<i class="fas fa-check"></i><span>BAŞARILI!</span>';
                exportBtn.style.background = '#10b981';
                
                setTimeout(() => {
                    exportBtn.innerHTML = originalText;
                    exportBtn.style.background = '#60a5fa';
                }, 2000);
            }, 3000);
        }
    }
    
    updateGatewayStatus(status) {
        const statusElement = document.getElementById('gateway-status');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.style.color = status === 'Aktif' ? '#10b981' : '#ef4444';
        }
    }
    
    updateProcessorStatus(status) {
        const statusElement = document.getElementById('processor-status');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.style.color = status === 'Çalışıyor' ? '#f59e0b' : '#ef4444';
        }
    }
    
    updateDatabaseStatus(status) {
        const statusElement = document.getElementById('db-status');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.style.color = status === 'Kaydediliyor' ? '#8b5cf6' : '#ef4444';
        }
    }
    
    // Random sensor failures
    simulateSensorFailure() {
        if (!this.isRunning) return;
        
        const sensors = ['temp1', 'pressure1', 'flow1', 'level1'];
        const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
        const sensorNode = document.querySelector(`[data-sensor="${randomSensor}"]`);
        
        if (sensorNode) {
            sensorNode.classList.remove('active');
            
            // Reactivate after 5 seconds
            setTimeout(() => {
                if (this.isRunning) {
                    sensorNode.classList.add('active');
                }
            }, 5000);
        }
        
        // Schedule next failure
        setTimeout(() => {
            this.simulateSensorFailure();
        }, Math.random() * 30000 + 15000); // 15-45 seconds
    }
    
    // Data flow animation
    animateDataFlow() {
        const flowLines = document.querySelectorAll('.flow-line');
        flowLines.forEach((line, index) => {
            line.style.animationDelay = `${index * 0.5}s`;
        });
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const dataCollectionAnimation = document.querySelector('.data-collection-hero-animation');
    if (dataCollectionAnimation) {
        const dataCollection = new DataCollectionAnimation();
        
        // Start sensor failure simulation after 10 seconds
        setTimeout(() => {
            dataCollection.simulateSensorFailure();
        }, 10000);
        
        // Start data flow animation
        dataCollection.animateDataFlow();
    }
}); 