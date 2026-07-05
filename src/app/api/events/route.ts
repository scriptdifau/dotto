import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/events            -> tutti gli eventi attivi
// GET /api/events?slug=xxx   -> singolo evento
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
