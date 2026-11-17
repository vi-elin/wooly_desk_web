/* Farm sounds for the home page: quiet, and the visitor can turn them off (a button in the header).
   The sounds are the game's own (Sources/SheepFarm/AmbientAudio.swift): rain, wind, breeze, crickets and
   bird calls are made here with the Web Audio API; the sheep voice is a real recording
   ("Sheep Baa" by AntumDeluge, CC0, sounds/CREDITS.txt), played lower or higher for other sheep.

   Browsers play sound only after the first click or key press, so nothing plays before that.
   The page tells this file what is on screen:
     farmSound.ambience({ rain, crickets, wind, meadow })   loops that must play now (true / false)
     farmSound.bleat(lamb) · sweep() · crunch() · coin() · chime()   short sounds of the visitor's actions */
(() => {
  const KEY = "wd-sound";
  const SR = 44100;
  const base = document.currentScript ? new URL(".", document.currentScript.src) : new URL("./", location.href);
  const uk = document.documentElement.lang === "uk";
  let on = true;
  try { on = localStorage.getItem(KEY) !== "off"; } catch (e) {}

  let ctx = null, master = null, ready = false;
  const buf = {};
  const loops = {};                     // name → { src, gain }
  let want = {};                        // the loops the page wants now
  let meadowTimer = 0, voiceTurn = 0, birdTurn = 0, lastSweep = 0;

  /* ── synthesis (the same formulas as in the game) ── */
  function noiseGen() {
    let s = 0x1234abcd, brown = 0;
    const white = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 2147483648 - 1; };
    return { white, brown() { brown = Math.max(-1, Math.min(1, brown * 0.995 + white() * 0.04)); return brown; } };
  }
  function make(seconds, f) {
    const n = Math.floor(seconds * SR), b = ctx.createBuffer(1, n, SR), d = b.getChannelData(0), r = noiseGen();
    const fade = Math.floor(SR * 0.03);
    for (let i = 0; i < n; i++) {
      let v = f(i / SR, r);
      if (i < fade) v *= i / fade;                 // soft edges: no clicks, seamless loops
      if (i > n - fade) v *= (n - i) / fade;
      d[i] = v;
    }
    return b;
  }
  const rain = (t, r) => r.white() * 0.05 + r.brown() * 0.12 + (r.white() > 0.9993 ? r.white() * 0.25 : 0);
  const wind = (t, r) => r.brown() * 0.22 * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2 * Math.PI / 6)));
  const breeze = (t, r) => r.brown() * 0.045 * (0.6 + 0.4 * Math.sin(t * 2 * Math.PI / 9));
  function crickets(t) {
    const c = (f, period, offset, amp) => {
      const u = (t + offset) % period;
      if (u >= 0.24) return 0;
      return Math.sin(2 * Math.PI * f * t) * Math.max(0, Math.sin(2 * Math.PI * 28 * u)) * Math.sin(Math.PI * u / 0.24) * amp;
    };
    return c(4600, 0.9, 0, 0.035) + c(5150, 1.2, 0.4, 0.025);
  }
  const BIRDS = [[2900, 3600, 0.08, 2, 0.12], [3400, 2700, 0.14, 1, 0], [3100, 3700, 0.06, 3, 0.09]];
  function bird(t, [f0, f1, d, n, gap]) {
    let v = 0;
    for (let k = 0; k < n; k++) {
      const u = t - 0.05 - k * (d + gap);
      if (u < 0 || u >= d) continue;
      const env = Math.sin(Math.PI * u / d);
      v += Math.sin(2 * Math.PI * (f0 * u + (f1 - f0) * u * u / (2 * d))) * env * env * 0.08;
    }
    return v;
  }
  function sweep(t, r) {                             // "shhhk": straw over the ground
    const env = Math.sin(Math.min(1, t / 0.36) * Math.PI);
    const bristle = r.white() - 0.6 * r.brown();
    const scratch = r.white() > 0.985 ? r.white() * 0.6 : 0;
    return env * env * (bristle * 0.32 + scratch * 0.3);
  }
  function crunch(t, r) {                            // snow: tiny muffled crackles and a soft thud
    const env = Math.min(1, t * 40) * Math.exp(-t * 5.5);
    let v = r.brown() * 0.55;
    if (r.white() > 0.93) v += r.white() * 0.7;
    return env * v * 0.6 + Math.sin(t * 2 * Math.PI * 90) * Math.exp(-t * 18) * 0.35;
  }
  function coins(t) {
    const a = Math.sin(t * 2 * Math.PI * 1760) * Math.exp(-t * 9);
    const u = t - 0.09, b = u > 0 ? Math.sin(u * 2 * Math.PI * 2349) * Math.exp(-u * 9) : 0;
    return (a + b) * 0.12;
  }
  function chime(t) {                                // petting in the game: G5, C6, E6 like a marimba
    const note = (f, t0, amp) => {
      const u = t - t0;
      if (u < 0) return 0;
      return (Math.sin(u * 2 * Math.PI * f) + 0.18 * Math.sin(u * 2 * Math.PI * f * 4) * Math.exp(-u * 14)) * Math.min(1, u * 120) * Math.exp(-u * 5.5) * amp;
    };
    return (note(784, 0, 0.55) + note(1047, 0.11, 0.5) + note(1319, 0.22, 0.42)) * 0.22;
  }
  /* a synthesized "baa", only when the recording does not load */
  function bleatVoice(f0, length) {
    const n = Math.floor(length * SR), out = ctx.createBuffer(1, n, SR), d = out.getChannelData(0), r = noiseGen();
    const g = (f, c, w) => Math.exp(-((f - c) * (f - c)) / (2 * w * w));
    let phase = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR, u = t / length;
      const f = f0 * (0.94 + 0.12 * Math.sin(Math.PI * Math.min(1, u * 1.6)) - 0.08 * Math.max(0, u - 0.6)) * (1 + 0.035 * Math.sin(2 * Math.PI * 9.5 * t) * Math.min(1, u * 4));
      phase += f / SR;
      const open = Math.min(1, u / 0.12) * Math.min(1, (1 - u) / 0.25 + 0.3);
      const F1 = 380 + 340 * open, F2 = 1050 + 250 * open;
      let v = 0;
      for (let h = 1; h * f < 4500; h++) {
        const fh = h * f;
        v += (0.9 * g(fh, F1, 140) + 0.55 * g(fh, F2, 170) + 0.25 * g(fh, 2500, 260) + 0.04) / Math.sqrt(h) * Math.sin(2 * Math.PI * phase * h);
      }
      const breath = (r.white() - 0.7 * r.brown()) * 0.06 * open;
      const trem = 1 - 0.28 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 9.5 * t + 0.6)) * Math.min(1, u * 3);
      d[i] = (v * 0.26 + breath) * trem * Math.min(1, t / 0.05) * Math.min(1, (length - t) / 0.22);
    }
    return out;
  }

  /* ── start: only after the first click or key press ── */
  function start() {
    if (!on) return;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.55;
      master.connect(ctx.destination);
      buf.rain = make(4, rain);
      buf.wind = make(6, wind);
      buf.meadow = make(9, breeze);
      buf.crickets = make(6, crickets);
      BIRDS.forEach((c, i) => { buf["bird" + i] = make(1.2, t => bird(t, c)); });
      buf.sweep = make(0.38, sweep);
      buf.sweep2 = make(0.32, (t, r) => sweep(t * 1.15, r) * 0.85);
      buf.crunch = make(0.42, crunch);
      buf.coins = make(0.5, coins);
      buf.chime = make(0.9, chime);
      ready = true;
      fetch(new URL("sounds/sheep_baa.m4a", base))
        .then(r => r.ok ? r.arrayBuffer() : Promise.reject())
        .then(a => new Promise((ok, no) => ctx.decodeAudioData(a, ok, no)))
        .then(b => {                                   // peak 0.7, like in the game
          const d = b.getChannelData(0);
          let peak = 0;
          for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i]));
          if (peak > 0.001) for (let i = 0; i < d.length; i++) d[i] *= 0.7 / peak;
          buf.baa = b;
        })
        .catch(() => { buf.baa = bleatVoice(190, 0.95); });
    }
    if (ctx.state !== "running") ctx.resume();
    apply();
  }
  ["pointerdown", "keydown", "touchend"].forEach(e => addEventListener(e, start, { capture: true, passive: true }));

  const live = () => on && ready && ctx.state !== "closed" && !document.hidden;

  function play(name, vol = 1, rate = 1) {
    if (!live() || !buf[name]) return;
    const s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = buf[name]; s.playbackRate.value = rate; g.gain.value = vol;
    s.connect(g).connect(master); s.start();
  }

  /* loops fade in and out */
  const LOOP_VOL = { rain: 0.6, wind: 0.5, meadow: 0.45, crickets: 0.25 };
  function apply() {
    if (!ready) return;
    for (const name of Object.keys(LOOP_VOL)) {
      const need = live() && !!want[name], l = loops[name], now = ctx.currentTime;
      if (need && !l) {
        const src = ctx.createBufferSource(), gain = ctx.createGain();
        src.buffer = buf[name]; src.loop = true;
        gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(LOOP_VOL[name], now + 1.2);
        src.connect(gain).connect(master); src.start();
        loops[name] = { src, gain };
      } else if (!need && l) {
        l.gain.gain.cancelScheduledValues(now);
        l.gain.gain.setValueAtTime(l.gain.gain.value, now);
        l.gain.gain.linearRampToValueAtTime(0, now + 0.8);
        l.src.stop(now + 0.85);
        delete loops[name];
      }
    }
    // farm life by day: now and then a sheep, now and then a bird
    clearTimeout(meadowTimer);
    if (live() && want.meadow) meadowTimer = setTimeout(meadowLife, 2500 + Math.random() * 3000);
  }
  function meadowLife() {
    if (!(live() && want.meadow)) return;
    if (voiceTurn % 2 === 0) {
      const voices = [1, 1.28, 0.84, 1, 1.42];
      play("baa", 0.35, voices[(voiceTurn / 2) % voices.length]);
    } else {
      play("bird" + (birdTurn++ % BIRDS.length), 0.5);
    }
    voiceTurn++;
    meadowTimer = setTimeout(meadowLife, 7000 + Math.random() * 6000);
  }
  document.addEventListener("visibilitychange", apply);

  /* ── the switch in the header ── */
  const ICON_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4Z" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path class="w" d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.6 7.6 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const ICON_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4Z" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m15.5 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const T = uk ? { label: "Звуки ферми", on: "Звук увімкнено. Натисніть, щоб вимкнути", off: "Звук вимкнено. Натисніть, щоб увімкнути" }
               : { label: "Farm sounds", on: "Sound is on. Click to turn it off", off: "Sound is off. Click to turn it on" };
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "sound-switch"; btn.setAttribute("aria-label", T.label);
  function show() {
    btn.setAttribute("aria-pressed", on);
    btn.title = on ? T.on : T.off;
    btn.innerHTML = on ? ICON_ON : ICON_OFF;
  }
  btn.addEventListener("click", () => {
    on = !on;
    try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
    show();
    if (on) { start(); play("chime", 0.6); } else apply();
  });
  show();
  const lang = document.querySelector(".topbar .lang-menu");
  if (lang) lang.after(btn);

  window.farmSound = {
    ambience(w) { want = w; apply(); },
    bleat(lamb) {
      const k = Math.random();
      play("baa", 0.75, lamb ? (k < 0.5 ? 1.28 : 1.42) : (k < 0.5 ? 1 : 0.84 + k * 0.2));
    },
    sweep() {                                        // at most one swish every 0.18 s while the broom moves
      if (!ready) return;
      const t = ctx.currentTime;
      if (t - lastSweep < 0.18) return;
      lastSweep = t;
      play(Math.random() < 0.5 ? "sweep" : "sweep2", 0.8);
    },
    crunch() {
      if (!ready) return;
      const t = ctx.currentTime;
      if (t - lastSweep < 0.22) return;
      lastSweep = t;
      play("crunch", 0.8);
    },
    coin() { play("coins", 0.9); },
    chime() { play("chime", 0.7); },
    /* for checks in the browser console */
    state: () => ({ on, ready, context: ctx?.state, loops: Object.keys(loops), recording: !!buf.baa }),
  };
})();
