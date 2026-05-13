import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import GateInForm from "@/components/forms/GateInForm";
import { getCurrentUser } from "@/lib/auth";
import { getAllCustomers } from "@/repositories/customers.repository";

export const metadata = {
  title: "Register Gate IN | MaritimeOps",
};

export default async function GateInPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role_code !== "GATE_OPERATOR") {
    redirect("/dashboard");
  }

  const customers = await getAllCustomers();

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Register Gate IN"
        description="Register the entry of a container through the terminal gate."
      />

      <Card title="Gate IN form">
        <GateInForm customers={customers} />
      </Card>
    </AppShell>
  );
}
