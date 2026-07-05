"use client";

import { useEffect, useRef, useState } from "react";
import AdminNav from "../components/AdminNav";

type ScanResult = {
  ok?: boolean;
  action?: "checkin" | "checkout";
  error?: string;
  booking?: {
    name: string;
    slotNumber: number | null;
    status: string;
    eventName: string | null;
  };
};

const STATUS_IT: Record<string, string> = {
  BOOKED: "Prenotata",
  CHECKED_IN: "In custodia",
  CHECKED_OUT: "Riconsegnata",
  CANCELLED: "Annullata",
};

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [supported, setSupported] = useState(true);
  const [manual, setManual] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [activeToken, setActiveToken] = useState("");
  const lastToken = useRef<string>("");

  useEffect(() => {
    // BarcodeDetector è disponibile su Chrome/Android. Altrove: inserimento manuale.
    setSupported(typeof window !== "undefined" && "BarcodeDetector" in window);
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopCamera() {
    scanningRef.current = false;
    setScanning(false);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function sendToken(token: string, action: "auto" | "checkin" | "checkout" = "auto") {
    if (!token) return;
    setActiveToken(token);
    setBusy(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action }),
      });
      const data: ScanResult = await res.json();
      setResult(data);
      if (navigator.vibrate) navigator.vibrate(res.ok ? 80 : [40, 40, 40]);
    } catch {
      setResult({ error: "Errore di rete." });
    } finally {
      setBusy(false);
    }
  }

  async function startCamera() {
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      scanningRef.current = true;
      setScanning(true);
      loopDetect();
    } catch {
      setSupported(false);
      setResult({ error: "Fotocamera non accessibile. Usa l'inserimento manuale." });
    }
  }

  async function loopDetect() {
    // @ts-expect-error BarcodeDetector non è ancora nei tipi standard
    const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
    const tick = async () => {
      if (!scanningRef.current || !videoRef.current) return;
      try {
        const codes = await detector.detect(videoRef.current);
        if (codes.length > 0) {
          const value = codes[0].rawValue as string;
          if (value && value !== lastToken.current) {
            lastToken.current = value;
            await sendToken(value);
            setTimeout(() => (lastToken.current = ""), 2500);
          }
        }
      } catch {
        /* ignora frame non validi */
      }
      if (scanningRef.current) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const b = result?.booking;
  const success = result?.ok;

  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="mx-auto max-w-md px-4 py-6">
        <h1 className="text-2xl font-extrabold">Scanner QR</h1>
        <p className="mt-1 text-sm text-dotto-ink/60">
          Inquadra il QR del ciclista per consegnare o riconsegnare la bici.
        </p>

        <div className="mt-4 overflow-hidden rounded-card bg-dotto-ink shadow-soft">
          <video
            ref={videoRef}
            className="aspect-square w-full bg-black object-cover"
            playsInline
            muted
          />
        </div>

        <div className="mt-4 flex gap-2">
          {!scanning ? (
            <button onClick={startCamera} className="btn-primary flex-1" disabled={!supported}>
              Avvia scanner
            </button>
          ) : (
            <button onClick={stopCamera} className="btn-ghost flex-1">
              Ferma scanner
            </button>
          )}
        </div>
        {!supported && (
          <p className="mt-2 text-xs text-dotto-ink/60">
            Il tuo browser non supporta la scansione automatica. Inserisci il codice a mano qui sotto
            (lo trovi nell&apos;URL del QR: la parte dopo <code>/booking/</code>).
          </p>
        )}

        <div className="mt-6 rounded-card bg-white p-4 shadow-soft">
          <label className="label" htmlFor="manual">Inserimento manuale</label>
          <div className="flex gap-2">
            <input
              id="manual"
              className="field"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="Codice o URL del QR"
            />
            <button
              onClick={() => sendToken(manual.trim())}
              className="btn-primary shrink-0"
              disabled={busy || !manual.trim()}
            >
              Cerca
            </button>
          </div>
        </div>

        {result && (
          <div
            className={`mt-6 rounded-card p-6 text-center shadow-soft ${
              success ? "bg-dotto-blue text-white" : b ? "bg-dotto-sky/30" : "bg-red-50"
            }`}
          >
            {success ? (
              <>
                <div className="text-4xl">{result.action === "checkin" ? "🚲🔒" : "🚲✅"}</div>
                <h2 className="mt-2 text-2xl font-extrabold">
                  {result.action === "checkin" ? "Bici presa in custodia" : "Bici riconsegnata"}
                </h2>
              </>
            ) : (
              <h2 className="text-xl font-extrabold text-dotto-ink">
                {result.error || "Attenzione"}
              </h2>
            )}

            {b && (
              <div className={`mt-3 ${success ? "text-white/90" : "text-dotto-ink/80"}`}>
                <p className="text-lg font-bold">{b.name}</p>
                <p className="text-sm">
                  {b.eventName}
                  {b.slotNumber ? ` · slot #${b.slotNumber}` : ""}
                </p>
                <p className="mt-1 text-sm">Stato: {STATUS_IT[b.status] ?? b.status}</p>
              </div>
            )}

            {/* Azioni manuali di override */}
            {b && (
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => sendToken(activeToken, "checkin")}
                  className="rounded-full bg-black/10 px-4 py-2 text-sm font-semibold"
                >
                  Forza consegna
                </button>
                <button
                  onClick={() => sendToken(activeToken, "checkout")}
                  className="rounded-full bg-black/10 px-4 py-2 text-sm font-semibold"
                >
                  Forza ritiro
                </button>
              </div>
            )}

            <button
              onClick={() => setResult(null)}
              className={`mt-4 text-sm font-semibold underline ${success ? "text-white" : "text-dotto-blue"}`}
            >
              Chiudi
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
