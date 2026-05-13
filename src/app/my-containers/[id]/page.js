import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import ContainerDetails from "@/components/containers/ContainerDetails";
import ContainerEventsTimeline from "@/components/containers/ContainerEventsTimeline";
import { getCurrentUser } from "@/lib/auth";
import { getContainerById } from "@/repositories/containers.repository";
import { getContainerEvents } from "@/repositories/events.repository";
import { canViewContainer } from "@/services/containers.service";

export const metadata = {
  title: "My Container Details | MaritimeOps",
};

export default async function MyContainerDetailsPage({ params }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role_code !== "CUSTOMER_AGENT") {
    redirect("/dashboard");
  }

  const container = await getContainerById(id);

  if (!container) {
    notFound();
  }

  if (!canViewContainer(currentUser, container)) {
    redirect("/my-containers");
  }

  const events = await getContainerEvents(container.id_container);

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title={`Container ${container.container_no}`}
        description="View your container details and available operational history."
      />

      <Card title="Container details">
        <ContainerDetails container={container} />
      </Card>

      <Card title="Operational history">
        <ContainerEventsTimeline events={events} />
      </Card>
    </AppShell>
  );
}
