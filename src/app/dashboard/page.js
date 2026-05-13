import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import DashboardStatGrid from "@/components/dashboard/DashboardStatGrid";
import RecentEventsTable from "@/components/dashboard/RecentEventsTable";
import { getCurrentUser } from "@/lib/auth";
import {
  getAdminDashboardStats,
  getCustomerDashboardStats,
  getGateDashboardStats,
  getRecentContainerEvents,
  getRecentContainerEventsForCustomer,
  getTerminalDashboardStats,
} from "@/repositories/dashboard.repository";

export const metadata = {
  title: "Dashboard | MaritimeOps",
};

function getEventLinkMode(user) {
  if (user.role_code === "CUSTOMER_AGENT") {
    return "my-containers";
  }

  if (user.role_code === "GATE_OPERATOR" || user.role_code === "TERMINAL_OPERATOR") {
    return "containers";
  }

  return "none";
}

async function getDashboardData(user) {
  if (user.role_code === "ADMIN") {
    const stats = await getAdminDashboardStats();
    const events = await getRecentContainerEvents();

    return {
      title: "Administrator Dashboard",
      description: "Overview of application users and recent operational events.",
      cards: [
        { label: "Total users", value: stats.total_users },
        { label: "Active users", value: stats.active_users },
        { label: "Inactive users", value: stats.inactive_users },
        { label: "Roles", value: stats.total_roles },
      ],
      events,
    };
  }

  if (user.role_code === "GATE_OPERATOR") {
    const stats = await getGateDashboardStats();
    const events = await getRecentContainerEvents();

    return {
      title: "Gate Dashboard",
      description: "Gate IN, Gate OUT and container movement overview.",
      cards: [
        { label: "Gate IN today", value: stats.gate_in_today },
        { label: "Gate OUT today", value: stats.gate_out_today },
        { label: "Containers in terminal", value: stats.containers_in_terminal },
        { label: "Containers gate out", value: stats.containers_gate_out },
      ],
      events,
    };
  }

  if (user.role_code === "TERMINAL_OPERATOR") {
    const stats = await getTerminalDashboardStats();
    const events = await getRecentContainerEvents();

    return {
      title: "Terminal Dashboard",
      description: "Vessel visits, pending operations and recent container events.",
      cards: [
        { label: "Active vessel visits", value: stats.active_vessel_visits },
        { label: "Pending discharge", value: stats.pending_discharge },
        { label: "Pending loading", value: stats.pending_loading },
        { label: "Containers in terminal", value: stats.containers_in_terminal },
      ],
      events,
    };
  }

  if (user.role_code === "CUSTOMER_AGENT") {
    const stats = await getCustomerDashboardStats(user.id_customer);
    const events = await getRecentContainerEventsForCustomer(user.id_customer);

    return {
      title: "Customer Dashboard",
      description: "Overview of containers associated with your customer account.",
      cards: [
        { label: "My containers", value: stats.my_containers },
        { label: "In terminal", value: stats.in_terminal },
        { label: "Loaded", value: stats.loaded },
        { label: "Gate out", value: stats.gate_out },
      ],
      events,
    };
  }

  return {
    title: "Dashboard",
    description: "Application overview.",
    cards: [],
    events: [],
  };
}

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const dashboard = await getDashboardData(currentUser);

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title={dashboard.title}
        description={dashboard.description}
      />

      <DashboardStatGrid cards={dashboard.cards} />

      <Card title="Recent Events">
        <RecentEventsTable
          events={dashboard.events}
          linkMode={getEventLinkMode(currentUser)}
        />
      </Card>
    </AppShell>
  );
}
