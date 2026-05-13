import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import VesselVisitForm from "@/components/forms/VesselVisitForm";
import { getCurrentUser } from "@/lib/auth";
import { getAllVessels } from "@/repositories/vessels.repository";

export const metadata = {
  title: "Create Vessel Visit | MaritimeOps",
};

export default async function CreateVesselVisitPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role_code !== "TERMINAL_OPERATOR") {
    redirect("/dashboard");
  }

  const vessels = await getAllVessels();

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Create Vessel Visit"
        description="Register a vessel visit using vessel, voyage, ETA, ETD and berth data."
      />

      <Card title="Visit details">
        <VesselVisitForm mode="create" vessels={vessels} />
      </Card>
    </AppShell>
  );
}
