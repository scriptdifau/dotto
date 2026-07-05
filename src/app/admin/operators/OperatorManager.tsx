"use client";

import { useEffect, useState } from "react";

type Operator = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OPERATOR";
  createdAt: string;
};

export default function OperatorManager() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "OPERATOR">("OPERATOR");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/operators");
    if (res.ok) setOperators((await res.json()).operators);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await fetch("/api/admin/operators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    setBusy(false);
    if (res.ok) {
      setName("");
      setEmail("");
      setPassword("");
      setRole("OPERATOR");
      await load();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Errore nella creazione.");
    }
  }

  async function remove(op: Operator) {
    if (!confirm(`Eliminare l'operatore "${op.name}"?`)) return;
    const res = await fetch(`/api/admin/operators/${op.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Impossibile eliminare.");
      return;
    }
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Operatori</h1>
      <p className="mt-1 text-sm text-dotto-ink/60">
        Chi può accedere al pannello. Gli <strong>ADMIN</strong> gestiscono eventi e operatori;
        gli <strong>OPERATOR</strong> usano statistiche e scanner.
      </p>

      <form onSubmit={create} className="mt-5 rounded-card bg-white p-5 shadow-soft">
        <h2 className="mb-3 text-lg font-extrabold">Nuovo operatore</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Nome</label>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Mario Rossi" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="mario@dotto.it" />
          </div>
          <div>
            <label className="label">Password <span className="font-normal text-dotto-ink/50">(min. 6)</span></label>
            <input type="password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div>
            <label className="label">Ruolo</label>
            <select className="field" value={role} onChange={(e) => setRole(e.target.value as "ADMIN" | "OPERATOR")}>
              <option value="OPERATOR">Operatore (scanner)</option>
              <option value="ADMIN">Amministratore</option>
            </select>
          </div>
        </div>
        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
        <button type="submit" className="btn-primary mt-4" disabled={busy}>
          {busy ? "Creazione…" : "Crea operatore"}
        </button>
      </form>

      {loading ? (
        <p className="mt-6 text-dotto-ink/60">Caricamento…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {operators.map((op) => (
            <div key={op.id} className="flex items-center justify-between gap-3 rounded-card bg-white p-4 shadow-soft">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-extrabold">{op.name}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${op.role === "ADMIN" ? "bg-dotto-blue/15 text-dotto-blue-dark" : "bg-dotto-ink/10 text-dotto-ink/60"}`}>
                    {op.role === "ADMIN" ? "Admin" : "Operatore"}
                  </span>
                </div>
                <p className="truncate text-sm text-dotto-ink/60">{op.email}</p>
              </div>
              <button onClick={() => remove(op)} className="shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                Elimina
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
