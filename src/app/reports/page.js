import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Reports | MaritimeOps",
};

export default async function ReportsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (!["GATE_OPERATOR", "TERMINAL_OPERATOR"].includes(currentUser.role_code)) {
    redirect("/dashboard");
  }

  const canExportGateTransactions = currentUser.role_code === "GATE_OPERATOR";
  const canExportVesselVisitContainers = currentUser.role_code === "TERMINAL_OPERATOR";

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Reports"
        description="Export live operational CSV reports from current MaritimeOps data."
      />

      <div className="app-grid app-grid-3">
        <Card
          title="Containers CSV"
          description="Container status, location, customer and latest empty/full condition."
        >
          <div className="app-form-actions">
            <a className="app-button app-button-primary" href="/api/reports/containers">
              Export Containers CSV
            </a>
          </div>
        </Card>

        {canExportGateTransactions ? (
          <Card
            title="Gate Transactions CSV"
            description="Gate IN and Gate OUT transactions with container, truck and operator data."
          >
            <div className="app-form-actions">
              <a className="app-button app-button-primary" href="/api/reports/gate-transactions">
                Export Gate Transactions CSV
              </a>
            </div>
          </Card>
        ) : null}

        {canExportVesselVisitContainers ? (
          <Card
            title="Vessel Visit Containers CSV"
            description="Vessel visit container operations with voyage and planned operation data."
          >
            <div className="app-form-actions">
              <a className="app-button app-button-primary" href="/api/reports/vessel-visit-containers">
                Export Vessel Visit Containers CSV
              </a>
            </div>
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}
