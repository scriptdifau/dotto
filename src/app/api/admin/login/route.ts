import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import type { Role } from "@/lib/session";

// POST /api/admin/login  { email, password }
export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email e password obbligatorie." }, { status: 400 });
  }

  const operator = await prisma.operator.findUnique({ where: { email } });
  if (!operator || !(await verifyPassword(password, operator.passwordHash))) {
    return NextResponse.json({ error: "Credenziali non valide." }, { status: 401 });
  }

  await setSessionCookie({
    id: operator.id,
    name: operator.name,
    role: operator.role as Role,
  });

  return NextResponse.json({ ok: true, name: operator.name, role: operator.role });
}
