import { withTransaction } from "@/lib/db";
import { TERMINAL_AREAS } from "@/lib/constants";
import { getContainerNumberError, normalizeContainerNumber } from "@/lib/validation";
import {
  getContainerById,
  getContainerByNumber,
  updateContainerLocation,
} from "@/repositories/containers.repository";
import { createContainerEvent } from "@/repositories/events.repository";

export function canViewContainer(user, container) {
  if (!user || !container) {
    return false;
  }

  if (user.role_code === "GATE_OPERATOR" || user.role_code === "TERMINAL_OPERATOR") {
    return true;
  }

  if (user.role_code === "CUSTOMER_AGENT") {
    if (!user.id_customer || !container.id_customer) {
      return false;
    }

    return Number(user.id_customer) === Number(container.id_customer);
  }

  return false;
}

export function canUpdateContainerLocation(user) {
  return user?.role_code === "TERMINAL_OPERATOR";
}

export async function validateContainerForOperation(containerNo) {
  const errors = {};

  if (!containerNo || !String(containerNo).trim()) {
    errors.container_no = "Container number is required.";
    return { ok: false, errors };
  }

  const normalizedContainerNo = normalizeContainerNumber(containerNo);
  const containerNoError = getContainerNumberError(normalizedContainerNo);

  if (containerNoError) {
    errors.container_no = containerNoError;
    return { ok: false, errors };
  }

  const container = await getContainerByNumber(normalizedContainerNo);

  if (!container) {
    return {
      ok: true,
      exists: false,
      container: null,
      message: "Container does not exist yet and can be created during Gate IN.",
    };
  }

  return {
    ok: true,
    exists: true,
    container,
    message: "Container exists.",
  };
}

export async function updateLocationFromPayload(idContainer, user, payload) {
  const container = await getContainerById(idContainer);

  if (!container) {
    return { ok: false, status: 404, errors: { container: "Container not found." } };
  }

  if (!canUpdateContainerLocation(user)) {
    return { ok: false, status: 403, errors: { permission: "Forbidden." } };
  }

  const area = String(payload.current_area || "").trim();
  const position = String(payload.current_position || "").trim();

  const errors = {};

  if (!area) {
    errors.current_area = "Area is required.";
  } else if (!TERMINAL_AREAS.includes(area)) {
    errors.current_area = "Selected area is invalid.";
  }

  if (!position) {
    errors.current_position = "Position is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, status: 400, errors };
  }

  const result = await withTransaction(async (client) => {
    const updated = await updateContainerLocation(client, idContainer, area, position);

    await createContainerEvent(client, {
      id_container: idContainer,
      id_user: user.id_user,
      event_type: "LOCATION_UPDATED",
      event_area: area,
      event_position: position,
      description: `Container location updated to ${area} / ${position}.`,
    });

    return updated;
  });

  return { ok: true, container: result };
}
