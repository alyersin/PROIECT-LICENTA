import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "My Reports | MaritimeOps",
};

export default async function MyReportsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role_code !== "CUSTOMER_AGENT") {
    redirect("/dashboard");
  }

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="My Reports"
        description="Export CSV reports scoped to containers associated with your customer account."
      />

      <div className="app-grid app-grid-2">
        <Card
          title="Containers CSV"
          description="Your customer containers with status, location and latest empty/full condition."
        >
          <div className="app-form-actions">
            <a className="app-button app-button-primary" href="/api/reports/containers">
              Export Containers CSV
            </a>
          </div>
        </Card>

        <Card
          title="Gate Transactions CSV"
          description="Gate transactions for containers associated with your customer account."
        >
          <div className="app-form-actions">
            <a className="app-button app-button-primary" href="/api/reports/gate-transactions">
              Export Gate Transactions CSV
            </a>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
