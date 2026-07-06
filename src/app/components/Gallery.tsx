const photos = [
  { src: "/foto/g1.jpg", alt: "Biciclette parcheggiate sulle rastrelliere Dottò a un evento all'aperto" },
  { src: "/foto/g2.jpg", alt: "Area di parcheggio bici Dottò con segnaletica dedicata" },
  { src: "/foto/g3.jpg", alt: "Viale alberato con le biciclette custodite dal servizio Dottò" },
  { src: "/foto/g4.jpg", alt: "Il parcheggio bici Dottò al tramonto durante un evento" },
];

export default function Gallery() {
  return (
    <section className="mx-auto max-w-md px-5 py-12 lg:max-w-6xl lg:py-16">
      <h2 className="text-center text-3xl font-extrabold lg:text-4xl">Dottò in azione</h2>
      <p className="mx-auto mt-2 max-w-sm text-center text-dotto-ink/70 lg:max-w-xl lg:text-lg">
        Rastrelliere mobili, area dedicata e valletti: il servizio dal vivo agli eventi.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:mt-12 lg:grid-cols-4 lg:gap-4">
        {photos.map((p) => (
          <div key={p.src} className="overflow-hidden rounded-2xl shadow-soft ring-1 ring-dotto-ink/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              className="aspect-[4/3] h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
