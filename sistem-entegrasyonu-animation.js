// ===== SİSTEM ENTEGRASYONU ANİMASYONU JAVASCRIPT =====

class SystemIntegrationAnimation {
    constructor() {
        this.isRefreshing = false;
        this.connectionStatus = {
            erp: true,
            mes: true,
            scada: true,
            plc: true
        };
        this.init();
    }

    init() {
        this.setupControls();
        this.startDataFlowAnimation();
        this.updateMetrics();
        this.simulateConnectionIssues();
    }

    setupControls() {
        const refreshBtn = document.querySelector('.refresh-btn');
        const settingsBtn = document.querySelector('.settings-btn');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshSystems());
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettings());
        }
    }

    refreshSystems() {
        if (this.isRefreshing) return;

        this.isRefreshing = true;
        const refreshBtn = document.querySelector('.refresh-btn');
        const originalIcon = refreshBtn.innerHTML;
        
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        refreshBtn.style.background = '#007acc';

        // Simulate refresh
        setTimeout(() => {
            this.isRefreshing = false;
            refreshBtn.innerHTML = originalIcon;
            refreshBtn.style.background = '#3e3e42';
            
            // Update all systems
            this.updateAllSystems();
        }, 2000);
    }

    showSettings() {
        const settingsBtn = document.querySelector('.settings-btn');
        const originalIcon = settingsBtn.innerHTML;
        
        settingsBtn.innerHTML = '<i class="fas fa-check"></i>';
        settingsBtn.style.background = '#4ec9b0';

        // Simulate settings update
        setTimeout(() => {
            settingsBtn.innerHTML = originalIcon;
            settingsBtn.style.background = '#3e3e42';
            
            // Show settings notification
            this.showSettingsNotification();
        }, 1500);
    }

    updateAllSystems() {
        const systems = ['erp', 'mes', 'scada', 'plc'];
        systems.forEach((system, index) => {
            setTimeout(() => {
                this.updateSystemStatus(system, true);
            }, index * 300);
        });
    }

    updateSystemStatus(system, isOnline) {
        const systemCard = document.querySelector(`.system-card.${system}`);
        if (!systemCard) return;

        const statusElement = systemCard.querySelector('.status');
        const flowIndicators = systemCard.querySelectorAll('.flow-indicator');
        
        if (isOnline) {
            statusElement.textContent = 'Bağlı';
            statusElement.className = 'status online';
            flowIndicators.forEach(indicator => {
                indicator.classList.add('active');
            });
        } else {
            statusElement.textContent = 'Bağlantı Yok';
            statusElement.className = 'status offline';
            flowIndicators.forEach(indicator => {
                indicator.classList.remove('active');
            });
        }
    }

    startDataFlowAnimation() {
        const flowIndicators = document.querySelectorAll('.flow-indicator');
        
        flowIndicators.forEach((indicator, index) => {
            setInterval(() => {
                if (indicator.classList.contains('active')) {
                    indicator.style.opacity = '0.3';
                    setTimeout(() => {
                        indicator.style.opacity = '1';
                    }, 500);
                }
            }, 2000 + (index * 200));
        });
    }

    updateMetrics() {
        const metrics = [
            { label: 'Aktif Bağlantı:', value: '4/4' },
            { label: 'Veri Akışı:', value: '2.5 MB/s' },
            { label: 'Gecikme:', value: '15ms' }
        ];

        const metricElements = document.querySelectorAll('.metric');
        metricElements.forEach((element, index) => {
            if (index < metrics.length) {
                const labelElement = element.querySelector('.metric-label');
                const valueElement = element.querySelector('.metric-value');
                
                if (labelElement && valueElement) {
                    labelElement.textContent = metrics[index].label;
                    valueElement.textContent = metrics[index].value;
                }
            }
        });

        // Update metrics periodically
        setInterval(() => {
            this.updateRandomMetrics();
        }, 5000);
    }

    updateRandomMetrics() {
        const dataFlowValues = ['2.3 MB/s', '2.7 MB/s', '2.5 MB/s', '2.8 MB/s'];
        const latencyValues = ['12ms', '18ms', '15ms', '20ms'];
        
        const dataFlowElement = document.querySelector('.metric-value:nth-child(2)');
        const latencyElement = document.querySelector('.metric-value:nth-child(3)');
        
        if (dataFlowElement) {
            dataFlowElement.textContent = dataFlowValues[Math.floor(Math.random() * dataFlowValues.length)];
        }
        
        if (latencyElement) {
            latencyElement.textContent = latencyValues[Math.floor(Math.random() * latencyValues.length)];
        }
    }

    simulateConnectionIssues() {
        // Simulate occasional connection issues
        setInterval(() => {
            const systems = ['erp', 'mes', 'scada', 'plc'];
            const randomSystem = systems[Math.floor(Math.random() * systems.length)];
            
            // 5% chance of connection issue
            if (Math.random() < 0.05) {
                this.updateSystemStatus(randomSystem, false);
                
                // Auto-reconnect after 3 seconds
                setTimeout(() => {
                    this.updateSystemStatus(randomSystem, true);
                }, 3000);
            }
        }, 10000);
    }

    showSettingsNotification() {
        const dashboard = document.querySelector('.integration-dashboard');
        const notification = document.createElement('div');
        notification.className = 'settings-notification';
        notification.innerHTML = `
            <div style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: #4ec9b0;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            ">
                <i class="fas fa-check"></i> Ayarlar güncellendi
            </div>
        `;
        
        dashboard.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const integrationAnimation = document.querySelector('.integration-hero-animation');
    if (integrationAnimation) {
        const integration = new SystemIntegrationAnimation();
    }
}); 