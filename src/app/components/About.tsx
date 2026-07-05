export default function About() {
  return (
    <section id="chi-siamo" className="mx-auto max-w-md px-5 py-12">
      <div className="rounded-card bg-dotto-blue-dark p-7 text-dotto-cream shadow-soft">
        <h2 className="text-3xl font-extrabold text-white">Chi siamo</h2>
        <p className="mt-4 text-dotto-cream/90">
          Dottò nasce da un&apos;idea semplice: andare in bici a un concerto, a una
          fiera o a una festa non dovrebbe voler dire cercare un palo libero e
          sperare di ritrovare la propria bici.
        </p>
        <p className="mt-3 text-dotto-cream/90">
          Siamo un piccolo gruppo di appassionati di bici e di eventi. Portiamo
          il nostro <strong>parcheggio custodito</strong> dove serve, lo
          rendiamo <strong>gratuito</strong> per chi pedala e lo gestiamo con un
          QR code, così non serve nessun documento o modulo cartaceo.
        </p>
        <p className="mt-3 text-dotto-cream/90">
          Più biciclette parcheggiate bene significano più spazio, meno auto e
          città più vivibili. È il nostro piccolo puntino blu — il
          <em> Dottò</em> — nella giornata di chi organizza e di chi partecipa.
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-white/10 p-3">
            <dt className="text-2xl font-extrabold text-dotto-sky">100%</dt>
            <dd className="text-xs text-dotto-cream/80">gratuito</dd>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <dt className="text-2xl font-extrabold text-dotto-sky">1</dt>
            <dd className="text-xs text-dotto-cream/80">QR per tutto</dd>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <dt className="text-2xl font-extrabold text-dotto-sky">0</dt>
            <dd className="text-xs text-dotto-cream/80">pensieri</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
