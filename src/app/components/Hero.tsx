import { LogoMark, IlloShowQr, IlloLock, BikeBadge } from "./Illustrations";

export default function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-dotto-sky/40 blur-2xl lg:h-[28rem] lg:w-[28rem]" aria-hidden />
      <div className="absolute -left-10 top-40 h-40 w-40 rounded-full bg-dotto-sky/30 blur-2xl lg:h-72 lg:w-72" aria-hidden />

      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-5 pt-6">
        <LogoMark className="h-8" />
        <div className="flex items-center gap-6">
          <div className="hidden gap-6 text-sm font-semibold text-dotto-ink/70 md:flex">
            <a href="#come-funziona" className="transition hover:text-dotto-ink">Come funziona</a>
            <a href="#chi-siamo" className="transition hover:text-dotto-ink">Chi siamo</a>
          </div>
          <a href="#prenota" className="rounded-full bg-dotto-blue px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-dotto-blue-dark">
            Prenota
          </a>
        </div>
      </nav>

      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <span className="inline-block rounded-full bg-dotto-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-dotto-blue-dark">
            Il primo in Italia 🇮🇹
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight lg:text-6xl">
            Lascia la bici.<br />
            <span className="text-dotto-blue">Goditi l&apos;evento.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-lg font-semibold text-dotto-ink lg:mx-0 lg:max-w-lg lg:text-xl">
            Il primo servizio di parcheggio bici <strong className="text-dotto-blue">custodito</strong> per eventi temporanei in Italia.
          </p>
          <p className="mx-auto mt-3 max-w-sm text-dotto-ink/70 lg:mx-0 lg:max-w-md lg:text-lg">
            Prenoti uno slot, mostri il QR e la tua bici è al sicuro. Gratis.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a href="#prenota" className="btn-primary">Prenota il tuo posto</a>
            <a href="#come-funziona" className="btn-ghost">Come funziona</a>
          </div>
        </div>

        {/* Scena illustrata: solo desktop, per non appesantire il mobile */}
        <div className="hidden lg:block">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-dotto-blue to-dotto-blue-dark shadow-soft" />
            <div className="absolute inset-6 flex items-center justify-center rounded-[2rem] bg-white/95">
              <IlloShowQr className="h-56 w-56" />
            </div>
            <div className="absolute -right-5 -top-5 rounded-3xl bg-white p-2 shadow-soft">
              <BikeBadge className="h-20 w-20" />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-3xl bg-white p-3 shadow-soft">
              <IlloLock className="h-20 w-20" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
