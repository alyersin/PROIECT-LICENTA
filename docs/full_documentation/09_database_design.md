# Database Design

## 1. Overview

The database is PostgreSQL.

The application uses simple SQL files and the `pg` library.

No ORM is used.

The database supports:

- user accounts
- roles
- customers / agents / shipping lines
- containers
- gate transactions
- vessels
- vessel visits
- vessel visit container operations
- uploaded CSV files
- container event history

This document is aligned with the updated ERD and the updated use case documentation.

## 2. Final table list

| No. | Table | Purpose |
|---:|---|---|
| 1 | roles | Stores application roles |
| 2 | users | Stores user accounts |
| 3 | customers | Stores clients, agents or shipping lines |
| 4 | containers | Stores container data and current location |
| 5 | gate_transactions | Stores Gate IN and Gate OUT operations |
| 6 | vessels | Stores vessels |
| 7 | vessel_visits | Stores vessel visits |
| 8 | vessel_visit_containers | Connects containers to vessel visits |
| 9 | uploaded_files | Stores uploaded CSV file information |
| 10 | container_events | Stores operational history |

## 3. Design decisions

The database is simplified for a licenta project.

The following are not modeled:

- detailed yard blocks
- detailed yard slots
- internal container moves table
- stowage planning module
- multiple roles per user
- separate validation table for Validate Container

The container location is stored directly in:

```txt
containers.current_area
containers.current_position
```

The simplified terminal areas are:

```txt
Import Yard
Export Yard
Reefer Area
Empty Yard
ISO Tanks / IMDG Cargo Area
```

The position is textual and simplified. The system does not automatically manage stacking levels, but the same position can represent a container stack. For example, B2-05 can be read as block/sector B2, position 05. If multiple containers are registered with the same position, they can be conceptually interpreted as being stacked in the same location. The application does not automatically calculate the physical tier and does not verify if the position is free.

Delete User is implemented as logical deactivation through `users.is_active`, not as physical deletion.

## 4. roles

Stores user roles.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_role | SERIAL PRIMARY KEY | Unique role id |
| code | VARCHAR UNIQUE NOT NULL | ADMIN, GATE_OPERATOR, TERMINAL_OPERATOR, CUSTOMER_AGENT |
| name | VARCHAR NOT NULL | Display name |

Relationship:

```txt
roles 1 -- N users
```

## 5. users

Stores application users.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_user | SERIAL PRIMARY KEY | Unique user id |
| id_role | INTEGER FK NOT NULL | References roles |
| id_customer | INTEGER FK NULL | References customers only for Customer / Line Agent users |
| email | VARCHAR UNIQUE NOT NULL | Login email |
| password_hash | TEXT NOT NULL | bcrypt password hash |
| full_name | VARCHAR NOT NULL | User full name |
| is_active | BOOLEAN NOT NULL | Account status |
| created_at | TIMESTAMP NOT NULL | Creation date |

Relationships:

```txt
users N -- 1 roles
users N -- 1 customers, only for Customer / Line Agent accounts
users 1 -- N gate_transactions
users 1 -- N vessel_visits
users 1 -- N uploaded_files
users 1 -- N container_events
```

For the simplified version, each user has one role. Therefore, `User_Roles` is not required.

`users.id_customer` is nullable and does not add a new table to the final 10-table ERD model. It is used only when the user has the `CUSTOMER_AGENT` role. It allows a Customer / Line Agent to see only containers where `containers.id_customer` matches the user's customer. For `ADMIN`, `GATE_OPERATOR`, and `TERMINAL_OPERATOR` users, `users.id_customer` should be `NULL`.

## 6. customers

Stores clients, agents or shipping lines.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_customer | SERIAL PRIMARY KEY | Unique customer id |
| name | VARCHAR NOT NULL | Customer/agent/shipping line name |
| type | VARCHAR NOT NULL | shipping_line, client, agent |
| created_at | TIMESTAMP NOT NULL | Creation date |

Relationship:

```txt
customers 1 -- N containers
```

## 7. containers

