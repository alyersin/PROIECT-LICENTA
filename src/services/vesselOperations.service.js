import { withTransaction } from "@/lib/db";
import {
  updateContainerAfterDischarge,
  updateContainerAfterLoad,
} from "@/repositories/containers.repository";
import { createContainerEvent } from "@/repositories/events.repository";
import {
  confirmVesselVisitContainer,
  getVesselVisitContainerById,
} from "@/repositories/vesselVisitContainers.repository";
import { validateDischargeLocationPayload } from "@/services/csvImport.service";

export async function confirmDischargeOperation(user, idOperation, payload) {
  if (user?.role_code !== "TERMINAL_OPERATOR") {
    return { ok: false, status: 403, errors: { permission: "Forbidden." } };
  }

  const operation = await getVesselVisitContainerById(idOperation);

  if (!operation) {
    return { ok: false, status: 404, errors: { operation: "Operation not found." } };
  }

  if (operation.operation_type !== "DISCHARGE") {
    return { ok: false, status: 400, errors: { operation: "Operation is not DISCHARGE." } };
  }

  if (operation.operation_status === "confirmed") {
    return { ok: false, status: 400, errors: { operation: "Operation is already confirmed." } };
  }

  const location = validateDischargeLocationPayload({
    area_after: payload.area_after || operation.area_after,
    position_after: payload.position_after || operation.position_after,
  });

  if (Object.keys(location.errors).length > 0) {
    return { ok: false, status: 400, errors: location.errors };
  }

  const result = await withTransaction(async (client) => {
    const confirmedOperation = await confirmVesselVisitContainer(
      client,
      idOperation
    );

    const container = await updateContainerAfterDischarge(client, operation.id_container, {
      current_area: location.area,
      current_position: location.position,
      gross_weight_kg: operation.weight_kg,
    });

    await createContainerEvent(client, {
      id_container: operation.id_container,
      id_user: user.id_user,
      id_vessel_visit: operation.id_vessel_visit,
      event_type: "DISCHARGED",
      event_area: location.area,
      event_position: location.position,
      description: `Container discharged from vessel visit and placed at ${location.area} / ${location.position}.`,
    });

    return { confirmedOperation, container };
  });

  return { ok: true, ...result };
}

export async function confirmLoadOperation(user, idOperation) {
  if (user?.role_code !== "TERMINAL_OPERATOR") {
    return { ok: false, status: 403, errors: { permission: "Forbidden." } };
  }

  const operation = await getVesselVisitContainerById(idOperation);

  if (!operation) {
    return { ok: false, status: 404, errors: { operation: "Operation not found." } };
  }

  if (operation.operation_type !== "LOAD") {
    return { ok: false, status: 400, errors: { operation: "Operation is not LOAD." } };
  }

  if (operation.operation_status === "confirmed") {
    return { ok: false, status: 400, errors: { operation: "Operation is already confirmed." } };
  }

  const result = await withTransaction(async (client) => {
    const confirmedOperation = await confirmVesselVisitContainer(
      client,
      idOperation
    );

    const container = await updateContainerAfterLoad(client, operation.id_container);

    await createContainerEvent(client, {
      id_container: operation.id_container,
      id_user: user.id_user,
      id_vessel_visit: operation.id_vessel_visit,
      event_type: "LOADED",
      event_area: operation.current_area,
      event_position: operation.current_position,
      description: "Container loaded on vessel.",
    });

    return { confirmedOperation, container };
  });

  return { ok: true, ...result };
}
