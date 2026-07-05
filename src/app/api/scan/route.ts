import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

// POST /api/scan  { token, action? }
// action: "auto" (default) | "checkin" | "checkout"
// Solo operatori autenticati.
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  let body: { token?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  // Accetta sia il token puro sia un URL /booking/<token>.
  let token = (body.token || "").trim();
  const match = token.match(/\/booking\/([^/?#]+)/);
  if (match) token = match[1];

  if (!token) {
    return NextResponse.json({ error: "QR non valido." }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { token },
    include: { event: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Prenotazione non trovata." }, { status: 404 });
  }

  const action = body.action || "auto";
  let newStatus = booking.status;
  const data: Record<string, unknown> = {};

  const wantCheckin = action === "checkin" || (action === "auto" && booking.status === "BOOKED");
  const wantCheckout = action === "checkout" || (action === "auto" && booking.status === "CHECKED_IN");

  if (wantCheckin && booking.status === "BOOKED") {
    newStatus = "CHECKED_IN";
    data.status = newStatus;
    data.checkedInAt = new Date();
  } else if (wantCheckout && booking.status === "CHECKED_IN") {
    newStatus = "CHECKED_OUT";
    data.status = newStatus;
    data.checkedOutAt = new Date();
  } else {
    // Nessuna transizione valida
    const messages: Record<string, string> = {
      CHECKED_OUT: "Bici già riconsegnata.",
      CHECKED_IN: "Bici già in custodia.",
      BOOKED: "Bici non ancora consegnata.",
      CANCELLED: "Prenotazione annullata.",
    };
    return NextResponse.json(
      {
        error: messages[booking.status] || "Operazione non consentita.",
        booking: publicBooking(booking),
      },
      { status: 409 }
    );
  }

  const updated = await prisma.booking.update({ where: { token }, data });

  return NextResponse.json({
    ok: true,
    action: newStatus === "CHECKED_IN" ? "checkin" : "checkout",
    booking: publicBooking({ ...booking, ...updated }),
  });
}

function publicBooking(b: {
  name: string;
  slotNumber: number | null;
  status: string;
  event?: { name: string } | null;
}) {
  return {
    name: b.name,
    slotNumber: b.slotNumber,
    status: b.status,
    eventName: b.event?.name ?? null,
  };
}
