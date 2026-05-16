import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createCsvResponse } from "@/lib/csvResponse";
import { getGateTransactionsReportRows } from "@/repositories/reports.repository";

const GATE_TRANSACTIONS_REPORT_FIELDS = [
  "transaction_type",
  "container_number",
  "customer_name",
  "container_condition",
  "truck_plate",
  "driver_name",
  "transaction_time",
  "operator_name",
];

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role_code === "CUSTOMER_AGENT") {
    const rows = user.id_customer
      ? await getGateTransactionsReportRows({ id_customer: user.id_customer })
      : [];

    return createCsvResponse(rows, GATE_TRANSACTIONS_REPORT_FIELDS, "my-gate-transactions-report.csv");
  }

  if (user.role_code !== "GATE_OPERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await getGateTransactionsReportRows();
  return createCsvResponse(rows, GATE_TRANSACTIONS_REPORT_FIELDS, "gate-transactions-report.csv");
}
