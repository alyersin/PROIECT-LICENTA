import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import UsersTable from "@/components/admin/UsersTable";
import { getCurrentUser } from "@/lib/auth";
import { getUsers } from "@/repositories/users.repository";

export const metadata = {
  title: "Manage Users | MaritimeOps",
};

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role_code !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await getUsers();

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Manage Users"
        description="Create, update, deactivate users and assign roles."
        action={
          <Button href="/admin/users/create">
            Create User
          </Button>
        }
      />

      <Card>
        <UsersTable users={users} />
      </Card>
    </AppShell>
  );
}
