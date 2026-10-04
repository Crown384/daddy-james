"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BirthdaySubmission } from "@/lib/types";
import { GoldenEmbers } from "./golden-embers";
import { CelebrationAudio } from "./celebration-audio";
import { MediaLightbox } from "./media-lightbox";
import { MemoryReelModal } from "./memory-reel-modal";

const CONFETTI_COLORS = [
  "#b7791f",
  "#f2c14e",
  "#e99a8e",
  "#f8dfb6",
  "#d4a373",
  "#ffd700",
  "#ffffff",
];

export function launchConfetti() {
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");

  Object.assign(layer.style, {
    position: "fixed",
    inset: "0",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: "9999",
  });

  document.body.appendChild(layer);

  Array.from({ length: 130 }, (_, index) => {
    const piece = document.createElement("span");
    const size = 6 + Math.random() * 8;
    const drift = -180 + Math.random() * 360;
    const rotate = 360 + Math.random() * 1080;
    const duration = 2200 + Math.random() * 1900;
    const delay = Math.random() * 450;

    Object.assign(piece.style, {
      position: "absolute",
      left: `${5 + Math.random() * 90}%`,
      top: "-28px",
      width: `${size}px`,
      height: `${size * (index % 3 === 0 ? 1.7 : 0.8)}px`,
      borderRadius: index % 4 === 0 ? "999px" : "2px",
      background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      boxShadow:
        index % 5 === 0 ? "0 0 12px rgba(245,184,71,.75)" : "none",
    });

    layer.appendChild(piece);

    piece.animate(
      [
        {
          transform: "translate3d(0,-20px,0) rotate(0deg)",
          opacity: 0,
        },
        { opacity: 1, offset: 0.1 },
        {
          transform: `translate3d(${drift}px,105vh,0) rotate(${rotate}deg)`,
          opacity: 0.96,
        },
      ],
      {
        duration,
        delay,
        easing: "cubic-bezier(.12,.72,.2,1)",
        fill: "forwards",
      },
    );
  });

  window.setTimeout(() => layer.remove(), 4800);
}

function displayDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

function SoundIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
      <path d="m16 9 5 5m0-5-5 5" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

