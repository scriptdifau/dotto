import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// DELETE /api/admin/operators/[id] — elimina un operatore (solo ADMIN).
// Non è possibile eliminare sé stessi, né l'ultimo amministratore rimasto.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Riservato agli amministratori." }, { status: 403 });
  }

  const { id } = await params;

  if (id === admin.id) {
    return NextResponse.json({ error: "Non puoi eliminare il tuo account." }, { status: 409 });
  }

  const target = await prisma.operator.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Operatore non trovato." }, { status: 404 });
  }

  if (target.role === "ADMIN") {
    const admins = await prisma.operator.count({ where: { role: "ADMIN" } });
    if (admins <= 1) {
      return NextResponse.json(
        { error: "Deve restare almeno un amministratore." },
        { status: 409 }
      );
    }
  }

  await prisma.operator.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
