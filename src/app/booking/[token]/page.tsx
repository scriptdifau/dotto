import { prisma } from "@/lib/db";
import { qrDataUrl, bookingUrl } from "@/lib/qr";
import { LogoMark } from "@/app/components/Illustrations";
import { notFound } from "next/navigation";

const STATUS_LABEL: Record<string, { text: string; className: string }> = {
  BOOKED: { text: "Prenotata — mostra il QR all'arrivo", className: "bg-dotto-sky/30 text-dotto-ink" },
  CHECKED_IN: { text: "In custodia — bici al sicuro 🚲", className: "bg-dotto-blue/15 text-dotto-blue-dark" },
  CHECKED_OUT: { text: "Riconsegnata — a presto!", className: "bg-dotto-ink/10 text-dotto-ink/70" },
  CANCELLED: { text: "Annullata", className: "bg-red-100 text-red-700" },
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const booking = await prisma.booking.findUnique({
    where: { token },
    include: { event: true },
  });

  if (!booking) notFound();

  const qr = await qrDataUrl(bookingUrl(booking.token));
  const status = STATUS_LABEL[booking.status] ?? STATUS_LABEL.BOOKED;
  const date = booking.event.startsAt.toLocaleString("it-IT", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center px-5 py-8">
      <LogoMark className="h-8" />

      <div className="mt-6 w-full rounded-card bg-white p-6 text-center shadow-soft">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>
          {status.text}
        </span>

        <div className="mt-5 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="Il tuo QR code Dottò" width={260} height={260} className="rounded-2xl" />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold">{booking.name}</h1>
        <p className="text-dotto-ink/70">
          {booking.event.name}
          {booking.slotNumber ? ` · slot #${booking.slotNumber}` : ""}
        </p>
        <p className="mt-1 text-sm text-dotto-ink/60">{booking.event.location}</p>
        <p className="text-sm text-dotto-ink/60">{date}</p>
      </div>

      <div className="mt-5 w-full rounded-card bg-dotto-cream p-5 text-sm text-dotto-ink/70">
        <p className="font-bold text-dotto-ink">Come usarlo</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>All&apos;arrivo mostra questo QR al parcheggiatore.</li>
          <li>Lui prende in custodia e lega la tua bici.</li>
          <li>Al ritorno mostra di nuovo lo stesso QR per riprenderla.</li>
        </ol>
        <p className="mt-3 text-xs text-dotto-ink/50">
          Salva questa pagina tra i preferiti o fai uno screenshot del QR.
        </p>
      </div>

      <a href="/" className="mt-6 text-sm font-semibold text-dotto-blue underline">
        Torna al sito Dottò
      </a>
    </main>
  );
}
