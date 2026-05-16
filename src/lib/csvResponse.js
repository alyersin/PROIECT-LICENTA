import Papa from "papaparse";

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
  const data = rows.map((row) => {
    const normalized = {};

    for (const field of fields) {
      normalized[field] = normalizeCsvValue(row[field]);
    }

    return normalized;
  });

  const csv = Papa.unparse(data, { columns: fields });

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
