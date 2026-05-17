import { CONTAINER_CONDITIONS, TERMINAL_AREAS, VESSEL_VISIT_STATUSES } from "./constants";

export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

export function isValidTerminalArea(value) {
  return TERMINAL_AREAS.includes(value);
}

export function isValidContainerNumber(value) {
  return /^[A-Z]{4}[0-9]{7}$/.test(String(value || "").trim().toUpperCase());
}

export function normalizeContainerNumber(value) {
  return String(value || "").trim().toUpperCase();
}

export function getContainerNumberError(value) {
  const containerNo = normalizeContainerNumber(value);

  if (!isRequired(containerNo)) {
    return "Container number is required.";
  }

  if (!isValidContainerNumber(containerNo)) {
    return "Container number must use 4 letters followed by 7 digits.";
  }

  return null;
}

export function validateLogin(data) {
  const errors = {};

  if (!isRequired(data.email)) errors.email = "Email is required";
  if (isRequired(data.email) && !isValidEmail(data.email)) errors.email = "Email is invalid";
  if (!isRequired(data.password)) errors.password = "Password is required";

  return errors;
}

export function validateUserInput(data, options = {}) {
  const errors = {};

  if (!isRequired(data.full_name)) errors.full_name = "Full name is required";
  if (!isRequired(data.email)) errors.email = "Email is required";
  if (isRequired(data.email) && !isValidEmail(data.email)) errors.email = "Email is invalid";
  if (!isRequired(data.id_role)) errors.id_role = "Role is required";
  if (options.requirePassword && !isRequired(data.password)) errors.password = "Password is required";

  return errors;
}

export function validateChangePassword(data) {
  const errors = {};

  if (!isRequired(data.current_password)) errors.current_password = "Current password is required";
  if (!isRequired(data.new_password)) errors.new_password = "New password is required";
  if (isRequired(data.new_password) && String(data.new_password).length < 8) {
    errors.new_password = "New password must have at least 8 characters";
  }

  return errors;
}

export function validateGateIn(data) {
  const errors = {};
  const containerNo = normalizeContainerNumber(data.container_no);

  if (!isRequired(containerNo)) errors.container_no = "Container number is required";
  if (isRequired(containerNo) && !isValidContainerNumber(containerNo)) errors.container_no = "Container number is invalid";
  if (!isRequired(data.truck_no)) errors.truck_no = "Truck number is required";
  if (!CONTAINER_CONDITIONS.includes(data.container_condition)) errors.container_condition = "Container condition is invalid";
  if (!isValidTerminalArea(data.area_after)) errors.area_after = "Area is invalid";
  if (!isRequired(data.position_after)) errors.position_after = "Position is required";

  return errors;
}

export function validateGateOut(data) {
  const errors = {};
  const containerNo = normalizeContainerNumber(data.container_no);

  if (!isRequired(containerNo)) errors.container_no = "Container number is required";
  if (isRequired(containerNo) && !isValidContainerNumber(containerNo)) errors.container_no = "Container number is invalid";
  if (!isRequired(data.truck_no)) errors.truck_no = "Truck number is required";

  return errors;
}

export function validateContainerLocation(data) {
  const errors = {};

  if (!isValidTerminalArea(data.current_area)) errors.current_area = "Area is invalid";
  if (!isRequired(data.current_position)) errors.current_position = "Position is required";

  return errors;
}

export function validateVesselVisit(data) {
  const errors = {};

  if (!isRequired(data.id_vessel)) errors.id_vessel = "Vessel is required";
  if (data.status && !VESSEL_VISIT_STATUSES.includes(data.status)) errors.status = "Status is invalid";

  if (data.eta && data.etd) {
    const eta = new Date(data.eta);
    const etd = new Date(data.etd);
    if (!Number.isNaN(eta.getTime()) && !Number.isNaN(etd.getTime()) && etd < eta) {
      errors.etd = "ETD must be after ETA";
    }
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
