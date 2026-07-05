import AdminNav from "../components/AdminNav";
import OperatorManager from "./OperatorManager";

export const dynamic = "force-dynamic";

export default function AdminOperatorsPage() {
  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <OperatorManager />
      </main>
    </div>
  );
}
