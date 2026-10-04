import { BirthdayForm } from "@/app/components/birthday-form";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4ee]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-stone-900/10 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-500">
              Chapel of Transformation
            </p>
            <p className="mt-1 text-sm font-medium text-stone-800">Birthday Book</p>
          </div>
          <span className="rounded-full border border-stone-900/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-stone-600 shadow-sm backdrop-blur">
            05 · 10 · 2026
          </span>
        </header>

        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-16">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-amber-900/10 bg-amber-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
              A birthday surprise
            </span>

            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-stone-950 sm:text-6xl lg:text-7xl">
              Help us celebrate
              <span className="block text-amber-700">Daddy James.</span>
            </h1>

            <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
              Leave a birthday wish, a photo, or a video. We&apos;ll gather
              everything into a private birthday book made especially for him.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {[
                ["A note", "Write your wish"],
                ["A picture", "Share a memory"],
                ["A video", "Say it yourself"],
              ].map(([title, copy]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-stone-900/10 bg-white/55 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-sm font-semibold text-stone-900">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-500">{copy}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 flex items-center gap-2 text-xs leading-5 text-stone-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Your submission is private and will only be shown to Daddy James.
            </p>
          </div>

          <BirthdayForm />
        </section>

        <footer className="border-t border-stone-900/10 pt-5 text-center text-xs text-stone-400">
          Made with love by the COT family.
        </footer>
      </div>
    </main>
  );
}
