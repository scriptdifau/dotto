# 🚲 Dottò

Sito + backend per **Dottò**, il servizio di parcheggio bici **gratuito** per eventi.
Il ciclista prenota uno slot, mostra un QR code al parcheggiatore che prende in
custodia la bici, e al ritorno riprende la bici mostrando lo stesso QR.

Costruito con **Next.js 15** (App Router), **Prisma**, **Tailwind CSS**.
Mobile-first, single page.

---

## Cosa contiene

| Parte | Percorso | Descrizione |
|-------|----------|-------------|
| **Landing** | `/` | Hero, "Come funziona" con illustrazioni, form di prenotazione, "Chi siamo" |
| **Form embeddabile** | `/embed/[slug]` | Solo il form di prenotazione, da mettere in un `<iframe>` su siti terzi |
| **Pagina QR** | `/booking/[token]` | Il QR code del ciclista + stato prenotazione |
| **Dashboard** | `/admin` | Statistiche live per evento, occupazione, codice embed (protetta) |
| **Gestione eventi** | `/admin/events` | Crea, modifica, attiva/disattiva ed elimina gli eventi |
| **Operatori** | `/admin/operators` | Gestione account operatori (solo ADMIN) |
| **Scanner** | `/admin/scan` | Il parcheggiatore scansiona i QR per consegnare/riconsegnare le bici |

### API

- `GET  /api/events` — eventi attivi (e posti liberi). `?slug=` per uno solo.
- `POST /api/bookings` — crea una prenotazione, genera il QR e invia l'email di conferma.
- `POST /api/scan` — check-in / check-out di una bici (solo operatori).
- `GET|POST /api/admin/events` · `PATCH|DELETE /api/admin/events/[id]` — gestione eventi (solo operatori).
- `GET|POST /api/admin/operators` · `DELETE /api/admin/operators/[id]` — gestione operatori (solo ADMIN).
- `POST /api/admin/login` · `POST /api/admin/logout` · `GET /api/admin/me` — sessione operatore.

### Stati di una prenotazione

`BOOKED` (prenotata) → `CHECKED_IN` (bici in custodia) → `CHECKED_OUT` (riconsegnata).
Lo scanner in modalità *auto* fa avanzare lo stato ad ogni scansione.

---

## Avvio in locale

Serve **Docker Desktop** (per il Postgres di sviluppo, uguale alla produzione).

```bash
npm install
cp .env.example .env      # poi modifica i valori
docker compose up -d      # avvia Postgres in locale (porta 5432)
npm run db:migrate        # applica le migrazioni e crea il database
npm run db:seed           # crea l'admin di default + un evento demo
npm run dev               # http://localhost:3000
```

`npm run db:migrate` (`prisma migrate dev`) applica le migrazioni ed esegue anche
il seed automaticamente. Per fermare il database: `docker compose down`
(i dati restano nel volume; `docker compose down -v` li azzera).

Area operatori: <http://localhost:3000/admin>. Il seed crea un **admin di default**
con le credenziali di `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`), di default
`admin@dotto.it` / `dotto2026`. Dopo il primo accesso puoi creare altri operatori
(admin o parcheggiatori) da **`/admin/operators`**.

### Migrazioni del database

Il database è versionato con le **migrazioni Prisma** in `prisma/migrations/`
(da committare in git).

- **Modifichi lo schema** (`prisma/schema.prisma`)? Crea una nuova migrazione:
  `npm run db:migrate` → ti chiede un nome (es. `add_phone_field`), genera il
  file SQL e lo applica in locale.
- **Azzeri e ricrei** il DB di sviluppo: `npm run db:reset` (riapplica tutto + seed).
- **In produzione**: `npm run db:deploy` applica le migrazioni pendenti senza
  toccare i dati.

---

## Incorporare il form su un altro sito

Copia questo snippet (lo trovi anche nella dashboard, per ogni evento):

```html
<iframe src="https://IL-TUO-DOMINIO/embed/festival-primavera-2026"
  width="100%" height="620"
  style="border:0;max-width:440px"
  loading="lazy"></iframe>
```

---

## Deploy in produzione (Vercel + Postgres)

Il provider è già `postgresql`: stessa tecnologia in locale e in produzione.

1. **Database**: crea un Postgres (Vercel Postgres, Neon, Supabase…).
2. Imposta le **variabili d'ambiente** su Vercel:
   - `DATABASE_URL` — stringa di connessione Postgres
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credenziali dell'admin di default (seed)
   - `SESSION_SECRET` — stringa lunga e casuale (`openssl rand -hex 32`)
   - `NEXT_PUBLIC_BASE_URL` — es. `https://dotto.it` (serve ai QR)
   - `RESEND_API_KEY` / `EMAIL_FROM` — opzionali, per le email di conferma
3. **Build command** su Vercel: imposta `npm run vercel-build` — esegue
   `prisma generate && prisma migrate deploy && next build`, così le migrazioni
   vengono applicate ad ogni deploy.
4. **Admin di default**: la prima volta esegui il seed una tantum
   (`npm run db:seed` con la `DATABASE_URL` di produzione, in locale o via console),
   oppure crea l'admin a mano nel DB.

---

## Gestione eventi

Gli eventi si gestiscono dall'area operatori in **`/admin/events`**: creazione,
modifica, attiva/disattiva ed eliminazione. Lo slug (usato in QR ed embed) viene
generato automaticamente dal nome e resta invariato quando modifichi l'evento.
Un evento con prenotazioni non può essere eliminato: va disattivato, così i dati
delle prenotazioni restano al sicuro. In alternativa `npm run db:studio` apre
Prisma Studio per l'accesso diretto al database.

## Operatori e ruoli

Ogni operatore ha un proprio account (email + password, hash **bcrypt**). Due ruoli:

- **ADMIN** — gestisce eventi e operatori, oltre a statistiche e scanner.
- **OPERATOR** — accede a statistiche e scanner (per i parcheggiatori).

Gli account si gestiscono da **`/admin/operators`** (solo ADMIN). Un admin non può
eliminare sé stesso, e deve restare sempre almeno un amministratore.

## Email di conferma

Se `RESEND_API_KEY` ed `EMAIL_FROM` sono impostate, alla prenotazione parte
un'email con il QR (in allegato e come link). Se non sono impostate, le email
vengono semplicemente saltate e la prenotazione funziona lo stesso.
Per la produzione: crea un account su [Resend](https://resend.com), verifica il
dominio del mittente e genera una API key.

## Note tecniche

- **Autenticazione**: login per-operatore con sessione via cookie httpOnly che
  contiene un **JWT firmato** (`jose`, chiave `SESSION_SECRET`). Il middleware
  protegge `/admin` e limita `/admin/operators` ai soli ADMIN.
- **Scanner QR**: usa l'API nativa `BarcodeDetector` (Chrome/Android). Su
  browser non supportati (es. iOS Safari) c'è l'inserimento manuale del codice.
- **Capienza**: l'assegnazione dello slot e il controllo posti avvengono in
  transazione, per evitare overbooking.
- **Privacy/GDPR**: pagina `/privacy` (informativa) e checkbox di consenso
  obbligatoria nel form. ⚠️ Completa i campi `[DA COMPLETARE]` in
  `src/app/privacy/page.tsx` con i dati reali del titolare prima del lancio.
- **Anti-spam**: campo honeypot nascosto (blocca i bot) e throttle di 15s per
  stessa email/evento (blocca doppi invii), senza servizi esterni.
