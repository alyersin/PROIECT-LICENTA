import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { parseLimit } from "@/lib/apiRequest";
import { DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT } from "@/lib/securityLimits";
import { getContainers, getContainersByCustomer } from "@/repositories/containers.repository";

export async function GET(request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const filters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    current_area: searchParams.get("current_area") || "",
    size_ft: searchParams.get("size_ft") || "",
    is_reefer: searchParams.get("is_reefer") || "",
    limit: parseLimit(searchParams.get("limit"), DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT),
  };

  if (user.role_code === "CUSTOMER_AGENT") {
    const containers = await getContainersByCustomer(user.id_customer, filters);
    return NextResponse.json({ containers });
  }

  if (!["GATE_OPERATOR", "TERMINAL_OPERATOR"].includes(user.role_code)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const containers = await getContainers({
    ...filters,
    id_customer: searchParams.get("id_customer") || "",
  });
  return NextResponse.json({ containers });
}
