// Utility per formattare date nel fuso orario italiano, indipendentemente
// dal fuso del runtime (server in UTC, browser dell'operatore, ecc.). Gli
// orari degli eventi sono sempre orari locali italiani: vanno mostrati come
// tali a chiunque li legga, ovunque si trovi.

const ROME_TZ = "Europe/Rome";

export function formatDateTimeIt(
  date: Date,
  opts: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" }
): string {
  return date.toLocaleString("it-IT", { ...opts, timeZone: ROME_TZ });
}

export function formatDateIt(
  date: Date,
  opts: Intl.DateTimeFormatOptions = { dateStyle: "long" }
): string {
  return date.toLocaleDateString("it-IT", { ...opts, timeZone: ROME_TZ });
}
