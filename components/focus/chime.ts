// A soft three-note bell made with the Web Audio API — no audio file needed.

type AudioCtor = typeof AudioContext;

let ctx: AudioContext | null = null;

/** Create/resume the shared AudioContext. Call from a user gesture (e.g. Start) so browsers allow playback later. */
export function unlockAudio() {
    try {
        if (!ctx) {
            const Ctor: AudioCtor | undefined =
                window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
            if (!Ctor) return;
            ctx = new Ctor();
        }
        if (ctx.state === "suspended") void ctx.resume();
    } catch {
        ctx = null;
    }
}

export function playChime() {
    unlockAudio();
    if (!ctx) return;
    const start = ctx.currentTime + 0.05;
    // C6, E6, G6 — a gentle major arpeggio
    [1046.5, 1318.5, 1568].forEach((freq, i) => {
        const t = start + i * 0.22;
        const osc = ctx!.createOscillator();
        const overtone = ctx!.createOscillator();
        const gain = ctx!.createGain();
        osc.type = "sine";
        overtone.type = "sine";
        osc.frequency.value = freq;
        overtone.frequency.value = freq * 2.01;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
        const overtoneGain = ctx!.createGain();
        overtoneGain.gain.value = 0.15;
        osc.connect(gain);
        overtone.connect(overtoneGain).connect(gain);
        gain.connect(ctx!.destination);
        osc.start(t);
        overtone.start(t);
        osc.stop(t + 1.7);
        overtone.stop(t + 1.7);
    });
}
