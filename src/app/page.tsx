import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import BookingForm from "./components/BookingForm";
import About from "./components/About";
import { LogoMark } from "./components/Illustrations";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />

      <section id="prenota" className="mx-auto max-w-md px-5 py-12">
        <BookingForm />
      </section>

      <About />

      <footer className="mx-auto max-w-md px-5 pb-10 pt-4 text-center">
        <LogoMark className="mx-auto h-7 opacity-80" />
        <p className="mt-3 text-sm text-dotto-ink/60">
          Parcheggio bici gratuito per eventi.
        </p>
        <p className="mt-2 text-xs text-dotto-ink/40">
          © {new Date().getFullYear()} Dottò ·{" "}
          <a href="/admin" className="underline">
            Area operatori
          </a>
        </p>
      </footer>
    </main>
  );
}
