import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// GET /api/admin/me — sessione corrente (per la UI).
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }
  return NextResponse.json(session);
}
