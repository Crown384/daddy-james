"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { BirthdaySubmission } from "@/lib/types";

type MediaLightboxProps = {
  submission: BirthdaySubmission | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
};

export function MediaLightbox({
  submission,
  onClose,
  onNext,
  onPrev,
  hasPrev,
  hasNext,
}: MediaLightboxProps) {
  useEffect(() => {
    if (!submission) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext && hasNext) onNext();
      if (e.key === "ArrowLeft" && onPrev && hasPrev) onPrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submission, onClose, onNext, onPrev, hasPrev, hasNext]);

  if (!submission) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-stone-950 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-stone-900/60 backdrop-blur-sm">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
              Memory from
            </p>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-white">
              {submission.name || "A beloved well-wisher"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Media content */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black min-h-[300px] sm:min-h-[440px]">
          {submission.videoUrl ? (
            <video
              src={submission.videoUrl}
              controls
              autoPlay
              playsInline
              className="max-h-[68vh] w-full object-contain"
            />
          ) : submission.photoUrl ? (
            <div className="relative h-[65vh] w-full">
              <Image
                src={submission.photoUrl}
                alt={submission.name || "Birthday memory"}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
                priority
              />
            </div>
          ) : null}

          {/* Previous / Next buttons */}
          {hasPrev && onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-black/90"
              aria-label="Previous memory"
            >
              ←
            </button>
          )}

          {hasNext && onNext && (
            <button
              type="button"
              onClick={onNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-black/90"
              aria-label="Next memory"
            >
              →
            </button>
          )}
        </div>

        {/* Caption / Note */}
        {submission.wish && (
          <div className="border-t border-white/10 bg-stone-900/80 px-6 py-4">
            <p className="max-h-28 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-stone-200">
              &ldquo;{submission.wish}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
