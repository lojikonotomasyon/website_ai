async function boot() {
    const [n, { OrbitControls: o }, { mergeGeometries: t }] = await Promise.all([
        import("three"),
        import("three/addons/controls/OrbitControls.js"),
        import("three/addons/utils/BufferGeometryUtils.js"),
    ]);
    const root = document.getElementById("shuttle3d"),
        stage = document.getElementById("s3d-stage"),
        coarsePointer = matchMedia("(pointer: coarse)").matches,
        reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches,
        stageSize = () => [stage.clientWidth || 1, stage.clientHeight || 1],
        msg = (key, vars = {}) =>
            Object.entries(vars).reduce(
                (text, [k, v]) => text.replace("{" + k + "}", v),
                I18N.t("shuttle.sim." + key),
            );
    let e;
    try {
        e = new n.WebGLRenderer({ antialias: !0, alpha: !0 });
    } catch (err) {
        throw (root.classList.add("is-fallback"), err);
    }
    e.setPixelRatio(Math.min(devicePixelRatio, coarsePointer ? 1.5 : 2)),
        e.setSize(...stageSize()),
        (e.shadowMap.enabled = !0),
        (e.shadowMap.type = n.PCFSoftShadowMap),
        stage.appendChild(e.domElement);
    const s = new n.Scene(),
        a = new n.PerspectiveCamera(40, stageSize()[0] / stageSize()[1], 60, 4e4),
        c = new o(a, e.domElement);
    (c.enableDamping = !0),
        (c.maxPolarAngle = 0.495 * Math.PI),
        (c.enableZoom = !1),
        (c.enablePan = !1),
        (c.enabled = !coarsePointer),
        coarsePointer && (e.domElement.style.touchAction = "auto"),
        s.add(new n.HemisphereLight(16777215, 9080729, 1.15));
    const r = new n.DirectionalLight(16777215, 1.6);
    r.position.set(-2e3, 6e3, -3500),
        r.target.position.set(600, 0, -900),
        s.add(r.target),
        (r.castShadow = !0),
        r.shadow.mapSize.set(coarsePointer ? 2048 : 4096, coarsePointer ? 2048 : 4096),
        Object.assign(r.shadow.camera, {
            left: -5200,
            right: 5200,
            top: 5200,
            bottom: -5200,
            near: 100,
            far: 14e3,
        }),
        (r.shadow.bias = -4e-4),
        s.add(r);
    const i = new n.DirectionalLight(14674175, 0.55);
    i.position.set(4e3, 2e3, 3e3), s.add(i);
    const f = (o, t = {}) => new n.MeshStandardMaterial({ color: o, roughness: 0.65, metalness: 0.1, ...t }),
        w = {
            o: f(5660781),
            frame: f(4870750),
            i: f(14923050, { roughness: 0.4, metalness: 0.25 }),
            inset: f(2040877, { roughness: 0.5 }),
            u: f(13934615, { metalness: 0.5, roughness: 0.35 }),
            l: f(1096065, { emissive: 1096065, emissiveIntensity: 1.2 }),
            red: f(13904426, { roughness: 0.4 }),
            h: f(4938311, { roughness: 0.85 }),
            m: f(5595246, { roughness: 0.85 }),
            M: f(7035466, { roughness: 0.85 }),
            k: f(12618325, { roughness: 0.9 }),
            v: f(6975090, { metalness: 0.4 }),
            p: f(10177691),
            Y: f(6184832),
            P: f(5205370),
            $: f(7110543),
            D: f(8150616),
            S: f(10133688, { metalness: 0.3 }),
            H: f(8225413),
            O: f(2763566),
            blue: f(2310352),
            A: f(12106946, { metalness: 0.6, roughness: 0.35 }),
            C: f(9146519, { metalness: 0.5, roughness: 0.4 }),
            W: f(4026288),
            X: f(14254635),
            j: f(9075298),
            green: f(3116891),
            K: f(2830651, { metalness: 0.3 }),
            L: f(4870750, { metalness: 0.3 }),
            G: f(2040877),
        },
        u = new n.LineBasicMaterial({ color: 1382171, transparent: !0, opacity: 0.5 });
    function l(o, t = !0, e = 25) {
        return (
            (o.castShadow = !0),
            (o.receiveShadow = !0),
            t && o.add(new n.LineSegments(new n.EdgesGeometry(o.geometry, e), u)),
            o
        );
    }
    function h(o, t, e, s, a, c, r, i, f = !0) {
        const w = l(new n.Mesh(new n.BoxGeometry(t, e, s), a), f);
        return w.position.set(c, r, i), o.add(w), w;
    }
    function y(o, t, e, s, a, c, r, i, f = 36) {
        const w = new n.CylinderGeometry(t, t, e, f);
        "x" === a && w.rotateZ(Math.PI / 2), "z" === a && w.rotateX(Math.PI / 2);
        const u = l(new n.Mesh(w, s));
        return u.position.set(c, r, i), o.add(u), u;
    }
    function d(n, o, t, e, s, a) {
        n.beginPath(), n.roundRect(o, t, e, s, a);
    }
    function m(o) {
        const t = new n.CanvasTexture(o);
        return (t.colorSpace = n.SRGBColorSpace), (t.anisotropy = 8), t;
    }
    const M = (() => {
            const n = document.createElement("canvas");
            n.width = n.height = 256;
            const o = n.getContext("2d");
            return (
                o.scale(4, 4),
                (o.fillStyle = "#14171d"),
                d(o, 1, 1, 62, 62, 14),
                o.fill(),
                (o.strokeStyle = "#d4a017"),
                (o.lineWidth = 1.5),
                o.stroke(),
                (o.fillStyle = "#fff"),
                o.fill(new Path2D("M18 14h8v28h20v8H18z")),
                (o.fillStyle = "#d4a017"),
                d(o, 36, 14, 10, 10, 2),
                o.fill(),
                m(n)
            );
        })(),
        g = (() => {
            const n = document.createElement("canvas");
            (n.width = 512), (n.height = 64);
            const o = n.getContext("2d");
            (o.fillStyle = "#14171d"), o.fillRect(0, 0, 512, 64), (o.fillStyle = "#d4a017");
            for (let n = -64; n < 576; n += 64)
                o.beginPath(),
                    o.moveTo(n, 64),
                    o.lineTo(n + 32, 64),
                    o.lineTo(n + 64, 0),
                    o.lineTo(n + 32, 0),
                    o.fill();
            return m(n);
        })();
    function k(o, t, e, s, a, c, r, i = 0, f = 0, w = 0) {
        const u = new n.Mesh(
            new n.PlaneGeometry(e, s),
            ((l = t),
            new n.MeshStandardMaterial({
                map: l,
                transparent: !0,
                roughness: 0.5,
                polygonOffset: !0,
                polygonOffsetFactor: -2,
            })),
        );
        var l;
        return u.position.set(a, c, r), u.rotation.set(f, i, w), o.add(u), u;
    }
    const v = 75,
        p = [0, 340, 680],
        b = 2200,
        x = 3800,
        z = 1440,
        Y = [235, -1855],
        P = new n.Mesh(
            new n.PlaneGeometry(2e4, 16e3),
            new n.MeshStandardMaterial({ color: 14541287, roughness: 1 }),
        );
    (P.rotation.x = -Math.PI / 2), P.position.set(600, -34, -1e3), (P.receiveShadow = !0), s.add(P);
    const $ = new n.GridHelper(2e4, 100, 11844550, 13159893);
    function D(n, o, t, e) {
        const a = o - n,
            c = (n + o) / 2;
        h(s, a, 30, 70, w.C, c, t - 15, e), h(s, a, 4, 20, w.A, c, t + 2, e, !1);
    }
    function S(n, o, t) {
        const e = Math.abs(o - n),
            a = (n + o) / 2;
        h(s, 70, 30, e, w.C, t, -15, a), h(s, 20, 4, e, w.A, t, 2, a, !1);
    }
    function T(n, o, t) {
        h(s, 60, 70, 90, w.u, n, o + 35, t), h(s, 62, 20, 92, w.O, n, o + 40, t, !1);
    }
    $.position.set(600, -33, -1e3), s.add($);
    for (const n of [-352, 352]) {
        D(-3e3, z, 0, n), D(2960, 4270, 0, n), T(-3030, 0, n), T(4300, 0, n);
        for (const o of [1, 2]) D(-3e3, z, p[o], n), T(-3030, p[o], n);
    }
    for (const n of [3175, 4425]) S(330, -2420, n), T(n, 0, -2450);
    const H = (() => {
            const o = [],
                e = [],
                s = (o, t, e, s, a, c, r) => {
                    const i = new n.BoxGeometry(t, e, s);
                    i.translate(a, c, r), o.push(i);
                };
            s(o, 384, 8, 584, 0, 4, 0);
            for (const n of [-1, 1]) {
                s(o, 8, 220, 600, 196 * n, 110, 0),
                    s(o, 400, 220, 8, 0, 110, 296 * n),
                    s(o, 10, 14, 612, 201 * n, 213, 0),
                    s(o, 412, 14, 10, 0, 213, 301 * n);
                for (const t of [60, 140]) s(o, 4, 10, 600, 202 * n, t, 0), s(o, 400, 10, 4, 0, t, 302 * n);
                for (const t of [-150, 0, 150]) s(o, 4, 180, 14, 202 * n, 96, t);
                s(e, 140, 28, 3, 0, 175, 301.5 * n);
            }
            const a = new n.CylinderGeometry(36, 36, 2, 24);
            a.translate(0, 9, 0), e.push(a);
            const c = t(o),
                r = t(
                    e
                        .map((n) => (n.toNonIndexed ? n.toNonIndexed() : n))
                        .map((n) => (n.deleteAttribute("uv"), n)),
                );
            return { g: c, e: new n.EdgesGeometry(c, 25), d: r };
        })(),
        O = [];
    function A(o = w.h) {
        const t = new n.Group(),
            e = new n.Mesh(H.g, o);
        (e.castShadow = e.receiveShadow = !0), t.add(e), t.add(new n.LineSegments(H.e, u));
        const s = new n.Mesh(H.d, w.O);
        return t.add(s), O.push(t), t;
    }
    const C = new n.Group();
    s.add(C);
    const W = [...new Set(Y.flatMap((n) => [n - 1045, n + 1045]))],
        X = [];
    for (const n of [1, -1]) {
        const o = 420 * n,
            t = 1040 * n,
            e = 730 * n;
        for (const s of W) {
            for (const n of [o, t]) h(C, 60, 1130, 60, w.W, s, 535, n);
            for (const n of [200, 900]) h(C, 30, 30, 560, w.W, s, n, e);
            for (const o of [1, 2]) h(C, 60, 30, 40, w.W, s, p[o] - 15, 395 * n);
        }
        for (const s of Y) {
            for (const a of [0, 1, 2]) {
                const c = p[a];
                for (const n of [o, t]) h(C, 2030, 12, 40, w.X, s, c + 58, n);
                for (const o of [-705, -235, 235, 705]) {
                    for (const n of [-1, 1]) h(C, 40, 10, 640, w.X, s + o + 170 * n, c + 65, e);
                    X.push({ x: s + o, R: n, level: a, h: null });
                }
            }
            for (const n of [o, t]) h(C, 2030, 40, 40, w.X, s, 1080, n);
        }
        for (const o of Y) {
            const e = Math.hypot(2090, 900),
                s = Math.atan2(900, 2090);
            h(C, e, 16, 8, w.W, o, 530, t + 34 * n).rotation.z = s;
        }
    }
    let j = 7;
    const K = [w.h, w.m, w.h, w.M];
    X.forEach((n, o) => {
        if ((j = (16807 * j) % 2147483647) / 2147483647 < 0.7) {
            const t = A(K[o % 4]);
            t.position.set(n.x, p[n.level] + 70, 700 * n.R), s.add(t), (n.h = t);
        }
    });
    const L = new n.Group();
    s.add(L);
    for (const n of [1500, 2900])
        for (const o of [-470, 470]) {
            h(s, 80, 1370, 80, w.K, n, 655, o);
            for (const t of p) h(s, 84, 14, 84, w.u, n, t + 8, o, !1);
        }
    for (const n of [-470, 470]) h(s, 1480, 80, 80, w.K, b, 1300, n);
    for (const n of [1500, 2900]) h(s, 80, 80, 1020, w.K, n, 1300, 0);
    h(s, 260, 160, 200, w.inset, 2900, 1420, 0),
        h(s, 262, 20, 202, w.u, 2900, 1360, 0, !1),
        y(s, 18, 1020, w.A, "z", 2900, 1370, 0),
        y(s, 18, 1400, w.A, "x", b, 1370, 470),
        y(s, 18, 1400, w.A, "x", b, 1370, -470),
        h(L, 1500, 30, 900, w.L, b, -37, 0);
    for (const n of [-352, 352]) h(L, 1490, 30, 70, w.C, b, -15, n), h(L, 1490, 4, 20, w.A, b, 2, n, !1);
    for (const n of [1458, 2942]) k(L, g, 880, 40, n, -19.5, 0, 0, -Math.PI / 2, Math.PI / 2);
    for (const n of [-430, 430]) {
        for (const o of [-600, 0, 600]) h(L, 30, 300, 30, w.u, b + o, 120, n);
        for (const o of [140, 270]) h(L, 1230, 24, 24, w.u, b, o, n);
    }
    for (const n of [1500, 2900]) for (const o of [-470, 470]) h(L, 110, 220, 40, w.O, n, 80, 0.9 * o);
    const E = [],
        G = [];
    for (const o of [1550, 2850])
        for (const t of [-470, 470]) {
            const e = new n.Mesh(new n.BoxGeometry(18, 1, 18), w.O);
            e.position.set(o, 0, t), s.add(e), E.push(e);
        }
    for (const o of [-470, 470]) {
        const t = h(s, 120, 240, 140, w.H, 2990, 1e3, o);
        G.push(t);
        const e = new n.Mesh(new n.BoxGeometry(14, 1, 14), w.O);
        e.position.set(2990, 0, o), s.add(e), (t.userData.chain = e);
    }
    const R = { y: 0 };
    function B(n) {
        (R.y = n), (L.position.y = n);
        for (const o of E) {
            const t = n + 190,
                e = 1260;
            (o.scale.y = e - t), (o.position.y = (t + e) / 2);
        }
        for (const o of G) {
            o.position.y = 1e3 - n;
            const t = o.userData.chain,
                e = o.position.y + 120,
                s = 1260;
            (t.scale.y = Math.max(1, s - e)), (t.position.y = (e + s) / 2);
        }
    }
    B(0);
    {
        const n = -2740,
            o = 720;
        for (const t of [-1, 1]) {
            h(s, 20, 70, o, w.G, x + 275 * t, 65, n), h(s, 22, 8, o, w.u, x + 275 * t, 103, n, !1);
            for (const o of [n - 330, n + 330]) h(s, 40, 100, 40, w.G, x + 275 * t, -10, o);
        }
        for (let n = -2410; n >= -3070; n -= 66) y(s, 24, 530, w.A, "x", x, 61, n, 20);
    }
    {
        const sign = new n.Group();
        sign.position.set(2200, 0, -820);
        sign.rotation.y = Math.PI;
        s.add(sign);

        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 320;
        const ctx = canvas.getContext("2d");
        const draw = () => {
            ctx.fillStyle = "#14171d";
            ctx.fillRect(0, 0, 1024, 320);
            ctx.strokeStyle = "#d4a017";
            ctx.lineWidth = 8;
            ctx.strokeRect(8, 8, 1008, 304);

            ctx.save();
            ctx.translate(48, 48);
            ctx.scale(3.5, 3.5);
            ctx.fillStyle = "#fff";
            ctx.fill(new Path2D("M18 14h8v28h20v8H18z"));
            ctx.fillStyle = "#d4a017";
            d(ctx, 36, 14, 10, 10, 2);
            ctx.fill();
            ctx.restore();

            ctx.font = "800 150px Inter, system-ui, sans-serif";
            ctx.textBaseline = "middle";
            let textX = 300;
            for (const [part, color] of [
                ["Loji", "#fff"],
                ["k", "#d4a017"],
                ["On", "#fff"],
            ]) {
                ctx.fillStyle = color;
                ctx.fillText(part, textX, 165);
                textX += ctx.measureText(part).width;
            }
        };
        draw();
        const texture = m(canvas);
        document.fonts.ready.then(() => {
            draw();
            texture.needsUpdate = true;
        });

        k(sign, texture, 1100, 344, 0, -30, 0, 0, -Math.PI / 2);
    }

    const F = new n.Group();
    s.add(F);
    const I = new n.Group();
    F.add(I), h(I, 1170, 12, 630, w.o, 0, 46, 0);
    for (const n of [-1, 1]) h(I, 624, 100, 12, w.frame, 0, 102, 321 * n);
    function U(o, t, e, s, a, c) {
        const r = new n.Group();
        r.position.set(e, s, a), "z" === t ? (r.rotation.x = Math.PI / 2) : (r.rotation.z = -Math.PI / 2);
        const i = new n.Group();
        r.add(i),
            y(i, v, 44, w.k, "y", 0, 0, 0, 48),
            y(i, 50, 46, w.v, "y", 0, 0, 0, 40),
            y(i, 18, 50, w.p, "y", 0, 0, 0, 24);
        for (let n = 0; n < 5; n++) {
            const o = (n / 5) * Math.PI * 2;
            for (const n of [-1, 1]) y(i, 4, 4, w.A, "y", 33 * Math.cos(o), 24 * n, 33 * Math.sin(o), 10);
        }
        o.add(r), c.push(i);
    }
    const V = [];
    for (const n of [-1, 1]) for (const o of [-1, 1]) U(I, "z", 385 * n, v, 352 * o, V);
    const q = new n.Group();
    I.add(q);
    const J = [];
    for (const n of [-1, 1]) {
        h(q, 6, 60, 560, w.frame, 597 * n, v, 0);
        for (const o of [-1, 1])
            U(q, "x", 622 * n, v, 245 * o, J),
                y(q, 9, 40, w.A, "y", 620 * n, 70, 110 * o, 16),
                y(I, 22, 80, w.H, "y", 620 * n, 110, 110 * o),
                y(I, 25, 6, w.u, "y", 620 * n, 153, 110 * o);
        h(I, 50, 70, 110, w.O, 640 * n, 110, 0), y(I, 24, 50, w.H, "x", 680 * n, 110, 0);
    }
    for (const n of [-1, 1])
        for (const o of [-1, 1])
            y(I, 45, 30, w.S, "y", 527 * n, 22, 300 * o), y(I, 14, 34, w.A, "y", 527 * n, 22, 300 * o, 16);
    for (const n of [-1, 1]) h(I, 40, 18, 640, w.D, 140 * n, 61, 0), h(I, 480, 6, 40, w.D, 0, 67, 335 * n);
    const N = [];
    for (const o of [-1, 1]) {
        const t = new n.Group();
        I.add(t), N.push(t);
        const e = 312,
            s = 592,
            a = 58,
            c = 168,
            r = 24,
            i = [
                [e, a],
                [s, a],
                [s, c - r],
                [s - r, c],
                [e, c],
            ].map(([t, e]) => new n.Vector2(o * t, e)),
            f = new n.ExtrudeGeometry(new n.Shape(i), {
                depth: 640,
                bevelEnabled: !0,
                bevelThickness: 2,
                bevelSize: 2,
                bevelSegments: 2,
                curveSegments: 4,
            });
        f.translate(0, 0, -320),
            t.add(l(new n.Mesh(f, w.i), !0, 50)),
            h(t, 220, 2, 600, w.inset, 440 * o, 170.5, 0, !1),
            k(t, M, 120, 120, 440 * o, 171.7, -140, 0, -Math.PI / 2, Math.PI);
        for (const n of [-323, 323]) h(t, 282, 26, 2, w.inset, 452 * o, 76, n, !1);
        k(t, g, 560, 30, 595 * o, 90, -20, (o * Math.PI) / 2),
            h(t, 3, 8, 360, w.l, 595 * o, 135, -40, !1),
            h(t, 4, 44, 44, w.inset, 596 * o, 112, 255, !1),
            y(t, 15, 14, w.red, "x", 604 * o, 112, 255, 24);
    }
    const Q = [],
        Z = [];
    for (const o of [-1, 1]) {
        h(I, 14, 90, 660, w.Y, 255 * o, 120, 0);
        const t = new n.Group();
        I.add(t), h(t, 12, 80, 650, w.P, 242 * o, 118, 0);
        const e = new n.Group();
        t.add(e), h(e, 10, 70, 640, w.$, 231 * o, 116, 0);
        for (const t of [-1, 1]) {
            h(e, 14, 22, 36, w.O, 229 * o, 100, 282 * t);
            const s = new n.Group();
            s.position.set(219 * o, 140, 312 * t),
                e.add(s),
                h(s, 12, 22, 60, w.u, 0, 0, 30 * -t),
                Z.push({ B: s, s: o, e: t });
        }
        Q.push({ mid: t, F: e });
    }
    const _ = { Y: 0, I: 0, x: x, z: -2e3, level: 0, mode: "Y", U: null },
        nn = { t: 0, speed: 1, V: !reducedMotion };
    F.position.set(_.x, 0, _.z), (I.position.y = 15), (q.position.y = -15);
    const on = [],
        tn = (n) => (n < 0.5 ? 2 * n * n : 1 - Math.pow(-2 * n + 2, 2) / 2),
        en = (n, o, t = tn) => new Promise((e) => on.push({ q: nn.t, J: n, N: o, r: e, e: t })),
        sn = (n) => en(n, () => {}),
        an = (n, o, t, e) => {
            const s = (function (n, o, t) {
                const e = o / t,
                    s = 0.5 * t * e * e;
                if (2 * s >= n) {
                    const o = Math.sqrt(n / t),
                        e = 2 * o;
                    return {
                        T: e,
                        f: (s) => {
                            const a = s * e;
                            return (a <= o ? 0.5 * t * a * a : n - 0.5 * t * (e - a) ** 2) / n;
                        },
                    };
                }
                const a = (n - 2 * s) / o,
                    c = 2 * e + a;
                return {
                    T: c,
                    f: (r) => {
                        const i = r * c;
                        return i < e
                            ? (0.5 * t * i * i) / n
                            : i < e + a
                              ? (s + o * (i - e)) / n
                              : (n - 0.5 * t * (c - i) ** 2) / n;
                    },
                };
            })(Math.abs(n), o, t);
            return en(s.T, e, s.f);
        },
        cn = document.getElementById("s3d-status"),
        rn = (n) => (cn.textContent = n),
        fn = { c: 0, s: 0, r: 0 },
        wn = document.getElementById("s3d-stV"),
        cycleEl = document.getElementById("s3d-stC"),
        storedEl = document.getElementById("s3d-stS"),
        retrievedEl = document.getElementById("s3d-stR"),
        un = () => {
            (cycleEl.textContent = fn.c), (storedEl.textContent = fn.s), (retrievedEl.textContent = fn.r);
        };
    rn(msg("init"));
    function ln(n) {
        _.Y = n;
        for (const o of Q) (o.mid.position.z = n / 2), (o.F.position.z = n / 2);
        _.U && _.I > 0.5 && (_.U.position.z = n);
    }
    function hn(n) {
        _.I = n;
        for (const o of Z) o.B.rotation.y = ((o.s * o.e * Math.PI) / 2) * n;
    }
    async function yn(n) {
        const o = _.Y;
        o !== n && (await an(n - o, 1.2, 0.004, (t) => ln(o + (n - o) * t)), ln(n));
    }
    async function dn() {
        await en(280, (n) => hn(n)),
            hn(1),
            (function () {
                const o = new n.Vector3();
                for (const n of O)
                    if (
                        (n.getWorldPosition(o),
                        I.worldToLocal(o),
                        Math.abs(o.x) < 5 && Math.abs(o.z - _.Y) < 5 && Math.abs(o.y - 70) < 5)
                    )
                        return I.attach(n), n.position.set(0, 70, _.Y), n.rotation.set(0, 0, 0), (_.U = n), n;
            })();
    }
    async function mn() {
        const n = _.U;
        return (
            await en(280, (n) => hn(1 - n)),
            hn(0),
            n && Math.abs(n.position.z) > 1 ? (s.attach(n), (_.U = null), n) : null
        );
    }
    async function Mn(n, o) {
        const t = "x" === n ? _.x : _.z,
            e = o - t;
        if (Math.abs(e) < 0.5) return;
        let s = t;
        await an(e, 5, 0.004, (o) => {
            const a = t + e * o,
                c = a - s;
            (s = a),
                "x" === n
                    ? ((_.x = a), (F.position.x = a), V.forEach((n) => (n.rotation.y -= c / v)))
                    : ((_.z = a), (F.position.z = a), J.forEach((n) => (n.rotation.y += c / v)));
        }),
            "x" === n ? ((_.x = o), (F.position.x = o)) : ((_.z = o), (F.position.z = o));
    }
    async function gn(n) {
        if (_.mode === n) return;
        const o = "Y" === n ? 0 : 1,
            t = 1 - o;
        await en(450, (n) => {
            const e = o + (t - o) * n;
            (I.position.y = 15 * e), (q.position.y = 15 - 30 * e);
        }),
            (_.mode = n);
    }
    let kn = Promise.resolve();
    function vn(n, o = !1) {
        const t = kn.then(() =>
            (async function (n, o) {
                const t = R.y,
                    e = p[n];
                Math.abs(t - e) < 0.5 ||
                    (await an(e - t, 3, 0.004, (n) => {
                        const s = t + (e - t) * n;
                        B(s), o && (F.position.y = s);
                    }),
                    B(e),
                    o && ((F.position.y = e), (_.level = n)));
            })(n, o),
        );
        return (kn = t), t;
    }
    async function pn() {
        if (Math.abs(_.x - b) < 1) return void (await vn(_.level));
        const n = vn(_.level);
        if (Math.abs(R.y - p[_.level]) < 1) return await n, void (await Mn("x", b));
        const o = _.x < b ? 750 : 3650;
        (_.x < b && _.x > o) || (_.x > b && _.x < o) ? await n : await Promise.all([n, Mn("x", o)]),
            await Mn("x", b);
    }
    async function bn(n) {
        (Math.abs(_.z) > 1 || "Y" === _.mode) &&
            (rn(msg("toCornerY")),
            await Promise.all([
                (async () => {
                    await Mn("z", 0), rn(msg("wheelsYX")), await gn("X");
                })(),
                vn(0),
            ])),
            (_.level !== n.level || _.x > z) &&
                (rn(msg("enterLift")),
                await pn(),
                _.level !== n.level && (rn(msg("liftUp", { n: n.level + 1 })), await vn(n.level, !0))),
            rn(msg("toCell", { n: n.level + 1 })),
            await Mn("x", n.x);
    }
    const xn = [...new Set(X.map((n) => n.x))].sort((n, o) => n - o),
        zn = (n) =>
            msg("cell", {
                level: n.level + 1,
                side: msg(n.R > 0 ? "right" : "left"),
                bay: xn.indexOf(n.x) + 1,
            }),
        Yn = (n) => n[Math.floor(Math.random() * n.length)];
    {
        const n = A(w.h);
        n.position.set(x, 85, -2700), s.add(n);
    }
    async function Pn() {
        await (async function () {
            rn(msg("pickStation")),
                await yn(-700),
                rn(msg("gripped")),
                await dn(),
                rn(msg("pullIn")),
                await yn(0),
                await mn();
        })();
        const n = Yn(X.filter((n) => !n.h && (n.level > 0 || Math.random() < 0.4)));
        await bn(n),
            vn(_.level),
            await (async function (n) {
                rn(msg("store", { cell: zn(n) })),
                    await dn(),
                    await yn(700 * n.R),
                    (n.h = await mn()),
                    await yn(0);
            })(n),
            fn.s++,
            un();
        const o = Yn(X.filter((o) => o.h && o !== n));
        await bn(o),
            vn(_.level),
            await (async function (n) {
                rn(msg("retrieve", { cell: zn(n) })),
                    await yn(700 * n.R),
                    await dn(),
                    (n.h = null),
                    await yn(0),
                    await mn();
            })(o),
            fn.r++,
            un(),
            await (async function () {
                (0 !== _.level || _.x < b) &&
                    (rn(msg("enterLift")),
                    await pn(),
                    0 !== _.level && (rn(msg("liftDown")), await vn(0, !0))),
                    rn(msg("toCornerX")),
                    await Mn("x", x),
                    rn(msg("wheelsXY")),
                    await gn("Y"),
                    rn(msg("toStation")),
                    await Mn("z", -2e3);
            })(),
            await (async function () {
                rn(msg("dropStation")), await dn(), await yn(-700), await mn(), await yn(0);
            })(),
            fn.c++,
            un(),
            rn(msg("done")),
            await sn(600);
    }
    (async () => {
        for (await sn(600); ; ) await Pn();
    })();
    const $n = document.getElementById("s3d-play");
    const syncPlay = () => {
        const label = $n.querySelector("span"),
            key = nn.V ? "pause" : "resume";
        (label.dataset.i18n = "shuttle.sim." + key),
            (label.textContent = msg(key)),
            ($n.querySelector("i").className = "fas " + (nn.V ? "fa-pause" : "fa-play"));
    };
    ($n.onclick = () => {
        (nn.V = !nn.V), syncPlay();
    }),
        syncPlay();
    let Dn = !1;
    const Sn = document.getElementById("s3d-follow"),
        Tn = document.getElementById("s3d-overview"),
        Hn = document.getElementById("s3d-close"),
        On = (n, o) => {
            (Dn = n),
                Sn.classList.toggle("on", "f" === o),
                Tn.classList.toggle("on", "o" === o),
                Hn.classList.toggle("on", "c" === o);
        },
        An = new n.Vector3(7800, 5600, -8000),
        Cn = new n.Vector3(1200, 200, -1300);
    const overviewPosition = () =>
        Cn.clone().add(
            An.clone()
                .sub(Cn)
                .multiplyScalar(Math.max(0.7, 1.05 / a.aspect)),
        );
    let Wn = null;
    function Xn(n, o, t = 1100) {
        Wn = { Z: a.position.clone(), q: c.target.clone(), p1: n, _: o, s: performance.now(), J: t };
    }
    const jn = () => F.getWorldPosition(new n.Vector3()).add(new n.Vector3(0, 150, 0));
    (Sn.onclick = () => {
        On(!0, "f");
        const o = jn();
        Xn(o.clone().add(new n.Vector3(1800, 1500, -2600)), o);
    }),
        (Hn.onclick = () => {
            On(!0, "c");
            const o = jn();
            Xn(o.clone().add(new n.Vector3(900, 550, -1200)), o);
        }),
        (Tn.onclick = () => {
            On(!1, "o"), Xn(overviewPosition(), Cn.clone());
        });
    const Kn = document.getElementById("s3d-rackT");
    let Ln = !1;
    (Kn.onclick = () => {
        (Ln = !Ln), Kn.classList.toggle("on", Ln);
        for (const n of [w.W, w.X])
            (n.transparent = Ln), (n.opacity = Ln ? 0.18 : 1), (n.depthWrite = !Ln), (n.needsUpdate = !0);
    }),
        c.target.copy(Cn),
        a.position.copy(overviewPosition()),
        new ResizeObserver(() => {
            const [vw, vh] = stageSize();
            (a.aspect = vw / vh), a.updateProjectionMatrix(), e.setSize(vw, vh);
        }).observe(stage);
    let En = performance.now(),
        Gn = null,
        Rn = 0,
        Bn = 0;
    const renderFrame = (o) => {
        const t = Math.max(0, Math.min(60, o - En));
        (En = o), nn.V && (nn.t += t);
        {
            const o = F.position;
            Gn && t > 0 && nn.V && (Rn += 0.15 * (o.distanceTo(Gn) / t - Rn)),
                (Gn = (Gn || new n.Vector3()).copy(o)),
                ++Bn % 6 == 0 && (wn.textContent = Rn.toFixed(1));
        }
        for (let n = on.length - 1; n >= 0; n--) {
            const o = on[n],
                t = Math.min(1, (nn.t - o.q) / o.J);
            o.N(o.e(t)), t >= 1 && (on.splice(n, 1), o.r());
        }
        if (Wn) {
            const n = tn(Math.min(1, (o - Wn.s) / Wn.J));
            a.position.lerpVectors(Wn.Z, Wn.p1, n),
                c.target.lerpVectors(Wn.q, Wn._, n),
                n >= 1 && (Wn = null);
        } else if (Dn) {
            const n = jn().sub(c.target).multiplyScalar(0.07);
            c.target.add(n), a.position.add(n);
        }
        c.update(), e.render(s, a);
    };
    let inView = !0;
    const syncLoop = () => e.setAnimationLoop(inView && !document.hidden ? renderFrame : null);
    new IntersectionObserver(
        ([entry]) => {
            (inView = entry.isIntersecting), syncLoop();
        },
        { rootMargin: "100px" },
    ).observe(stage),
        document.addEventListener("visibilitychange", syncLoop),
        syncLoop();
}
const startWhenIdle = () =>
    (window.requestIdleCallback || ((callback) => setTimeout(callback, 200)))(
        () => boot().catch(() => document.getElementById("shuttle3d").classList.add("is-fallback")),
        { timeout: 2000 },
    );
if (document.readyState === "complete") startWhenIdle();
else addEventListener("load", startWhenIdle, { once: true });
