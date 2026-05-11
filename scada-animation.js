// ===== SCADA ANİMASYONU =====

class ScadaAnimation {
    constructor() {
        this.isRunning = true;
        this.temp      = 24.5;
        this.humidity  = 45;
        this.energy    = 125;
        this.production = 1247;

        this.procStates = {
            sorter:   { state: 'run',  label: 'Çalışıyor' },
            lift:     { state: 'idle', label: 'Hazır' },
            conveyor: { state: 'run',  label: 'Çalışıyor' },
            robot:    { state: 'warn', label: 'Beklemede' }
        };

        this.alarmPool = [
            { type: 'info', msg: 'Sistem - Normal Çalışma' },
            { type: 'warn', msg: 'Sıcaklık - Yüksek Değer' },
            { type: 'info', msg: 'Enerji - Optimizasyon' },
            { type: 'warn', msg: 'Konveyor - Bakım Gerekli' },
            { type: 'err',  msg: 'Robot 2 - Bağlantı Kesildi' },
            { type: 'info', msg: 'Sorter - Yüksek Verimlilik' },
        ];

        this.activeAlarms = [
            { type: 'warn', msg: 'Robot 2 - Bakım', time: '2dk' },
            { type: 'info', msg: 'Sorter - Verimli',  time: '5dk' },
        ];

        this._bindControls();
        this._startClock();
        this._startDataLoop();
        this._startProcLoop();
        this._startAlarmLoop();
    }

    _bindControls() {
        document.getElementById('sc-start')?.addEventListener('click', () => {
            this.isRunning = true;
            this._resetProcs();
        });
        document.getElementById('sc-stop')?.addEventListener('click', () => {
            this.isRunning = false;
            ['sorter','lift','conveyor','robot'].forEach(p => {
                this.procStates[p] = { state: 'off', label: 'Durduruldu' };
            });
            this._renderProcs();
        });
        document.getElementById('sc-reset')?.addEventListener('click', () => {
            this.isRunning = true;
            this.temp = 24.5; this.humidity = 45; this.energy = 125; this.production = 1247;
            this._resetProcs();
            this._updateKPIs();
        });
    }

    _startClock() {
        const tick = () => {
            const el = document.getElementById('sc-clock');
            if (el) el.textContent = new Date().toLocaleTimeString('tr-TR', { hour12: false });
        };
        tick();
        setInterval(tick, 1000);
    }

    _startDataLoop() {
        setInterval(() => {
            if (!this.isRunning) return;
            this.temp       = Math.max(20, Math.min(30, this.temp   + (Math.random()-0.5)*0.4));
            this.humidity   = Math.max(35, Math.min(55, this.humidity + (Math.random()-0.5)*1.5));
            this.energy     = Math.max(100,Math.min(150,this.energy  + (Math.random()-0.5)*3));
            this.production += Math.floor(Math.random() * 3);
            this._updateKPIs();
        }, 1500);
    }

    _updateKPIs() {
        this._set('sc-temp',   `${this.temp.toFixed(1)}°C`);
        this._set('sc-hum',    `${Math.round(this.humidity)}%`);
        this._set('sc-energy', `${Math.round(this.energy)}`);
        this._set('sc-prod',   this.production.toLocaleString('tr-TR'));
        this._width('sc-fill-temp',   ((this.temp - 20) / 10 * 100).toFixed(0));
        this._width('sc-fill-hum',    this.humidity.toFixed(0));
        this._width('sc-fill-energy', ((this.energy - 100) / 50 * 100).toFixed(0));
        this._width('sc-fill-prod',   Math.min(100, this.production / 3000 * 100).toFixed(0));
    }

    _startProcLoop() {
        setInterval(() => {
            if (!this.isRunning) return;
            const keys = Object.keys(this.procStates);
            const k = keys[Math.floor(Math.random() * keys.length)];
            const opts = [
                { state: 'run',  label: 'Çalışıyor' },
                { state: 'idle', label: 'Hazır' },
                { state: 'warn', label: 'Beklemede' },
            ];
            this.procStates[k] = opts[Math.floor(Math.random() * opts.length)];
            this._renderProcs();
        }, 4000);
    }

    _renderProcs() {
        for (const [k, v] of Object.entries(this.procStates)) {
            const dot = document.getElementById(`sc-dot-${k}`);
            const st  = document.getElementById(`sc-st-${k}`);
            if (dot) dot.dataset.state = v.state;
            if (st)  st.textContent    = v.label;
        }
    }

    _resetProcs() {
        this.procStates = {
            sorter:   { state: 'run',  label: 'Çalışıyor' },
            lift:     { state: 'idle', label: 'Hazır' },
            conveyor: { state: 'run',  label: 'Çalışıyor' },
            robot:    { state: 'warn', label: 'Beklemede' }
        };
        this._renderProcs();
    }

    _startAlarmLoop() {
        setInterval(() => {
            if (!this.isRunning) return;
            const a    = this.alarmPool[Math.floor(Math.random() * this.alarmPool.length)];
            const mins = Math.floor(Math.random() * 5) + 1;
            this.activeAlarms.unshift({ type: a.type, msg: a.msg, time: `${mins}dk` });
            if (this.activeAlarms.length > 4) this.activeAlarms.pop();
            this._renderAlarms();
        }, 7000);
    }

    _renderAlarms() {
        const list = document.getElementById('sc-alarm-list');
        if (!list) return;
        list.innerHTML = this.activeAlarms.map(a => `
            <div class="sc-alarm ${a.type}">
                <span class="sc-alarm-dot"></span>
                <span class="sc-alarm-msg">${a.msg}</span>
                <span class="sc-alarm-t">${a.time}</span>
            </div>`).join('');
    }

    _set(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }
    _width(id, pct) { const el = document.getElementById(id); if (el) el.style.width = `${pct}%`; }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.scada-hero-animation')) new ScadaAnimation();
});
