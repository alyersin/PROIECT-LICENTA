# Formal Relational Model and Constraints

## 1. Purpose

This document presents the formal relational model for MaritimeOps.

The ERD shows the database visually. The relational model writes the same structure in formal table form, with primary keys, foreign keys and constraints.

This document also explains the remaining relationship loops in the ERD.

## 2. Formal relational schema

### Roles

```txt
Roles(
  id_role PK,
  code UNIQUE NOT NULL,
  name NOT NULL
)
```

Constraints:

```txt
code IN ('ADMIN', 'GATE_OPERATOR', 'TERMINAL_OPERATOR', 'CUSTOMER_AGENT')
```

### Users

```txt
Users(
  id_user PK,
  id_role FK -> Roles(id_role) NOT NULL,
  email UNIQUE NOT NULL,
  password_hash NOT NULL,
  full_name NOT NULL,
  is_active NOT NULL,
  created_at NOT NULL
)
```

Notes:

- A user has one role.
- There is no `User_Roles` table in the simplified version.
- Delete User is implemented as logical deactivation through `is_active`.

### Customers

```txt
Customers(
  id_customer PK,
  name NOT NULL,
  type NOT NULL,
  created_at NOT NULL
)
```

Constraints:

```txt
type IN ('shipping_line', 'client', 'agent')
```

### Containers

```txt
Containers(
  id_container PK,
  container_no UNIQUE NOT NULL,
  iso_type NULL,
  size_ft NULL,
  status NOT NULL,
  is_reefer NOT NULL,
  gross_weight_kg NULL,
  current_area NULL,
  current_position NULL,
  id_customer FK -> Customers(id_customer) NULL
)
```

Constraints:

```txt
size_ft IS NULL OR size_ft IN (20, 40, 45)
current_area IS NULL OR current_area IN (
  'Import Yard',
  'Export Yard',
  'Reefer Area',
  'Empty Yard',
  'ISO Tanks / IMDG Cargo Area'
)
```

Notes:

- `id_customer` is nullable because a container can be imported or introduced before the customer/agent information is fully known.
- `current_position` is textual and simplified.
- The system does not calculate physical stacking tiers.

### Gate_Transactions

```txt
Gate_Transactions(
  id_gate_transaction PK,
  id_container FK -> Containers(id_container) NOT NULL,
  id_user FK -> Users(id_user) NOT NULL,
  transaction_type NOT NULL,
  truck_no NOT NULL,
  transaction_time NOT NULL,
  container_condition NULL,
  seal_no NULL,
  destination NULL,
  area_after NULL,
  position_after NULL,
  observations NULL
)
```

Constraints:

```txt
transaction_type IN ('GATE_IN', 'GATE_OUT')
container_condition IS NULL OR container_condition IN ('empty', 'full')
area_after IS NULL OR area_after IN (
  'Import Yard',
  'Export Yard',
  'Reefer Area',
  'Empty Yard',
  'ISO Tanks / IMDG Cargo Area'
)
```

Notes:

- `area_after` and `position_after` are mainly used for Gate IN.
- Gate OUT can keep these fields null.

### Vessels

```txt
Vessels(
  id_vessel PK,
  name NOT NULL,
  imo UNIQUE NULL
)
```

### Vessel_Visits

```txt
Vessel_Visits(
  id_vessel_visit PK,
  id_vessel FK -> Vessels(id_vessel) NOT NULL,
  id_created_by FK -> Users(id_user) NOT NULL,
  inbound_voyage_no NULL,
  outbound_voyage_no NULL,
  eta NULL,
  etd NULL,
  berth NULL,
  status NOT NULL,
  created_at NOT NULL
)
```

Constraints:

```txt
status IN ('planned', 'arrived', 'in_operation', 'completed', 'cancelled')
eta IS NULL OR etd IS NULL OR etd >= eta
```

### Vessel_Visit_Containers

```txt
Vessel_Visit_Containers(
  id_vessel_visit_container PK,
  id_vessel_visit FK -> Vessel_Visits(id_vessel_visit) NOT NULL,
  id_container FK -> Containers(id_container) NOT NULL,
  operation_type NOT NULL,
  operation_status NOT NULL,
  port NULL,
  weight_kg NULL,
  area_after NULL,
  position_after NULL
)
```

Constraints:

```txt
operation_type IN ('DISCHARGE', 'LOAD')
operation_status IN ('planned', 'confirmed', 'cancelled')
area_after IS NULL OR area_after IN (
  'Import Yard',
  'Export Yard',
  'Reefer Area',
  'Empty Yard',
  'ISO Tanks / IMDG Cargo Area'
)
```

Notes:

- For `DISCHARGE`, `area_after` and `position_after` can be completed when the container is discharged.
- For `LOAD`, these fields can remain null.

### Uploaded_Files

```txt
Uploaded_Files(
  id_file PK,
  id_vessel_visit FK -> Vessel_Visits(id_vessel_visit) NOT NULL,
  id_uploaded_by FK -> Users(id_user) NOT NULL,
  file_type NOT NULL,
  file_name NOT NULL,
  uploaded_at NOT NULL
)
```

Constraints:

```txt
file_type IN ('DISCHARGE_LIST', 'LOADING_LIST')
```

### Container_Events

