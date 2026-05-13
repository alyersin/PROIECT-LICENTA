# AGENTS.md

## Project

This project is called MaritimeOps.

MaritimeOps is a simplified Container Terminal Management System built for a licenta project. The application manages users, roles, containers, Gate IN/Gate OUT operations, vessel visits, CSV import for loading/discharge lists, and container operational history.

Before making changes, read the documentation inside the `docs/` folder. The current documentation is aligned with the updated Use Case diagram and updated ERD.

## Current Documentation Sources

Use these documents as the source of truth:

```txt
docs/00_README.md
docs/01_project_overview.md
docs/02_requirements.md
docs/03_roles_permissions.md
docs/04_use_cases.md
docs/05_ui_ux_wireframes.md
docs/06_styling_globals_css.md
docs/07_frontend_architecture.md
docs/08_backend_architecture.md
docs/09_database_design.md
docs/10_sql_schema_plan.md
docs/11_csv_import_flow.md
docs/12_auth_security.md
docs/13_docker_containerization.md
docs/14_local_linux_deployment.md
docs/15_logs_maintenance.md
docs/16_testing_plan.md
docs/17_future_improvements.md
docs/18_build_implementation_plan.md
docs/19_relational_model_constraints.md
```

The Word documentation and diagrams are used for academic explanation. The Markdown files are used as the build documentation for implementation.

## Final Tech Stack

Use only:

- Next.js
- JavaScript
- Tailwind CSS
- reusable global CSS classes in `src/app/globals.css`
- PostgreSQL
- `pg` library for SQL queries
- NextAuth/Auth.js
- bcrypt
- PapaParse
- manual validation
- Docker
- Docker Compose
- Docker logs
- UFW documentation only
- `.env` variables
- simple SQL files

Do not add:

- Prisma
- Drizzle
- Zod
- Redis
- Kubernetes
- Nginx
- HTTPS setup
- advanced monitoring
- complex backup systems
- microservices

## Scope Rules

Keep the project simple and suitable for a university licenta project.

Do not build a full Terminal Operating System like Navis.

The application must focus only on:

- authentication
- role-based access
- user profile viewing
- password changing
- user management by Administrator
- container viewing and searching
- Gate IN
- Gate OUT
- vessel visit management
- CSV import for discharge and loading lists
- loading/discharge confirmation
- simplified container location updates
- container operational history

Do not implement:

- detailed yard slot planning
- yard blocks, bays, rows or tiers
- automatic stacking calculation
- internal move planning as a separate module
- crane planning
- real stowage planning
- EDI integration
- public API
- payment module

## Actor and Role Rules

The Use Case model uses a general actor named `User`.

The following actors are specializations of `User`:

- Administrator
- Gate Operator
- Terminal Operator
- Customer / Line Agent

The general `User` can:

- Login
- Logout
- View Profile
- Change Password

The Administrator can:

- Manage Users
- Create User
- Update User
- Delete User logically by deactivation
- Assign / Change Role

The Gate Operator can:

- View Containers
- Register Gate IN
- Register Gate OUT

The Terminal Operator can:

- View Containers
- update container location from container details
- Manage Vessel Visits
- import CSV loading/discharge lists
- confirm loading/discharge operations

The Customer / Line Agent can:

- View Containers associated with their customer account only

## Use Case Rules

The current use cases are:

```txt
Login
Logout
View Profile
Change Password
Manage Users
Create User
Update User
Delete User
Assign / Change Role
View Containers
Validate Container
Register Gate IN
Register Gate OUT
Manage Vessel Visits
```

`Validate Container` is a logical validation included by `Register Gate IN` and `Register Gate OUT`. It is not a separate database table.

`Manage Users` includes:

```txt
Create User
Update User
Delete User
Assign / Change Role
```

`Register Gate IN` and `Register Gate OUT` include:

```txt
Validate Container
```

Do not reintroduce `Manage Stowage Plan` as a current use case. The stowage plan is considered external to the terminal application and is normally prepared by the vessel, Chief Officer, master, shipping line or agent. MaritimeOps works only with simplified CSV loading/discharge lists.

## Database Rules

Use exactly the simplified 10-table model:

```txt
roles
users
customers
containers
gate_transactions
vessels
vessel_visits
vessel_visit_containers
uploaded_files
container_events
```

Do not add these removed tables:

```txt
user_roles
container_moves
yard_blocks
yard_slots
container_visits
```

Each user has one role through:

```txt
users.id_role -> roles.id_role
```

For Customer / Line Agent access, the user may be associated with a customer through:

```txt
users.id_customer -> customers.id_customer
```

Containers may be associated with a customer through:

```txt
containers.id_customer -> customers.id_customer
```

`containers.id_customer` may be nullable when customer information is not available initially.

Container location is simplified and stored in:

```txt
containers.current_area
containers.current_position
```

Allowed simplified areas:

```txt
Import Yard
Export Yard
Reefer Area
Empty Yard
ISO Tanks / IMDG Cargo Area
```

The position is textual. The application does not calculate physical tiers and does not verify whether a position is free.

## Container Events Rules

Use `container_events` for operational history.

The table must support:

```txt
id_container_event
id_container
id_user
id_vessel_visit
id_gate_transaction
event_type
event_time
event_area
event_position
description
```

`id_vessel_visit` is nullable.

`id_gate_transaction` is nullable.

`event_area` is nullable.

`event_position` is nullable.

Allowed event types:

```txt
GATE_IN
GATE_OUT
DISCHARGED
LOADED
LOCATION_UPDATED
VESSEL_VISIT_ASSIGNED
```

When creating events:

- Gate IN creates `GATE_IN`
- Gate OUT creates `GATE_OUT`
- location correction creates `LOCATION_UPDATED`
- discharge confirmation creates `DISCHARGED`
- loading confirmation creates `LOADED`
- assignment to a vessel visit may create `VESSEL_VISIT_ASSIGNED`

## Relational Model and Constraint Rules

When working on database documentation or SQL, keep the formal relational model aligned with `docs/19_relational_model_constraints.md`.

The formal model must mention:

- primary keys
- foreign keys
- nullable fields
- not-null fields
- unique fields
- check constraints or enum-like values
- delete/deactivation rules
- explanations for circular relationships in the ERD

The apparent ERD cycles are acceptable because `container_events` stores operational history and traceability. Explain that optional references to `gate_transactions` and `vessel_visits` do not duplicate the main relationship; they identify the operation that generated the event.

## Development Rules

Use simple SQL files:

```txt
database/schema.sql
database/seed.sql
```

Use the `pg` library for database access.

Keep database queries readable and close to standard SQL.

Use manual validation with simple `if` checks.

Use bcrypt for password hashing and password comparison.

Use PapaParse for CSV import.

Use NextAuth/Auth.js for authentication.

Use role-based access based on these roles:

```txt
ADMIN
GATE_OPERATOR
TERMINAL_OPERATOR
CUSTOMER_AGENT
```

Backend authorization must be enforced in route handlers or services. Hiding a link in the UI is not enough.

Operations that update multiple tables must use database transactions. Examples:

- Gate IN
- Gate OUT
- Confirm discharge
- Confirm loading
- Update location
- CSV import when creating multiple rows

## Styling Rules

Use Tailwind CSS, but avoid very long Tailwind class strings in JSX.

Prefer reusable classes defined in:

```txt
src/app/globals.css
```

Use clear dashboard-style UI components:

- buttons
- cards
- forms
- tables
- badges
- modals

Keep the interface professional, simple and easy to demonstrate.