Stores container data and current simplified location.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_container | SERIAL PRIMARY KEY | Unique container id |
| container_no | VARCHAR UNIQUE NOT NULL | Example: MSCU1234567 |
| iso_type | VARCHAR NULL | ISO type |
| size_ft | INTEGER NULL | 20, 40, 45 |
| status | VARCHAR NOT NULL | Operational status |
| is_reefer | BOOLEAN NOT NULL | Reefer flag |
| gross_weight_kg | NUMERIC NULL | Gross weight |
| current_area | VARCHAR NULL | Import Yard, Export Yard, Reefer Area, Empty Yard, ISO Tanks / IMDG Cargo Area |
| current_position | VARCHAR NULL | Textual position, example: B2-05 |
| id_customer | INTEGER FK NULL | Customer/agent/shipping line. Can be null when information is not available initially |

Relationships:

```txt
containers N -- 1 customers
containers 1 -- N gate_transactions
containers 1 -- N vessel_visit_containers
containers 1 -- N container_events
```

## 8. gate_transactions

Stores Gate IN and Gate OUT operations.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_gate_transaction | SERIAL PRIMARY KEY | Unique transaction id |
| id_container | INTEGER FK NOT NULL | Container |
| id_user | INTEGER FK NOT NULL | Gate Operator |
| transaction_type | VARCHAR NOT NULL | GATE_IN or GATE_OUT |
| truck_no | VARCHAR NOT NULL | Truck number |
| transaction_time | TIMESTAMP NOT NULL | Date/time |
| container_condition | VARCHAR NULL | empty or full |
| seal_no | VARCHAR NULL | Seal number |
| destination | VARCHAR NULL | Mostly for Gate OUT |
| area_after | VARCHAR NULL | Area after Gate IN |
| position_after | VARCHAR NULL | Position after Gate IN |
| observations | TEXT NULL | Notes |

Relationships:

```txt
gate_transactions N -- 1 containers
gate_transactions N -- 1 users
gate_transactions 1 -- N container_events
```

## 9. vessels

Stores vessels.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_vessel | SERIAL PRIMARY KEY | Unique vessel id |
| name | VARCHAR NOT NULL | Vessel name |
| imo | VARCHAR UNIQUE NULL | IMO number |

Relationship:

```txt
vessels 1 -- N vessel_visits
```

## 10. vessel_visits

Stores visits of vessels in the terminal.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_vessel_visit | SERIAL PRIMARY KEY | Unique visit id |
| id_vessel | INTEGER FK NOT NULL | Vessel |
| id_created_by | INTEGER FK NOT NULL | Terminal Operator |
| inbound_voyage_no | VARCHAR NULL | Inbound voyage |
| outbound_voyage_no | VARCHAR NULL | Outbound voyage |
| eta | TIMESTAMP NULL | Estimated time of arrival |
| etd | TIMESTAMP NULL | Estimated time of departure |
| berth | VARCHAR NULL | Berth |
| status | VARCHAR NOT NULL | planned, arrived, in_operation, completed, cancelled |
| created_at | TIMESTAMP NOT NULL | Creation date |

Relationships:

```txt
vessels 1 -- N vessel_visits
users 1 -- N vessel_visits
vessel_visits 1 -- N vessel_visit_containers
vessel_visits 1 -- N uploaded_files
vessel_visits 1 -- N container_events
```

## 11. vessel_visit_containers

Connects containers to vessel visits and stores operation type.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_vessel_visit_container | SERIAL PRIMARY KEY | Unique id |
| id_vessel_visit | INTEGER FK NOT NULL | Vessel visit |
| id_container | INTEGER FK NOT NULL | Container |
| operation_type | VARCHAR NOT NULL | DISCHARGE or LOAD |
| operation_status | VARCHAR NOT NULL | planned, confirmed, cancelled |
| port | VARCHAR NULL | Port from CSV |
| weight_kg | NUMERIC NULL | Weight from CSV |
| area_after | VARCHAR NULL | Area after discharge |
| position_after | VARCHAR NULL | Position after discharge |

Relationships:

```txt
vessel_visits 1 -- N vessel_visit_containers
containers 1 -- N vessel_visit_containers
```

## 12. uploaded_files

Stores information about uploaded CSV files.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_file | SERIAL PRIMARY KEY | Unique file id |
| id_vessel_visit | INTEGER FK NOT NULL | Vessel visit |
| id_uploaded_by | INTEGER FK NOT NULL | User who uploaded |
| file_type | VARCHAR NOT NULL | DISCHARGE_LIST or LOADING_LIST |
| file_name | VARCHAR NOT NULL | Original file name |
| uploaded_at | TIMESTAMP NOT NULL | Upload date |

