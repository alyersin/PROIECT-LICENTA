import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Profile | MaritimeOps",
};

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Profile"
        description="View your account information and assigned role."
      />

      <Card title="Account details">
        <div className="app-details-grid">
          <div>
            <span className="app-detail-label">Full name</span>
            <strong className="app-detail-value">{currentUser.full_name}</strong>
          </div>

          <div>
            <span className="app-detail-label">Email</span>
            <strong className="app-detail-value">{currentUser.email}</strong>
          </div>

          <div>
            <span className="app-detail-label">Role</span>
            <Badge variant="blue">{currentUser.role_code}</Badge>
          </div>

          <div>
            <span className="app-detail-label">Customer</span>
            <strong className="app-detail-value">{currentUser.customer_name || "-"}</strong>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
