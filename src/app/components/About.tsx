export default function About() {
  return (
    <section id="chi-siamo" className="mx-auto max-w-md px-5 py-12 lg:max-w-5xl lg:py-20">
      <div className="rounded-card bg-dotto-blue-dark p-7 text-dotto-cream shadow-soft lg:p-12">
        <div className="lg:grid lg:grid-cols-[1.6fr_1fr] lg:items-center lg:gap-12">
          <div>
            <h2 className="text-3xl font-extrabold text-white lg:text-4xl">Chi siamo</h2>
            <p className="mt-4 text-dotto-cream/90 lg:text-lg">
              Dottò è un progetto dell&apos;<strong>Associazione Scintilla cicloprogetti APS</strong>:
              portiamo il parcheggio bici <strong>custodito</strong> dove prima non c&apos;era —
              a concerti, festival, mostre e fiere.
            </p>
            <p className="mt-3 text-dotto-cream/90 lg:text-lg">
              Il servizio è affidato ai <strong>valletti di una cooperativa sociale</strong>:
              accolgono la tua bici, la sistemano sulle <strong>rastrelliere mobili</strong>{" "}
              (fino a 12 bici ciascuna) in un&apos;area dedicata e sorvegliata, e te la
              riconsegnano. Tutto <strong>gratuito</strong> e a zero emissioni.
            </p>
            <p className="mt-3 text-dotto-cream/90 lg:text-lg">
              A seconda dell&apos;evento offriamo la formula <strong>Valet</strong> — prendiamo
              noi in custodia la bici — o <strong>Half-Valet</strong>, dove la leghi tu alle
              rastrelliere. In entrambi i casi tu pedali, al resto pensiamo noi.
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3 text-center lg:mt-0 lg:grid-cols-1 lg:gap-4">
            <div className="rounded-2xl bg-white/10 p-3 lg:p-5">
              <dt className="text-2xl font-extrabold text-dotto-sky lg:text-4xl">100%</dt>
              <dd className="text-xs text-dotto-cream/80 lg:text-sm">gratuito</dd>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 lg:p-5">
              <dt className="text-2xl font-extrabold text-dotto-sky lg:text-4xl">0</dt>
              <dd className="text-xs text-dotto-cream/80 lg:text-sm">emissioni</dd>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 lg:p-5">
              <dt className="text-2xl font-extrabold text-dotto-sky lg:text-4xl">12</dt>
              <dd className="text-xs text-dotto-cream/80 lg:text-sm">bici per rastrelliera</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
