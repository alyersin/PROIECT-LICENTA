import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Change Password | MaritimeOps",
};

export default async function ChangePasswordPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Change Password"
        description="Update the password used to access your MaritimeOps account."
      />

      <Card title="Password security" description="Choose a password with at least 6 characters.">
        <ChangePasswordForm />
      </Card>
    </AppShell>
  );
}
