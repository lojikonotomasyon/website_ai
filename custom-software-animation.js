// ===== ÖZEL YAZILIM ANİMASYONU =====

class CustomSoftwareAnimation {
    constructor() {
        this.isRunning = true;
        this.cpu       = 23;
        this.ram       = 148;
        this.loc       = 1200;
        this.curLine   = 2;
        this.buildCycle = 0;

        this.termLines = [
            { cls: 'cmd', text: '$ python main.py' },
            { cls: 'ok',  text: '▶ Lojikon System v4.0.0 başlatıldı' },
            { cls: '',    text: 'Modüller yükleniyor...' },
            { cls: 'ok',  text: '✔ Tüm modüller hazır' },
            { cls: 'cmd', text: '$ pytest tests.py' },
            { cls: 'ok',  text: '✔ 42 test geçti' },
            { cls: '',    text: 'Build tamamlandı.' },
            { cls: 'cmd', text: '$ python deploy.py' },
            { cls: 'ok',  text: '▶ Deployment başarılı' },
        ];
        this.termIdx = 1;

        document.getElementById('cs-start')?.addEventListener('click', () => this.start());
        document.getElementById('cs-stop')?.addEventListener('click',  () => this.stop());
        document.getElementById('cs-reset')?.addEventListener('click', () => this.reset());

        this._startLoop();
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._startLoop();
    }

    stop() {
        this.isRunning = false;
        clearInterval(this._timer);
        clearInterval(this._termTimer);
        const b = document.getElementById('cs-build');
        if (b) { b.textContent = 'STOPPED'; b.className = 'cs-build-val err'; }
    }

    reset() {
        this.stop();
        this.cpu    = 23;
        this.ram    = 148;
        this.loc    = 1200;
        this.curLine = 2;
        this.buildCycle = 0;
        this.termIdx = 1;
        this._updateMetrics();
        this._moveCursor(2);
        const b = document.getElementById('cs-build');
        if (b) { b.textContent = 'SUCCESS'; b.className = 'cs-build-val ok'; }
    }

    _startLoop() {
        this._timer = setInterval(() => {
            if (!this.isRunning) return;
            this.cpu = Math.max(5, Math.min(80, this.cpu + (Math.random() - 0.5) * 12));
            this.ram = Math.max(80, Math.min(400, this.ram + (Math.random() - 0.5) * 15));
            this.loc += Math.floor(Math.random() * 3);
            this._updateMetrics();
            this.curLine = (this.curLine % 12) + 1;
            this._moveCursor(this.curLine);
            this.buildCycle++;
            if (this.buildCycle % 5 === 0) this._triggerBuild();
        }, 1800);

        this._termTimer = setInterval(() => {
            if (!this.isRunning) return;
            this._addTermLine();
        }, 3500);
    }

    _updateMetrics() {
        const cpu = Math.round(this.cpu);
        const ramMB = Math.round(this.ram);
        const locK = (this.loc / 1000).toFixed(1) + 'k';
        this._set('cs-cpu', cpu + '%');
        this._set('cs-ram', ramMB + ' MB');
        this._set('cs-loc', locK);
        const cpuBar = document.getElementById('cs-cpu-bar');
        if (cpuBar) cpuBar.style.width = cpu + '%';
        const ramBar = document.getElementById('cs-ram-bar');
        if (ramBar) ramBar.style.width = Math.min(100, (ramMB / 512 * 100)).toFixed(0) + '%';
    }

    _moveCursor(lineIdx) {
        document.querySelectorAll('.cs-line').forEach((el, i) => {
            el.classList.toggle('cur-line', i === lineIdx - 1);
        });
        document.querySelectorAll('.cs-lno').forEach((el, i) => {
            el.classList.toggle('cur', i === lineIdx - 1);
        });
    }

    _triggerBuild() {
        const b = document.getElementById('cs-build');
        if (!b) return;
        b.textContent = 'BUILDING'; b.className = 'cs-build-val run';
        setTimeout(() => {
            if (!this.isRunning) return;
            const ok = Math.random() > 0.1;
            b.textContent = ok ? 'SUCCESS' : 'ERROR';
            b.className   = 'cs-build-val ' + (ok ? 'ok' : 'err');
            if (!ok) setTimeout(() => { b.textContent = 'SUCCESS'; b.className = 'cs-build-val ok'; }, 2000);
        }, 1200);
    }

    _addTermLine() {
        const container = document.getElementById('cs-term-out');
        if (!container) return;
        const t = this.termLines[this.termIdx % this.termLines.length];
        this.termIdx++;
        const children = container.children;
        if (children.length >= 3) container.removeChild(children[0]);
        const div = document.createElement('div');
        div.className = 'cs-term-line' + (t.cls ? ' ' + t.cls : '');
        div.textContent = t.text;
        container.appendChild(div);
    }

    _set(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.custom-software-hero-animation')) new CustomSoftwareAnimation();
});
