const values = [
  { icon: "🤝", title: "Sociale", text: "Gestito dai valletti di una cooperativa sociale." },
  { icon: "🌱", title: "Sostenibile", text: "Mobilità ecologica, a zero emissioni." },
  { icon: "🆓", title: "Gratuito", text: "Nessun costo per chi arriva in bici." },
  { icon: "🔒", title: "Sicuro", text: "Bici custodite e sorvegliate: basta furti." },
  { icon: "✨", title: "Innovativo", text: "Prenoti online e usi un semplice QR." },
];

export default function Values() {
  return (
    <section className="mx-auto max-w-md px-5 py-12 lg:max-w-6xl lg:py-16">
      <h2 className="text-center text-3xl font-extrabold lg:text-4xl">Perché Dottò</h2>
      <p className="mx-auto mt-2 max-w-sm text-center text-dotto-ink/70 lg:max-w-xl lg:text-lg">
        Un servizio che fa bene alla bici, alla città e alle persone.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-5 lg:gap-4">
        {values.map((v) => (
          <div key={v.title} className="flex items-center gap-4 rounded-card bg-white p-4 shadow-soft lg:flex-col lg:items-center lg:gap-2 lg:p-5 lg:text-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-dotto-sky/40 text-2xl">
              {v.icon}
            </div>
            <div>
              <h3 className="font-extrabold">{v.title}</h3>
              <p className="mt-0.5 text-sm text-dotto-ink/70">{v.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
