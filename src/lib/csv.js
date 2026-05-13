import Papa from "papaparse";

export function parseCsvText(csvText) {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => String(header || "").trim(),
  });

  return {
    rows: result.data,
    errors: result.errors,
  };
}

export function normalizeCsvRow(row) {
  return {
    container_no: String(row.container_no || "").trim().toUpperCase(),
    iso_type: String(row.iso_type || "").trim() || null,
    size_ft: row.size_ft ? Number(row.size_ft) : null,
    weight_kg: row.weight_kg ? Number(row.weight_kg) : null,
    port: String(row.port || "").trim() || null,
    area_after: String(row.area_after || "").trim() || null,
    position_after: String(row.position_after || "").trim() || null,
  };
}

export function validateCsvRows(rows, fileType) {
  const errors = [];

  if (!rows.length) {
    errors.push({
      row: 0,
      field: "file",
      message: "CSV file is empty.",
    });

    return errors;
  }

  rows.forEach((row, index) => {
    const line = index + 2;

    if (!row.container_no || !String(row.container_no).trim()) {
      errors.push({
        row: line,
        field: "container_no",
        message: "Container number is required.",
      });
    }

    if (row.size_ft && ![20, 40, 45].includes(Number(row.size_ft))) {
      errors.push({
        row: line,
        field: "size_ft",
        message: "Container size must be 20, 40 or 45.",
      });
    }

    if (row.weight_kg && Number.isNaN(Number(row.weight_kg))) {
      errors.push({
        row: line,
        field: "weight_kg",
        message: "Weight must be numeric.",
      });
    }

    if (
      fileType === "DISCHARGE_LIST" &&
      row.area_after &&
      ![
        "Import Yard",
        "Export Yard",
        "Reefer Area",
        "Empty Yard",
        "ISO Tanks / IMDG Cargo Area",
      ].includes(String(row.area_after).trim())
    ) {
      errors.push({
        row: line,
        field: "area_after",
        message: "Area after discharge is invalid.",
      });
    }
  });

  const seen = new Set();

  rows.forEach((row, index) => {
    const containerNo = String(row.container_no || "").trim().toUpperCase();

    if (!containerNo) {
      return;
    }

    if (seen.has(containerNo)) {
      errors.push({
        row: index + 2,
        field: "container_no",
        message: "Duplicate container number in same file.",
      });
    }

    seen.add(containerNo);
  });

  return errors;
}
