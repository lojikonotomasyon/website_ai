// ===== PLC PROGRAMLAMA ANİMASYONU JAVASCRIPT =====

class PlcProgrammingAnimation {
    constructor() {
        this.currentFile = 'main.lad';
        this.isCompiling = false;
        this.isRunning = false;
        this.init();
    }

    init() {
        this.setupFileTabs();
        this.setupControls();
        this.startCodeAnimation();
        this.updateTime();
    }

    setupFileTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchFile(tab.dataset.file);
            });
        });
    }

    switchFile(filename) {
        this.currentFile = filename;
        
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.file === filename) {
                tab.classList.add('active');
            }
        });

        // Update code content based on file
        this.updateCodeContent(filename);
    }

    updateCodeContent(filename) {
        const codeContent = document.querySelector('.code-content');
        let newContent = '';

        switch(filename) {
            case 'main.lad':
                newContent = `
                    <div class="code-line"><span class="keyword">NETWORK</span> <span class="number">1</span></div>
                    <div class="code-line"><span class="indent">|</span><span class="input">I0.0</span><span class="operator">--| |--</span><span class="output">Q0.0</span></div>
                    <div class="code-line"><span class="keyword">NETWORK</span> <span class="number">2</span></div>
                    <div class="code-line"><span class="indent">|</span><span class="input">I0.1</span><span class="operator">--| |--</span><span class="function">TON</span><span class="parameter">(T1, 1000ms)</span></div>
                    <div class="code-line"><span class="indent">|</span><span class="timer">T1</span><span class="operator">--| |--</span><span class="output">Q0.1</span></div>
                    <div class="code-line"><span class="keyword">NETWORK</span> <span class="number">3</span></div>
                    <div class="code-line"><span class="indent">|</span><span class="input">I0.2</span><span class="operator">--| |--</span><span class="function">CTU</span><span class="parameter">(C1, 100)</span></div>
                    <div class="code-line"><span class="indent">|</span><span class="counter">C1</span><span class="operator">--| |--</span><span class="output">Q0.2</span></div>
                `;
                break;
            case 'functions.fbd':
                newContent = `
                    <div class="code-line"><span class="keyword">FUNCTION_BLOCK</span> <span class="function">FB1</span></div>
                    <div class="code-line"><span class="keyword">VAR_INPUT</span></div>
                    <div class="code-line"><span class="indent"></span><span class="input">Start</span> : <span class="keyword">BOOL</span>;</div>
                    <div class="code-line"><span class="indent"></span><span class="input">Reset</span> : <span class="keyword">BOOL</span>;</div>
                    <div class="code-line"><span class="keyword">VAR_OUTPUT</span></div>
                    <div class="code-line"><span class="indent"></span><span class="output">Running</span> : <span class="keyword">BOOL</span>;</div>
                    <div class="code-line"><span class="keyword">VAR</span></div>
                    <div class="code-line"><span class="indent"></span><span class="timer">Timer1</span> : <span class="function">TON</span>;</div>
                    <div class="code-line"><span class="keyword">END_VAR</span></div>
                `;
                break;
            case 'variables.scl':
                newContent = `
                    <div class="code-line"><span class="keyword">VAR_GLOBAL</span></div>
                    <div class="code-line"><span class="indent"></span><span class="input">g_bStart</span> : <span class="keyword">BOOL</span> := <span class="keyword">FALSE</span>;</div>
                    <div class="code-line"><span class="indent"></span><span class="input">g_bStop</span> : <span class="keyword">BOOL</span> := <span class="keyword">TRUE</span>;</div>
                    <div class="code-line"><span class="indent"></span><span class="output">g_bRunning</span> : <span class="keyword">BOOL</span> := <span class="keyword">FALSE</span>;</div>
                    <div class="code-line"><span class="indent"></span><span class="output">g_iCounter</span> : <span class="keyword">INT</span> := <span class="number">0</span>;</div>
                    <div class="code-line"><span class="indent"></span><span class="output">g_rSpeed</span> : <span class="keyword">REAL</span> := <span class="number">100.0</span>;</div>
                    <div class="code-line"><span class="keyword">END_VAR</span></div>
                `;
                break;
        }

        codeContent.innerHTML = newContent;
    }

    setupControls() {
        const compileBtn = document.querySelector('.compile-btn');
        const debugBtn = document.querySelector('.debug-btn');
        const downloadBtn = document.querySelector('.download-btn');

        if (compileBtn) {
            compileBtn.addEventListener('click', () => this.compileCode());
        }

        if (debugBtn) {
            debugBtn.addEventListener('click', () => this.debugCode());
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadCode());
        }
    }

    compileCode() {
        if (this.isCompiling) return;

        this.isCompiling = true;
        const compileBtn = document.querySelector('.compile-btn');
        const originalIcon = compileBtn.innerHTML;
        
        compileBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        compileBtn.style.background = '#ff6b6b';

        // Simulate compilation
        setTimeout(() => {
            this.isCompiling = false;
            compileBtn.innerHTML = originalIcon;
            compileBtn.style.background = '#3e3e42';
            
            // Show success message
            this.showCompilationResult(true);
        }, 2000);
    }

    debugCode() {
        const debugBtn = document.querySelector('.debug-btn');
        const originalIcon = debugBtn.innerHTML;
        
        debugBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        debugBtn.style.background = '#4ec9b0';

        // Simulate debugging
        setTimeout(() => {
            debugBtn.innerHTML = originalIcon;
            debugBtn.style.background = '#3e3e42';
            
            // Show debug info
            this.showDebugInfo();
        }, 1500);
    }

    downloadCode() {
        const downloadBtn = document.querySelector('.download-btn');
        const originalIcon = downloadBtn.innerHTML;
        
        downloadBtn.innerHTML = '<i class="fas fa-check"></i>';
        downloadBtn.style.background = '#4ec9b0';

        // Simulate download
        setTimeout(() => {
            downloadBtn.innerHTML = originalIcon;
            downloadBtn.style.background = '#3e3e42';
            
            // Show download success
            this.showDownloadSuccess();
        }, 1000);
    }

    showCompilationResult(success) {
        const statusArea = document.querySelector('.plc-status');
        const resultDiv = document.createElement('div');
        resultDiv.className = 'status-item';
        resultDiv.innerHTML = `
            <span class="status-label">COMPILE:</span>
            <span class="status-value" style="color: ${success ? '#4ec9b0' : '#ff6b6b'}">
                ${success ? 'SUCCESS' : 'ERROR'}
            </span>
        `;
        
        statusArea.appendChild(resultDiv);
        
        setTimeout(() => {
            resultDiv.remove();
        }, 3000);
    }

    showDebugInfo() {
        const statusArea = document.querySelector('.plc-status');
        const debugDiv = document.createElement('div');
        debugDiv.className = 'status-item';
        debugDiv.innerHTML = `
            <span class="status-label">DEBUG:</span>
            <span class="status-value" style="color: #4fc1ff">ACTIVE</span>
        `;
        
        statusArea.appendChild(debugDiv);
        
        setTimeout(() => {
            debugDiv.remove();
        }, 3000);
    }

    showDownloadSuccess() {
        const statusArea = document.querySelector('.plc-status');
        const downloadDiv = document.createElement('div');
        downloadDiv.className = 'status-item';
        downloadDiv.innerHTML = `
            <span class="status-label">DOWNLOAD:</span>
            <span class="status-value" style="color: #4ec9b0">COMPLETE</span>
        `;
        
        statusArea.appendChild(downloadDiv);
        
        setTimeout(() => {
            downloadDiv.remove();
        }, 3000);
    }

    startCodeAnimation() {
        // Simulate code typing effect
        const codeLines = document.querySelectorAll('.code-line');
        codeLines.forEach((line, index) => {
            line.style.opacity = '0';
            setTimeout(() => {
                line.style.transition = 'opacity 0.5s ease';
                line.style.opacity = '1';
            }, index * 200);
        });
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('tr-TR');
        
        // Update time in status if needed
        const timeElement = document.querySelector('.status-value');
        if (timeElement && timeElement.textContent.includes(':')) {
            timeElement.textContent = timeString;
        }
        
        setTimeout(() => this.updateTime(), 1000);
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const plcAnimation = document.querySelector('.plc-hero-animation');
    if (plcAnimation) {
        const plc = new PlcProgrammingAnimation();
    }
}); 