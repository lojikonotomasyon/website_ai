// Miniload Animation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startMiniloadAnimation');
    const resetBtn = document.getElementById('resetMiniloadAnimation');
    const storeBtn = document.getElementById('storeItem');
    const retrieveBtn = document.getElementById('retrieveItem');
    
    const shuttleCar = document.getElementById('shuttleCar');
    const liftPlatform = document.getElementById('liftPlatform');
    const rackSlots = document.querySelectorAll('.rack-slot');
    const shuttleStatus = document.querySelector('.shuttle-status');
    const miniloadSpeed = document.getElementById('miniloadSpeed');
    const miniloadCapacity = document.getElementById('miniloadCapacity');
    const miniloadStatus = document.getElementById('miniloadStatus');
    
    let animationRunning = false;
    let currentLevel = 1;
    let occupiedSlots = 0;
    let totalSlots = rackSlots.length;
    
    // Initialize system
    function initializeSystem() {
        updateCapacity();
        updateStatus('Hazır');
        updateSpeed('0');
        resetShuttlePosition();
        resetLiftPosition();
        clearAllSlots();
    }
    
    // Start animation
    function startAnimation() {
        if (animationRunning) return;
        
        animationRunning = true;
        startBtn.disabled = true;
        startBtn.innerHTML = '<i class="fas fa-pause"></i> Durdur';
        updateStatus('Çalışıyor');
        updateSpeed('2.5');
        
        // Start continuous operation
        performOperation();
    }
    
    // Stop animation
    function stopAnimation() {
        animationRunning = false;
        startBtn.disabled = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Başlat';
        updateStatus('Durduruldu');
        updateSpeed('0');
    }
    
    // Reset animation
    function resetAnimation() {
        stopAnimation();
        initializeSystem();
    }
    
    // Perform operation (store or retrieve)
    function performOperation() {
        if (!animationRunning) return;
        
        const operation = Math.random() > 0.5 ? 'store' : 'retrieve';
        
        if (operation === 'store' && occupiedSlots < totalSlots) {
            storeItem();
        } else if (operation === 'retrieve' && occupiedSlots > 0) {
            retrieveItem();
        } else {
            // Switch operation if current one is not possible
            if (operation === 'store') {
                retrieveItem();
            } else {
                storeItem();
            }
        }
    }
    
    // Store item
    function storeItem() {
        updateStatus('Depolama');
        
        // Find empty slot
        const emptySlot = findEmptySlot();
        if (!emptySlot) return;
        
        const slotLevel = parseInt(emptySlot.dataset.slot.split('-')[0]);
        const slotPosition = parseInt(emptySlot.dataset.slot.split('-')[1]);
        
        // Move shuttle to target level
        moveShuttleToLevel(slotLevel, () => {
            // Move lift to target level
            moveLiftToLevel(slotLevel, () => {
                // Place item in slot
                setTimeout(() => {
                    emptySlot.classList.add('occupied');
                    occupiedSlots++;
                    updateCapacity();
                    
                    // Return to base
                    setTimeout(() => {
                        moveShuttleToLevel(1, () => {
                            moveLiftToLevel(1, () => {
                                if (animationRunning) {
                                    setTimeout(performOperation, 1000);
                                }
                            });
                        });
                    }, 500);
                }, 500);
            });
        });
    }
    
    // Retrieve item
    function retrieveItem() {
        updateStatus('Çekme');
        
        // Find occupied slot
        const occupiedSlot = findOccupiedSlot();
        if (!occupiedSlot) return;
        
        const slotLevel = parseInt(occupiedSlot.dataset.slot.split('-')[0]);
        const slotPosition = parseInt(occupiedSlot.dataset.slot.split('-')[1]);
        
        // Move shuttle to target level
        moveShuttleToLevel(slotLevel, () => {
            // Move lift to target level
            moveLiftToLevel(slotLevel, () => {
                // Remove item from slot
                setTimeout(() => {
                    occupiedSlot.classList.remove('occupied');
                    occupiedSlots--;
                    updateCapacity();
                    
                    // Return to base
                    setTimeout(() => {
                        moveShuttleToLevel(1, () => {
                            moveLiftToLevel(1, () => {
                                if (animationRunning) {
                                    setTimeout(performOperation, 1000);
                                }
                            });
                        });
                    }, 500);
                }, 500);
            });
        });
    }
    
    // Move shuttle to specific level
    function moveShuttleToLevel(level, callback) {
        const targetY = 20 + (level - 1) * 60;
        const currentY = parseInt(shuttleCar.style.bottom) || 20;
        
        shuttleCar.style.transition = 'bottom 1s ease-in-out';
        shuttleCar.style.bottom = targetY + 'px';
        
        setTimeout(() => {
            if (callback) callback();
        }, 1000);
    }
    
    // Move lift to specific level
    function moveLiftToLevel(level, callback) {
        const targetY = 0 + (level - 1) * 60;
        
        liftPlatform.classList.add('moving-up');
        liftPlatform.style.transform = `translateY(-${targetY}px)`;
        
        setTimeout(() => {
            liftPlatform.classList.remove('moving-up');
            if (callback) callback();
        }, 1000);
    }
    
    // Find empty slot
    function findEmptySlot() {
        for (let slot of rackSlots) {
            if (!slot.classList.contains('occupied')) {
                return slot;
            }
        }
        return null;
    }
    
    // Find occupied slot
    function findOccupiedSlot() {
        for (let slot of rackSlots) {
            if (slot.classList.contains('occupied')) {
                return slot;
            }
        }
        return null;
    }
    
    // Reset shuttle position
    function resetShuttlePosition() {
        shuttleCar.style.bottom = '20px';
        shuttleCar.style.transition = 'none';
    }
    
    // Reset lift position
    function resetLiftPosition() {
        liftPlatform.style.transform = 'translateY(0)';
        liftPlatform.classList.remove('moving-up', 'moving-down');
    }
    
    // Clear all slots
    function clearAllSlots() {
        rackSlots.forEach(slot => {
            slot.classList.remove('occupied');
        });
        occupiedSlots = 0;
    }
    
    // Update capacity display
    function updateCapacity() {
        miniloadCapacity.textContent = `${occupiedSlots}/${totalSlots} slot`;
    }
    
    // Update status display
    function updateStatus(status) {
        miniloadStatus.textContent = status;
        shuttleStatus.textContent = status;
    }
    
    // Update speed display
    function updateSpeed(speed) {
        miniloadSpeed.textContent = `${speed} m/s`;
    }
    
    // Manual store item
    function manualStoreItem() {
        if (animationRunning) return;
        
        if (occupiedSlots >= totalSlots) {
            alert('Tüm slotlar dolu!');
            return;
        }
        
        storeItem();
    }
    
    // Manual retrieve item
    function manualRetrieveItem() {
        if (animationRunning) return;
        
        if (occupiedSlots <= 0) {
            alert('Depolanmış ürün yok!');
            return;
        }
        
        retrieveItem();
    }
    
    // Event listeners
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            if (animationRunning) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAnimation);
    }
    
    if (storeBtn) {
        storeBtn.addEventListener('click', manualStoreItem);
    }
    
    if (retrieveBtn) {
        retrieveBtn.addEventListener('click', manualRetrieveItem);
    }
    
    // Initialize system on load
    initializeSystem();
    
    // Add hover effects for rack slots
    rackSlots.forEach(slot => {
        slot.addEventListener('mouseenter', function() {
            if (!this.classList.contains('occupied')) {
                this.style.background = 'var(--accent-light)';
                this.style.borderColor = 'var(--accent)';
            }
        });
        
        slot.addEventListener('mouseleave', function() {
            if (!this.classList.contains('occupied')) {
                this.style.background = 'var(--secondary)';
                this.style.borderColor = 'var(--accent-light)';
            }
        });
        
        slot.addEventListener('click', function() {
            if (!animationRunning) {
                if (this.classList.contains('occupied')) {
                    this.classList.remove('occupied');
                    occupiedSlots--;
                } else {
                    this.classList.add('occupied');
                    occupiedSlots++;
                }
                updateCapacity();
            }
        });
    });
    
    // Add smooth animations
    function smoothAnimation(element, property, value, duration = 1000, callback) {
        element.style.transition = `${property} ${duration}ms ease-in-out`;
        element.style[property] = value;
        
        setTimeout(() => {
            if (callback) callback();
        }, duration);
    }
    
    // Add performance monitoring
    let performanceData = {
        operations: 0,
        startTime: Date.now()
    };
    
    function updatePerformance() {
        performanceData.operations++;
        const elapsed = (Date.now() - performanceData.startTime) / 1000;
        const opsPerMinute = (performanceData.operations / elapsed) * 60;
        
        // Update speed based on performance
        if (opsPerMinute > 0) {
            updateSpeed((opsPerMinute / 10).toFixed(1));
        }
    }
    
    // Cleanup function
    function cleanupAnimation() {
        stopAnimation();
        clearAllSlots();
        resetShuttlePosition();
        resetLiftPosition();
    }
    
    // Handle page visibility change
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && animationRunning) {
            stopAnimation();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Adjust positions if needed
        if (!animationRunning) {
            resetShuttlePosition();
            resetLiftPosition();
        }
    });
}); 