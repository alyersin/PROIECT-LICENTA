import { withTransaction } from "@/lib/db";
import { parseCsvText, normalizeCsvRow, validateCsvRows } from "@/lib/csv";
import { TERMINAL_AREAS } from "@/lib/constants";
import { createContainer, getContainerByNumber } from "@/repositories/containers.repository";
import { createUploadedFile } from "@/repositories/uploadedFiles.repository";
import { createVesselVisitContainer } from "@/repositories/vesselVisitContainers.repository";
import { getVesselVisitById } from "@/repositories/vesselVisits.repository";

function operationTypeFromFileType(fileType) {
  if (fileType === "DISCHARGE_LIST") {
    return "DISCHARGE";
  }

  if (fileType === "LOADING_LIST") {
    return "LOAD";
  }

  return null;
}

export async function importCsvForVesselVisit(user, idVesselVisit, payload) {
  if (user?.role_code !== "TERMINAL_OPERATOR") {
    return { ok: false, status: 403, errors: { permission: "Forbidden." } };
  }

  const vesselVisit = await getVesselVisitById(idVesselVisit);

  if (!vesselVisit) {
    return { ok: false, status: 404, errors: { vessel_visit: "Vessel visit not found." } };
  }

  const fileType = String(payload.file_type || "").trim();
  const fileName = String(payload.file_name || "").trim() || "uploaded.csv";
  const csvText = String(payload.csv_text || "");

  const errors = {};

  if (!["DISCHARGE_LIST", "LOADING_LIST"].includes(fileType)) {
    errors.file_type = "File type must be DISCHARGE_LIST or LOADING_LIST.";
  }

  if (!csvText.trim()) {
    errors.csv_text = "CSV content is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, status: 400, errors };
  }

  const parsed = parseCsvText(csvText);

  if (parsed.errors.length > 0) {
    return {
      ok: false,
      status: 400,
      errors: {
        csv_text: "CSV parsing failed.",
        rows: parsed.errors,
      },
    };
  }

  const rowErrors = validateCsvRows(parsed.rows, fileType);

  if (rowErrors.length > 0) {
    return {
      ok: false,
      status: 400,
      errors: {
        rows: rowErrors,
      },
    };
  }

  const operationType = operationTypeFromFileType(fileType);
  const normalizedRows = parsed.rows.map(normalizeCsvRow);

  const result = await withTransaction(async (client) => {
    const uploadedFile = await createUploadedFile(client, {
      id_vessel_visit: idVesselVisit,
      id_uploaded_by: user.id_user,
      file_type: fileType,
      file_name: fileName,
    });

    const createdOperations = [];

    for (const row of normalizedRows) {
      let container = await getContainerByNumber(row.container_no);

      if (!container) {
        container = await createContainer(client, {
          container_no: row.container_no,
          iso_type: row.iso_type,
          size_ft: row.size_ft,
          status: "planned",
          is_reefer: false,
          gross_weight_kg: row.weight_kg,
          current_area: fileType === "DISCHARGE_LIST" ? null : "Export Yard",
          current_position: null,
          id_customer: null,
        });
      }

      const operation = await createVesselVisitContainer(client, {
        id_vessel_visit: idVesselVisit,
        id_container: container.id_container,
        operation_type: operationType,
        port: row.port,
        weight_kg: row.weight_kg,
        area_after: row.area_after,
        position_after: row.position_after,
      });

      createdOperations.push(operation);
    }

    return {
      uploadedFile,
      createdOperations,
    };
  });

  return {
    ok: true,
    rowsImported: normalizedRows.length,
    uploadedFile: result.uploadedFile,
    createdOperations: result.createdOperations,
  };
}

export function validateDischargeLocationPayload(payload) {
  const area = String(payload.area_after || "").trim();
  const position = String(payload.position_after || "").trim();

  const errors = {};

  if (!area) {
    errors.area_after = "Area after discharge is required.";
  } else if (!TERMINAL_AREAS.includes(area)) {
    errors.area_after = "Area after discharge is invalid.";
  }

  if (!position) {
    errors.position_after = "Position after discharge is required.";
  }

  return {
    area,
    position,
    errors,
  };
}
