import { SignJWT, jwtVerify } from "jose";

// Modulo "edge-safe": nessuna dipendenza da next/headers o da Node.
// Usato sia dal middleware (edge) sia da lib/auth (server).

export const SESSION_COOKIE = "dotto_admin";

export type Role = "ADMIN" | "OPERATOR";
export type Session = { id: string; name: string; role: Role };

function secretKey(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET non configurato");
  return new TextEncoder().encode(s);
}

export async function createSessionToken(session: Session): Promise<string> {
  return new SignJWT({ name: session.name, role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.id)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const role = payload.role === "ADMIN" ? "ADMIN" : "OPERATOR";
    return { id: String(payload.sub), name: String(payload.name ?? ""), role };
  } catch {
    return null;
  }
}
