"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BirthdaySubmission } from "@/lib/types";

const CONFETTI_COLORS = [
  "#b7791f",
  "#f2c14e",
  "#e99a8e",
  "#f8dfb6",
  "#d4a373",
  "#ffffff",
];

function launchConfetti() {
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

  Array.from({ length: 120 }, (_, index) => {
    const piece = document.createElement("span");
    const size = 5 + Math.random() * 7;
    const drift = -150 + Math.random() * 300;
    const rotate = 360 + Math.random() * 900;
    const duration = 2200 + Math.random() * 1800;
    const delay = Math.random() * 450;

    Object.assign(piece.style, {
      position: "absolute",
      left: `${8 + Math.random() * 84}%`,
      top: "-28px",
      width: `${size}px`,
      height: `${size * (index % 3 === 0 ? 1.7 : 0.8)}px`,
      borderRadius: index % 4 === 0 ? "999px" : "2px",
      background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      boxShadow:
        index % 5 === 0 ? "0 0 10px rgba(245,184,71,.65)" : "none",
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

  window.setTimeout(() => layer.remove(), 4700);
}

function displayDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function CelebrationHero() {
  useEffect(() => {
    const first = window.setTimeout(launchConfetti, 180);
    const second = window.setTimeout(launchConfetti, 1350);

    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
    };
  }, []);

  return (
    <section className="relative flex min-h-[82svh] items-center justify-center overflow-hidden px-5 py-20 text-center sm:min-h-[88svh]">
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-rose-200/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-100/80 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-amber-900/10 bg-white/85 text-2xl shadow-[0_14px_42px_-22px_rgba(120,74,12,0.5)] backdrop-blur">
          ✦
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-amber-800 sm:text-xs">
          Celebrating a remarkable man
        </p>

        <h1 className="mx-auto mt-5 max-w-5xl text-balance font-serif text-[3.15rem] font-semibold leading-[0.93] tracking-[-0.055em] text-stone-950 sm:text-7xl lg:text-[5.8rem]">
          Happy Birthday
          <span className="mt-2 block bg-gradient-to-r from-amber-800 via-amber-600 to-orange-700 bg-clip-text text-transparent">
            Dr. Engr James Abioye
          </span>
        </h1>

        <div className="mx-auto mt-9 h-px w-24 bg-gradient-to-r from-transparent via-amber-700/70 to-transparent" />

        <p className="mx-auto mt-8 max-w-2xl text-balance font-serif text-2xl leading-9 text-stone-700 sm:text-3xl sm:leading-10">
          We love you and there is absolutely nothing you can do about it.
        </p>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-stone-500 sm:text-base">
          A collection of faces, memories and words from people who wanted to
          celebrate you today.
        </p>

        <a
          href="#wishes"
          className="mx-auto mt-10 inline-flex items-center gap-2 rounded-full border border-stone-900/10 bg-white/80 px-5 py-3 text-sm font-semibold text-stone-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
        >
          See your birthday wishes
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
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

function VideoMemory({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    void video.play().catch(() => undefined);
  }, []);

  function toggleSound() {
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
    <div className="relative h-full min-h-[205px] overflow-hidden bg-stone-200 sm:min-h-[230px]">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      >
        Your browser does not support video playback.
      </video>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

      <button
        type="button"
        onClick={toggleSound}
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/65"
        aria-label={muted ? "Unmute video" : "Mute video"}
      >
        <SoundIcon muted={muted} />
      </button>
    </div>
  );
}

function MediaPanel({ submission }: { submission: BirthdaySubmission }) {
  if (submission.videoUrl) {
    return <VideoMemory src={submission.videoUrl} />;
  }

  if (submission.photoUrl) {
    return (
      <div className="relative h-full min-h-[205px] overflow-hidden bg-stone-100 sm:min-h-[230px]">
        <Image
          src={submission.photoUrl}
          alt={
            submission.name
              ? `A birthday memory from ${submission.name}`
              : "Birthday memory"
          }
          fill
          sizes="(max-width: 768px) 42vw, 300px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[205px] items-center justify-center bg-gradient-to-br from-amber-100 via-[#fff8eb] to-rose-100 sm:min-h-[230px]">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-900/10 bg-white/75 text-2xl text-amber-700 shadow-sm">
          ♥
        </div>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-800/70">
          With love
        </p>
      </div>
    </div>
  );
}

function WishCard({
  submission,
  index,
}: {
  submission: BirthdaySubmission;
  index: number;
}) {
  const tilt =
    index % 3 === 0
      ? "rotate-[0.28deg]"
      : index % 3 === 1
        ? "-rotate-[0.35deg]"
        : "rotate-[0.12deg]";

  return (
    <div className="relative py-9 sm:py-11">
      <div className="absolute left-1/2 top-0 z-10 h-11 w-px -translate-x-1/2 bg-amber-900/30" />
      <div className="absolute left-1/2 top-7 z-20 h-4 w-4 -translate-x-1/2 rounded-full border-[4px] border-[#fbf7ef] bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.72)]" />

      <article
        className={`relative z-20 mx-auto grid w-[calc(100%-1.25rem)] max-w-[680px] grid-cols-[42%_58%] overflow-hidden rounded-[1.45rem] border border-white/95 bg-[#fffdf8] shadow-[0_24px_64px_-34px_rgba(83,54,24,0.44)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_-34px_rgba(83,54,24,0.52)] ${tilt}`}
      >
        <MediaPanel submission={submission} />

        <div className="relative flex min-h-[205px] flex-col p-4 sm:min-h-[230px] sm:p-5">
          <span className="absolute right-4 top-3 text-sm text-amber-700/55">
            ✦
          </span>

          <p className="pr-6 text-[8px] font-semibold uppercase tracking-[0.25em] text-amber-700 sm:text-[9px]">
            From
          </p>

          <h2 className="mt-1 pr-5 font-serif text-[1.12rem] font-semibold leading-tight tracking-[-0.025em] text-stone-950 sm:text-[1.35rem]">
            {submission.name || "Someone who loves you"}
          </h2>

          <div className="mt-2.5 h-px w-10 bg-amber-600/40" />

          {submission.wish ? (
            <p className="mt-3 whitespace-pre-wrap text-[11px] leading-[1.65] text-stone-600 sm:text-[13px] sm:leading-[1.65]">
              {submission.wish}
            </p>
          ) : (
            <p className="mt-3 font-serif text-[12px] italic leading-5 text-stone-500 sm:text-sm">
              A memory sent with love for your special day.
            </p>
          )}

          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <p className="text-[8px] uppercase tracking-[0.14em] text-stone-400 sm:text-[9px]">
              {displayDate(submission.createdAt)}
            </p>
            <span className="font-serif text-base text-rose-400">♡</span>
          </div>
        </div>
      </article>
    </div>
  );
}

function BirthdayLights() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-10 -translate-x-1/2">
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-amber-800/10 via-amber-900/30 to-amber-800/10" />

      {Array.from({ length: 36 }).map((_, index) => {
        const side = index % 2 === 0 ? "left-[8px]" : "right-[8px]";
        const glow =
          index % 3 === 0
            ? "bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.9)]"
            : index % 3 === 1
              ? "bg-rose-300 shadow-[0_0_14px_rgba(253,164,175,0.76)]"
              : "bg-orange-300 shadow-[0_0_14px_rgba(253,186,116,0.82)]";

        return (
          <span
            key={index}
            className={`absolute h-2.5 w-2.5 rounded-full border-2 border-white/90 ${side} ${glow} ${index % 5 === 0 ? "animate-pulse" : ""}`}
            style={{ top: `${(index / 35) * 100}%` }}
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

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf7ef] text-stone-950">
      <CelebrationHero />

      <section
        id="wishes"
        className="relative mx-auto w-full max-w-6xl px-1 pb-24 pt-8 sm:px-6 sm:pb-32"
      >
        <div className="mx-auto max-w-2xl px-5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-800">
            Your people showed up
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.035em] text-stone-950 sm:text-4xl">
            A string of birthday love
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-500">
            Every light holds a message, a memory, or a face that wanted to
            celebrate you.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="rounded-full border border-stone-900/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-stone-500 shadow-sm">
            {submissions.length} {submissions.length === 1 ? "wish" : "wishes"}
          </span>

          <button
            type="button"
            onClick={() => void load()}
            disabled={refreshing}
            className="rounded-full border border-stone-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-stone-600 shadow-sm transition hover:bg-white disabled:opacity-60"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
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
                className="h-52 animate-pulse rounded-[1.45rem] border border-stone-900/5 bg-white/70 shadow-sm"
              />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="mx-auto mt-14 max-w-md rounded-[2rem] border border-stone-900/10 bg-white/75 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-700">
              ♥
            </div>
            <h3 className="mt-5 font-serif text-2xl font-semibold text-stone-900">
              The string is ready.
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              The birthday wishes will appear here as they arrive.
            </p>
          </div>
        ) : (
          <div className="relative mx-auto mt-8 max-w-4xl pb-14">
            <BirthdayLights />

            {submissions.map((submission, index) => (
              <WishCard
                key={submission._id}
                submission={submission}
                index={index}
              />
            ))}

            <div className="relative z-10 mx-auto mt-4 flex w-fit flex-col items-center rounded-full border border-amber-900/10 bg-white/85 px-5 py-3 text-center shadow-sm backdrop-blur">
              <span className="text-lg text-amber-600">♥</span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                With all our love
              </span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
