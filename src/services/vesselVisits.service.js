import { VESSEL_VISIT_STATUSES } from "@/lib/constants";
import { getVesselById } from "@/repositories/vessels.repository";
import {
  createVesselVisit,
  getVesselVisitById,
  updateVesselVisit,
} from "@/repositories/vesselVisits.repository";

function normalizePayload(payload) {
  return {
    id_vessel: payload.id_vessel ? Number(payload.id_vessel) : null,
    inbound_voyage_no: String(payload.inbound_voyage_no || "").trim(),
    outbound_voyage_no: String(payload.outbound_voyage_no || "").trim(),
    eta: String(payload.eta || "").trim(),
    etd: String(payload.etd || "").trim(),
    berth: String(payload.berth || "").trim(),
    status: String(payload.status || "planned").trim(),
  };
}

async function validateVesselVisitPayload(data) {
  const errors = {};

  if (!data.id_vessel) {
    errors.id_vessel = "Vessel is required.";
  } else {
    const vessel = await getVesselById(data.id_vessel);
    if (!vessel) {
      errors.id_vessel = "Selected vessel is invalid.";
    }
  }

  if (!data.status || !VESSEL_VISIT_STATUSES.includes(data.status)) {
    errors.status = "Selected status is invalid.";
  }

  if (data.eta && data.etd) {
    const eta = new Date(data.eta);
    const etd = new Date(data.etd);

    if (Number.isNaN(eta.getTime())) {
      errors.eta = "ETA is invalid.";
    }

    if (Number.isNaN(etd.getTime())) {
      errors.etd = "ETD is invalid.";
    }

    if (!Number.isNaN(eta.getTime()) && !Number.isNaN(etd.getTime()) && etd < eta) {
      errors.etd = "ETD must be after ETA.";
    }
  }

  return errors;
}

export async function createVesselVisitFromPayload(user, payload) {
  if (user?.role_code !== "TERMINAL_OPERATOR") {
    return { ok: false, status: 403, errors: { permission: "Forbidden." } };
  }

  const data = normalizePayload(payload);
  const errors = await validateVesselVisitPayload(data);

  if (Object.keys(errors).length > 0) {
    return { ok: false, status: 400, errors };
  }

  const created = await createVesselVisit({
    ...data,
    id_created_by: user.id_user,
  });

  return { ok: true, vesselVisit: created };
}

export async function updateVesselVisitFromPayload(user, idVesselVisit, payload) {
  if (user?.role_code !== "TERMINAL_OPERATOR") {
    return { ok: false, status: 403, errors: { permission: "Forbidden." } };
  }

  const existing = await getVesselVisitById(idVesselVisit);

  if (!existing) {
    return { ok: false, status: 404, errors: { vessel_visit: "Vessel visit not found." } };
  }

  const data = normalizePayload(payload);
  const errors = await validateVesselVisitPayload(data);

  if (Object.keys(errors).length > 0) {
    return { ok: false, status: 400, errors };
  }

  const updated = await updateVesselVisit(idVesselVisit, data);

  return { ok: true, vesselVisit: updated };
}
