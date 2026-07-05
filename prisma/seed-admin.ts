// Crea SOLO l'amministratore di default (nessun dato demo).
// Utile per avviare la produzione pulita:
//   ADMIN_EMAIL / ADMIN_PASSWORD dalle variabili d'ambiente.
//   npm run db:seed:admin

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!email || !password) {
    console.error("Imposta ADMIN_EMAIL e ADMIN_PASSWORD prima di eseguire.");
    process.exit(1);
  }

  await prisma.operator.upsert({
    where: { email },
    update: {},
    create: {
      name: "Amministratore",
      email,
      role: "ADMIN",
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  console.log(`Admin pronto: ${email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
