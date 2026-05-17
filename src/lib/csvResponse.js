import Papa from "papaparse";
import { escapeCsvFormulaRows } from "@/lib/csvExport";
import { MAX_EXPORT_ROWS } from "@/lib/securityLimits";

function normalizeCsvValue(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value === null || value === undefined) {
    return "";
  }

  return value;
}

export function createCsvResponse(rows, fields, filename) {
  const limitedRows = rows.slice(0, MAX_EXPORT_ROWS);
  const data = limitedRows.map((row) => {
    const normalized = {};

    for (const field of fields) {
      normalized[field] = normalizeCsvValue(row[field]);
    }

    return normalized;
  });

  const csv = Papa.unparse(escapeCsvFormulaRows(data, fields), { columns: fields });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
