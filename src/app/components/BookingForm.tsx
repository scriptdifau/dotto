"use client";

import { useEffect, useState } from "react";
import { formatDateTimeIt } from "@/lib/date";

type EventLite = {
  slug: string;
  name: string;
  location: string;
  startsAt: string;
  slotsLeft: number;
  totalSlots: number;
};

type Props = {
  /** Se impostato, il form è bloccato su questo evento (usato nell'embed). */
  eventSlug?: string;
  /** Stile compatto per l'embed. */
  embedded?: boolean;
};

type Result = {
  token: string;
  slotNumber: number | null;
  eventName: string;
  bookingUrl: string;
};

export default function BookingForm({ eventSlug, embedded }: Props) {
  const [events, setEvents] = useState<EventLite[]>([]);
  const [selected, setSelected] = useState<string>(eventSlug ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [azienda, setAzienda] = useState(""); // honeypot anti-bot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const url = eventSlug ? `/api/events?slug=${encodeURIComponent(eventSlug)}` : "/api/events";
    fetch(url)
      .then((r) => r.json())
      .then((data: { events: EventLite[] }) => {
        setEvents(data.events);
        if (eventSlug && data.events[0]) setSelected(data.events[0].slug);
        else if (!eventSlug && data.events[0]) setSelected(data.events[0].slug);
      })
      .catch(() => setError("Impossibile caricare gli eventi."));
  }, [eventSlug]);

  const current = events.find((e) => e.slug === selected);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventSlug: selected, name, email, phone, privacy, marketing, azienda }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore nella prenotazione.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-card bg-white p-6 text-center shadow-soft">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-dotto-blue text-2xl text-white">
          ✓
        </div>
        <h3 className="text-xl font-extrabold">Prenotazione confermata!</h3>
        <p className="mt-1 text-dotto-ink/70">
          {result.eventName}
          {result.slotNumber ? ` · slot #${result.slotNumber}` : ""}
        </p>
        <p className="mt-4 text-sm text-dotto-ink/70">
          Apri il tuo QR e mostralo al parcheggiatore all&apos;arrivo (e al ritorno).
        </p>
        <a
          href={result.bookingUrl}
          target={embedded ? "_blank" : undefined}
          rel="noreferrer"
          className="btn-primary mt-4 w-full"
        >
          Apri il mio QR code
        </a>
        <button
          onClick={() => {
            setResult(null);
            setName("");
            setEmail("");
            setPhone("");
            setPrivacy(false);
            setMarketing(false);
          }}
          className="mt-3 text-sm font-semibold text-dotto-blue underline"
        >
          Fai un&apos;altra prenotazione
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-card bg-white p-6 shadow-soft">
      {!embedded && (
        <h3 className="mb-4 text-2xl font-extrabold">Prenota il tuo posto bici</h3>
      )}

      {!eventSlug && (
        <div className="mb-4">
          <label className="label">Evento</label>
          {events.length === 0 ? (
            <p className="rounded-2xl bg-dotto-cream px-4 py-3 text-sm text-dotto-ink/60">
              Nessun evento disponibile al momento.
            </p>
          ) : (
            <div className="space-y-2">
              {events.map((e) => {
                const isSelected = e.slug === selected;
                const soldOut = e.slotsLeft <= 0;
                return (
                  <button
                    type="button"
                    key={e.slug}
                    onClick={() => !soldOut && setSelected(e.slug)}
                    disabled={soldOut}
                    aria-pressed={isSelected}
                    className={`w-full rounded-2xl border-2 px-4 py-3 text-left transition ${
                      isSelected ? "border-dotto-blue bg-dotto-blue/5" : "border-dotto-ink/10 bg-white"
                    } ${soldOut ? "cursor-not-allowed opacity-50" : "hover:border-dotto-blue/50"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{e.name}</div>
                        <div className="text-sm text-dotto-ink/60">{e.location}</div>
                        <div className="text-sm text-dotto-ink/60">{formatDateTimeIt(new Date(e.startsAt))}</div>
                      </div>
                      <span
                        className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold ${
                          soldOut ? "bg-dotto-ink/10 text-dotto-ink/50" : "bg-dotto-blue/10 text-dotto-blue"
                        }`}
                      >
                        {soldOut ? "Esaurito" : `${e.slotsLeft}/${e.totalSlots} posti`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {eventSlug && current && (
        <div className="mb-4 rounded-2xl bg-dotto-cream px-4 py-3 text-sm">
          <div className="font-semibold">{current.name}</div>
          <div className="text-dotto-ink/70">{current.location}</div>
          <div className="mt-1 font-semibold text-dotto-blue">
            {current.slotsLeft > 0
              ? `${current.slotsLeft} posti disponibili su ${current.totalSlots}`
              : "Posti esauriti"}
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="label" htmlFor="name">Nome e cognome</label>
        <input id="name" className="field" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Mario Rossi" />
      </div>
      <div className="mb-4">
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="mario@email.it" />
      </div>
      <div className="mb-4">
        <label className="label" htmlFor="phone">Telefono <span className="font-normal text-dotto-ink/50">(facoltativo)</span></label>
        <input id="phone" className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 333 1234567" />
      </div>

      {/* Honeypot anti-bot: nascosto agli utenti, i bot lo compilano. */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden" style={{ opacity: 0 }}>
        <label>
          Azienda (non compilare)
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={azienda}
            onChange={(e) => setAzienda(e.target.value)}
          />
        </label>
      </div>

      <label className="mb-4 flex items-start gap-2 text-sm text-dotto-ink/80">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0"
          checked={privacy}
          onChange={(e) => setPrivacy(e.target.checked)}
          required
        />
        <span>
          Ho letto e accetto l&apos;
          <a href="/privacy" target="_blank" rel="noreferrer" className="font-semibold text-dotto-blue underline">
            informativa privacy
          </a>
          .
        </span>
      </label>

      <label className="mb-4 flex items-start gap-2 text-sm text-dotto-ink/70">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0"
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
        />
        <span>
          Vorrei essere ricontattato/a per iniziative simili di Dottò.{" "}
          <span className="text-dotto-ink/50">(facoltativo)</span>
        </span>
      </label>

      {error && <p className="mb-3 text-sm font-semibold text-red-600">{error}</p>}

      <button type="submit" className="btn-primary w-full" disabled={loading || !current || current.slotsLeft <= 0 || !privacy}>
        {loading ? "Prenotazione…" : "Prenota gratis"}
      </button>
      <p className="mt-3 text-center text-xs text-dotto-ink/50">
        Servizio gratuito · Nessun pagamento richiesto
      </p>
    </form>
  );
}
