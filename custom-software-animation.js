// ===== ÖZEL YAZILIM ANİMASYONU JAVASCRIPT =====

class CustomSoftwareAnimation {
    constructor() {
        this.isRunning = false;
        this.codeProgress = 85;
        this.testProgress = 92;
        this.performanceProgress = 78;
        
        this.terminalLines = [
            '$ python main.py',
            'Lojikon System v4.0.0',
            'Status: Active',
            'Production: Started',
            '$'
        ];
        
        this.init();
    }
    
    init() {
        this.setupControls();
        this.animateProgressBars();
        this.setupFileTabs();
        this.animateTerminal();
        
        // Update progress bars every 5 seconds
        setInterval(() => {
            this.updateProgressBars();
        }, 5000);
    }
    
    setupControls() {
        const runBtn = document.getElementById('run-code');
        const debugBtn = document.getElementById('debug-code');
        const deployBtn = document.getElementById('deploy-code');
        
        if (runBtn) {
            runBtn.addEventListener('click', () => {
                this.runCode();
            });
        }
        
        if (debugBtn) {
            debugBtn.addEventListener('click', () => {
                this.debugCode();
            });
        }
        
        if (deployBtn) {
            deployBtn.addEventListener('click', () => {
                this.deployCode();
            });
        }
    }
    
    setupFileTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Simulate file switching
                this.switchFile(tab.textContent);
            });
        });
    }
    
    switchFile(filename) {
        const codeContent = document.querySelector('.code-content');
        if (codeContent) {
            // Simulate different file content
            const fileContents = {
                'main.py': [
                    '<span class="keyword">class</span> <span class="class-name">LojikonSystem</span>:',
                    '    <span class="keyword">def</span> <span class="function-name">__init__</span>(<span class="parameter">self</span>):',
                    '        <span class="variable">self</span>.<span class="property">version</span> = <span class="string">"4.0.0"</span>',
                    '        <span class="variable">self</span>.<span class="property">status</span> = <span class="string">"active"</span>',
                    '',
                    '    <span class="keyword">def</span> <span class="function-name">start_production</span>(<span class="parameter">self</span>):',
                    '        <span class="comment"># Akıllı üretim başlat</span>',
                    '        <span class="keyword">return</span> <span class="string">"Üretim başlatıldı"</span>',
                    '',
                    '<span class="variable">system</span> = <span class="class-name">LojikonSystem</span>()'
                ],
                'config.js': [
                    '<span class="keyword">const</span> <span class="variable">config</span> = {',
                    '    <span class="property">version</span>: <span class="string">"4.0.0"</span>,',
                    '    <span class="property">environment</span>: <span class="string">"production"</span>,',
                    '    <span class="property">debug</span>: <span class="keyword">false</span>,',
                    '    <span class="property">api</span>: {',
                    '        <span class="property">baseUrl</span>: <span class="string">"https://api.lojikon.com"</span>',
                    '    }',
                    '};',
                    '',
                    '<span class="keyword">module</span>.<span class="property">exports</span> = <span class="variable">config</span>;'
                ],
                'database.sql': [
                    '<span class="keyword">CREATE TABLE</span> <span class="class-name">users</span> (',
                    '    <span class="property">id</span> <span class="keyword">INT</span> <span class="keyword">PRIMARY KEY</span> <span class="keyword">AUTO_INCREMENT</span>,',
                    '    <span class="property">name</span> <span class="keyword">VARCHAR</span>(255) <span class="keyword">NOT NULL</span>,',
                    '    <span class="property">email</span> <span class="keyword">VARCHAR</span>(255) <span class="keyword">UNIQUE</span>,',
                    '    <span class="property">created_at</span> <span class="keyword">TIMESTAMP</span> <span class="keyword">DEFAULT</span> <span class="keyword">CURRENT_TIMESTAMP</span>',
                    ');',
                    '',
                    '<span class="keyword">CREATE INDEX</span> <span class="class-name">idx_email</span> <span class="keyword">ON</span> <span class="class-name">users</span>(<span class="property">email</span>);'
                ]
            };
            
            const content = fileContents[filename] || fileContents['main.py'];
            codeContent.innerHTML = content.map(line => `<div class="code-line">${line}</div>`).join('');
        }
    }
    
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            const delays = [0, 0.5, 1];
            bar.style.animationDelay = `${delays[index]}s`;
        });
    }
    
    updateProgressBars() {
        // Random progress updates
        this.codeProgress += Math.floor((Math.random() - 0.5) * 5);
        this.codeProgress = Math.max(80, Math.min(95, this.codeProgress));
        
        this.testProgress += Math.floor((Math.random() - 0.5) * 3);
        this.testProgress = Math.max(85, Math.min(98, this.testProgress));
        
        this.performanceProgress += Math.floor((Math.random() - 0.5) * 4);
        this.performanceProgress = Math.max(70, Math.min(85, this.performanceProgress));
        
        // Update DOM
        this.updateProgressElement('code-progress', this.codeProgress);
        this.updateProgressElement('test-progress', this.testProgress);
        this.updateProgressElement('performance-progress', this.performanceProgress);
    }
    
    updateProgressElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.style.width = `${value}%`;
        }
        
        const valueElement = element?.parentElement?.querySelector('.progress-value');
        if (valueElement) {
            valueElement.textContent = `${value}%`;
        }
    }
    
    animateTerminal() {
        const terminalContent = document.getElementById('terminal-content');
        if (terminalContent) {
            terminalContent.innerHTML = '';
            
            this.terminalLines.forEach((line, index) => {
                setTimeout(() => {
                    const lineElement = document.createElement('div');
                    lineElement.className = 'terminal-line';
                    lineElement.textContent = line;
                    terminalContent.appendChild(lineElement);
                }, index * 500);
            });
        }
    }
    
    runCode() {
        const runBtn = document.getElementById('run-code');
        if (runBtn) {
            const originalText = runBtn.innerHTML;
            runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>ÇALIŞTIRILIYOR...</span>';
            runBtn.style.background = '#f59e0b';
            
            setTimeout(() => {
                runBtn.innerHTML = '<i class="fas fa-check"></i><span>BAŞARILI!</span>';
                runBtn.style.background = '#10b981';
                
                // Add new terminal line
                this.addTerminalLine('Program başarıyla çalıştırıldı!');
                
                setTimeout(() => {
                    runBtn.innerHTML = originalText;
                    runBtn.style.background = '#10b981';
                }, 2000);
            }, 2000);
        }
    }
    
    debugCode() {
        const debugBtn = document.getElementById('debug-code');
        if (debugBtn) {
            const originalText = debugBtn.innerHTML;
            debugBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>DEBUG...</span>';
            debugBtn.style.background = '#8b5cf6';
            
            setTimeout(() => {
                debugBtn.innerHTML = '<i class="fas fa-bug"></i><span>HATA BULUNDU</span>';
                debugBtn.style.background = '#ef4444';
                
                // Add debug info to terminal
                this.addTerminalLine('Debug: Line 7 - Syntax error fixed');
                
                setTimeout(() => {
                    debugBtn.innerHTML = originalText;
                    debugBtn.style.background = '#f59e0b';
                }, 3000);
            }, 1500);
        }
    }
    
    deployCode() {
        const deployBtn = document.getElementById('deploy-code');
        if (deployBtn) {
            const originalText = deployBtn.innerHTML;
            deployBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>DEPLOY...</span>';
            deployBtn.style.background = '#f59e0b';
            
            setTimeout(() => {
                deployBtn.innerHTML = '<i class="fas fa-rocket"></i><span>CANLIYA ALINDI</span>';
                deployBtn.style.background = '#10b981';
                
                // Add deployment info to terminal
                this.addTerminalLine('Deployment: Production environment updated');
                
                setTimeout(() => {
                    deployBtn.innerHTML = originalText;
                    deployBtn.style.background = '#8b5cf6';
                }, 3000);
            }, 3000);
        }
    }
    
    addTerminalLine(text) {
        const terminalContent = document.getElementById('terminal-content');
        if (terminalContent) {
            const lineElement = document.createElement('div');
            lineElement.className = 'terminal-line';
            lineElement.textContent = text;
            terminalContent.appendChild(lineElement);
            
            // Remove old lines if too many
            const lines = terminalContent.querySelectorAll('.terminal-line');
            if (lines.length > 8) {
                lines[0].remove();
            }
        }
    }
    
    // Simulate code compilation
    simulateCompilation() {
        const compilationSteps = [
            'Compiling...',
            'Linking...',
            'Optimizing...',
            'Build successful!'
        ];
        
        compilationSteps.forEach((step, index) => {
            setTimeout(() => {
                this.addTerminalLine(step);
            }, index * 1000);
        });
    }
    
    // Random code errors
    simulateCodeErrors() {
        const errors = [
            'Error: Syntax error at line 15',
            'Warning: Unused variable detected',
            'Info: Code optimization completed',
            'Success: All tests passed'
        ];
        
        const randomError = errors[Math.floor(Math.random() * errors.length)];
        this.addTerminalLine(randomError);
        
        // Schedule next error
        setTimeout(() => {
            this.simulateCodeErrors();
        }, Math.random() * 20000 + 10000); // 10-30 seconds
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const customSoftwareAnimation = document.querySelector('.custom-software-hero-animation');
    if (customSoftwareAnimation) {
        const customSoftware = new CustomSoftwareAnimation();
        
        // Start code error simulation after 15 seconds
        setTimeout(() => {
            customSoftware.simulateCodeErrors();
        }, 15000);
    }
}); 