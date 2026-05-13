import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import ContainersTable from "@/components/containers/ContainersTable";
import { getCurrentUser } from "@/lib/auth";
import { getContainers } from "@/repositories/containers.repository";
import { TERMINAL_AREAS } from "@/lib/constants";

export const metadata = {
  title: "Containers | MaritimeOps",
};

export default async function ContainersPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (!["GATE_OPERATOR", "TERMINAL_OPERATOR"].includes(currentUser.role_code)) {
    redirect("/dashboard");
  }

  const filters = {
    search: resolvedSearchParams?.search || "",
    status: resolvedSearchParams?.status || "",
    current_area: resolvedSearchParams?.current_area || "",
    size_ft: resolvedSearchParams?.size_ft || "",
    is_reefer: resolvedSearchParams?.is_reefer || "",
  };

  const containers = await getContainers(filters);

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Containers"
        description="Search, filter and view operational container data."
      />

      <Card>
        <form className="app-filter-form">
          <input
            className="app-input"
            name="search"
            placeholder="Search container, ISO type or customer"
            defaultValue={filters.search}
          />

          <select className="app-select" name="current_area" defaultValue={filters.current_area}>
            <option value="">All areas</option>
            {TERMINAL_AREAS.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>

          <select className="app-select" name="status" defaultValue={filters.status}>
            <option value="">All statuses</option>
            <option value="planned">planned</option>
            <option value="in_terminal">in_terminal</option>
            <option value="gate_out">gate_out</option>
            <option value="discharged">discharged</option>
            <option value="loaded">loaded</option>
          </select>

          <select className="app-select" name="size_ft" defaultValue={filters.size_ft}>
            <option value="">All sizes</option>
            <option value="20">20 ft</option>
            <option value="40">40 ft</option>
            <option value="45">45 ft</option>
          </select>

          <select className="app-select" name="is_reefer" defaultValue={filters.is_reefer}>
            <option value="">All types</option>
            <option value="true">Reefer</option>
            <option value="false">Non-reefer</option>
          </select>

          <button className="app-button app-button-secondary" type="submit">
            Filter
          </button>
        </form>
      </Card>

      <Card>
        <ContainersTable containers={containers} basePath="/containers" />
      </Card>
    </AppShell>
  );
}
