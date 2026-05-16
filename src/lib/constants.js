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

export const TERMINAL_POSITIONS_BY_AREA = {
  "Export Yard": ["B1-01", "B1-02", "B2-01", "B2-02"],
  "Import Yard": ["A1-01", "A1-02", "A2-01", "A2-02"],
  "Reefer Area": ["R1-01", "R1-02", "R2-01", "R2-02"],
  "Empty Yard": ["E1-01", "E1-02", "E2-01", "E2-02"],
  "ISO Tanks / IMDG Cargo Area": ["T1-01", "T1-02", "T2-01", "T2-02"],
};

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
