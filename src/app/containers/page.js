import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import ContainersListPanel from "@/components/containers/ContainersListPanel";
import { getCurrentUser } from "@/lib/auth";
import { getAllCustomers } from "@/repositories/customers.repository";
import { getContainers } from "@/repositories/containers.repository";

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
    condition: resolvedSearchParams?.condition || "",
    current_area: resolvedSearchParams?.current_area || "",
    id_customer: resolvedSearchParams?.id_customer || "",
    size_ft: resolvedSearchParams?.size_ft || "",
    iso_type: resolvedSearchParams?.iso_type || "",
  };

  const [containers, customers] = await Promise.all([
    getContainers(),
    getAllCustomers(),
  ]);

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="Containers"
        description="Search, filter and view operational container data."
      />

      <ContainersListPanel
        containers={containers}
        customers={customers}
        basePath="/containers"
        initialFilters={filters}
        showAdvancedFilters
        showConditionFilter
        showIsoTypeFilter
        showCustomerFilter
        searchPlaceholder="Search by container, ISO type or customer"
        exportFilename="containers.csv"
      />
    </AppShell>
  );
}
