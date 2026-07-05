import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function token() {
  return randomBytes(9).toString("base64url");
}

async function main() {
  // Admin di default (credenziali dalle env, con fallback per lo sviluppo).
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@dotto.it").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "dotto2026";
  await prisma.operator.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Amministratore",
      email: adminEmail,
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);

  // Evento demo
  const event = await prisma.event.upsert({
    where: { slug: "festival-primavera-2026" },
    update: {},
    create: {
      slug: "festival-primavera-2026",
      name: "Festival di Primavera 2026",
      location: "Parco della Musica, Milano",
      startsAt: new Date("2026-05-16T18:00:00"),
      endsAt: new Date("2026-05-16T23:59:00"),
      totalSlots: 60,
      description:
        "Vieni in bici al festival: lascia la tua bicicletta al parcheggio Dotto, gratis e sorvegliato.",
      active: true,
    },
  });

  // Qualche prenotazione di esempio in stati diversi
  const samples = [
    { name: "Giulia Rossi", email: "giulia@example.com", status: "CHECKED_IN", slot: 1 },
    { name: "Marco Bianchi", email: "marco@example.com", status: "CHECKED_IN", slot: 2 },
    { name: "Sara Verdi", email: "sara@example.com", status: "CHECKED_OUT", slot: 3 },
    { name: "Luca Neri", email: "luca@example.com", status: "BOOKED", slot: 4 },
    { name: "Anna Gallo", email: "anna@example.com", status: "BOOKED", slot: 5 },
  ];

  // Crea le prenotazioni demo solo se l'evento non ne ha già (idempotente:
  // il seed viene eseguito anche da `migrate dev` / `migrate reset`).
  const existing = await prisma.booking.count({ where: { eventId: event.id } });
  if (existing === 0) {
    for (const s of samples) {
      await prisma.booking.create({
        data: {
          eventId: event.id,
          token: token(),
          name: s.name,
          email: s.email,
          status: s.status,
          slotNumber: s.slot,
          checkedInAt: s.status !== "BOOKED" ? new Date() : null,
          checkedOutAt: s.status === "CHECKED_OUT" ? new Date() : null,
        },
      });
    }
  }

  console.log("Seed completato. Evento demo: /embed/festival-primavera-2026");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
