import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import VesselVisitsTable from "@/components/vessel-visits/VesselVisitsTable";
import { getCurrentUser } from "@/lib/auth";
import { getVesselVisits } from "@/repositories/vesselVisits.repository";

export const metadata = {
  title: "Vessel Visits | MaritimeOps",
};

export default async function VesselVisitsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role_code !== "TERMINAL_OPERATOR") {
    redirect("/dashboard");
  }

  const vesselVisits = await getVesselVisits();

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Vessel Visits"
        description="Create and manage vessel calls in the terminal."
        action={<Button href="/vessel-visits/create">Create Vessel Visit</Button>}
      />

      <Card title="Visits">
        <VesselVisitsTable vesselVisits={vesselVisits} />
      </Card>
    </AppShell>
  );
}
