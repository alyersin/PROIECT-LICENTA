import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import UserForm from "@/components/forms/UserForm";
import { getCurrentUser } from "@/lib/auth";
import { findUserById } from "@/repositories/users.repository";
import { getAllRoles } from "@/repositories/roles.repository";
import { getAllCustomers } from "@/repositories/customers.repository";

export const metadata = {
  title: "Edit User | MaritimeOps",
};

export default async function EditUserPage({ params }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role_code !== "ADMIN") {
    redirect("/dashboard");
  }

  const selectedUser = await findUserById(id);

  if (!selectedUser) {
    notFound();
  }

  const roles = await getAllRoles();
  const customers = await getAllCustomers();

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Edit User"
        description="Update account details, status, role or password."
      />

      <Card>
        <UserForm
          mode="edit"
          user={selectedUser}
          roles={roles}
          customers={customers}
        />
      </Card>
    </AppShell>
  );
}
