"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { BirthdaySubmission } from "@/lib/types";

function displayDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
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
    <main className="min-h-screen bg-[#16120f] text-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-12">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
              Just for you
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Happy Birthday, Daddy James.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-400 sm:text-base">
              Messages, memories and videos from your COT family — gathered in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-300">
              {submissions.length} {submissions.length === 1 ? "message" : "messages"}
            </span>
            <button
              type="button"
              onClick={() => void load()}
              disabled={refreshing}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-200 disabled:opacity-60"
            >
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </header>

        {error ? (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-5 py-10 md:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5"
              />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <section className="flex min-h-[55vh] items-center justify-center py-12 text-center">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-300 text-2xl text-stone-950">
                ♥
              </div>
              <h2 className="mt-5 text-2xl font-semibold">Your birthday book is ready.</h2>
              <p className="mt-2 text-sm leading-6 text-stone-400">
                Messages will appear here as members send them.
              </p>
            </div>
          </section>
        ) : (
          <section className="columns-1 gap-5 py-8 md:columns-2">
            {submissions.map((submission) => (
              <article
                key={submission._id}
                className="mb-5 break-inside-avoid overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20"
              >
                {submission.photoUrl ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
                    <Image
                      src={submission.photoUrl}
                      alt={submission.name ? `A memory from ${submission.name}` : "Birthday memory"}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {submission.name || "With love, anonymously"}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        {displayDate(submission.createdAt)}
                      </p>
                    </div>
                    <span className="text-amber-300">♥</span>
                  </div>

                  {submission.wish ? (
                    <p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-stone-200">
                      {submission.wish}
                    </p>
                  ) : null}

                  {submission.videoUrl ? (
                    <video
                      className="mt-5 w-full rounded-2xl bg-black"
                      controls
                      preload="metadata"
                      playsInline
                      src={submission.videoUrl}
                    >
                      Your browser does not support video playback.
                    </video>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
