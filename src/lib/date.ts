// Utility per calcoli di data consapevoli del fuso orario italiano.
// Il server gira in UTC, quindi non possiamo usare Date/getDate() locali.

function timeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(date)
    .reduce((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {} as Record<string, string>);

  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return (asUTC - date.getTime()) / 60000;
}

// Istante UTC corrispondente alla mezzanotte di domani nel fuso orario dato
// (default: Europe/Rome). Usato per mostrare solo gli eventi dei giorni
// successivi a oggi, indipendentemente dal fuso del server.
export function startOfTomorrow(timeZone = "Europe/Rome"): Date {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(now)
    .reduce((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {} as Record<string, string>);

  const todayAsUTC = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
  const tomorrowAsUTC = new Date(todayAsUTC + 24 * 60 * 60 * 1000);
  const offset = timeZoneOffsetMinutes(tomorrowAsUTC, timeZone);
  return new Date(tomorrowAsUTC.getTime() - offset * 60000);
}
