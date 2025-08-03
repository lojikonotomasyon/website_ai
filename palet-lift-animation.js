// Professional Pallet Lift Animation System
class ProfessionalElevator {
    constructor() {
        this.currentFloor = 1;
        this.targetFloor = 1;
        this.isMoving = false;
        this.isDoorOpen = false;
        this.totalFloors = 4;
        this.floorHeight = 150; // pixels per floor
        this.moveSpeed = 2000; // ms per floor
        this.doorSpeed = 500; // ms for door operation
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.setElevatorPosition();
        this.setCounterweightPosition();
    }

    bindEvents() {
        // Floor buttons
        const floorButtons = document.querySelectorAll('.floor-btn');
        floorButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const floor = parseInt(e.target.dataset.floor);
                this.callElevator(floor);
            });
        });

        // Emergency stop
        const emergencyStop = document.getElementById('emergencyStop');
        if (emergencyStop) {
            emergencyStop.addEventListener('click', () => this.emergencyStop());
        }

        // Pallet loading
        const pallets = document.querySelectorAll('.pallet');
        pallets.forEach(pallet => {
            pallet.addEventListener('click', (e) => {
                this.loadPallet(pallet);
            });
        });
    }

    callElevator(targetFloor) {
        if (this.isMoving || targetFloor === this.currentFloor) return;

        this.targetFloor = targetFloor;
        this.updateFloorButtons();
        this.moveElevator();
    }

    moveElevator() {
        if (this.isMoving) return;

        this.isMoving = true;
        this.updateStatus('HAREKET HALİNDE');
        this.closeDoors();

        const direction = this.targetFloor > this.currentFloor ? 'up' : 'down';
        const floorsToMove = Math.abs(this.targetFloor - this.currentFloor);
        const totalMoveTime = floorsToMove * this.moveSpeed;

        // Calculate new positions
        const newElevatorPosition = (this.totalFloors - this.targetFloor) * this.floorHeight;
        const newCounterweightPosition = (this.targetFloor - 1) * this.floorHeight;

        // Animate elevator car
        const elevatorCar = document.getElementById('elevatorCar');
        if (elevatorCar) {
            elevatorCar.style.transition = `bottom ${totalMoveTime}ms ease-in-out`;
            elevatorCar.style.bottom = `${newElevatorPosition}px`;
        }

        // Animate counterweight
        const counterweight = document.getElementById('counterweight');
        if (counterweight) {
            counterweight.style.transition = `top ${totalMoveTime}ms ease-in-out`;
            counterweight.style.top = `${newCounterweightPosition}px`;
        }

        // Update floor display during movement
        this.animateFloorDisplay(totalMoveTime);

        // Complete movement
        setTimeout(() => {
            this.currentFloor = this.targetFloor;
            this.isMoving = false;
            this.updateStatus('HAZIR');
            this.openDoors();
            this.updateDisplay();
        }, totalMoveTime);
    }

    animateFloorDisplay(duration) {
        const floorDisplay = document.getElementById('currentFloor');
        if (!floorDisplay) return;

        const startFloor = this.currentFloor;
        const endFloor = this.targetFloor;
        const steps = 10;
        const stepTime = duration / steps;

        let step = 0;
        const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            const currentDisplayFloor = Math.round(startFloor + (endFloor - startFloor) * progress);
            floorDisplay.textContent = currentDisplayFloor;

            if (step >= steps) {
                clearInterval(interval);
            }
        }, stepTime);
    }

    openDoors() {
        if (this.isDoorOpen) return;

        this.isDoorOpen = true;
        const leftDoor = document.querySelector('.car-door.left-door');
        const rightDoor = document.querySelector('.car-door.right-door');

        if (leftDoor) leftDoor.classList.add('open');
        if (rightDoor) rightDoor.classList.add('open');

        // Close doors after a delay
        setTimeout(() => {
            this.closeDoors();
        }, 3000);
    }

    closeDoors() {
        if (!this.isDoorOpen) return;

        this.isDoorOpen = false;
        const leftDoor = document.querySelector('.car-door.left-door');
        const rightDoor = document.querySelector('.car-door.right-door');

        if (leftDoor) leftDoor.classList.remove('open');
        if (rightDoor) rightDoor.classList.remove('open');
    }

    loadPallet(pallet) {
        if (this.isMoving || !this.isDoorOpen) return;

        // Animate pallet loading
        pallet.style.transition = 'all 1s ease-in-out';
        pallet.style.transform = 'scale(0.8) translateY(-20px)';
        pallet.style.opacity = '0.7';

        // Simulate loading process
        setTimeout(() => {
            pallet.style.transform = 'scale(1) translateY(0)';
            pallet.style.opacity = '1';
            this.updateStatus('YÜKLEME TAMAMLANDI');
        }, 1000);
    }

    emergencyStop() {
        this.isMoving = false;
        this.updateStatus('ACİL DURDURMA');
        
        // Reset elevator position
        this.setElevatorPosition();
        this.setCounterweightPosition();
        
        // Close doors
        this.closeDoors();
        
        // Update display
        this.updateDisplay();
        
        // Reset status after delay
        setTimeout(() => {
            this.updateStatus('HAZIR');
        }, 3000);
    }

    updateFloorButtons() {
        const floorButtons = document.querySelectorAll('.floor-btn');
        floorButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.floor) === this.targetFloor) {
                btn.classList.add('active');
            }
        });
    }

    updateStatus(status) {
        const statusElement = document.getElementById('elevatorStatus');
        if (statusElement) {
            statusElement.textContent = status;
            
            // Color coding for status
            switch (status) {
                case 'HAZIR':
                    statusElement.style.color = '#2ecc71';
                    break;
                case 'HAREKET HALİNDE':
                    statusElement.style.color = '#f39c12';
                    break;
                case 'ACİL DURDURMA':
                    statusElement.style.color = '#e74c3c';
                    break;
                case 'YÜKLEME TAMAMLANDI':
                    statusElement.style.color = '#3498db';
                    break;
                default:
                    statusElement.style.color = '#2ecc71';
            }
        }
    }

    updateDisplay() {
        const floorElement = document.getElementById('currentFloor');
        if (floorElement) {
            floorElement.textContent = this.currentFloor;
        }
    }

    setElevatorPosition() {
        const elevatorCar = document.getElementById('elevatorCar');
        if (elevatorCar) {
            const position = (this.totalFloors - this.currentFloor) * this.floorHeight;
            elevatorCar.style.bottom = `${position}px`;
        }
    }

    setCounterweightPosition() {
        const counterweight = document.getElementById('counterweight');
        if (counterweight) {
            const position = (this.currentFloor - 1) * this.floorHeight;
            counterweight.style.top = `${position}px`;
        }
    }

    // Auto-demo mode
    startDemo() {
        this.demoInterval = setInterval(() => {
            if (!this.isMoving) {
                const randomFloor = Math.floor(Math.random() * this.totalFloors) + 1;
                if (randomFloor !== this.currentFloor) {
                    this.callElevator(randomFloor);
                }
            }
        }, 5000);
    }

    stopDemo() {
        if (this.demoInterval) {
            clearInterval(this.demoInterval);
        }
    }
}

// Initialize the elevator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const elevator = new ProfessionalElevator();
    
    // Start demo mode after 3 seconds
    setTimeout(() => {
        elevator.startDemo();
    }, 3000);
}); 