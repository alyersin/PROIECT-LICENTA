import { ROLE_CODES } from "./constants";

export function hasRole(user, roles) {
  return Boolean(user && roles.includes(user.role_code));
}

export function canManageUsers(user) {
  return hasRole(user, [ROLE_CODES.ADMIN]);
}

export function canRegisterGate(user) {
  return hasRole(user, [ROLE_CODES.GATE_OPERATOR]);
}

export function canManageVesselVisits(user) {
  return hasRole(user, [ROLE_CODES.TERMINAL_OPERATOR]);
}

export function canUpdateContainerLocation(user) {
  return hasRole(user, [ROLE_CODES.TERMINAL_OPERATOR]);
}

export function canViewContainers(user) {
  return hasRole(user, [
    ROLE_CODES.GATE_OPERATOR,
    ROLE_CODES.TERMINAL_OPERATOR,
    ROLE_CODES.CUSTOMER_AGENT,
  ]);
}

export function canViewContainer(user, container) {
  if (!user || !container) return false;
  if (user.role_code === ROLE_CODES.GATE_OPERATOR) return true;
  if (user.role_code === ROLE_CODES.TERMINAL_OPERATOR) return true;
  if (user.role_code === ROLE_CODES.CUSTOMER_AGENT) return true;
  return false;
}

export function requireRole(user, roles) {
  if (!hasRole(user, roles)) {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }
}
