import { prisma } from "./db";

// Trasforma un testo in slug URL-safe: "Festival di Primavera!" -> "festival-di-primavera"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // rimuove i segni diacritici (accenti)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Genera uno slug univoco per gli eventi, aggiungendo -2, -3… se serve.
export async function uniqueEventSlug(name: string): Promise<string> {
  const base = slugify(name) || "evento";
  let candidate = base;
  let n = 1;
  // Ciclo finché lo slug è già preso.
  while (await prisma.event.findUnique({ where: { slug: candidate } })) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}
