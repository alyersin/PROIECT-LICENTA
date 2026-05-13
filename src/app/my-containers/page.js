import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import ContainersTable from "@/components/containers/ContainersTable";
import { getCurrentUser } from "@/lib/auth";
import { getContainersByCustomer } from "@/repositories/containers.repository";

export const metadata = {
  title: "My Containers | MaritimeOps",
};

export default async function MyContainersPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role_code !== "CUSTOMER_AGENT") {
    redirect("/dashboard");
  }

  const filters = {
    search: resolvedSearchParams?.search || "",
    status: resolvedSearchParams?.status || "",
  };

  const containers = await getContainersByCustomer(currentUser.id_customer, filters);

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="My Containers"
        description="View containers associated with your customer account."
      />

      <Card>
        <form className="app-filter-form">
          <input
            className="app-input"
            name="search"
            placeholder="Search container"
            defaultValue={filters.search}
          />

          <select className="app-select" name="status" defaultValue={filters.status}>
            <option value="">All statuses</option>
            <option value="planned">planned</option>
            <option value="in_terminal">in_terminal</option>
            <option value="gate_out">gate_out</option>
            <option value="discharged">discharged</option>
            <option value="loaded">loaded</option>
          </select>

          <button className="app-button app-button-secondary" type="submit">
            Filter
          </button>
        </form>
      </Card>

      <Card>
        <ContainersTable containers={containers} basePath="/my-containers" />
      </Card>
    </AppShell>
  );
}
