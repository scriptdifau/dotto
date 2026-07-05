import {
  IlloBook,
  IlloShowQr,
  IlloLock,
  IlloReturn,
  IlloPickup,
} from "./Illustrations";

const steps = [
  {
    n: 1,
    title: "Prenoti il tuo slot",
    text: "Scegli l'evento e riserva un posto per la tua bici. Ci vogliono 30 secondi.",
    Illo: IlloBook,
  },
  {
    n: 2,
    title: "Mostri il QR all'arrivo",
    text: "Arrivi in bici e mostri il tuo QR code al parcheggiatore Dottò.",
    Illo: IlloShowQr,
  },
  {
    n: 3,
    title: "La tua bici è legata",
    text: "Il parcheggiatore lega e prende in custodia la bici. Tu sei libero di entrare.",
    Illo: IlloLock,
  },
  {
    n: 4,
    title: "Ti godi l'evento",
    text: "Nessun pensiero: la bici resta custodita per tutta la durata dell'evento.",
    Illo: IlloReturn,
  },
  {
    n: 5,
    title: "Rimostri il QR e riparti",
    text: "Al ritorno mostri di nuovo lo stesso QR e riprendi la tua bici. Fine!",
    Illo: IlloPickup,
  },
];

export default function HowItWorks() {
  return (
    <section id="come-funziona" className="mx-auto max-w-md px-5 py-12">
      <h2 className="text-center text-3xl font-extrabold">Come funziona</h2>
      <p className="mx-auto mt-2 max-w-sm text-center text-dotto-ink/70">
        Cinque passi, un solo QR code. Semplice come andare in bici.
      </p>

      <ol className="mt-8 space-y-6">
        {steps.map(({ n, title, text, Illo }, i) => (
          <li key={n} className="relative">
            <div className="flex items-center gap-4 rounded-card bg-white p-4 shadow-soft">
              <div className="shrink-0">
                <Illo className="h-24 w-24" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dotto-blue text-sm font-bold text-white">
                    {n}
                  </span>
                  <h3 className="text-lg font-extrabold">{title}</h3>
                </div>
                <p className="mt-1 text-sm text-dotto-ink/70">{text}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="ml-8 h-6 w-0.5 bg-dotto-ink/10" aria-hidden />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
