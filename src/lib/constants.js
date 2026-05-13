export const ROLE_CODES = {
  ADMIN: "ADMIN",
  GATE_OPERATOR: "GATE_OPERATOR",
  TERMINAL_OPERATOR: "TERMINAL_OPERATOR",
  CUSTOMER_AGENT: "CUSTOMER_AGENT",
};

export const TERMINAL_AREAS = [
  "Import Yard",
  "Export Yard",
  "Reefer Area",
  "Empty Yard",
  "ISO Tanks / IMDG Cargo Area",
];

export const GATE_TRANSACTION_TYPES = {
  GATE_IN: "GATE_IN",
  GATE_OUT: "GATE_OUT",
};

export const CONTAINER_CONDITIONS = ["empty", "full"];

export const VESSEL_VISIT_STATUSES = [
  "planned",
  "arrived",
  "in_operation",
  "completed",
  "cancelled",
];

export const VESSEL_OPERATION_TYPES = {
  DISCHARGE: "DISCHARGE",
  LOAD: "LOAD",
};

export const OPERATION_STATUSES = ["planned", "confirmed", "cancelled"];

export const UPLOADED_FILE_TYPES = {
  DISCHARGE_LIST: "DISCHARGE_LIST",
  LOADING_LIST: "LOADING_LIST",
};

export const CONTAINER_EVENT_TYPES = {
  GATE_IN: "GATE_IN",
  GATE_OUT: "GATE_OUT",
  DISCHARGED: "DISCHARGED",
  LOADED: "LOADED",
  LOCATION_UPDATED: "LOCATION_UPDATED",
  VESSEL_VISIT_ASSIGNED: "VESSEL_VISIT_ASSIGNED",
};
