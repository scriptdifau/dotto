import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Gallery from "./components/Gallery";
import BookingForm from "./components/BookingForm";
import About from "./components/About";
import { LogoMark } from "./components/Illustrations";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Gallery />

      <section id="prenota" className="mx-auto max-w-md px-5 py-12 lg:max-w-5xl lg:py-20">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="mb-8 hidden lg:mb-0 lg:block">
            <h2 className="text-4xl font-extrabold">Pronto a pedalare?</h2>
            <p className="mt-3 text-lg text-dotto-ink/70">
              Prenota in 30 secondi. Nessun pagamento, nessun modulo cartaceo: solo un QR.
            </p>
            <ul className="mt-6 space-y-3 text-dotto-ink/80">
              {[
                "Servizio 100% gratuito",
                "Bici custodita per tutta la durata dell'evento",
                "Stesso QR per lasciare e riprendere la bici",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dotto-blue text-sm text-white">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <BookingForm />
          </div>
        </div>
      </section>

      <About />

      <footer className="mx-auto max-w-6xl px-5 pb-10 pt-4 text-center lg:flex lg:items-center lg:justify-between lg:pt-10 lg:text-left">
        <div className="lg:flex lg:items-center lg:gap-3">
          <LogoMark className="mx-auto h-7 opacity-80 lg:mx-0" />
          <p className="mt-3 text-sm text-dotto-ink/60 lg:mt-0">
            Parcheggio bici gratuito per eventi.
          </p>
        </div>
        <p className="mt-2 text-xs text-dotto-ink/40 lg:mt-0">
          © {new Date().getFullYear()} Dottò ·{" "}
          <a href="/privacy" className="underline">
            Privacy
          </a>{" "}
          ·{" "}
          <a href="/admin" className="underline">
            Area operatori
          </a>
        </p>
      </footer>
    </main>
  );
}
