// Validazione condivisa dell'input evento (usata da create e update).

export type ParsedEvent = {
  name: string;
  location: string;
  startsAt: Date;
  endsAt: Date | null;
  totalSlots: number;
  description: string | null;
  active: boolean;
};

export function parseEventInput(
  body: Record<string, unknown>
): ParsedEvent | { error: string } {
  const name = String(body.name ?? "").trim();
  const location = String(body.location ?? "").trim();
  const startsAtRaw = String(body.startsAt ?? "").trim();
  const endsAtRaw = String(body.endsAt ?? "").trim();
  const totalSlots = Number(body.totalSlots);
  const description = String(body.description ?? "").trim();
  const active = body.active === undefined ? true : Boolean(body.active);

  if (!name) return { error: "Il nome dell'evento è obbligatorio." };
  if (!location) return { error: "Il luogo è obbligatorio." };
  if (!startsAtRaw) return { error: "La data di inizio è obbligatoria." };

  const startsAt = new Date(startsAtRaw);
  if (isNaN(startsAt.getTime())) return { error: "Data di inizio non valida." };

  let endsAt: Date | null = null;
  if (endsAtRaw) {
    endsAt = new Date(endsAtRaw);
    if (isNaN(endsAt.getTime())) return { error: "Data di fine non valida." };
    if (endsAt < startsAt) return { error: "La fine non può precedere l'inizio." };
  }

  if (!Number.isInteger(totalSlots) || totalSlots < 1 || totalSlots > 100000) {
    return { error: "Numero di posti non valido." };
  }

  return {
    name,
    location,
    startsAt,
    endsAt,
    totalSlots,
    description: description || null,
    active,
  };
}
