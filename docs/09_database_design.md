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

## 4. roles

Stores user roles.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_role | SERIAL PRIMARY KEY | Unique role id |
| code | VARCHAR UNIQUE | ADMIN, GATE_OPERATOR, TERMINAL_OPERATOR, CUSTOMER_AGENT |
| name | VARCHAR | Display name |

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
| id_role | INTEGER FK | References roles |
| id_customer | INTEGER FK NULL | Used for Customer / Line Agent |
| email | VARCHAR UNIQUE | Login email |
| password_hash | TEXT | bcrypt password hash |
| full_name | VARCHAR | User full name |
| is_active | BOOLEAN | Account status |
| created_at | TIMESTAMP | Creation date |

Relationships:

```txt
users N -- 1 roles
users N -- 1 customers
users 1 -- N gate_transactions
users 1 -- N vessel_visits
users 1 -- N uploaded_files
users 1 -- N container_events
```

## 6. customers

Stores clients, agents or shipping lines.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_customer | SERIAL PRIMARY KEY | Unique customer id |
| name | VARCHAR | Customer/agent/shipping line name |
| type | VARCHAR | shipping_line, client, agent |
| created_at | TIMESTAMP | Creation date |

Relationship:

```txt
customers 1 -- N containers
customers 1 -- N users
```

## 7. containers

Stores container data and current simplified location.

Fields:

| Field | Type | Notes |
|---|---|---|
| id_container | SERIAL PRIMARY KEY | Unique container id |
| container_no | VARCHAR UNIQUE | Example: MSCU1234567 |
| iso_type | VARCHAR | ISO type |
| size_ft | INTEGER | 20, 40, 45 |
| status | VARCHAR | Operational status |
| is_reefer | BOOLEAN | Reefer flag |
| gross_weight_kg | NUMERIC | Gross weight |
| current_area | VARCHAR | Import Yard, Export Yard, Reefer Area, Empty Yard, ISO Tanks / IMDG Cargo Area |
| current_position | VARCHAR | Textual position, example: B2-05 |
| id_customer | INTEGER FK | Customer/agent/shipping line |

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
| id_container | INTEGER FK | Container |
| id_user | INTEGER FK | Gate Operator |
| transaction_type | VARCHAR | GATE_IN or GATE_OUT |
| truck_no | VARCHAR | Truck number |
| transaction_time | TIMESTAMP | Date/time |
| container_condition | VARCHAR | empty or full |
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
| name | VARCHAR | Vessel name |
| imo | VARCHAR UNIQUE | IMO number |

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
| id_vessel | INTEGER FK | Vessel |
| id_created_by | INTEGER FK | Terminal Operator |
| inbound_voyage_no | VARCHAR NULL | Inbound voyage |
| outbound_voyage_no | VARCHAR NULL | Outbound voyage |
| eta | TIMESTAMP | Estimated time of arrival |
| etd | TIMESTAMP | Estimated time of departure |
| berth | VARCHAR NULL | Berth |
| status | VARCHAR | planned, arrived, in_operation, completed, cancelled |
| created_at | TIMESTAMP | Creation date |

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
| id_vessel_visit | INTEGER FK | Vessel visit |
| id_container | INTEGER FK | Container |
| operation_type | VARCHAR | DISCHARGE or LOAD |
| operation_status | VARCHAR | planned, confirmed, cancelled |
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
| id_vessel_visit | INTEGER FK | Vessel visit |
| id_uploaded_by | INTEGER FK | User who uploaded |
| file_type | VARCHAR | DISCHARGE_LIST or LOADING_LIST |
| file_name | VARCHAR | Original file name |
| uploaded_at | TIMESTAMP | Upload date |

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
| id_container | INTEGER FK | Container |
| id_user | INTEGER FK | User |
| id_vessel_visit | INTEGER FK NULL | Optional vessel visit |
| id_gate_transaction | INTEGER FK NULL | Optional gate transaction |
| event_type | VARCHAR | Event type |
| event_time | TIMESTAMP | Event time |
| description | TEXT | Event description |

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

| Use case | Tables |
|---|---|
| Login / Logout | users, roles |
| Manage Users | users, roles, customers |
| View Containers | containers, customers, container_events, vessel_visit_containers, gate_transactions |
| Register Gate IN | containers, gate_transactions, container_events |
| Register Gate OUT | containers, gate_transactions, container_events |
| Manage Vessel Visits | vessels, vessel_visits, vessel_visit_containers, uploaded_files, containers, container_events |
