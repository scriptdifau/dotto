import BookingForm from "@/app/components/BookingForm";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { LogoMark } from "@/app/components/Illustrations";

// Pagina pensata per essere incorporata in un <iframe> su siti terzi.
export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event || !event.active) notFound();

  return (
    <main className="mx-auto max-w-md p-4">
      <div className="mb-3 flex items-center justify-between">
        <LogoMark className="h-6" />
        <span className="text-xs font-semibold text-dotto-ink/50">Parcheggio bici gratuito</span>
      </div>
      <BookingForm eventSlug={slug} embedded />
    </main>
  );
}
