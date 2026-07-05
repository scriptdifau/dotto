// Illustrazioni SVG in stile "disegnato a mano" per spiegare il servizio.
// Palette Dotto (blu/navy/bianco, dal logo). Tratto morbido (stroke-hand).

type IlloProps = { className?: string };

const INK = "#17255A";
const BLUE = "#3F7EC0";
const NAVY = "#21357E";
const SKY = "#BBD7F1";

function Bike({ x = 0, y = 0, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="stroke-hand" fill="none" stroke={INK} strokeWidth={4}>
      <circle cx="22" cy="60" r="18" />
      <circle cx="78" cy="60" r="18" />
      <path d="M22 60 L45 60 L60 32 M45 60 L62 60 L78 60 M60 32 L78 60 M45 60 L38 32 L30 32 M60 32 L52 32" />
      <path d="M38 32 L30 26" stroke={BLUE} strokeWidth={5} />
      <circle cx="60" cy="60" r="2.5" fill={INK} />
    </g>
  );
}

export function IlloBook({ className }: IlloProps) {
  // Passo 1: prenoti lo slot dal telefono
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Prenoti lo slot dal telefono">
      <rect x="30" y="14" width="140" height="30" rx="14" fill={SKY} opacity="0.6" />
      <rect x="62" y="26" width="76" height="150" rx="16" fill="#fff" stroke={INK} strokeWidth={4} className="stroke-hand" />
      <line x1="88" y1="38" x2="112" y2="38" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <rect x="74" y="52" width="52" height="40" rx="8" fill={SKY} opacity="0.8" />
      <g stroke={INK} strokeWidth={4} fill="none" className="stroke-hand">
        <path d="M80 108 h40 M80 124 h40 M80 140 h24" />
      </g>
      <circle cx="132" cy="150" r="20" fill={BLUE} />
      <path d="M124 150 l6 6 l12 -13" stroke="#fff" strokeWidth={5} fill="none" className="stroke-hand" />
    </svg>
  );
}

export function IlloShowQr({ className }: IlloProps) {
  // Passo 2: mostri il QR al parcheggiatore
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Mostri il QR al parcheggiatore">
      <rect x="18" y="60" width="70" height="120" rx="14" fill="#fff" stroke={INK} strokeWidth={4} className="stroke-hand" />
      <rect x="30" y="74" width="46" height="46" rx="4" fill={INK} />
      <g fill={SKY}>
        <rect x="35" y="79" width="10" height="10" />
        <rect x="61" y="79" width="10" height="10" />
        <rect x="35" y="105" width="10" height="10" />
        <rect x="50" y="92" width="8" height="8" />
        <rect x="61" y="105" width="10" height="10" />
      </g>
      <circle cx="150" cy="46" r="18" fill={SKY} />
      <path d="M132 176 c0 -30 12 -50 18 -50 c6 0 18 20 18 50" fill={BLUE} />
      <path d="M150 96 l0 30" stroke={INK} strokeWidth={4} className="stroke-hand" />
      <path d="M150 108 l-24 20" stroke={INK} strokeWidth={4} className="stroke-hand" />
    </svg>
  );
}

export function IlloLock({ className }: IlloProps) {
  // Passo 3: il parcheggiatore lega la bici
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Il parcheggiatore lega la bici">
      <Bike x={38} y={70} scale={1.1} />
      <g transform="translate(120 24)">
        <rect x="0" y="26" width="46" height="40" rx="8" fill={BLUE} stroke={INK} strokeWidth={4} className="stroke-hand" />
        <path d="M10 26 v-8 a13 13 0 0 1 26 0 v8" fill="none" stroke={INK} strokeWidth={4} className="stroke-hand" />
        <circle cx="23" cy="44" r="5" fill="#fff" />
        <path d="M23 48 v10" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function IlloReturn({ className }: IlloProps) {
  // Passo 4: torni a fine evento
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Torni a fine evento">
      <circle cx="100" cy="100" r="66" fill="none" stroke={INK} strokeWidth={4} strokeDasharray="2 12" className="stroke-hand" />
      <path d="M100 44 a56 56 0 1 1 -40 17" fill="none" stroke={BLUE} strokeWidth={6} className="stroke-hand" />
      <path d="M60 61 l-2 -20 l20 6 z" fill={BLUE} />
      <circle cx="100" cy="100" r="26" fill={SKY} />
      <path d="M100 84 v18 l12 8" fill="none" stroke={INK} strokeWidth={5} className="stroke-hand" />
    </svg>
  );
}

export function IlloPickup({ className }: IlloProps) {
  // Passo 5: rimostri il QR e riprendi la bici
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Rimostri il QR e riprendi la bici">
      <Bike x={30} y={82} scale={1.05} />
      <g transform="translate(120 40)">
        <rect x="0" y="0" width="52" height="52" rx="6" fill="#fff" stroke={INK} strokeWidth={4} className="stroke-hand" />
        <g fill={BLUE}>
          <rect x="8" y="8" width="12" height="12" />
          <rect x="32" y="8" width="12" height="12" />
          <rect x="8" y="32" width="12" height="12" />
          <rect x="24" y="24" width="8" height="8" />
          <rect x="34" y="34" width="10" height="10" />
        </g>
      </g>
      <path d="M150 96 c14 6 28 4 40 -6" fill="none" stroke={NAVY} strokeWidth={6} className="stroke-hand" />
      <path d="M186 84 l6 6 l-8 6" fill="none" stroke={NAVY} strokeWidth={6} className="stroke-hand" />
    </svg>
  );
}

// Marchio Dotto: cerchio blu con bici stilizzata (ruote = "oo") + wordmark.
export function BikeBadge({ className }: IlloProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Dottò">
      <circle cx="50" cy="50" r="48" fill={BLUE} />
      <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeWidth="3" opacity="0.7" />
      {/* ruote (le due "o") */}
      <circle cx="32" cy="52" r="13" fill="none" stroke={NAVY} strokeWidth="5" />
      <circle cx="68" cy="52" r="13" fill="none" stroke={NAVY} strokeWidth="5" />
      {/* corpo del ciclista / telaio, bianco */}
      <path
        d="M32 52 L48 52 L58 34 M45 52 L68 52 M58 34 L46 34"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        className="stroke-hand"
      />
      <circle cx="59" cy="27" r="4.5" fill="#fff" />
      {/* wordmark */}
      <text x="50" y="82" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="800" fontSize="16" fontStyle="italic" fill="#fff">
        dottò
      </text>
    </svg>
  );
}

// Lockup orizzontale per header/footer: badge + testo.
export function LogoMark({ className }: IlloProps) {
  return (
    <svg viewBox="0 0 150 40" className={className} role="img" aria-label="Dottò">
      <g transform="translate(2 2)">
        <circle cx="18" cy="18" r="18" fill={BLUE} />
        <circle cx="12" cy="20" r="6" fill="none" stroke={NAVY} strokeWidth="2.5" />
        <circle cx="26" cy="20" r="6" fill="none" stroke={NAVY} strokeWidth="2.5" />
        <path d="M12 20 L19 20 L23 12 M18 20 L26 20 M23 12 L18 12" fill="none" stroke="#fff" strokeWidth="2.5" className="stroke-hand" />
        <circle cx="23.5" cy="9" r="2.2" fill="#fff" />
      </g>
      <text x="46" y="27" fontFamily="var(--font-sans)" fontWeight="800" fontSize="24" fill={INK}>
        Dottò
      </text>
    </svg>
  );
}
