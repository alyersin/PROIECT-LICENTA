import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import UserForm from "@/components/forms/UserForm";
import { getCurrentUser } from "@/lib/auth";
import { getAllRoles } from "@/repositories/roles.repository";
import { getAllCustomers } from "@/repositories/customers.repository";

export const metadata = {
  title: "Create User | MaritimeOps",
};

export default async function CreateUserPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role_code !== "ADMIN") {
    redirect("/dashboard");
  }

  const roles = await getAllRoles();
  const customers = await getAllCustomers();

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Create User"
        description="Create a new application account and assign a role."
      />

      <Card>
        <UserForm mode="create" roles={roles} customers={customers} />
      </Card>
    </AppShell>
  );
}
