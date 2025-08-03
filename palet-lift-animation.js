// Palet Lift Animation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startPaletAnimation');
    const resetBtn = document.getElementById('resetPaletAnimation');
    const liftPlatform = document.querySelector('.lift-platform');
    const palets = document.querySelectorAll('.palet');
    const upBtn = document.querySelector('.up-btn');
    const downBtn = document.querySelector('.down-btn');
    
    let animationRunning = false;
    let currentLevel = 'ground'; // 'ground' or 'upper'
    
    // Animation start function
    function startPaletAnimation() {
        if (animationRunning) return;
        
        animationRunning = true;
        startBtn.disabled = true;
        startBtn.textContent = 'Animasyon Çalışıyor...';
        
        // Start the animation sequence
        animatePaletLift();
    }
    
    // Main animation sequence
    function animatePaletLift() {
        const groundPalets = document.querySelectorAll('.ground-level .palet');
        const upperPalets = document.querySelectorAll('.upper-level .palet');
        
        // Move palets from ground to upper level
        movePaletsToUpper(groundPalets, 0);
    }
    
    // Move palets to upper level
    function movePaletsToUpper(palets, index) {
        if (index >= palets.length) {
            // All ground palets moved, now move upper palets down
            setTimeout(() => {
                const upperPalets = document.querySelectorAll('.upper-level .palet');
                movePaletsToGround(upperPalets, 0);
            }, 1000);
            return;
        }
        
        const palet = palets[index];
        const destination = palet.dataset.destination;
        
        if (destination === 'up') {
            // Move lift up
            liftPlatform.classList.add('moving-up');
            upBtn.classList.add('active');
            
            setTimeout(() => {
                // Move palet to lift platform
                palet.classList.add('moving');
                palet.style.position = 'absolute';
                palet.style.top = '50%';
                palet.style.left = '50%';
                palet.style.transform = 'translate(-50%, -50%)';
                
                setTimeout(() => {
                    // Move lift down
                    liftPlatform.classList.remove('moving-up');
                    liftPlatform.classList.add('moving-down');
                    upBtn.classList.remove('active');
                    downBtn.classList.add('active');
                    
                    setTimeout(() => {
                        // Place palet in upper level
                        const upperLevel = document.querySelector('.upper-level');
                        upperLevel.appendChild(palet);
                        palet.classList.remove('moving');
                        palet.style.position = 'static';
                        palet.style.top = 'auto';
                        palet.style.left = 'auto';
                        palet.style.transform = 'none';
                        
                        liftPlatform.classList.remove('moving-down');
                        downBtn.classList.remove('active');
                        
                        // Move next palet
                        setTimeout(() => {
                            movePaletsToUpper(palets, index + 1);
                        }, 500);
                    }, 2000);
                }, 1000);
            }, 2000);
        }
    }
    
    // Move palets to ground level
    function movePaletsToGround(palets, index) {
        if (index >= palets.length) {
            // Animation complete
            setTimeout(() => {
                stopPaletAnimation();
            }, 1000);
            return;
        }
        
        const palet = palets[index];
        const destination = palet.dataset.destination;
        
        if (destination === 'down') {
            // Move lift up
            liftPlatform.classList.add('moving-up');
            upBtn.classList.add('active');
            
            setTimeout(() => {
                // Move palet to lift platform
                palet.classList.add('moving');
                palet.style.position = 'absolute';
                palet.style.top = '50%';
                palet.style.left = '50%';
                palet.style.transform = 'translate(-50%, -50%)';
                
                setTimeout(() => {
                    // Move lift down
                    liftPlatform.classList.remove('moving-up');
                    liftPlatform.classList.add('moving-down');
                    upBtn.classList.remove('active');
                    downBtn.classList.add('active');
                    
                    setTimeout(() => {
                        // Place palet in ground level
                        const groundLevel = document.querySelector('.ground-level');
                        groundLevel.appendChild(palet);
                        palet.classList.remove('moving');
                        palet.style.position = 'static';
                        palet.style.top = 'auto';
                        palet.style.left = 'auto';
                        palet.style.transform = 'none';
                        
                        liftPlatform.classList.remove('moving-down');
                        downBtn.classList.remove('active');
                        
                        // Move next palet
                        setTimeout(() => {
                            movePaletsToGround(palets, index + 1);
                        }, 500);
                    }, 2000);
                }, 1000);
            }, 2000);
        }
    }
    
    // Stop animation
    function stopPaletAnimation() {
        animationRunning = false;
        startBtn.disabled = false;
        startBtn.textContent = 'Animasyonu Başlat';
        
        // Reset lift platform
        liftPlatform.classList.remove('moving-up', 'moving-down');
        upBtn.classList.remove('active');
        downBtn.classList.remove('active');
    }
    
    // Reset animation
    function resetPaletAnimation() {
        // Stop current animation
        stopPaletAnimation();
        
        // Reset palets to original positions
        palets.forEach(palet => {
            palet.classList.remove('moving');
            palet.style.position = 'static';
            palet.style.top = 'auto';
            palet.style.left = 'auto';
            palet.style.transform = 'none';
        });
        
        // Reset lift platform
        liftPlatform.classList.remove('moving-up', 'moving-down');
        upBtn.classList.remove('active');
        downBtn.classList.remove('active');
    }
    
    // Event listeners
    if (startBtn) {
        startBtn.addEventListener('click', startPaletAnimation);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetPaletAnimation);
    }
    
    // Manual control buttons
    if (upBtn) {
        upBtn.addEventListener('click', function() {
            if (!animationRunning) {
                this.classList.add('active');
                liftPlatform.classList.add('moving-up');
                
                setTimeout(() => {
                    this.classList.remove('active');
                    liftPlatform.classList.remove('moving-up');
                }, 2000);
            }
        });
    }
    
    if (downBtn) {
        downBtn.addEventListener('click', function() {
            if (!animationRunning) {
                this.classList.add('active');
                liftPlatform.classList.add('moving-down');
                
                setTimeout(() => {
                    this.classList.remove('active');
                    liftPlatform.classList.remove('moving-down');
                }, 2000);
            }
        });
    }
    
    // Palet click effects
    palets.forEach(palet => {
        palet.addEventListener('click', function() {
            if (!animationRunning) {
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
    
    // Auto-start animation after page load
    setTimeout(() => {
        if (!animationRunning) {
            startPaletAnimation();
        }
    }, 3000);
    
    // Add performance indicators
    function addPerformanceIndicators() {
        const indicators = document.createElement('div');
        indicators.className = 'performance-indicators';
        indicators.innerHTML = `
            <div class="indicator">
                <span class="label">Hız:</span>
                <span class="value">0.3 m/s</span>
            </div>
            <div class="indicator">
                <span class="label">Kapasite:</span>
                <span class="value">1500 kg</span>
            </div>
            <div class="indicator">
                <span class="label">Durum:</span>
                <span class="value" id="liftStatus">Hazır</span>
            </div>
        `;
        
        const animationContainer = document.querySelector('.palet-lift-animation');
        if (animationContainer) {
            animationContainer.appendChild(indicators);
        }
        
        // Add styles for indicators
        const style = document.createElement('style');
        style.textContent = `
            .performance-indicators {
                display: flex;
                justify-content: space-around;
                margin-top: 1rem;
                padding: 1rem;
                background: var(--light-bg);
                border-radius: 8px;
            }
            
            .indicator {
                text-align: center;
            }
            
            .indicator .label {
                display: block;
                font-size: 0.8rem;
                color: var(--secondary);
                margin-bottom: 0.25rem;
            }
            
            .indicator .value {
                display: block;
                font-weight: 600;
                color: var(--primary-dark);
                font-size: 1rem;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update status indicator
    function updateStatus(status) {
        const statusElement = document.getElementById('liftStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }
    
    // Initialize performance indicators
    addPerformanceIndicators();
    
    // Update status during animation
    const originalStartAnimation = startPaletAnimation;
    startPaletAnimation = function() {
        updateStatus('Çalışıyor');
        originalStartAnimation();
    };
    
    const originalStopAnimation = stopPaletAnimation;
    stopPaletAnimation = function() {
        updateStatus('Hazır');
        originalStopAnimation();
    };
    
    // Add safety features
    function addSafetyFeatures() {
        // Emergency stop button
        const emergencyBtn = document.createElement('button');
        emergencyBtn.className = 'emergency-btn';
        emergencyBtn.innerHTML = '⏹️ DURDUR';
        emergencyBtn.style.cssText = `
            background: var(--danger);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 1rem;
        `;
        
        emergencyBtn.addEventListener('click', function() {
            updateStatus('DURDURULDU');
            resetPaletAnimation();
        });
        
        const animationControls = document.querySelector('.animation-controls');
        if (animationControls) {
            animationControls.appendChild(emergencyBtn);
        }
    }
    
    // Initialize safety features
    addSafetyFeatures();
}); 