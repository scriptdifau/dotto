import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, hashPassword } from "@/lib/auth";

// GET /api/admin/operators — elenco operatori (solo ADMIN).
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Riservato agli amministratori." }, { status: 403 });
  }
  const operators = await prisma.operator.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json({ operators });
}

// POST /api/admin/operators — crea un operatore (solo ADMIN).
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Riservato agli amministratori." }, { status: 403 });
  }

  let body: { name?: string; email?: string; password?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  const role = body.role === "ADMIN" ? "ADMIN" : "OPERATOR";

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Nome, email e password obbligatori." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email non valida." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "La password deve avere almeno 6 caratteri." }, { status: 400 });
  }

  const existing = await prisma.operator.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Esiste già un operatore con questa email." }, { status: 409 });
  }

  const operator = await prisma.operator.create({
    data: { name, email, role, passwordHash: await hashPassword(password) },
    select: { id: true },
  });
  return NextResponse.json({ id: operator.id });
}
