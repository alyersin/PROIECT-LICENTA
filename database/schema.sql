DROP TABLE IF EXISTS container_events;
DROP TABLE IF EXISTS uploaded_files;
DROP TABLE IF EXISTS vessel_visit_containers;
DROP TABLE IF EXISTS gate_transactions;
DROP TABLE IF EXISTS vessel_visits;
DROP TABLE IF EXISTS vessels;
DROP TABLE IF EXISTS containers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
  id_role SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  CONSTRAINT chk_roles_code CHECK (code IN ('ADMIN', 'GATE_OPERATOR', 'TERMINAL_OPERATOR', 'CUSTOMER_AGENT'))
);

CREATE TABLE customers (
  id_customer SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_customers_type CHECK (type IN ('shipping_line', 'client', 'agent'))
);

CREATE TABLE users (
  id_user SERIAL PRIMARY KEY,
  id_role INTEGER NOT NULL REFERENCES roles(id_role) ON UPDATE CASCADE ON DELETE RESTRICT,
  id_customer INTEGER NULL REFERENCES customers(id_customer) ON UPDATE CASCADE ON DELETE SET NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE containers (
  id_container SERIAL PRIMARY KEY,
  container_no VARCHAR(20) NOT NULL UNIQUE,
  iso_type VARCHAR(20),
  size_ft INTEGER,
  status VARCHAR(50) NOT NULL,
  is_reefer BOOLEAN NOT NULL DEFAULT FALSE,
  gross_weight_kg NUMERIC(12, 2),
  current_area VARCHAR(100),
  current_position VARCHAR(100),
  id_customer INTEGER NULL REFERENCES customers(id_customer) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT chk_containers_size CHECK (size_ft IS NULL OR size_ft IN (20, 40, 45)),
  CONSTRAINT chk_containers_number_format CHECK (container_no ~ '^[A-Z]{4}[0-9]{7}$'),
  CONSTRAINT chk_containers_status CHECK (status IN ('planned', 'in_terminal', 'gate_out', 'discharged', 'loaded')),
  CONSTRAINT chk_containers_gross_weight CHECK (gross_weight_kg IS NULL OR gross_weight_kg >= 0),
  CONSTRAINT chk_containers_area CHECK (current_area IS NULL OR current_area IN ('Import Yard', 'Export Yard', 'Reefer Area', 'Empty Yard', 'ISO Tanks / IMDG Cargo Area'))
);

CREATE TABLE vessels (
  id_vessel SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  imo VARCHAR(20) UNIQUE
);

CREATE TABLE vessel_visits (
  id_vessel_visit SERIAL PRIMARY KEY,
  id_vessel INTEGER NOT NULL REFERENCES vessels(id_vessel) ON UPDATE CASCADE ON DELETE RESTRICT,
  id_created_by INTEGER NOT NULL REFERENCES users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
  inbound_voyage_no VARCHAR(50),
  outbound_voyage_no VARCHAR(50),
  eta TIMESTAMP,
  etd TIMESTAMP,
  berth VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'planned',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_vessel_visits_status CHECK (status IN ('planned', 'arrived', 'in_operation', 'completed', 'cancelled')),
  CONSTRAINT chk_vessel_visits_dates CHECK (eta IS NULL OR etd IS NULL OR etd >= eta)
);

CREATE TABLE gate_transactions (
  id_gate_transaction SERIAL PRIMARY KEY,
  id_container INTEGER NOT NULL REFERENCES containers(id_container) ON UPDATE CASCADE ON DELETE RESTRICT,
  id_user INTEGER NOT NULL REFERENCES users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
  transaction_type VARCHAR(50) NOT NULL,
  truck_no VARCHAR(50) NOT NULL,
  transaction_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  container_condition VARCHAR(50),
  seal_no VARCHAR(100),
  destination VARCHAR(150),
  area_after VARCHAR(100),
  position_after VARCHAR(100),
  observations TEXT,
  CONSTRAINT chk_gate_transactions_type CHECK (transaction_type IN ('GATE_IN', 'GATE_OUT')),
  CONSTRAINT chk_gate_transactions_condition CHECK (container_condition IS NULL OR container_condition IN ('empty', 'full')),
  CONSTRAINT chk_gate_transactions_area CHECK (area_after IS NULL OR area_after IN ('Import Yard', 'Export Yard', 'Reefer Area', 'Empty Yard', 'ISO Tanks / IMDG Cargo Area'))
);

CREATE TABLE vessel_visit_containers (
  id_vessel_visit_container SERIAL PRIMARY KEY,
  id_vessel_visit INTEGER NOT NULL REFERENCES vessel_visits(id_vessel_visit) ON UPDATE CASCADE ON DELETE CASCADE,
  id_container INTEGER NOT NULL REFERENCES containers(id_container) ON UPDATE CASCADE ON DELETE RESTRICT,
  operation_type VARCHAR(50) NOT NULL,
  operation_status VARCHAR(50) NOT NULL DEFAULT 'planned',
  port VARCHAR(50),
  weight_kg NUMERIC(12, 2),
  area_after VARCHAR(100),
  position_after VARCHAR(100),
  CONSTRAINT chk_vvc_operation_type CHECK (operation_type IN ('DISCHARGE', 'LOAD')),
  CONSTRAINT chk_vvc_operation_status CHECK (operation_status IN ('planned', 'confirmed', 'cancelled')),
  CONSTRAINT chk_vvc_weight CHECK (weight_kg IS NULL OR weight_kg >= 0),
  CONSTRAINT chk_vvc_area CHECK (area_after IS NULL OR area_after IN ('Import Yard', 'Export Yard', 'Reefer Area', 'Empty Yard', 'ISO Tanks / IMDG Cargo Area')),
  CONSTRAINT uq_vvc_visit_container_operation UNIQUE (id_vessel_visit, id_container, operation_type)
);

CREATE TABLE uploaded_files (
  id_file SERIAL PRIMARY KEY,
  id_vessel_visit INTEGER NOT NULL REFERENCES vessel_visits(id_vessel_visit) ON UPDATE CASCADE ON DELETE CASCADE,
  id_uploaded_by INTEGER NOT NULL REFERENCES users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
  file_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_uploaded_files_type CHECK (file_type IN ('DISCHARGE_LIST', 'LOADING_LIST'))
);

CREATE TABLE container_events (
  id_container_event SERIAL PRIMARY KEY,
  id_container INTEGER NOT NULL REFERENCES containers(id_container) ON UPDATE CASCADE ON DELETE RESTRICT,
  id_user INTEGER NOT NULL REFERENCES users(id_user) ON UPDATE CASCADE ON DELETE RESTRICT,
  id_vessel_visit INTEGER NULL REFERENCES vessel_visits(id_vessel_visit) ON UPDATE CASCADE ON DELETE SET NULL,
  id_gate_transaction INTEGER NULL REFERENCES gate_transactions(id_gate_transaction) ON UPDATE CASCADE ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  event_area VARCHAR(100),
  event_position VARCHAR(100),
  description TEXT NOT NULL,
  CONSTRAINT chk_container_events_type CHECK (event_type IN ('GATE_IN', 'GATE_OUT', 'DISCHARGED', 'LOADED', 'LOCATION_UPDATED', 'VESSEL_VISIT_ASSIGNED')),
  CONSTRAINT chk_container_events_area CHECK (event_area IS NULL OR event_area IN ('Import Yard', 'Export Yard', 'Reefer Area', 'Empty Yard', 'ISO Tanks / IMDG Cargo Area'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_containers_container_no ON containers(container_no);
CREATE INDEX idx_containers_status ON containers(status);
CREATE INDEX idx_containers_current_area ON containers(current_area);
CREATE INDEX idx_gate_transactions_container ON gate_transactions(id_container);
CREATE INDEX idx_gate_transactions_user ON gate_transactions(id_user);
CREATE INDEX idx_gate_transactions_time ON gate_transactions(transaction_time);
CREATE INDEX idx_vessel_visits_status ON vessel_visits(status);
CREATE INDEX idx_vessel_visits_vessel ON vessel_visits(id_vessel);
CREATE INDEX idx_vvc_visit ON vessel_visit_containers(id_vessel_visit);
CREATE INDEX idx_vvc_container ON vessel_visit_containers(id_container);
CREATE INDEX idx_uploaded_files_visit ON uploaded_files(id_vessel_visit);
CREATE INDEX idx_container_events_container ON container_events(id_container);
CREATE INDEX idx_container_events_user ON container_events(id_user);
CREATE INDEX idx_container_events_time ON container_events(event_time);
