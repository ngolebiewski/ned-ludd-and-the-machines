import { zzfx } from "zzfx";

export class AudioManager {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // ================= MASTER =================
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 0;
        this.masterGain.connect(this.audioCtx.destination);

        // ================= DRUM BUS (IMPORTANT FIX) =================
        this.drumGain = this.audioCtx.createGain();
        this.drumGain.gain.value = 1.8; // 🔥 make drums punch through
        this.drumGain.connect(this.masterGain);

        // ================= DELAY =================
        this.delay = this.audioCtx.createDelay(5.0);
        this.delay.delayTime.value = 0.28;

        this.delayGain = this.audioCtx.createGain();
        this.delayGain.gain.value = 0.18;

        this.delay.connect(this.delayGain).connect(this.delay);
        this.delay.connect(this.masterGain);

        // ================= ZzFX ROUTING =================
        zzfx.ctx = this.audioCtx;
        zzfx.destination = this.masterGain;

        // ================= STATE =================
        this.isPlaying = false;
        this.loopId = null;

        this.isBossMode = false;
        this.speedMultiplier = 1;
        this.pitchMultiplier = 1;

        // ================= NOTES =================
        this.NOTES = {
            Eb2: 77.78,
            F2: 87.31,
            Gb2: 92.50,
            Eb3: 155.56,
        };
    }

    // ================= SFX =================
    playSFX(type) {
        switch (type) {
            case "explode":
                zzfx(...[2.2,,78,.05,.13,.43,4,2.6,-5,8,,,,1.6,4.6,.8,.16,.3,.13]);
                break;

            case "hit":
                zzfx(...[,,274,.02,.06,.19,4,2.4,,-2,,,.01,1.1,,.2,,.83,.02,.11]);
                break;

            case "robot":
                zzfx(...[2.1,0,65.40639,.04,.03,.27,2,2.7,,,,,,,,,.18,.4,.14]);
                break;

            case "jump":
                zzfx(...[2,,267,.02,.02,.05,1,2.3,,110,,,,,,.1,.01,.67,.03,,113]);
                break;
        }
    }

    // ================= DRUM ENGINE =================
    playNoise(time, len = 0.12, cutoff = 500) {
        const size = this.audioCtx.sampleRate * len;
        const buffer = this.audioCtx.createBuffer(1, size, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < size; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = this.isBossMode ? cutoff * 1.3 : cutoff;

        const gain = this.audioCtx.createGain();

        // 🔥 MUCH LOUDER DRUM TRANSIENTS
        gain.gain.setValueAtTime(0.8, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + len);

        // 🚨 ROUTE TO DRUM BUS (FIX)
        noise.connect(filter).connect(gain).connect(this.drumGain);
        noise.start(time);
    }

    playKick(time) {
        this.playNoise(time, 0.18, 120);
    }

    playSnare(time) {
        this.playNoise(time, 0.14, 250);
    }

    playHat(time) {
        this.playNoise(time, 0.05, 800);
    }

    // ================= BASS =================
    playBass(time, freq, len = 1.5) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq * this.pitchMultiplier, time);

        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + len);

        osc.connect(gain).connect(this.masterGain);
        osc.connect(gain).connect(this.delay);

        osc.start(time);
        osc.stop(time + len);
    }

    // ================= CLANG =================
    playClang(time) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(
            (700 + Math.random() * 400) * this.pitchMultiplier,
            time
        );

        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

        osc.connect(gain).connect(this.masterGain);
        osc.connect(gain).connect(this.delay);

        osc.start(time);
        osc.stop(time + 0.35);
    }

    // ================= ARP =================
    playArp(time, root) {
        const pattern = [1, 3, 2, 5, 3, 2, 1, 2];

        const scale = this.isBossMode
            ? [1, 1.122, 1.26, 1.335, 1.498]
            : [1, 1.122, 1.189, 1.335, 1.498];

        pattern.forEach((step, i) => {
            const freq = root * scale[step % scale.length];

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = "square";
            osc.frequency.setValueAtTime(
                freq * this.pitchMultiplier,
                time + i * 0.11
            );

            gain.gain.setValueAtTime(0.08, time + i * 0.11);
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                time + i * 0.11 + 0.1
            );

            osc.connect(gain).connect(this.masterGain);
            osc.start(time + i * 0.11);
            osc.stop(time + i * 0.11 + 0.1);
        });
    }

    // ================= CHORDS =================
    playChord(time) {
        const minor = [[155.56, 185, 233]];
        const major = [
            [155.56, 196, 246],
            [174.61, 220, 261],
            [196, 246, 311],
        ];

        const pool = this.isBossMode ? major : minor;
        const chord = pool[Math.floor(Math.random() * pool.length)];

        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.12, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 2);

        gain.connect(this.masterGain);
        gain.connect(this.delay);

        chord.forEach(freq => {
            const osc = this.audioCtx.createOscillator();
            osc.type = "sawtooth";

            osc.frequency.setValueAtTime(freq * this.pitchMultiplier, time);

            osc.connect(gain);
            osc.start(time);
            osc.stop(time + 2);
        });
    }

    // ================= SEQUENCER =================
    schedule() {
        const now = this.audioCtx.currentTime;

        const bpm = 100 * this.speedMultiplier;
        const beat = 60 / bpm;

        for (let i = 0; i < 32; i++) {
            const t = now + i * beat;
            const step = i % 16;

            // ================= DRUMS =================
            this.playHat(t);

            if (step === 0 || step === 8) this.playKick(t);
            if (step === 4 || step === 12 || step === 14) this.playSnare(t);

            // ================= MUSIC =================
            if (i % 8 === 0) this.playBass(t, this.NOTES.Eb2, 3);
            if (i % 8 === 4) this.playBass(t, this.NOTES.Gb2, 1);
            if (i % 8 === 6) this.playBass(t, this.NOTES.F2, 1);

            if (Math.random() < (this.isBossMode ? 0.4 : 0.2)) {
                this.playClang(t);
            }

            if (i > 16) this.playArp(t, this.NOTES.Eb3);

            if (i === 0 || i === 16) this.playChord(t);
        }

        this.loopId = setTimeout(() => this.schedule(), beat * 32 * 1000);
    }

    // ================= CONTROL =================
    start() {
        if (this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
        }

        if (!this.isPlaying) {
            this.isPlaying = true;
            this.fadeIn(2);
            this.schedule();
        }
    }

    stop() {
        clearTimeout(this.loopId);
        this.isPlaying = false;
        this.fadeOut(2);
    }

    fadeIn(t = 2) {
        const now = this.audioCtx.currentTime;
        this.masterGain.gain.setValueAtTime(0, now);
        this.masterGain.gain.linearRampToValueAtTime(0.35, now + t);
    }

    fadeOut(t = 2) {
        const now = this.audioCtx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0, now + t);
    }

    // ================= BOSS MODE =================
    enterBossMode() {
        this.isBossMode = true;
        this.speedMultiplier = 2;
        this.pitchMultiplier = 1.414;
    }

    exitBossMode() {
        this.isBossMode = false;
        this.speedMultiplier = 1;
        this.pitchMultiplier = 1;
    }
}