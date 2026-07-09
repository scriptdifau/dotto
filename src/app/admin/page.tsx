import { prisma } from "@/lib/db";
import { baseUrl } from "@/lib/qr";
import AdminNav from "./components/AdminNav";

export const dynamic = "force-dynamic";

function Stat({ label, value, tone }: { label: string; value: number | string; tone?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <div className={`text-3xl font-extrabold ${tone ?? "text-dotto-ink"}`}>{value}</div>
      <div className="text-xs font-semibold text-dotto-ink/60">{label}</div>
    </div>
  );
}

const STATUS: Record<string, { label: string; className: string }> = {
  BOOKED: { label: "Prenotata", className: "bg-dotto-sky/50 text-dotto-ink" },
  CHECKED_IN: { label: "In custodia", className: "bg-dotto-blue/15 text-dotto-blue-dark" },
  CHECKED_OUT: { label: "Riconsegnata", className: "bg-dotto-ink/10 text-dotto-ink/60" },
  CANCELLED: { label: "Annullata", className: "bg-red-100 text-red-700" },
};

export default async function AdminDashboard() {
  const events = await prisma.event.findMany({
    orderBy: { startsAt: "desc" },
    include: {
      bookings: {
        orderBy: [{ slotNumber: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          slotNumber: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  const all = events.flatMap((e) => e.bookings);
  const totals = {
    bookings: all.length,
    inCustody: all.filter((b) => b.status === "CHECKED_IN").length,
    returned: all.filter((b) => b.status === "CHECKED_OUT").length,
    pending: all.filter((b) => b.status === "BOOKED").length,
  };

  const base = baseUrl();

  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-extrabold">Statistiche</h1>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Prenotazioni totali" value={totals.bookings} />
          <Stat label="Bici in custodia ora" value={totals.inCustody} tone="text-dotto-blue" />
          <Stat label="Da consegnare" value={totals.pending} tone="text-dotto-ink/70" />
          <Stat label="Riconsegnate" value={totals.returned} tone="text-dotto-ink/50" />
        </div>

        <h2 className="mt-8 text-lg font-extrabold">Eventi</h2>
        <div className="mt-3 space-y-4">
          {events.map((e) => {
            const active = e.bookings.filter((b) => ["BOOKED", "CHECKED_IN"].includes(b.status)).length;
            const inCustody = e.bookings.filter((b) => b.status === "CHECKED_IN").length;
            const returned = e.bookings.filter((b) => b.status === "CHECKED_OUT").length;
            const pct = e.totalSlots ? Math.round((active / e.totalSlots) * 100) : 0;
            const embedUrl = `${base}/embed/${e.slug}`;
            return (
              <div key={e.id} className="rounded-card bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-extrabold">{e.name}</h3>
                    <p className="text-sm text-dotto-ink/60">{e.location}</p>
                    <p className="text-sm text-dotto-ink/60">
                      {e.startsAt.toLocaleString("it-IT", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${e.active ? "bg-dotto-blue/15 text-dotto-blue-dark" : "bg-dotto-ink/10 text-dotto-ink/50"}`}>
                    {e.active ? "Attivo" : "Chiuso"}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold text-dotto-ink/60">
                    <span>Occupazione</span>
                    <span>{active}/{e.totalSlots} ({pct}%)</span>
                  </div>
                  <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-dotto-ink/10">
                    <div className="h-full rounded-full bg-dotto-blue" style={{ width: `${Math.min(100, pct)}%` }} />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-xl bg-dotto-cream py-2">
                    <div className="font-extrabold text-dotto-blue">{inCustody}</div>
                    <div className="text-xs text-dotto-ink/60">in custodia</div>
                  </div>
                  <div className="rounded-xl bg-dotto-cream py-2">
                    <div className="font-extrabold">{active - inCustody}</div>
                    <div className="text-xs text-dotto-ink/60">attese</div>
                  </div>
                  <div className="rounded-xl bg-dotto-cream py-2">
                    <div className="font-extrabold text-dotto-ink/50">{returned}</div>
                    <div className="text-xs text-dotto-ink/60">riconsegnate</div>
                  </div>
                </div>

                <details className="mt-4 text-sm" open>
                  <summary className="cursor-pointer font-semibold text-dotto-blue">
                    Prenotati ({e.bookings.length})
                  </summary>
                  {e.bookings.length === 0 ? (
                    <p className="mt-2 text-xs text-dotto-ink/50">Ancora nessuna prenotazione.</p>
                  ) : (
                    <div className="mt-2 overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="text-xs uppercase text-dotto-ink/50">
                            <th className="py-1 pr-2 font-semibold">Slot</th>
                            <th className="py-1 pr-2 font-semibold">Nome</th>
                            <th className="py-1 pr-2 font-semibold">Stato</th>
                            <th className="py-1 font-semibold">Contatto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {e.bookings.map((b) => {
                            const st = STATUS[b.status] ?? STATUS.BOOKED;
                            return (
                              <tr key={b.id} className="border-t border-dotto-ink/5 align-top">
                                <td className="py-2 pr-2 font-semibold text-dotto-ink/70">
                                  {b.slotNumber ? `#${b.slotNumber}` : "—"}
                                </td>
                                <td className="py-2 pr-2 font-semibold">{b.name}</td>
                                <td className="py-2 pr-2">
                                  <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold ${st.className}`}>
                                    {st.label}
                                  </span>
                                </td>
                                <td className="py-2 text-xs text-dotto-ink/60">
                                  {b.email && (
                                    <a href={`mailto:${b.email}`} className="underline">{b.email}</a>
                                  )}
                                  {b.phone && <div>{b.phone}</div>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </details>

                <details className="mt-4 text-sm">
                  <summary className="cursor-pointer font-semibold text-dotto-blue">
                    Codice per incorporare il form
                  </summary>
                  <div className="mt-2 space-y-2">
                    <p className="text-xs text-dotto-ink/60">
                      Incolla questo codice nel sito dell&apos;evento:
                    </p>
                    <pre className="overflow-x-auto rounded-xl bg-dotto-ink p-3 text-xs text-dotto-cream">
{`<iframe src="${embedUrl}"
  width="100%" height="620"
  style="border:0;max-width:440px"
  loading="lazy"></iframe>`}
                    </pre>
                    <a href={`/embed/${e.slug}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-dotto-blue underline">
                      Anteprima embed →
                    </a>
                  </div>
                </details>
              </div>
            );
          })}
          {events.length === 0 && (
            <p className="text-dotto-ink/60">Nessun evento. Aggiungine uno dal seed o dal database.</p>
          )}
        </div>
      </main>
    </div>
  );
}
