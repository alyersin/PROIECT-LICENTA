import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import ContainersListPanel from "@/components/containers/ContainersListPanel";
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
    condition: resolvedSearchParams?.condition || "",
    current_area: resolvedSearchParams?.current_area || "",
    size_ft: resolvedSearchParams?.size_ft || "",
    iso_type: resolvedSearchParams?.iso_type || "",
  };

  const containers = await getContainersByCustomer(currentUser.id_customer);

  return (
    <AppShell user={currentUser}>
      <PageHeader
        title="My Containers"
        description="View containers associated with your customer account."
      />

      <ContainersListPanel
        containers={containers}
        basePath="/my-containers"
        initialFilters={filters}
        showConditionFilter
        showAreaFilter
        showSizeFilter
        showIsoTypeFilter
        includeCustomerSearch={false}
        searchPlaceholder="Search by container or ISO type"
        exportFilename="my-containers.csv"
      />
    </AppShell>
  );
}
