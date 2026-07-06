export default function About() {
  return (
    <section id="chi-siamo" className="mx-auto max-w-md px-5 py-12 lg:max-w-5xl lg:py-20">
      <div className="rounded-card bg-dotto-blue-dark p-7 text-dotto-cream shadow-soft lg:p-12">
        <div className="lg:grid lg:grid-cols-[1.6fr_1fr] lg:items-center lg:gap-12">
          <div>
            <h2 className="text-3xl font-extrabold text-white lg:text-4xl">Chi siamo</h2>
            <p className="mt-4 text-dotto-cream/90 lg:text-lg">
              Dottò nasce da un&apos;idea semplice: andare in bici a un concerto, a una
              fiera o a una festa non dovrebbe voler dire cercare un palo libero e
              sperare di ritrovare la propria bici.
            </p>
            <p className="mt-3 text-dotto-cream/90 lg:text-lg">
              Siamo un piccolo gruppo di appassionati di bici e di eventi. Portiamo
              il nostro <strong>parcheggio custodito</strong> dove serve, lo
              rendiamo <strong>gratuito</strong> per chi pedala e lo gestiamo con un
              QR code, così non serve nessun documento o modulo cartaceo.
            </p>
            <p className="mt-3 text-dotto-cream/90 lg:text-lg">
              Più biciclette parcheggiate bene significano più spazio, meno auto e
              città più vivibili. È il nostro piccolo puntino blu — il
              <em> Dottò</em> — nella giornata di chi organizza e di chi partecipa.
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3 text-center lg:mt-0 lg:grid-cols-1 lg:gap-4">
            <div className="rounded-2xl bg-white/10 p-3 lg:p-5">
              <dt className="text-2xl font-extrabold text-dotto-sky lg:text-4xl">100%</dt>
              <dd className="text-xs text-dotto-cream/80 lg:text-sm">gratuito</dd>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 lg:p-5">
              <dt className="text-2xl font-extrabold text-dotto-sky lg:text-4xl">1</dt>
              <dd className="text-xs text-dotto-cream/80 lg:text-sm">QR per tutto</dd>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 lg:p-5">
              <dt className="text-2xl font-extrabold text-dotto-sky lg:text-4xl">0</dt>
              <dd className="text-xs text-dotto-cream/80 lg:text-sm">pensieri</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
