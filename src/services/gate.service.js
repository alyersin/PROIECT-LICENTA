import { withTransaction } from "@/lib/db";
import { CONTAINER_CONDITIONS, TERMINAL_AREAS } from "@/lib/constants";
import { getContainerNumberError, normalizeContainerNumber } from "@/lib/validation";
import {
  createContainer,
  getContainerByNumber,
  updateContainerAfterGateIn,
  updateContainerAfterGateOut,
} from "@/repositories/containers.repository";
import { createContainerEvent } from "@/repositories/events.repository";
import { createGateTransaction } from "@/repositories/gate.repository";

function nullableText(value) {
  const text = String(value || "").trim();
  return text || null;
}

function nullableNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export async function registerGateIn(user, payload) {
  if (user?.role_code !== "GATE_OPERATOR") {
    return { ok: false, status: 403, errors: { permission: "Forbidden." } };
  }

  const data = {
    container_no: normalizeContainerNumber(payload.container_no),
    truck_no: nullableText(payload.truck_no),
    container_condition: nullableText(payload.container_condition),
    seal_no: nullableText(payload.seal_no),
    area_after: nullableText(payload.area_after),
    position_after: nullableText(payload.position_after),
    observations: nullableText(payload.observations),
    iso_type: nullableText(payload.iso_type),
    size_ft: nullableNumber(payload.size_ft),
    gross_weight_kg: nullableNumber(payload.gross_weight_kg),
    is_reefer: payload.is_reefer === true || payload.is_reefer === "true",
    id_customer: nullableNumber(payload.id_customer),
  };

  const errors = {};
  const containerNoError = getContainerNumberError(data.container_no);

  if (containerNoError) {
    errors.container_no = containerNoError;
  }

  if (!data.truck_no) {
    errors.truck_no = "Truck number is required.";
  }

  if (!data.container_condition || !CONTAINER_CONDITIONS.includes(data.container_condition)) {
    errors.container_condition = "Container condition must be empty or full.";
  }

  if (!data.area_after || !TERMINAL_AREAS.includes(data.area_after)) {
    errors.area_after = "A valid area is required.";
  }

  if (!data.position_after) {
    errors.position_after = "Position is required.";
  }

  if (payload.size_ft && ![20, 40, 45].includes(data.size_ft)) {
    errors.size_ft = "Container size must be 20, 40 or 45.";
  }

  if (payload.gross_weight_kg && data.gross_weight_kg === null) {
    errors.gross_weight_kg = "Gross weight must be numeric.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, status: 400, errors };
  }

  const result = await withTransaction(async (client) => {
    let container = await getContainerByNumber(data.container_no);

    if (!container) {
      container = await createContainer(client, {
        container_no: data.container_no,
        iso_type: data.iso_type,
        size_ft: data.size_ft,
        status: "in_terminal",
        is_reefer: data.is_reefer,
        gross_weight_kg: data.gross_weight_kg,
        current_area: data.area_after,
        current_position: data.position_after,
        id_customer: data.id_customer,
      });
    } else {
      container = await updateContainerAfterGateIn(client, container.id_container, {
        iso_type: data.iso_type,
        size_ft: data.size_ft,
        is_reefer: data.is_reefer,
        gross_weight_kg: data.gross_weight_kg,
        current_area: data.area_after,
        current_position: data.position_after,
        id_customer: data.id_customer,
      });
    }

    const gateTransaction = await createGateTransaction(client, {
      id_container: container.id_container,
      id_user: user.id_user,
      transaction_type: "GATE_IN",
      truck_no: data.truck_no,
      container_condition: data.container_condition,
      seal_no: data.seal_no,
      area_after: data.area_after,
      position_after: data.position_after,
      observations: data.observations,
    });

    await createContainerEvent(client, {
      id_container: container.id_container,
      id_user: user.id_user,
      id_gate_transaction: gateTransaction.id_gate_transaction,
      event_type: "GATE_IN",
      event_area: data.area_after,
      event_position: data.position_after,
      description: `Gate IN registered for truck ${data.truck_no}.`,
    });

    return { container, gateTransaction };
  });

  return { ok: true, ...result };
}

export async function registerGateOut(user, payload) {
  if (user?.role_code !== "GATE_OPERATOR") {
    return { ok: false, status: 403, errors: { permission: "Forbidden." } };
  }

  const data = {
    container_no: normalizeContainerNumber(payload.container_no),
    truck_no: nullableText(payload.truck_no),
    destination: nullableText(payload.destination),
    seal_no: nullableText(payload.seal_no),
    observations: nullableText(payload.observations),
  };

  const errors = {};
  const containerNoError = getContainerNumberError(data.container_no);

  if (containerNoError) {
    errors.container_no = containerNoError;
  }

  if (!data.truck_no) {
    errors.truck_no = "Truck number is required.";
  }

  if (!data.destination) {
    errors.destination = "Destination is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, status: 400, errors };
  }

  const existingContainer = await getContainerByNumber(data.container_no);

  if (!existingContainer) {
    return {
      ok: false,
      status: 404,
      errors: { container_no: "Container not found." },
    };
  }

  if (existingContainer.status === "gate_out") {
    return {
      ok: false,
      status: 400,
      errors: { container_no: "Container is already marked as gate_out." },
    };
  }

  const result = await withTransaction(async (client) => {
    const gateTransaction = await createGateTransaction(client, {
      id_container: existingContainer.id_container,
      id_user: user.id_user,
      transaction_type: "GATE_OUT",
      truck_no: data.truck_no,
      destination: data.destination,
      seal_no: data.seal_no,
      observations: data.observations,
    });

    const container = await updateContainerAfterGateOut(
      client,
      existingContainer.id_container
    );

    await createContainerEvent(client, {
      id_container: existingContainer.id_container,
      id_user: user.id_user,
      id_gate_transaction: gateTransaction.id_gate_transaction,
      event_type: "GATE_OUT",
      event_area: existingContainer.current_area,
      event_position: existingContainer.current_position,
      description: `Gate OUT registered for truck ${data.truck_no}. Destination: ${data.destination}.`,
    });

    return { container, gateTransaction };
  });

  return { ok: true, ...result };
}
