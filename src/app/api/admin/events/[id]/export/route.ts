import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

const STATUS_IT: Record<string, string> = {
  BOOKED: "Prenotata",
  CHECKED_IN: "In custodia",
  CHECKED_OUT: "Riconsegnata",
  CANCELLED: "Annullata",
};

// Escape di un campo CSV (delimitatore ';', per Excel italiano).
function cell(value: string | number | null | undefined): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

function fmt(d: Date | null): string {
  return d ? d.toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" }) : "";
}

// GET /api/admin/events/[id]/export — CSV dei prenotati (apribile in Excel).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return new Response("Non autorizzato.", { status: 401 });
  }

  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      bookings: { orderBy: [{ slotNumber: "asc" }, { createdAt: "asc" }] },
    },
  });
  if (!event) {
    return new Response("Evento non trovato.", { status: 404 });
  }

  const header = [
    "Slot",
    "Nome",
    "Email",
    "Telefono",
    "Stato",
    "Prenotata il",
    "Consegnata il",
    "Riconsegnata il",
  ];

  const rows = event.bookings.map((b) =>
    [
      cell(b.slotNumber ?? ""),
      cell(b.name),
      cell(b.email),
      cell(b.phone ?? ""),
      cell(STATUS_IT[b.status] ?? b.status),
      cell(fmt(b.createdAt)),
      cell(fmt(b.checkedInAt)),
      cell(fmt(b.checkedOutAt)),
    ].join(";")
  );

  // BOM UTF-8 così Excel legge correttamente gli accenti.
  const csv = "﻿" + [header.map(cell).join(";"), ...rows].join("\r\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="prenotati-${event.slug}.csv"`,
    },
  });
}