Relationships:

```txt
vessel_visits 1 -- N uploaded_files
users 1 -- N uploaded_files
```

## 13. container_events

Stores operational history.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_container_event | SERIAL PRIMARY KEY | Unique event id |
| id_container | INTEGER FK NOT NULL | Container |
| id_user | INTEGER FK NOT NULL | User |
| id_vessel_visit | INTEGER FK NULL | Optional vessel visit |
| id_gate_transaction | INTEGER FK NULL | Optional gate transaction |
| event_type | VARCHAR NOT NULL | Event type |
| event_time | TIMESTAMP NOT NULL | Event time |
| event_area | VARCHAR NULL | Area associated with the event |
| event_position | VARCHAR NULL | Position associated with the event |
| description | TEXT NOT NULL | Event description |

Relationships:

```txt
containers 1 -- N container_events
users 1 -- N container_events
vessel_visits 1 -- N container_events
gate_transactions 1 -- N container_events
```

## 14. Recommended enum values

### roles.code

```txt
ADMIN
GATE_OPERATOR
TERMINAL_OPERATOR
CUSTOMER_AGENT
```

### customers.type

```txt
shipping_line
client
agent
```

### containers.current_area

```txt
Import Yard
Export Yard
Reefer Area
Empty Yard
ISO Tanks / IMDG Cargo Area
```

### gate_transactions.transaction_type

```txt
GATE_IN
GATE_OUT
```

### gate_transactions.container_condition

```txt
empty
full
```

### vessel_visits.status

```txt
planned
arrived
in_operation
completed
cancelled
```

### vessel_visit_containers.operation_type

```txt
DISCHARGE
LOAD
```

### vessel_visit_containers.operation_status

```txt
planned
confirmed
cancelled
```

### uploaded_files.file_type

```txt
DISCHARGE_LIST
LOADING_LIST
```

### container_events.event_type

```txt
GATE_IN
GATE_OUT
DISCHARGED
LOADED
LOCATION_UPDATED
VESSEL_VISIT_ASSIGNED
```

## 15. Use case to table mapping

| Use case | Tables | Notes |
|---|---|---|
| Login / Logout | users, roles | Authentication uses email, password_hash and role |
| View Profile | users, roles | Displays authenticated user data |
| Change Password | users | Updates password_hash |
| Manage Users | users, roles | Includes Create User, Update User, Delete User and Assign / Change Role |
| Create User | users, roles | Creates a new account and initial role |
| Update User | users, roles | Updates user data |
| Delete User | users | Logical delete through is_active |
| Assign / Change Role | users, roles | Updates users.id_role |
| View Containers | containers, customers, container_events, vessel_visit_containers, gate_transactions | Displays containers and history |
| Validate Container | containers, gate_transactions, vessel_visit_containers | Logical validation, no separate table |
| Register Gate IN | containers, gate_transactions, container_events | Includes Validate Container |
| Register Gate OUT | containers, gate_transactions, container_events | Includes Validate Container |
| Manage Vessel Visits | vessels, vessel_visits, vessel_visit_containers, uploaded_files, containers, container_events | Manages visits, CSV and loading/discharge confirmations |

## 16. Explanation of relationship loops

Some loops remain in the ERD because `container_events` is used for traceability.

Example:

```txt
containers -> gate_transactions -> container_events -> containers
```

This is acceptable because:

- `gate_transactions` stores the concrete Gate IN or Gate OUT transaction.
- `container_events` stores the historical event shown in the container timeline.
- `id_gate_transaction` in `container_events` is optional and used only when the event comes from a gate transaction.

Another example:

```txt
vessel_visits -> vessel_visit_containers -> containers -> container_events -> vessel_visits
```

This is acceptable because:

- `vessel_visit_containers` stores the planned/confirmed vessel operation.
- `container_events` stores the history event generated after confirmation.
- `id_vessel_visit` in `container_events` is optional and used only when the event is related to a vessel visit.

These loops do not mean duplicated entities. They are used to preserve operational traceability.
