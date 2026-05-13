import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import ContainerDetails from "@/components/containers/ContainerDetails";
import ContainerEventsTimeline from "@/components/containers/ContainerEventsTimeline";
import UpdateLocationForm from "@/components/forms/UpdateLocationForm";
import { getCurrentUser } from "@/lib/auth";
import { getContainerById } from "@/repositories/containers.repository";
import { getContainerEvents } from "@/repositories/events.repository";
import { canViewContainer } from "@/services/containers.service";

export const metadata = {
  title: "Container Details | MaritimeOps",
};

export default async function ContainerDetailsPage({ params }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const container = await getContainerById(id);

  if (!container) {
    notFound();
  }

  if (!canViewContainer(currentUser, container)) {
    redirect("/dashboard");
  }

  const events = await getContainerEvents(container.id_container);
  const canUpdateLocation = currentUser.role_code === "TERMINAL_OPERATOR";

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title={`Container ${container.container_no}`}
        description="View container details, current location and operational history."
      />

      <div className="app-grid app-grid-2">
        <Card title="Container details">
          <ContainerDetails container={container} />
        </Card>

        {canUpdateLocation ? (
          <Card title="Update location" description="Correct the current area and position when needed.">
            <UpdateLocationForm container={container} />
          </Card>
        ) : (
          <Card title="Location update">
            <p className="app-card-muted">
              Only Terminal Operator users can update container location.
            </p>
          </Card>
        )}
      </div>

      <Card title="Operational history">
        <ContainerEventsTimeline events={events} />
      </Card>
    </AppShell>
  );
}
