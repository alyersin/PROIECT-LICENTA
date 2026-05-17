const FORMULA_PREFIX_PATTERN = /^[=+\-@\t\r]/;

export function escapeCsvFormulaValue(value) {
  if (typeof value !== "string") {
    return value;
  }

  if (!FORMULA_PREFIX_PATTERN.test(value)) {
    return value;
  }

  return `'${value}`;
}

export function escapeCsvFormulaRows(rows, fields) {
  return rows.map((row) => {
    const escaped = {};

    for (const field of fields) {
      escaped[field] = escapeCsvFormulaValue(row[field]);
    }

    return escaped;
  });
}
