import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createCsvResponse } from "@/lib/csvResponse";
import { getVesselVisitContainersReportRows } from "@/repositories/reports.repository";

const VESSEL_VISIT_CONTAINERS_REPORT_FIELDS = [
  "vessel_name",
  "inbound_voyage_no",
  "outbound_voyage_no",
  "eta",
  "etd",
  "container_number",
  "operation_type",
  "status",
];

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role_code !== "TERMINAL_OPERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await getVesselVisitContainersReportRows();
  return createCsvResponse(rows, VESSEL_VISIT_CONTAINERS_REPORT_FIELDS, "vessel-visit-containers-report.csv");
}
