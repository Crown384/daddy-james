"use client";

import { useEffect, useRef, useState } from "react";

export function CelebrationAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  function playNote(freq: number, time: number, duration: number) {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Use a soft sine/triangle blend for music box / warm chime sound
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.08, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  function toggleAudio() {
    if (isPlaying) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state === "running") {
        void audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === "suspended") {
        void audioCtxRef.current.resume();
      }

      setIsPlaying(true);

      // Warm celebratory chords arpeggiated gently (C major / G / Am / F)
      const progression = [
        [261.63, 329.63, 392.0, 523.25], // C4, E4, G4, C5
        [246.94, 293.66, 392.0, 493.88], // B3, D4, G4, B4
        [220.0, 261.63, 329.63, 440.0],  // A3, C4, E4, A4
        [174.61, 220.0, 261.63, 349.23], // F3, A3, C4, F4
      ];

      let chordIdx = 0;
      let noteIdx = 0;

      const scheduleTick = () => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        const chord = progression[chordIdx];
        const freq = chord[noteIdx];

        playNote(freq, now, 1.8);

        noteIdx++;
        if (noteIdx >= chord.length) {
          noteIdx = 0;
          chordIdx = (chordIdx + 1) % progression.length;
        }
      };

      scheduleTick();
      intervalRef.current = window.setInterval(scheduleTick, 650);
    } catch {
      setIsPlaying(false);
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        void audioCtxRef.current.close().catch(() => undefined);
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleAudio}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-xs font-semibold shadow-lg backdrop-blur-md transition-all duration-300 ${
        isPlaying
          ? "border-amber-400 bg-amber-950/85 text-amber-200 shadow-amber-500/25 ring-2 ring-amber-400/50 hover:bg-amber-900"
          : "border-stone-900/10 bg-white/90 text-stone-700 hover:bg-white hover:shadow-xl"
      }`}
      title={isPlaying ? "Mute celebration melody" : "Play celebration melody"}
    >
      <span className={isPlaying ? "animate-spin text-amber-300" : "text-amber-600"}>
        {isPlaying ? "♫" : "♪"}
      </span>
      <span>{isPlaying ? "Music Playing" : "Celebration Music"}</span>
      {isPlaying && (
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      )}
    </button>
  );
}
