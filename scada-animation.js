// ===== SCADA ANİMASYONU JAVASCRIPT =====

class ScadaAnimation {
    constructor() {
        this.isRunning = true;
        this.currentTime = new Date();
        this.processStates = {
            sorter: { status: 'Çalışıyor', active: true },
            lift: { status: 'Hazır', active: false },
            conveyor: { status: 'Çalışıyor', active: true },
            robot: { status: 'Beklemede', active: false, warning: true }
        };
        
        this.dataValues = {
            temperature: 24.5,
            humidity: 45,
            energy: 125,
            production: 1247
        };
        
        this.alarms = [
            { type: 'warning', message: 'Robot 2 - Bakım Gerekli', time: '2 dk önce' },
            { type: 'info', message: 'Sorter - Yüksek Verimlilik', time: '5 dk önce' }
        ];
        
        this.init();
    }
    
    init() {
        this.updateTime();
        this.updateProcessStates();
        this.updateRealTimeData();
        this.updateAlarms();
        this.setupControls();
        
        // Start real-time updates
        setInterval(() => {
            this.updateTime();
            this.updateRealTimeData();
        }, 1000);
        
        // Update process states every 5 seconds
        setInterval(() => {
            this.updateProcessStates();
        }, 5000);
        
        // Add new alarms every 10 seconds
        setInterval(() => {
            this.addRandomAlarm();
        }, 10000);
    }
    
    updateTime() {
        const timeElement = document.getElementById('dashboard-time');
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
    
    updateProcessStates() {
        Object.keys(this.processStates).forEach(process => {
            const statusElement = document.getElementById(`${process}-status`);
            const indicator = document.querySelector(`[data-process="${process}"] .process-indicator`);
            
            if (statusElement && indicator) {
                const state = this.processStates[process];
                statusElement.textContent = state.status;
                
                // Update indicator
                indicator.className = 'process-indicator';
                if (state.active) {
                    indicator.classList.add('active');
                } else if (state.warning) {
                    indicator.classList.add('warning');
                }
                
                // Random state changes
                if (Math.random() < 0.3) {
                    this.randomizeProcessState(process);
                }
            }
        });
    }
    
    randomizeProcessState(process) {
        const states = [
            { status: 'Çalışıyor', active: true, warning: false },
            { status: 'Hazır', active: false, warning: false },
            { status: 'Beklemede', active: false, warning: true },
            { status: 'Hata', active: false, warning: false }
        ];
        
        this.processStates[process] = states[Math.floor(Math.random() * states.length)];
    }
    
    updateRealTimeData() {
        // Update temperature
        this.dataValues.temperature += (Math.random() - 0.5) * 0.2;
        this.dataValues.temperature = Math.max(20, Math.min(30, this.dataValues.temperature));
        
        // Update humidity
        this.dataValues.humidity += (Math.random() - 0.5) * 1;
        this.dataValues.humidity = Math.max(35, Math.min(55, this.dataValues.humidity));
        
        // Update energy
        this.dataValues.energy += (Math.random() - 0.5) * 2;
        this.dataValues.energy = Math.max(100, Math.min(150, this.dataValues.energy));
        
        // Update production
        this.dataValues.production += Math.floor(Math.random() * 3);
        
        // Update DOM
        this.updateDataElement('temperature', `${this.dataValues.temperature.toFixed(1)}°C`);
        this.updateDataElement('humidity', `${Math.round(this.dataValues.humidity)}%`);
        this.updateDataElement('energy', `${Math.round(this.dataValues.energy)} kW`);
        this.updateDataElement('production', this.dataValues.production.toLocaleString());
        
        // Update trends
        this.updateTrends();
    }
    
    updateDataElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    updateTrends() {
        const trendElements = document.querySelectorAll('.data-trend');
        trendElements.forEach(trend => {
            const isUp = Math.random() > 0.5;
            trend.className = `data-trend ${isUp ? 'up' : 'down'}`;
            
            const icon = trend.querySelector('i');
            const span = trend.querySelector('span');
            
            if (icon && span) {
                icon.className = isUp ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
                const value = isUp ? 
                    `+${(Math.random() * 5).toFixed(1)}` : 
                    `-${(Math.random() * 3).toFixed(1)}`;
                span.textContent = value;
            }
        });
    }
    
    updateAlarms() {
        const alarmsList = document.getElementById('alarms-list');
        if (alarmsList) {
            alarmsList.innerHTML = '';
            
            this.alarms.forEach(alarm => {
                const alarmElement = document.createElement('div');
                alarmElement.className = `alarm-item ${alarm.type}`;
                
                const icon = alarm.type === 'warning' ? 'fas fa-exclamation-circle' :
                           alarm.type === 'error' ? 'fas fa-times-circle' :
                           'fas fa-info-circle';
                
                alarmElement.innerHTML = `
                    <i class="${icon}"></i>
                    <span>${alarm.message}</span>
                    <span class="alarm-time">${alarm.time}</span>
                `;
                
                alarmsList.appendChild(alarmElement);
            });
        }
    }
    
    addRandomAlarm() {
        const alarmTypes = [
            { type: 'info', message: 'Sistem - Normal Çalışma', time: '1 dk önce' },
            { type: 'warning', message: 'Sıcaklık - Yüksek Değer', time: '3 dk önce' },
            { type: 'info', message: 'Enerji - Optimizasyon', time: '1 dk önce' },
            { type: 'warning', message: 'Konveyor - Bakım Gerekli', time: '2 dk önce' }
        ];
        
        const randomAlarm = alarmTypes[Math.floor(Math.random() * alarmTypes.length)];
        this.alarms.unshift(randomAlarm);
        
        // Keep only last 5 alarms
        if (this.alarms.length > 5) {
            this.alarms.pop();
        }
        
        this.updateAlarms();
    }
    
    setupControls() {
        const emergencyStop = document.getElementById('emergency-stop');
        const systemReset = document.getElementById('system-reset');
        const maintenanceMode = document.getElementById('maintenance-mode');
        
        if (emergencyStop) {
            emergencyStop.addEventListener('click', () => {
                this.emergencyStop();
            });
        }
        
        if (systemReset) {
            systemReset.addEventListener('click', () => {
                this.systemReset();
            });
        }
        
        if (maintenanceMode) {
            maintenanceMode.addEventListener('click', () => {
                this.toggleMaintenanceMode();
            });
        }
    }
    
    emergencyStop() {
        this.isRunning = false;
        
        // Stop all processes
        Object.keys(this.processStates).forEach(process => {
            this.processStates[process] = { status: 'DURDURULDU', active: false, warning: false };
        });
        
        // Add emergency alarm
        this.alarms.unshift({
            type: 'error',
            message: 'ACİL DURDUR - Sistem Durduruldu',
            time: 'Şimdi'
        });
        
        this.updateProcessStates();
        this.updateAlarms();
        
        // Visual feedback
        document.body.style.filter = 'grayscale(50%)';
        
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 2000);
    }
    
