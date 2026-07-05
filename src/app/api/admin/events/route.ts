import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { uniqueEventSlug } from "@/lib/slug";
import { parseEventInput } from "@/lib/event";

// GET /api/admin/events — tutti gli eventi (con conteggi), solo operatori.
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    orderBy: { startsAt: "desc" },
    include: {
      bookings: { select: { status: true } },
    },
  });

  const data = events.map((e) => {
    const active = e.bookings.filter((b) => ["BOOKED", "CHECKED_IN"].includes(b.status)).length;
    return {
      id: e.id,
      slug: e.slug,
      name: e.name,
      location: e.location,
      startsAt: e.startsAt.toISOString(),
      endsAt: e.endsAt ? e.endsAt.toISOString() : null,
      totalSlots: e.totalSlots,
      description: e.description ?? "",
      active: e.active,
      booked: active,
    };
  });

  return NextResponse.json({ events: data });
}

// POST /api/admin/events — crea un evento.
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const parsed = parseEventInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const slug = await uniqueEventSlug(parsed.name);
  const event = await prisma.event.create({
    data: {
      slug,
      name: parsed.name,
      location: parsed.location,
      startsAt: parsed.startsAt,
      endsAt: parsed.endsAt,
      totalSlots: parsed.totalSlots,
      description: parsed.description,
      active: parsed.active,
    },
  });

  return NextResponse.json({ id: event.id, slug: event.slug });
}
