import { LogoMark } from "./Illustrations";

export default function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-dotto-sky/40 blur-2xl" aria-hidden />
      <div className="absolute -left-10 top-40 h-40 w-40 rounded-full bg-dotto-sky/30 blur-2xl" aria-hidden />

      <nav className="mx-auto flex max-w-md items-center justify-between px-5 pt-6">
        <LogoMark className="h-8" />
        <a href="#prenota" className="text-sm font-bold text-dotto-blue">
          Prenota
        </a>
      </nav>

      <div className="mx-auto max-w-md px-5 pb-10 pt-10 text-center">
        <span className="inline-block rounded-full bg-dotto-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-dotto-blue-dark">
          Il primo in Italia 🇮🇹
        </span>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight">
          Lascia la bici.<br />
          <span className="text-dotto-blue">Goditi l&apos;evento.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-lg font-semibold text-dotto-ink">
          Il primo servizio di parcheggio bici <strong className="text-dotto-blue">custodito</strong> per eventi temporanei in Italia.
        </p>
        <p className="mx-auto mt-3 max-w-sm text-dotto-ink/70">
          Prenoti uno slot, mostri il QR e la tua bici è al sicuro. Gratis.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a href="#prenota" className="btn-primary">Prenota il tuo posto</a>
          <a href="#come-funziona" className="btn-ghost">Come funziona</a>
        </div>
      </div>
    </header>
  );
}