    systemReset() {
        this.isRunning = true;
        
        // Reset all processes
        this.processStates = {
            sorter: { status: 'Çalışıyor', active: true },
            lift: { status: 'Hazır', active: false },
            conveyor: { status: 'Çalışıyor', active: true },
            robot: { status: 'Beklemede', active: false, warning: true }
        };
        
        // Reset data values
        this.dataValues = {
            temperature: 24.5,
            humidity: 45,
            energy: 125,
            production: 1247
        };
        
        // Add reset alarm
        this.alarms.unshift({
            type: 'info',
            message: 'Sistem Sıfırlandı',
            time: 'Şimdi'
        });
        
        this.updateProcessStates();
        this.updateRealTimeData();
        this.updateAlarms();
    }
    
    toggleMaintenanceMode() {
        const maintenanceBtn = document.getElementById('maintenance-mode');
        if (maintenanceBtn) {
            const isMaintenance = maintenanceBtn.textContent.includes('BAKIM');
            
            if (isMaintenance) {
                maintenanceBtn.innerHTML = '<i class="fas fa-tools"></i><span>BAKIM MODU</span>';
                maintenanceBtn.style.background = '#60a5fa';
                this.isRunning = true;
            } else {
                maintenanceBtn.innerHTML = '<i class="fas fa-check"></i><span>NORMAL MOD</span>';
                maintenanceBtn.style.background = '#10b981';
                this.isRunning = false;
            }
        }
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const scadaAnimation = document.querySelector('.scada-hero-animation');
    if (scadaAnimation) {
        const scada = new ScadaAnimation();
    }
}); 