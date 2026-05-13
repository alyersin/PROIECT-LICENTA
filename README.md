# MaritimeOps Documentation Pack

MaritimeOps is a simplified Container Terminal Management System designed for a licenta project.

The documentation in this pack is aligned with the updated Use Case diagram, the updated ERD, and the updated database/use-case reports.

## Documentation files

The documentation pack covers:

1. `00_README.md` - documentation pack overview
2. `01_project_overview.md` - project purpose, scope and simplified terminal model
3. `02_requirements.md` - functional and non-functional requirements
4. `03_roles_permissions.md` - roles, permissions and access rules
5. `04_use_cases.md` - updated use cases
6. `05_ui_ux_wireframes.md` - UI/UX design and wireframes
7. `06_styling_globals_css.md` - Tailwind CSS and `globals.css` strategy
8. `07_frontend_architecture.md` - frontend folder structure and pages
9. `08_backend_architecture.md` - backend architecture, routes, services and repositories
10. `09_database_design.md` - updated database design
11. `10_sql_schema_plan.md` - SQL schema and seed planning
12. `11_csv_import_flow.md` - loading/discharge CSV import flow
13. `12_auth_security.md` - authentication and security
14. `13_docker_containerization.md` - Docker and Docker Compose setup
15. `14_local_linux_deployment.md` - local Linux server deployment
16. `15_logs_maintenance.md` - logs and basic maintenance
17. `16_testing_plan.md` - manual testing plan
18. `17_future_improvements.md` - future improvements outside current scope
19. `18_build_implementation_plan.md` - recommended build order
20. `19_relational_model_constraints.md` - formal relational model and constraints

## Project summary

MaritimeOps is a web application for simplified operational management in a container terminal.

The application supports:

- user authentication
- role-based access
- profile viewing
- password changing
- user management
- container search and visualization
- Gate IN operations
- Gate OUT operations
- vessel visit management
- CSV import for discharge and loading lists
- confirmation of discharge and loading operations
- simplified container location updates
- container operational history

The system is not intended to replace a real industrial Terminal Operating System. It models the essential logic in a simplified and understandable way for an academic licenta project.

## Main design principle

> Keep the project realistic enough for a container terminal application, but simple enough to explain, build and present clearly for a licenta project.

## Final simplified technology stack

```txt
Next.js
JavaScript
Tailwind CSS + globals.css
PostgreSQL
pg library
NextAuth/Auth.js
bcrypt
PapaParse
Docker
Docker Compose
Docker logs
UFW
.env variables
Manual validation
Simple SQL files
```

## Current roles and actors

The Use Case diagram uses a general actor named `User`.

The following actors specialize `User`:

- Administrator
- Gate Operator
- Terminal Operator
- Customer / Line Agent

The general `User` has access to:

- Login
- Logout
- View Profile
- Change Password

The Administrator manages users and roles.

The Gate Operator registers Gate IN and Gate OUT operations.

The Terminal Operator manages vessel visits, CSV import and operational confirmations.

The Customer / Line Agent views only the containers associated with their customer account.

## Current use cases

The current use case set is:

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

`Validate Container` is a logical validation step and does not require a separate table.

## Current database model

The database uses a simplified 10-table model:

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

The model intentionally excludes:

```txt
user_roles
container_moves
yard_blocks
yard_slots
container_visits
```

Each user has one role through `users.id_role`.

Customer / Line Agent access can be connected through `users.id_customer`.

Containers can be connected to customers through `containers.id_customer`, which may be nullable when the customer is not known initially.

## Simplified terminal model

The application uses operational areas and textual positions.

Allowed simplified areas:

```txt
Import Yard
Export Yard
Reefer Area
Empty Yard
ISO Tanks / IMDG Cargo Area
```

Each container stores:

```txt
current_area
current_position
```

The system does not model detailed yard blocks, rows, tiers or individual slot algorithms.

The position is textual and simplified. The system does not automatically manage stacking levels, but the same position can represent a container stack. For example, `B2-05` can be read as block/sector B2, position 05. If multiple containers are registered with the same position, they can be conceptually interpreted as being stacked in the same location. The application does not automatically calculate the physical tier and does not verify if the position is free.

## Container events and ERD cycles

`container_events` stores the operational history of each container.

It can reference:

- the container
- the user who generated the event
- a vessel visit, when relevant
- a gate transaction, when relevant

The ERD may contain apparent circular relationships because `container_events` connects to multiple operational tables. These links are intentional and are used for traceability. The optional references do not duplicate the main data; they show which operation generated the event.

The formal explanation of these constraints is included in:

```txt
docs/19_relational_model_constraints.md
```

## Stowage plan decision

The current application does not implement a separate `Manage Stowage Plan` module.

The stowage plan is considered external to the terminal application and is normally prepared by the vessel, Chief Officer, master, shipping line or agent.

MaritimeOps works with simplified CSV loading/discharge lists inside the `Manage Vessel Visits` module.

## Deployment scope

The licenta version is designed for local Linux server deployment using Docker Compose.

Included:

- Docker
- Docker Compose
- PostgreSQL container
- Next.js web container
- Docker logs
- UFW documentation

Not required for the current version:

- Nginx
- HTTPS
- Kubernetes
- Redis
- advanced monitoring
- production backup automation

## Final goal

The final goal is to produce a working prototype that demonstrates how a container terminal can manage basic operational flows using a web application, a relational database and a local Docker-based deployment.
