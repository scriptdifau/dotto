"use client";

import { useEffect, useState } from "react";
import { formatDateTimeIt } from "@/lib/date";

type EventRow = {
  id: string;
  slug: string;
  name: string;
  location: string;
  startsAt: string;
  endsAt: string | null;
  totalSlots: number;
  description: string;
  active: boolean;
  booked: number;
};

type FormValues = {
  name: string;
  location: string;
  startsAt: string; // datetime-local
  endsAt: string; // datetime-local
  totalSlots: string;
  description: string;
  active: boolean;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ISO (UTC) -> valore per <input type="datetime-local"> in ora locale.
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

// valore datetime-local (ora locale) -> ISO UTC per il server.
function toIso(local: string): string {
  return local ? new Date(local).toISOString() : "";
}

const EMPTY: FormValues = {
  name: "",
  location: "",
  startsAt: "",
  endsAt: "",
  totalSlots: "50",
  description: "",
  active: true,
};

function EventForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: FormValues;
  submitLabel: string;
  onSubmit: (v: FormValues) => Promise<string | null>;
  onCancel?: () => void;
}) {
  const [v, setV] = useState<FormValues>(initial);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FormValues>(k: K, val: FormValues[K]) {
    setV((prev) => ({ ...prev, [k]: val }));
  }

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const err = await onSubmit(v);
    setBusy(false);
    if (err) setError(err);
  }

  return (
    <form onSubmit={handle} className="space-y-3">
      <div>
        <label className="label">Nome evento</label>
        <input className="field" value={v.name} onChange={(e) => set("name", e.target.value)} required placeholder="Festival di Primavera 2026" />
      </div>
      <div>
        <label className="label">Luogo</label>
        <input className="field" value={v.location} onChange={(e) => set("location", e.target.value)} required placeholder="Parco della Musica, Milano" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Inizio</label>
          <input type="datetime-local" className="field" value={v.startsAt} onChange={(e) => set("startsAt", e.target.value)} required />
        </div>
        <div>
          <label className="label">Fine <span className="font-normal text-dotto-ink/50">(facolt.)</span></label>
          <input type="datetime-local" className="field" value={v.endsAt} onChange={(e) => set("endsAt", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Posti bici totali</label>
        <input type="number" min={1} className="field" value={v.totalSlots} onChange={(e) => set("totalSlots", e.target.value)} required />
      </div>
      <div>
        <label className="label">Descrizione <span className="font-normal text-dotto-ink/50">(facolt.)</span></label>
        <textarea className="field min-h-20" value={v.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={v.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4" />
        Attivo (visibile e prenotabile)
      </label>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button type="submit" className="btn-primary flex-1" disabled={busy}>
          {busy ? "Salvataggio…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Annulla
          </button>
        )}
      </div>
    </form>
  );
}

export default function EventManager() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/events");
    if (res.ok) {
      const data = await res.json();
      setEvents(data.events);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(v: FormValues): Promise<string | null> {
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload(v)),
    });
    const data = await res.json();
    if (!res.ok) return data.error || "Errore nella creazione.";
    setCreating(false);
    await load();
    return null;
  }

  async function update(id: string, v: FormValues): Promise<string | null> {
    const res = await fetch(`/api/admin/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload(v)),
    });
    const data = await res.json();
    if (!res.ok) return data.error || "Errore nel salvataggio.";
    setEditingId(null);
    await load();
    return null;
  }

  async function remove(ev: EventRow) {
    if (!confirm(`Eliminare "${ev.name}"? L'operazione è irreversibile.`)) return;
    const res = await fetch(`/api/admin/events/${ev.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Impossibile eliminare.");
      return;
    }
    await load();
  }

  function payload(v: FormValues) {
    return {
      name: v.name,
      location: v.location,
      startsAt: toIso(v.startsAt),
      endsAt: toIso(v.endsAt),
      totalSlots: Number(v.totalSlots),
      description: v.description,
      active: v.active,
    };
  }

  function toForm(e: EventRow): FormValues {
    return {
      name: e.name,
      location: e.location,
      startsAt: toLocalInput(e.startsAt),
      endsAt: toLocalInput(e.endsAt),
      totalSlots: String(e.totalSlots),
      description: e.description,
      active: e.active,
    };
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Eventi</h1>
        {!creating && (
          <button onClick={() => setCreating(true)} className="btn-primary">
            + Nuovo evento
          </button>
        )}
      </div>

      {creating && (
        <div className="mt-4 rounded-card bg-white p-5 shadow-soft">
          <h2 className="mb-3 text-lg font-extrabold">Nuovo evento</h2>
          <EventForm initial={EMPTY} submitLabel="Crea evento" onSubmit={create} onCancel={() => setCreating(false)} />
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-dotto-ink/60">Caricamento…</p>
      ) : (
        <div className="mt-6 space-y-4">
          {events.length === 0 && !creating && (
            <p className="text-dotto-ink/60">Nessun evento. Creane uno con “+ Nuovo evento”.</p>
          )}
          {events.map((e) => (
            <div key={e.id} className="rounded-card bg-white p-5 shadow-soft">
              {editingId === e.id ? (
                <>
                  <h2 className="mb-3 text-lg font-extrabold">Modifica evento</h2>
                  <EventForm
                    initial={toForm(e)}
                    submitLabel="Salva modifiche"
                    onSubmit={(v) => update(e.id, v)}
                    onCancel={() => setEditingId(null)}
                  />
                </>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-lg font-extrabold">{e.name}</h2>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${e.active ? "bg-dotto-blue/15 text-dotto-blue-dark" : "bg-dotto-ink/10 text-dotto-ink/50"}`}>
                        {e.active ? "Attivo" : "Disattivo"}
                      </span>
                    </div>
                    <p className="text-sm text-dotto-ink/60">{e.location}</p>
                    <p className="text-sm text-dotto-ink/60">
                      {formatDateTimeIt(new Date(e.startsAt))}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-dotto-blue">
                      {e.booked}/{e.totalSlots} posti occupati · /{e.slug}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button onClick={() => setEditingId(e.id)} className="rounded-full border-2 border-dotto-ink/15 px-4 py-1.5 text-sm font-semibold hover:border-dotto-ink/40">
                      Modifica
                    </button>
                    <button onClick={() => remove(e)} className="rounded-full px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                      Elimina
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
