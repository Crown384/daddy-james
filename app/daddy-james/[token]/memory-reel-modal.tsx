"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { BirthdaySubmission } from "@/lib/types";

type MemoryReelModalProps = {
  submissions: BirthdaySubmission[];
  isOpen: boolean;
  onClose: () => void;
};

export function MemoryReelModal({
  submissions,
  isOpen,
  onClose,
}: MemoryReelModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const SLIDE_DURATION = 8000; // 8 seconds per slide

  const current = submissions[currentIndex];

  // Reset to first slide when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setProgress(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  // Autoplay timer with smooth progress bar
  useEffect(() => {
    if (!isOpen || !isPlaying || submissions.length <= 1) return;

    const intervalTime = 50;
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % submissions.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => window.clearInterval(timer);
  }, [isOpen, isPlaying, currentIndex, submissions.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % submissions.length);
        setProgress(0);
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + submissions.length) % submissions.length);
        setProgress(0);
      }
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, submissions.length, onClose]);

  if (!isOpen || !current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-stone-950/96 text-white backdrop-blur-2xl"
      role="dialog"
      aria-modal="true"
    >
      {/* Top progress bar */}
      <div className="relative h-1 w-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-yellow-200 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <span className="font-serif text-sm sm:text-base font-medium tracking-wide text-amber-200">
            Daddy James • Memory Reel
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-stone-300">
            {currentIndex + 1} of {submissions.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur hover:bg-white/20 transition"
          >
            {isPlaying ? "❚❚ Pause" : "▶ Resume"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
            aria-label="Close reel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main presentation area */}
      <div className="relative flex flex-1 items-center justify-center p-4 sm:p-10 overflow-hidden">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-amber-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-rose-600/15 blur-3xl" />

        <div className="relative z-10 grid w-full max-w-5xl items-center gap-8 md:grid-cols-2">
          {/* Media box */}
          <div className="relative mx-auto flex h-[48vh] sm:h-[58vh] w-full max-w-md items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-black/60 shadow-2xl">
            {current.videoUrl ? (
              <video
                ref={videoRef}
                src={current.videoUrl}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-contain"
              />
            ) : current.photoUrl ? (
              <div className="relative h-full w-full">
                <Image
                  src={current.photoUrl}
                  alt={current.name || "Birthday memory"}
                  fill
                  sizes="(max-width: 768px) 90vw, 450px"
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10 text-4xl text-amber-300">
                  ♥
                </div>
                <p className="mt-4 font-serif text-lg text-amber-200">
                  A Heartfelt Birthday Wish
                </p>
              </div>
            )}
          </div>

          {/* Message & Author box */}
          <div className="flex flex-col justify-center text-left">
            <span className="text-4xl sm:text-5xl text-amber-400/40 font-serif select-none">
              “
            </span>
            <p className="max-h-[38vh] overflow-y-auto whitespace-pre-wrap font-serif text-lg sm:text-2xl leading-relaxed text-stone-100 pr-2">
              {current.wish || "Sending boundless love, joy, and blessings on your special day!"}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-0.5 w-8 bg-amber-500" />
              <div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {current.name || "With all our love"}
                </h4>
                <p className="text-xs uppercase tracking-widest text-amber-400/80">
                  COT Family Well-wisher
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Previous and Next side buttons */}
        <button
          type="button"
          onClick={() => {
            setCurrentIndex((prev) => (prev - 1 + submissions.length) % submissions.length);
            setProgress(0);
          }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-xl backdrop-blur transition hover:scale-110 hover:bg-black/80"
          aria-label="Previous slide"
        >
          ←
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentIndex((prev) => (prev + 1) % submissions.length);
            setProgress(0);
          }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-xl backdrop-blur transition hover:scale-110 hover:bg-black/80"
          aria-label="Next slide"
        >
          →
        </button>
      </div>

      {/* Footer guidance */}
      <div className="flex items-center justify-center border-t border-white/10 py-3 text-center text-xs text-stone-400">
        Press <kbd className="mx-1 rounded border border-white/20 px-1.5 py-0.5">Space</kbd> to pause,{" "}
        <kbd className="mx-1 rounded border border-white/20 px-1.5 py-0.5">←</kbd>
        <kbd className="mx-1 rounded border border-white/20 px-1.5 py-0.5">→</kbd> to browse,{" "}
        <kbd className="mx-1 rounded border border-white/20 px-1.5 py-0.5">Esc</kbd> to exit.
      </div>
    </div>
  );
}
