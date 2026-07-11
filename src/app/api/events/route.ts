import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Il modulo generale nasconde un evento questo numero di ore dopo la sua fine.
const HOURS_VISIBLE_AFTER_END = 2;

// GET /api/events            -> eventi attivi non ancora conclusi da oltre 2h
// GET /api/events?slug=xxx   -> singolo evento (indipendentemente dalla data,
//                                per non rompere gli embed già condivisi)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const events = await prisma.event.findMany({
    where: {
      active: true,
      ...(slug ? { slug } : {}),
    },
    orderBy: { startsAt: "asc" },
    include: {
      _count: {
        select: {
          bookings: { where: { status: { in: ["BOOKED", "CHECKED_IN"] } } },
        },
      },
    },
  });

  const now = Date.now();
  const visible = events.filter((e) => {
    if (slug) return true; // richiesta di un evento specifico: sempre visibile
    // La "fine" è obbligatoria dal form, ma eventi creati in precedenza
    // potrebbero non averla: in quel caso stimiamo 2h dalla partenza.
    const end = e.endsAt ?? new Date(e.startsAt.getTime() + 2 * 60 * 60 * 1000);
    const hideAt = end.getTime() + HOURS_VISIBLE_AFTER_END * 60 * 60 * 1000;
    return now < hideAt;
  });

  const data = visible.map((e) => ({
    slug: e.slug,
    name: e.name,
    location: e.location,
    startsAt: e.startsAt.toISOString(),
    totalSlots: e.totalSlots,
    slotsLeft: Math.max(0, e.totalSlots - e._count.bookings),
  }));

  return NextResponse.json({ events: data });
}
