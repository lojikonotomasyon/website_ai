// ===== PLC PROGRAMLAMA ANİMASYONU =====

class PlcProgrammingAnimation {
    constructor() {
        this.isRunning = true;
        this.scan      = 8.4;
        this.cpu       = 18;
        this.errors    = 0;

        this.inputs  = [true,  true, false, true,  false, false, false, true];
        this.outputs = [true,  false, true,  false, false, false];
        this.rungs   = [true,  false, true,  false];

        document.getElementById('plc-start')?.addEventListener('click', () => this.start());
        document.getElementById('plc-stop')?.addEventListener('click',  () => this.stop());
        document.getElementById('plc-reset')?.addEventListener('click', () => this.reset());

        this._set('plc-mode', 'RUN');
        this._renderIO();
        this._renderRungs();
        this._startLoop();
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._set('plc-mode', 'RUN');
        document.getElementById('plc-mode')?.classList.replace('stop', 'run');
        this._startLoop();
    }

    stop() {
        this.isRunning = false;
        clearInterval(this._timer);
        this._set('plc-mode', 'STOP');
        const m = document.getElementById('plc-mode');
        if (m) { m.classList.remove('run', 'blue'); m.classList.add('stop'); }
        this.rungs.fill(false);
        this._renderRungs();
    }

    reset() {
        this.stop();
        this.scan   = 8.4;
        this.cpu    = 18;
        this.errors = 0;
        this.inputs  = [true, true, false, true, false, false, false, true];
        this.outputs = [true, false, true, false, false, false];
        this.rungs   = [true, false, true, false];
        this._renderIO();
        this._renderRungs();
        this._updateMetrics();
        this._set('plc-mode', 'RUN');
        const m = document.getElementById('plc-mode');
        if (m) { m.classList.remove('stop'); m.classList.add('run'); }
    }

    _startLoop() {
        this._timer = setInterval(() => {
            if (!this.isRunning) return;
            this.scan = Math.max(5, Math.min(20, this.scan + (Math.random() - 0.5) * 1.5));
            this.cpu  = Math.max(5, Math.min(60, this.cpu  + (Math.random() - 0.5) * 6));
            this._updateMetrics();
            this._fluctuateIO();
            this._fluctuateRungs();
        }, 2000);
    }

    _fluctuateIO() {
        const idx = Math.floor(Math.random() * this.inputs.length);
        this.inputs[idx] = !this.inputs[idx];
        this.outputs[Math.floor(Math.random() * this.outputs.length)] = Math.random() > 0.4;
        this._renderIO();
    }

    _fluctuateRungs() {
        const idx = Math.floor(Math.random() * this.rungs.length);
        if (idx === 3) {
            this.rungs[3] = !this.rungs[3];
        } else {
            this.rungs[idx] = Math.random() > 0.35;
        }
        this._renderRungs();
    }

    _renderIO() {
        this.inputs.forEach((on, i) => {
            const dot = document.getElementById(`plc-in-${i}`);
            const lbl = document.getElementById(`plc-inl-${i}`);
            if (dot) { dot.classList.toggle('on', on); dot.classList.remove('warn'); }
            if (lbl) { lbl.classList.toggle('on', on); }
        });
        this.outputs.forEach((on, i) => {
            const dot = document.getElementById(`plc-out-${i}`);
            const lbl = document.getElementById(`plc-outl-${i}`);
            if (dot) { dot.classList.toggle('on', on); dot.classList.remove('warn'); }
            if (lbl) { lbl.classList.toggle('on', on); }
        });
        if (document.getElementById('plc-in-5')?.classList.contains('on') === false) {
            document.getElementById('plc-in-5')?.classList.add('warn');
        }
        if (document.getElementById('plc-out-3')?.classList.contains('on') === false) {
            document.getElementById('plc-out-3')?.classList.add('warn');
        }
    }

    _renderRungs() {
        this.rungs.forEach((active, i) => {
            const rung = document.getElementById(`plc-rung-${i}`);
            if (!rung) return;
            if (i === 3 && !active) {
                rung.classList.remove('active');
                rung.classList.add('warn');
            } else {
                rung.classList.remove('warn');
                rung.classList.toggle('active', active);
            }
        });
    }

    _updateMetrics() {
        this._set('plc-scan',   this.scan.toFixed(1));
        this._set('plc-scan-m', this.scan.toFixed(1));
        this._set('plc-cpu',    Math.round(this.cpu) + '%');
        this._set('plc-err',    this.errors);
    }

    _set(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.plc-hero-animation')) new PlcProgrammingAnimation();
});
