// Sorter Animation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startAnimation');
    const resetBtn = document.getElementById('resetAnimation');
    const conveyorBelt = document.querySelector('.conveyor-belt');
    const packages = document.querySelectorAll('.package');
    const divertors = document.querySelectorAll('.divertor');
    const lanes = document.querySelectorAll('.lane .sorted-packages');
    
    let animationRunning = false;
    let packageIndex = 0;
    
    // Animation start function
    function startAnimation() {
        if (animationRunning) return;
        
        animationRunning = true;
        startBtn.disabled = true;
        startBtn.textContent = 'Animasyon Çalışıyor...';
        
        // Start conveyor belt
        conveyorBelt.classList.add('active');
        
        // Process packages one by one
        processNextPackage();
    }
    
    // Process next package
    function processNextPackage() {
        if (packageIndex >= packages.length) {
            // Animation complete
            setTimeout(() => {
                stopAnimation();
            }, 2000);
            return;
        }
        
        const package = packages[packageIndex];
        const destination = package.dataset.destination;
        
        // Start package movement
        package.classList.add('moving');
        
        // Activate corresponding divertor after delay
        setTimeout(() => {
            const divertor = document.querySelector(`[data-target="${destination}"]`);
            if (divertor) {
                divertor.classList.add('active');
            }
        }, 1500);
        
        // Add package to destination lane
        setTimeout(() => {
            const lane = document.querySelector(`.lane-${destination.toLowerCase()} .sorted-packages`);
            if (lane) {
                const sortedPackage = document.createElement('div');
                sortedPackage.className = 'sorted-package';
                sortedPackage.textContent = destination;
                lane.appendChild(sortedPackage);
                
                // Add entrance animation
                sortedPackage.style.animation = 'fadeInUp 0.5s ease';
            }
            
            // Deactivate divertor
            const divertor = document.querySelector(`[data-target="${destination}"]`);
            if (divertor) {
                divertor.classList.remove('active');
            }
            
            packageIndex++;
            
            // Process next package after delay
            setTimeout(() => {
                processNextPackage();
            }, 500);
            
        }, 3000);
    }
    
    // Stop animation
    function stopAnimation() {
        animationRunning = false;
        startBtn.disabled = false;
        startBtn.textContent = 'Animasyonu Başlat';
        conveyorBelt.classList.remove('active');
    }
    
    // Reset animation
    function resetAnimation() {
        // Stop current animation
        stopAnimation();
        
        // Reset variables
        packageIndex = 0;
        
        // Reset packages
        packages.forEach(package => {
            package.classList.remove('moving');
            package.style.left = '-50px';
        });
        
        // Reset divertors
        divertors.forEach(divertor => {
            divertor.classList.remove('active');
        });
        
        // Clear lanes
        lanes.forEach(lane => {
            lane.innerHTML = '';
        });
    }
    
    // Event listeners
    if (startBtn) {
        startBtn.addEventListener('click', startAnimation);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAnimation);
    }
    
    // Add fadeInUp animation for sorted packages
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Auto-start animation after page load
    setTimeout(() => {
        if (!animationRunning) {
            startAnimation();
        }
    }, 3000);
});

// Additional interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Package hover effects
    const packages = document.querySelectorAll('.package');
    packages.forEach(package => {
        package.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.zIndex = '10';
        });
        
        package.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        });
    });
    
    // Divertor click effects
    const divertors = document.querySelectorAll('.divertor');
    divertors.forEach(divertor => {
        divertor.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                this.classList.add('active');
                setTimeout(() => {
                    this.classList.remove('active');
                }, 1000);
            }
        });
    });
    
    // Lane hover effects
    const lanes = document.querySelectorAll('.lane');
    lanes.forEach(lane => {
        lane.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        lane.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
    });
    
    // Add package counter
    function updatePackageCount() {
        const lanes = document.querySelectorAll('.lane');
        lanes.forEach(lane => {
            const packages = lane.querySelectorAll('.sorted-package');
            const count = packages.length;
            const title = lane.querySelector('h4');
            if (title) {
                title.textContent = `${title.textContent.split(' ')[0]} (${count})`;
            }
        });
    }
    
    // Update count every second
    setInterval(updatePackageCount, 1000);
    
    // Add speed control
    const speedControl = document.createElement('div');
    speedControl.className = 'speed-control';
    speedControl.innerHTML = `
        <label for="animationSpeed">Animasyon Hızı:</label>
        <input type="range" id="animationSpeed" min="0.5" max="2" step="0.1" value="1">
        <span id="speedValue">1x</span>
    `;
    
    const animationControls = document.querySelector('.animation-controls');
    if (animationControls) {
        animationControls.appendChild(speedControl);
    }
    
    // Speed control functionality
    const speedSlider = document.getElementById('animationSpeed');
    const speedValue = document.getElementById('speedValue');
    
    if (speedSlider && speedValue) {
        speedSlider.addEventListener('input', function() {
            const speed = this.value;
            speedValue.textContent = speed + 'x';
            
            // Update animation speed
            const conveyorBelt = document.querySelector('.conveyor-belt');
            if (conveyorBelt) {
                conveyorBelt.style.animationDuration = (10 / speed) + 's';
            }
            
            const packages = document.querySelectorAll('.package');
            packages.forEach(package => {
                package.style.animationDuration = (3 / speed) + 's';
            });
        });
    }
    
    // Add speed control styles
    const speedStyles = document.createElement('style');
    speedStyles.textContent = `
        .speed-control {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
            padding: 1rem;
            background: var(--light-bg);
            border-radius: 8px;
        }
        
        .speed-control label {
            font-weight: 600;
            color: var(--primary-dark);
        }
        
        .speed-control input[type="range"] {
            flex: 1;
            max-width: 200px;
        }
        
        .speed-control span {
            font-weight: 600;
            color: var(--accent);
            min-width: 30px;
        }
    `;
    document.head.appendChild(speedStyles);
});

// Performance optimization
document.addEventListener('DOMContentLoaded', function() {
    // Use requestAnimationFrame for smooth animations
    function smoothAnimation(callback) {
        requestAnimationFrame(callback);
    }
    
    // Optimize package movement
    const packages = document.querySelectorAll('.package');
    packages.forEach(package => {
        package.style.willChange = 'transform, left';
    });
    
    // Clean up after animation
    function cleanupAnimation() {
        packages.forEach(package => {
            package.style.willChange = 'auto';
        });
    }
    
    // Call cleanup after animation stops
    const resetBtn = document.getElementById('resetAnimation');
    if (resetBtn) {
        resetBtn.addEventListener('click', cleanupAnimation);
    }
}); 