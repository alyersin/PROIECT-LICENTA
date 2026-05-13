import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Dashboard | MaritimeOps",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell user={user}>
      <PageHeader title="Dashboard" description="Operational overview for your role." />

      <div className="app-grid app-grid-4">
        <Card title="Role" value={user.role_name || user.role_code} />
        <Card title="Containers" value="0" />
        <Card title="Gate operations" value="0" />
        <Card title="Vessel visits" value="0" />
      </div>
    </AppShell>
  );
}
