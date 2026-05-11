# SQL Schema Plan

## 1. Overview

The project uses simple SQL files instead of Prisma or Drizzle.

Recommended files:

```txt
database/
  schema.sql
  seed.sql
```

`schema.sql` creates tables and constraints.

`seed.sql` inserts initial roles, test users, customers, vessels and containers.

## 2. schema.sql structure

Recommended order:

```txt
1. roles
2. customers
3. users
4. containers
5. vessels
6. vessel_visits
7. gate_transactions
8. vessel_visit_containers
9. uploaded_files
10. container_events
```

Tables with no foreign keys are created first.

## 3. SQL schema draft

```sql
CREATE TABLE roles (
  id_role SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE customers (
  id_customer SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id_user SERIAL PRIMARY KEY,
  id_role INTEGER NOT NULL REFERENCES roles(id_role),
  id_customer INTEGER NULL REFERENCES customers(id_customer),
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
  id_customer INTEGER REFERENCES customers(id_customer)
);

CREATE TABLE vessels (
  id_vessel SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  imo VARCHAR(20) UNIQUE
);

CREATE TABLE vessel_visits (
  id_vessel_visit SERIAL PRIMARY KEY,
  id_vessel INTEGER NOT NULL REFERENCES vessels(id_vessel),
  id_created_by INTEGER NOT NULL REFERENCES users(id_user),
  inbound_voyage_no VARCHAR(50),
  outbound_voyage_no VARCHAR(50),
  eta TIMESTAMP,
  etd TIMESTAMP,
  berth VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'planned',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gate_transactions (
  id_gate_transaction SERIAL PRIMARY KEY,
  id_container INTEGER NOT NULL REFERENCES containers(id_container),
  id_user INTEGER NOT NULL REFERENCES users(id_user),
  transaction_type VARCHAR(50) NOT NULL,
  truck_no VARCHAR(50) NOT NULL,
  transaction_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  container_condition VARCHAR(50),
  seal_no VARCHAR(100),
  destination VARCHAR(150),
  area_after VARCHAR(100),
  position_after VARCHAR(100),
  observations TEXT
);

CREATE TABLE vessel_visit_containers (
  id_vessel_visit_container SERIAL PRIMARY KEY,
  id_vessel_visit INTEGER NOT NULL REFERENCES vessel_visits(id_vessel_visit),
  id_container INTEGER NOT NULL REFERENCES containers(id_container),
  operation_type VARCHAR(50) NOT NULL,
  operation_status VARCHAR(50) NOT NULL DEFAULT 'planned',
  port VARCHAR(50),
  weight_kg NUMERIC(12, 2),
  area_after VARCHAR(100),
  position_after VARCHAR(100)
);

CREATE TABLE uploaded_files (
  id_file SERIAL PRIMARY KEY,
  id_vessel_visit INTEGER NOT NULL REFERENCES vessel_visits(id_vessel_visit),
  id_uploaded_by INTEGER NOT NULL REFERENCES users(id_user),
  file_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE container_events (
  id_container_event SERIAL PRIMARY KEY,
  id_container INTEGER NOT NULL REFERENCES containers(id_container),
  id_user INTEGER NOT NULL REFERENCES users(id_user),
  id_vessel_visit INTEGER NULL REFERENCES vessel_visits(id_vessel_visit),
  id_gate_transaction INTEGER NULL REFERENCES gate_transactions(id_gate_transaction),
  event_type VARCHAR(50) NOT NULL,
  event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  description TEXT NOT NULL
);
```

Location fields:

```txt
containers.current_area
containers.current_position
gate_transactions.area_after
gate_transactions.position_after
vessel_visit_containers.area_after
vessel_visit_containers.position_after
```

Allowed simplified areas:

```txt
Import Yard
Export Yard
Reefer Area
Empty Yard
ISO Tanks / IMDG Cargo Area
```

The position is textual and simplified. The system does not automatically manage stacking levels, but the same position can represent a container stack. For example, B2-05 can be read as block/sector B2, position 05. If multiple containers are registered with the same position, they can be conceptually interpreted as being stacked in the same location. The application does not automatically calculate the physical tier and does not verify if the position is free.

## 4. Useful indexes

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_containers_container_no ON containers(container_no);
CREATE INDEX idx_containers_status ON containers(status);
CREATE INDEX idx_containers_current_area ON containers(current_area);
CREATE INDEX idx_gate_transactions_container ON gate_transactions(id_container);
CREATE INDEX idx_gate_transactions_time ON gate_transactions(transaction_time);
CREATE INDEX idx_vessel_visits_status ON vessel_visits(status);
CREATE INDEX idx_vvc_visit ON vessel_visit_containers(id_vessel_visit);
CREATE INDEX idx_vvc_container ON vessel_visit_containers(id_container);
CREATE INDEX idx_container_events_container ON container_events(id_container);
CREATE INDEX idx_container_events_time ON container_events(event_time);
```

## 5. seed.sql draft

The seed file inserts initial test data.

```sql
INSERT INTO roles (code, name) VALUES
('ADMIN', 'Administrator'),
('GATE_OPERATOR', 'Gate Operator'),
('TERMINAL_OPERATOR', 'Terminal Operator'),
('CUSTOMER_AGENT', 'Customer / Line Agent');

INSERT INTO customers (name, type) VALUES
('Maersk Line', 'shipping_line'),
('MSC', 'shipping_line'),
('Demo Import Client', 'client'),
('Demo Agent', 'agent');
```

Users require bcrypt password hashes. The hash should be generated from the application or from a small script.

Example users:

```txt
admin@maritimeops.local
gate@maritimeops.local
terminal@maritimeops.local
customer@maritimeops.local
```

## 6. Running schema.sql in Docker

Example:

```bash
docker exec -i maritimeops-db psql -U maritimeops_user -d maritimeops_db < database/schema.sql
```

## 7. Running seed.sql in Docker

Example:

```bash
docker exec -i maritimeops-db psql -U maritimeops_user -d maritimeops_db < database/seed.sql
```

## 8. Why simple SQL is good for this project

Simple SQL is suitable because:

- the database has only 10 main tables
- the schema is easy to understand
- the professor can see the real relational structure
- no ORM concepts need to be explained
- it connects directly with the ERD