```txt
Container_Events(
  id_container_event PK,
  id_container FK -> Containers(id_container) NOT NULL,
  id_user FK -> Users(id_user) NOT NULL,
  id_vessel_visit FK -> Vessel_Visits(id_vessel_visit) NULL,
  id_gate_transaction FK -> Gate_Transactions(id_gate_transaction) NULL,
  event_type NOT NULL,
  event_time NOT NULL,
  event_area NULL,
  event_position NULL,
  description NOT NULL
)
```

Constraints:

```txt
event_type IN (
  'GATE_IN',
  'GATE_OUT',
  'DISCHARGED',
  'LOADED',
  'LOCATION_UPDATED',
  'VESSEL_VISIT_ASSIGNED'
)

event_area IS NULL OR event_area IN (
  'Import Yard',
  'Export Yard',
  'Reefer Area',
  'Empty Yard',
  'ISO Tanks / IMDG Cargo Area'
)
```

Notes:

- `id_vessel_visit` is nullable because not every event is related to a vessel.
- `id_gate_transaction` is nullable because not every event is related to a gate operation.
- `event_area` and `event_position` are used when the event records or changes the location of the container.

## 3. Foreign key delete/update rules

Recommended rules:

| Relationship | Recommended rule | Reason |
|---|---|---|
| Users -> Roles | ON DELETE RESTRICT | A role should not be deleted if users still use it |
| Containers -> Customers | ON DELETE SET NULL | Container history can remain even if customer data is removed |
| Gate_Transactions -> Containers | ON DELETE RESTRICT | Gate history must not be orphaned |
| Gate_Transactions -> Users | ON DELETE RESTRICT | Operational history must preserve the user reference |
| Vessel_Visits -> Vessels | ON DELETE RESTRICT | Visit history must preserve the vessel reference |
| Vessel_Visits -> Users | ON DELETE RESTRICT | Visit creator must remain traceable |
| Vessel_Visit_Containers -> Vessel_Visits | ON DELETE CASCADE | If a visit is removed during testing, its operation rows can be removed |
| Vessel_Visit_Containers -> Containers | ON DELETE RESTRICT | Container operation history should remain valid |
| Uploaded_Files -> Vessel_Visits | ON DELETE CASCADE | Uploaded file metadata belongs to the visit |
| Uploaded_Files -> Users | ON DELETE RESTRICT | Uploader should remain traceable |
| Container_Events -> Containers | ON DELETE RESTRICT | Event history must not be orphaned |
| Container_Events -> Users | ON DELETE RESTRICT | Event creator must remain traceable |
| Container_Events -> Vessel_Visits | ON DELETE SET NULL | Event can remain even if visit is removed in a test/demo context |
| Container_Events -> Gate_Transactions | ON DELETE SET NULL | Event can remain even if linked transaction is removed in a test/demo context |

## 4. Explanation of the remaining ERD loops

### Loop 1: Containers, Gate_Transactions and Container_Events

```txt
Containers -> Gate_Transactions -> Container_Events -> Containers
```

This loop appears because the same operational reality is stored at two levels:

- `Gate_Transactions` stores the formal gate transaction.
- `Container_Events` stores the timeline event visible in the container history.

This is not an error because the two tables have different purposes.

`Container_Events.id_gate_transaction` is optional and is completed only when the event is generated by Gate IN or Gate OUT.

### Loop 2: Vessel_Visits, Vessel_Visit_Containers, Containers and Container_Events

```txt
Vessel_Visits -> Vessel_Visit_Containers -> Containers -> Container_Events -> Vessel_Visits
```

This loop appears because vessel operations are planned and confirmed through `Vessel_Visit_Containers`, while the container history is recorded in `Container_Events`.

This is not an error because:

- `Vessel_Visit_Containers` stores the operational assignment and status.
- `Container_Events` stores the chronological event after confirmation.
- `Container_Events.id_vessel_visit` is optional and used only for vessel-related events.

### Loop 3: Users and operational tables

```txt
Users -> Gate_Transactions -> Container_Events -> Users
Users -> Vessel_Visits -> Container_Events -> Users
```

This loop exists because the system stores both:

- the user who created an operational record
- the user who generated a history event

This is useful for traceability and does not create invalid redundancy.

## 5. Validate Container explanation

`Validate Container` is a use case, not a table.

It is implemented through backend logic that checks:

- container number format
- required form fields
- container existence
- operation rules
- valid area and position
- status restrictions

It is included by:

```txt
Register Gate IN
Register Gate OUT
```

## 6. Stowage plan explanation

`Manage Stowage Plan` is not included as a separate use case or database module.

Reason:

The official stowage plan is prepared outside the application by the vessel side, shipping line, chief officer, commander or agent. MaritimeOps receives operational loading/discharge lists and records terminal-side confirmations.

Therefore, the database stores:

```txt
vessel_visits
vessel_visit_containers
uploaded_files
container_events
```

It does not store a separate stowage plan model.

## 7. Summary

The final relational model contains 10 main tables:

```txt
Roles
Users
Customers
Containers
Gate_Transactions
Vessels
Vessel_Visits
Vessel_Visit_Containers
Uploaded_Files
Container_Events
```

The model is simple enough for a licenta project and supports the final Use Case diagram and ERD.
