import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startOfTomorrow } from "@/lib/date";

// GET /api/events            -> eventi futuri attivi (da domani in poi)
// GET /api/events?slug=xxx   -> singolo evento (indipendentemente dalla data,
//                                per non rompere gli embed già condivisi)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const events = await prisma.event.findMany({
    where: {
      active: true,
      ...(slug ? { slug } : { startsAt: { gte: startOfTomorrow() } }),
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

  const data = events.map((e) => ({
    slug: e.slug,
    name: e.name,
    location: e.location,
    startsAt: e.startsAt.toISOString(),
    totalSlots: e.totalSlots,
    slotsLeft: Math.max(0, e.totalSlots - e._count.bookings),
  }));

  return NextResponse.json({ events: data });
}
