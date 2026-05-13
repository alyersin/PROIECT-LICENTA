import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import GateTransactionsTable from "@/components/gate/GateTransactionsTable";
import { getCurrentUser } from "@/lib/auth";
import { getRecentGateTransactions } from "@/repositories/gate.repository";

export const metadata = {
  title: "Gate Overview | MaritimeOps",
};

export default async function GateOverviewPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role_code !== "GATE_OPERATOR") {
    redirect("/dashboard");
  }

  const transactions = await getRecentGateTransactions(20);

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Gate Overview"
        description="Review recent Gate IN and Gate OUT operations."
        action={
          <div className="app-form-actions">
            <Link className="app-button app-button-primary" href="/gate/in">
              Register Gate IN
            </Link>
            <Link className="app-button app-button-secondary" href="/gate/out">
              Register Gate OUT
            </Link>
          </div>
        }
      />

      <Card title="Recent gate transactions">
        <GateTransactionsTable transactions={transactions} />
      </Card>
    </AppShell>
  );
}
