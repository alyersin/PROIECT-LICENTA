import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import GateOutForm from "@/components/forms/GateOutForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Register Gate OUT | MaritimeOps",
};

export default async function GateOutPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role_code !== "GATE_OPERATOR") {
    redirect("/dashboard");
  }

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Register Gate OUT"
        description="Register the exit of a container through the terminal gate."
      />

      <Card title="Gate OUT form">
        <GateOutForm />
      </Card>
    </AppShell>
  );
}
