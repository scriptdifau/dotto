"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "@/app/components/Illustrations";

type Me = { name: string; role: "ADMIN" | "OPERATOR" };

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setMe(data))
      .catch(() => {});
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const link = (href: string, label: string) => (
    <a
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        pathname === href
          ? "bg-dotto-blue text-white"
          : "text-dotto-ink/70 hover:bg-dotto-ink/5"
      }`}
    >
      {label}
    </a>
  );

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-dotto-ink/10 bg-dotto-cream/90 px-4 py-3 backdrop-blur">
      <LogoMark className="h-6" />
      <div className="flex flex-wrap items-center justify-end gap-1">
        {link("/admin", "Statistiche")}
        {link("/admin/events", "Eventi")}
        {link("/admin/scan", "Scanner")}
        {me?.role === "ADMIN" && link("/admin/operators", "Operatori")}
        <button
          onClick={logout}
          className="rounded-full px-4 py-2 text-sm font-semibold text-dotto-ink/50 hover:text-dotto-ink"
          title={me ? `${me.name} · esci` : "Esci"}
        >
          Esci
        </button>
      </div>
    </nav>
  );
}
