import AdminNav from "../components/AdminNav";
import EventManager from "./EventManager";

export const dynamic = "force-dynamic";

export default function AdminEventsPage() {
  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <EventManager />
      </main>
    </div>
  );
}
