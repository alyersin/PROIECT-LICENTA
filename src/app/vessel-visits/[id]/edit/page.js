import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import VesselVisitForm from "@/components/forms/VesselVisitForm";
import { getCurrentUser } from "@/lib/auth";
import { getAllVessels } from "@/repositories/vessels.repository";
import { getVesselVisitById } from "@/repositories/vesselVisits.repository";

export const metadata = {
  title: "Edit Vessel Visit | MaritimeOps",
};

export default async function EditVesselVisitPage({ params }) {
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

  const vessels = await getAllVessels();

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Edit Vessel Visit"
        description="Update vessel visit data and operational status."
      />

      <Card title="Visit details">
        <VesselVisitForm mode="edit" vesselVisit={vesselVisit} vessels={vessels} />
      </Card>
    </AppShell>
  );
}
