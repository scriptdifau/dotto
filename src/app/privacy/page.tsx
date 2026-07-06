import type { Metadata } from "next";
import { LogoMark } from "@/app/components/Illustrations";

export const metadata: Metadata = {
  title: "Informativa privacy — Dottò",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <a href="/" className="inline-block">
        <LogoMark className="h-7" />
      </a>

      <h1 className="mt-6 text-3xl font-extrabold">Informativa privacy</h1>
      <p className="mt-1 text-sm text-dotto-ink/60">
        Ai sensi del Regolamento (UE) 2016/679 (GDPR).
      </p>

      <div className="mt-6 rounded-2xl border-2 border-dotto-sun/60 bg-dotto-sun/10 p-4 text-sm text-dotto-ink/80">
        <strong>Nota per il titolare:</strong> completa i campi tra parentesi quadre
        <code> [DA COMPLETARE] </code> con i dati reali (ragione sociale, indirizzo,
        email di contatto) prima della pubblicazione ufficiale.
      </div>

      <section className="prose-dotto mt-8 space-y-6 text-dotto-ink/80">
        <div>
          <h2 className="text-lg font-extrabold text-dotto-ink">Titolare del trattamento</h2>
          <p>
            Il titolare del trattamento è <strong>[DA COMPLETARE: ragione sociale / nome]</strong>,
            con sede in <strong>[DA COMPLETARE: indirizzo]</strong>. Per qualsiasi
            richiesta puoi scrivere a <strong>[DA COMPLETARE: email di contatto]</strong>.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-dotto-ink">Quali dati raccogliamo</h2>
          <p>
            Quando prenoti un posto per la tua bici raccogliamo: <strong>nome e cognome</strong>,
            <strong> indirizzo email</strong> e, se lo fornisci, il <strong>numero di telefono</strong>
            (facoltativo). Generiamo inoltre un codice identificativo della prenotazione (QR).
          </p>
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-dotto-ink">Perché li trattiamo</h2>
          <p>
            Usiamo i tuoi dati esclusivamente per <strong>gestire la prenotazione</strong> del
            servizio di parcheggio bici, riconoscere la tua bici tramite il QR al momento della
            consegna e della riconsegna, e inviarti l&apos;email di conferma con il codice.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-dotto-ink">Base giuridica</h2>
          <p>
            Il trattamento si fonda sul tuo <strong>consenso</strong> (art. 6.1.a GDPR), che
            presti spuntando l&apos;apposita casella, e sull&apos;<strong>esecuzione del servizio</strong>
            da te richiesto (art. 6.1.b GDPR).
          </p>
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-dotto-ink">Per quanto tempo</h2>
          <p>
            Conserviamo i dati della prenotazione per il tempo necessario a erogare il servizio
            durante l&apos;evento e per un periodo limitato successivo per fini gestionali, dopodiché
            vengono cancellati o resi anonimi. <strong>[DA COMPLETARE: es. entro 6 mesi]</strong>.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-dotto-ink">A chi comunichiamo i dati</h2>
          <p>
            I dati non vengono venduti né ceduti a terzi per finalità commerciali. Sono trattati
            da fornitori tecnici che agiscono come responsabili del trattamento, tra cui i servizi
            di <strong>hosting e database</strong> e, se attivo, il servizio di <strong>invio email</strong>.
            Questi fornitori possono operare su infrastrutture situate nell&apos;Unione Europea.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-dotto-ink">I tuoi diritti</h2>
          <p>
            Puoi in ogni momento chiedere <strong>accesso, rettifica, cancellazione</strong>,
            limitazione o portabilità dei tuoi dati, e <strong>revocare il consenso</strong>.
            Hai inoltre diritto di proporre reclamo al <strong>Garante per la protezione dei dati
            personali</strong>. Per esercitare i tuoi diritti scrivi a
            <strong> [DA COMPLETARE: email di contatto]</strong>.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-dotto-ink">Cookie</h2>
          <p>
            Il sito non utilizza cookie di profilazione o di tracciamento pubblicitario. Utilizza
            solo cookie tecnici necessari al funzionamento (ad esempio la sessione dell&apos;area
            operatori).
          </p>
        </div>
      </section>

      <a href="/" className="mt-10 inline-block text-sm font-semibold text-dotto-blue underline">
        ← Torna al sito
      </a>
    </main>
  );
}
