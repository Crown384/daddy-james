import { BirthdayForm } from "@/app/components/birthday-form";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4ee]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-12">
        <header className="border-b border-stone-900/10 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-500">
            Chapel of Transformation
          </p>
        </header>

        <section className="flex flex-1 flex-col gap-10 py-10 sm:py-14 lg:grid lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-20 lg:py-16">
          <div className="max-w-xl">
            <h1 className="text-balance text-[3.25rem] font-semibold leading-[0.94] tracking-[-0.055em] text-stone-950 sm:text-6xl lg:text-7xl">
              Join us in celebrating
              <span className="block text-amber-700">Daddy James.</span>
            </h1>

            <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
              We&apos;re putting together a private collection of birthday
              messages, photos and videos from the COT family — something
              special for him to look back on and enjoy.
            </p>

            <p className="mt-5 max-w-lg text-base font-semibold leading-7 text-stone-900 sm:text-lg">
              Add yours and be part of the celebration.
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
