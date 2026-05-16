export function hasRole(user, allowedRoles) {
  if (!user) {
    return false;
  }

  return allowedRoles.includes(user.role_code);
}

export function requireRole(user, allowedRoles) {
  if (!hasRole(user, allowedRoles)) {
    throw new Error("Forbidden");
  }
}

export function isAdmin(user) {
  return user?.role_code === "ADMIN";
}

export function isGateOperator(user) {
  return user?.role_code === "GATE_OPERATOR";
}

export function isTerminalOperator(user) {
  return user?.role_code === "TERMINAL_OPERATOR";
}

export function isCustomerAgent(user) {
  return user?.role_code === "CUSTOMER_AGENT";
}

export function canViewContainer(user, container) {
  if (!user || !container) {
    return false;
  }

  if (["GATE_OPERATOR", "TERMINAL_OPERATOR"].includes(user.role_code)) {
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
