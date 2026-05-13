import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import CsvUploadForm from "@/components/forms/CsvUploadForm";
import { getCurrentUser } from "@/lib/auth";
import { getVesselVisitById } from "@/repositories/vesselVisits.repository";

export const metadata = {
  title: "Import CSV | MaritimeOps",
};

export default async function ImportCsvPage({ params }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role_code !== "TERMINAL_OPERATOR") {
    redirect("/dashboard");
  }

  const vesselVisit = await getVesselVisitById(id);

  if (!vesselVisit) {
    notFound();
  }

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title={`Import CSV - ${vesselVisit.vessel_name}`}
        description="Upload a discharge or loading list and create planned operations."
      />

      <Card title="CSV import">
        <CsvUploadForm vesselVisit={vesselVisit} />
      </Card>
    </AppShell>
  );
}
