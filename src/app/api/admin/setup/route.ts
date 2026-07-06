import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

// GET /api/admin/setup
// Crea l'amministratore iniziale usando ADMIN_EMAIL / ADMIN_PASSWORD
// (già configurate su Vercel). È sicura: funziona SOLO finché non esiste
// alcun operatore, quindi non è riutilizzabile dopo la configurazione.
export async function GET() {
  const count = await prisma.operator.count();
  if (count > 0) {
    return NextResponse.json({
      ok: false,
      message: "Configurazione già completata. Vai su /admin/login per accedere.",
    });
  }

  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Mancano ADMIN_EMAIL e/o ADMIN_PASSWORD tra le variabili d'ambiente su Vercel.",
      },
      { status: 500 }
    );
  }

  await prisma.operator.create({
    data: {
      name: "Amministratore",
      email,
      role: "ADMIN",
      passwordHash: await hashPassword(password),
    },
  });

  return NextResponse.json({
    ok: true,
    message: `Amministratore creato: ${email}. Ora vai su /admin/login e accedi con questa email e la password impostata su Vercel.`,
  });
}
