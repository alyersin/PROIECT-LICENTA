import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createCsvResponse } from "@/lib/csvResponse";
import { getContainersReportRows } from "@/repositories/reports.repository";

const CONTAINER_REPORT_FIELDS = [
  "container_number",
  "iso_type",
  "size",
  "customer_name",
  "current_area",
  "current_position",
  "status",
  "condition",
];

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role_code === "CUSTOMER_AGENT") {
    const rows = user.id_customer
      ? await getContainersReportRows({ id_customer: user.id_customer })
      : [];

    return createCsvResponse(rows, CONTAINER_REPORT_FIELDS, "my-containers-report.csv");
  }

  if (!["GATE_OPERATOR", "TERMINAL_OPERATOR"].includes(user.role_code)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await getContainersReportRows();
  return createCsvResponse(rows, CONTAINER_REPORT_FIELDS, "containers-report.csv");
}