function CelebrationHero({
  onOpenReel,
  submissionsCount,
}: {
  onOpenReel: () => void;
  submissionsCount: number;
}) {
  useEffect(() => {
    const first = window.setTimeout(launchConfetti, 250);
    const second = window.setTimeout(launchConfetti, 1600);

    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
    };
  }, []);

  return (
    <section className="relative flex min-h-[85svh] items-center justify-center overflow-hidden px-5 py-16 text-center sm:min-h-[90svh]">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-28 top-12 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-20 h-96 w-96 rounded-full bg-rose-200/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        {/* Emblem Badge */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/25 bg-white/90 text-2xl text-amber-700 shadow-[0_16px_40px_-20px_rgba(180,83,9,0.45)] backdrop-blur animate-pulse-glow">
          ✦
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-800/90 sm:text-xs">
          Commemorating a Remarkable Man, Father & Mentor
        </p>

        <h1 className="mx-auto mt-4 max-w-4xl font-serif text-[2.75rem] font-bold leading-[1.02] tracking-[-0.035em] text-stone-900 sm:text-6xl lg:text-7xl">
          Happy Birthday,
          <span className="mt-2 block bg-gradient-to-r from-amber-800 via-amber-600 to-orange-700 bg-clip-text text-transparent drop-shadow-sm">
            Dr. Engr James Abioye
          </span>
        </h1>

        <div className="mx-auto mt-6 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-700/60" />
          <span className="text-sm text-amber-700/70">✻ ✦ ✻</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-700/60" />
        </div>

        <p className="mx-auto mt-6 max-w-2xl font-serif text-xl sm:text-2xl leading-relaxed text-stone-700 font-medium">
          &ldquo;We love you and there is absolutely nothing you can do about it.&rdquo;
        </p>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-500 sm:text-base">
          A timeless collection of faces, cherished memories, and heartfelt words
          from your family and loved ones gathered to honor you today.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5 no-print">
          {submissionsCount > 0 && (
            <button
              type="button"
              onClick={onOpenReel}
              className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/15 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:brightness-105"
            >
              <span>▶</span>
              <span>Play Memory Reel</span>
            </button>
          )}

          <a
            href="#wishes"
            className="inline-flex items-center gap-2 rounded-full border border-stone-900/10 bg-white/90 px-5 py-3.5 text-sm font-semibold text-stone-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
          >
            <span>See All Wishes</span>
            <span aria-hidden="true">↓</span>
          </a>

          <button
            type="button"
            onClick={launchConfetti}
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/10 bg-amber-50/80 px-4 py-3.5 text-sm font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100/90"
            title="Shower more confetti"
          >
            <span>🎉</span>
            <span>Shower Love</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function VideoMemory({
  src,
  onOpenLightbox,
}: {
  src: string;
  onOpenLightbox: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    void video.play().catch(() => undefined);
  }, []);

  function toggleSound(e: React.MouseEvent) {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !muted;
    video.muted = nextMuted;
    setMuted(nextMuted);

    if (video.paused) {
      void video.play().catch(() => undefined);
    }
  }

  return (
    <div
      onClick={onOpenLightbox}
      className="group relative h-56 sm:h-full min-h-[220px] cursor-pointer overflow-hidden bg-stone-900"
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      >
        Your browser does not support video playback.
      </video>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition group-hover:opacity-40" />

      {/* Expand overlay icon */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md shadow-lg">
          ⤢
        </span>
      </div>

      <button
        type="button"
        onClick={toggleSound}
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/60 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/80"
        aria-label={muted ? "Unmute video" : "Mute video"}
      >
        <SoundIcon muted={muted} />
      </button>

      <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
        Video Message
      </span>
    </div>
  );
}

function MediaPanel({
  submission,
  onOpenLightbox,
}: {
  submission: BirthdaySubmission;
  onOpenLightbox: () => void;
}) {
  if (submission.videoUrl) {
    return <VideoMemory src={submission.videoUrl} onOpenLightbox={onOpenLightbox} />;
  }

  if (submission.photoUrl) {
    return (
      <div
        onClick={onOpenLightbox}
        className="group relative h-56 sm:h-full min-h-[220px] cursor-pointer overflow-hidden bg-stone-100"
      >
        <Image
          src={submission.photoUrl}
          alt={
            submission.name
              ? `A birthday memory from ${submission.name}`
              : "Birthday memory"
          }
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md shadow-lg">
            ⤢
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-44 sm:h-full min-h-[190px] items-center justify-center bg-gradient-to-br from-amber-100/80 via-[#fff8eb] to-orange-100/70">
      <div className="text-center p-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-900/10 bg-white/80 text-2xl text-amber-700 shadow-sm">
          ♥
        </div>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-800/80">
          Sent with Love
        </p>
      </div>
    </div>
  );
}

// Realistic golden wooden clothespin clipping card to light string
function ClothespinClip() {
  return (
    <div className="absolute -top-4 left-1/2 z-30 -translate-x-1/2 no-print" aria-hidden="true">
      <div className="relative flex flex-col items-center">
        {/* Clip Body */}
        <div className="h-6 w-3 rounded-sm bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 shadow-md border-x border-amber-900/40">
          <div className="mx-auto mt-2 h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_4px_rgba(251,191,36,0.9)]" />
        </div>
        {/* Clip spring wire */}
        <div className="absolute top-2.5 h-1 w-4 rounded-full bg-stone-400 shadow-sm" />
      </div>
    </div>
  );
}

function WishCard({
  submission,
  index,
  onOpenLightbox,
}: {
  submission: BirthdaySubmission;
  index: number;
  onOpenLightbox: () => void;
}) {
  const [hearts, setHearts] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<
    Array<{ id: number; drift: number; rot: number; emoji: string }>
  >([]);

  const tilt =
    index % 3 === 0
      ? "sm:rotate-[0.35deg]"
      : index % 3 === 1
        ? "sm:-rotate-[0.4deg]"
        : "sm:rotate-[0.15deg]";

  function handleSendHeart(e: React.MouseEvent) {
    e.stopPropagation();
    setHearts((prev) => prev + 1);

    const emojis = ["❤️", "💖", "✨", "🎂", "🤍", "🌟"];
    const id = Date.now() + Math.random();
    const drift = -35 + Math.random() * 70;
    const rot = -25 + Math.random() * 50;
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    setFloatingHearts((prev) => [...prev, { id, drift, rot, emoji }]);
    window.setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1600);
  }

  return (
    <div className="relative py-8 sm:py-10 page-break-avoid">
      {/* Hanging connection to garland */}
      <div className="absolute left-1/2 top-0 z-10 h-10 w-px -translate-x-1/2 bg-amber-900/25 no-print" />
      <div className="absolute left-1/2 top-6 z-20 h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-[#fbf7ef] bg-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.8)] no-print" />

      <article
        className={`relative z-20 mx-auto w-[calc(100%-1.5rem)] max-w-[700px] overflow-hidden rounded-[1.6rem] border border-amber-900/10 bg-[#fffdf9] shadow-[0_20px_50px_-25px_rgba(83,54,24,0.35)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_-25px_rgba(83,54,24,0.45)] ${tilt}`}
      >
        <ClothespinClip />

        <div className="grid grid-cols-1 md:grid-cols-[44%_56%]">
          <MediaPanel submission={submission} onOpenLightbox={onOpenLightbox} />

          <div className="relative flex min-h-[220px] flex-col p-5 sm:p-6">
            <span className="absolute right-5 top-4 text-xs text-amber-700/40 select-none">
              ✦
            </span>

            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-700">
              A Message From
            </p>

            <h2 className="mt-1 font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              {submission.name || "Someone who loves you"}
            </h2>

            <div className="mt-2.5 h-px w-12 bg-amber-600/30" />

            {submission.wish ? (
              <p className="mt-3.5 whitespace-pre-wrap font-serif text-sm sm:text-base leading-relaxed text-stone-700">
                &ldquo;{submission.wish}&rdquo;
              </p>
            ) : (
              <p className="mt-3.5 font-serif text-sm italic text-stone-500">
                A cherished memory sent with utmost love and prayers for your birthday.
              </p>
            )}

            {/* Footer with date & Heart reaction button */}
            <div className="mt-auto flex items-center justify-between pt-5 border-t border-stone-200/50">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                {displayDate(submission.createdAt)}
              </span>

              {/* Heart burst reaction */}
              <div className="relative flex items-center no-print">
                {floatingHearts.map((h) => (
                  <span
                    key={h.id}
                    className="pointer-events-none absolute -top-4 right-2 text-base select-none animate-float-heart"
                    style={
                      {
                        "--drift-x": `${h.drift}px`,
                        "--rot": `${h.rot}deg`,
                      } as React.CSSProperties
                    }
                  >
                    {h.emoji}
                  </span>
                ))}

                <button
                  type="button"
                  onClick={handleSendHeart}
                  className="flex items-center gap-1.5 rounded-full border border-amber-900/10 bg-amber-50/70 px-2.5 py-1 text-xs font-medium text-stone-700 shadow-sm transition hover:scale-105 hover:bg-rose-50 hover:text-rose-600"
                  title="Send love"
                >
                  <span className="text-rose-500">{hearts > 0 ? "❤️" : "♡"}</span>
                  <span className="text-[11px] font-semibold">{hearts > 0 ? hearts : "Blessing"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function BirthdayLights() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-10 -translate-x-1/2 no-print" aria-hidden="true">
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-amber-800/10 via-amber-900/30 to-amber-800/10" />

      {Array.from({ length: 40 }).map((_, index) => {
        const side = index % 2 === 0 ? "left-[7px]" : "right-[7px]";
        const glow =
          index % 3 === 0
            ? "bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.9)]"
            : index % 3 === 1
              ? "bg-rose-300 shadow-[0_0_14px_rgba(253,164,175,0.8)]"
              : "bg-orange-300 shadow-[0_0_14px_rgba(253,186,116,0.85)]";

        return (
          <span
            key={index}
            className={`absolute h-2.5 w-2.5 rounded-full border-2 border-white/95 ${side} ${glow} ${index % 4 === 0 ? "animate-pulse" : ""}`}
            style={{ top: `${(index / 39) * 100}%` }}
          />
        );
      })}
    </div>
  );
}

export function BirthdayAlbum({ token }: { token: string }) {
  const [submissions, setSubmissions] = useState<BirthdaySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | "photos" | "videos" | "words">("all");

  // Lightbox & Slideshow state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isReelOpen, setIsReelOpen] = useState(false);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setRefreshing(true);

      try {
        const response = await fetch("/api/wishes", {
          cache: "no-store",
          headers: {
            "x-birthday-token": token,
          },
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to open the birthday book.");
        }

        setSubmissions(payload.submissions ?? []);
        setError("");
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to open the birthday book.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token],
  );

  useEffect(() => {
    void load(true);
    const interval = window.setInterval(() => void load(true), 15000);
    return () => window.clearInterval(interval);
  }, [load]);

  // Filtered submissions
  const filtered = useMemo(() => {
    return submissions.filter((item) => {
      // Category filter
      if (category === "photos" && !item.photoUrl) return false;
      if (category === "videos" && !item.videoUrl) return false;
      if (category === "words" && !item.wish) return false;

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesWish = item.wish?.toLowerCase().includes(q);
        return matchesName || matchesWish;
      }

      return true;
    });
  }, [submissions, category, search]);

  const activeLightboxSubmission =
    lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-stone-950 paper-texture selection:bg-amber-200">
      {/* Ambient background particles */}
      <GoldenEmbers />

      {/* Hero Section */}
      <CelebrationHero
        onOpenReel={() => setIsReelOpen(true)}
        submissionsCount={submissions.length}
      />

      {/* Main Wishes String Section */}
      <section
        id="wishes"
        className="relative mx-auto w-full max-w-5xl px-3 pb-24 pt-8 sm:px-6 sm:pb-32"
      >
        <div className="mx-auto max-w-2xl px-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-800">
            A Living Tapestry of Love
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Tributes & Birthday Wishes
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-stone-600">
            Every card hanging on this string represents a heart celebrating you,
            Dr. Engr James Abioye.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row no-print">
          {/* Search box */}
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by sender or message…"
              className="w-full rounded-full border border-stone-900/10 bg-white/90 px-4 py-2 pl-9 text-xs font-medium text-stone-800 placeholder-stone-400 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            <span className="absolute left-3 top-2.5 text-xs text-stone-400">
              🔍
            </span>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-2 text-xs text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-stone-900/10 bg-white/80 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                category === "all"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              type="button"
              onClick={() => setCategory("photos")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                category === "photos"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Photos ({submissions.filter((s) => s.photoUrl).length})
            </button>
            <button
              type="button"
              onClick={() => setCategory("videos")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                category === "videos"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Videos ({submissions.filter((s) => s.videoUrl).length})
            </button>
            <button
              type="button"
              onClick={() => setCategory("words")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                category === "words"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Messages ({submissions.filter((s) => s.wish).length})
            </button>
          </div>

          {/* Quick Refresh & Print */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void load()}
              disabled={refreshing}
              className="rounded-full border border-stone-900/10 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-stone-600 shadow-sm transition hover:bg-white disabled:opacity-60"
            >
              {refreshing ? "Refreshing…" : "↻ Refresh"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border border-stone-900/10 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-stone-600 shadow-sm transition hover:bg-white"
              title="Print keepsake album or export PDF"
            >
              🖨️ Keepsake
            </button>
          </div>
        </div>

        {error ? (
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mx-auto mt-10 max-w-[680px] space-y-9 px-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-[1.6rem] border border-amber-900/10 bg-white/70 shadow-sm"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mx-auto mt-14 max-w-md rounded-[2rem] border border-stone-900/10 bg-white/85 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-700">
              ♥
            </div>
            <h3 className="mt-5 font-serif text-2xl font-bold text-stone-900">
              {search || category !== "all"
                ? "No matching wishes found"
                : "The string is ready."}
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              {search || category !== "all"
                ? "Try clearing the search filter or selecting another category."
                : "The birthday wishes will appear here as they arrive."}
            </p>
            {(search || category !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="mt-4 rounded-full border border-stone-900/10 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="relative mx-auto mt-8 max-w-4xl pb-14">
            <BirthdayLights />

            {filtered.map((submission, index) => (
              <WishCard
                key={submission._id}
                submission={submission}
                index={index}
                onOpenLightbox={() => setLightboxIndex(index)}
              />
            ))}

            <div className="relative z-10 mx-auto mt-8 flex w-fit flex-col items-center rounded-full border border-amber-900/10 bg-white/90 px-6 py-3.5 text-center shadow-md backdrop-blur">
              <span className="text-xl text-amber-600">♥</span>
              <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-stone-600">
                With All Our Love & Gratitude
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Floating Ambient Celebratory Music Toggle */}
      <CelebrationAudio />

      {/* Fullscreen Memory Reel Slideshow */}
      <MemoryReelModal
        submissions={filtered}
        isOpen={isReelOpen}
        onClose={() => setIsReelOpen(false)}
      />

      {/* Media Lightbox */}
      <MediaLightbox
        submission={activeLightboxSubmission}
        onClose={() => setLightboxIndex(null)}
        hasPrev={lightboxIndex !== null && lightboxIndex > 0}
        hasNext={lightboxIndex !== null && lightboxIndex < filtered.length - 1}
        onPrev={() => setLightboxIndex((prev) => (prev !== null ? prev - 1 : null))}
        onNext={() => setLightboxIndex((prev) => (prev !== null ? prev + 1 : null))}
      />
    </main>
  );
}
