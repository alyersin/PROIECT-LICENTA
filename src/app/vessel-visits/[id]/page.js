import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import VesselVisitDetails from "@/components/vessel-visits/VesselVisitDetails";
import VisitContainersTable from "@/components/vessel-visits/VisitContainersTable";
import Button from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth";
import {
  getVesselVisitById,
  getVesselVisitContainers,
} from "@/repositories/vesselVisits.repository";
import { getUploadedFilesForVisit } from "@/repositories/uploadedFiles.repository";
import UploadedFilesTable from "@/components/vessel-visits/UploadedFilesTable";

export const metadata = {
  title: "Vessel Visit Details | MaritimeOps",
};

export default async function VesselVisitDetailsPage({ params }) {
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

  const operations = await getVesselVisitContainers(vesselVisit.id_vessel_visit);
  const uploadedFiles = await getUploadedFilesForVisit(vesselVisit.id_vessel_visit);

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title={`Vessel Visit - ${vesselVisit.vessel_name}`}
        description="View visit information and associated loading/discharge operations."
        action={
          <div className="app-form-actions">
            <Button href={`/vessel-visits/${vesselVisit.id_vessel_visit}/import`}>
              Import CSV
            </Button>
            <Button href={`/vessel-visits/${vesselVisit.id_vessel_visit}/edit`} variant="secondary">
              Edit Visit
            </Button>
          </div>
        }
      />

      <Card title="Visit details">
        <VesselVisitDetails vesselVisit={vesselVisit} />
      </Card>

      <Card title="Uploaded files">
        <UploadedFilesTable files={uploadedFiles} />
      </Card>

      <Card title="Operations">
        <VisitContainersTable operations={operations} />
      </Card>
    </AppShell>
  );
}
