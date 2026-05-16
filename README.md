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

Customer / Line Agent access is connected through nullable `users.id_customer`.

`users.id_customer` is a foreign key to `customers.id_customer`. It is used only for `CUSTOMER_AGENT` users so the application can show only containers linked to that customer. It should be `NULL` for `ADMIN`, `GATE_OPERATOR`, and `TERMINAL_OPERATOR` users.

Containers can be connected to customers through `containers.id_customer`, which may be nullable when the customer is not known initially.

This keeps the final 10-table ERD model unchanged.

## Environment modes

Local Next.js + database in Docker:

```txt
POSTGRES_DB=maritimeops_db
POSTGRES_USER=maritimeops_user
POSTGRES_PASSWORD=replace_with_a_strong_local_database_password
POSTGRES_PORT=5433
DATABASE_URL=postgres://maritimeops_user:replace_with_a_strong_local_database_password@localhost:5433/maritimeops_db
NEXTAUTH_SECRET=replace_with_at_least_32_random_bytes_base64
NEXTAUTH_URL=http://localhost:3000
```

Full Docker Compose behind host Nginx:

```txt
POSTGRES_DB=maritimeops_db
POSTGRES_USER=maritimeops_user
POSTGRES_PASSWORD=replace_with_a_strong_local_database_password
DATABASE_URL=postgres://maritimeops_user:replace_with_a_strong_local_database_password@db:5432/maritimeops_db
NEXTAUTH_SECRET=replace_with_at_least_32_random_bytes_base64
NEXTAUTH_URL=https://my-subdomain.go.ro
NODE_ENV=production
```

`NEXTAUTH_SECRET` and `POSTGRES_PASSWORD` must be changed for every real or shared environment. Do not reuse the example placeholders.

Current safe Docker Compose port behavior:

```txt
web: 127.0.0.1:3000:3000
db: no published ports
```

The main `docker-compose.yml` is intended for the local Ubuntu Server deployment where Nginx runs on the host. PostgreSQL is reachable only inside the Docker network by the app container through `db:5432`.

For host-based local development where Next.js runs outside Docker and only PostgreSQL runs in Docker, use the optional localhost-only override:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db
```

This binds PostgreSQL to `127.0.0.1:${POSTGRES_PORT:-5433}` only. Do not use the dev override for public deployment.

## Demo users

Development-only demo users are intended to use password `admin123`. Change or disable these accounts before any shared demo or production-like deployment.

```txt
admin@maritimeops.local
gate@maritimeops.local
terminal@maritimeops.local
customer@maritimeops.local
```

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

## Local Ubuntu Server deployment

Target deployment architecture:

```txt
Internet
  -> Digi router / ONT
  -> forwards only 80 and 443
  -> Ubuntu Server
  -> UFW allows only SSH, 80, 443
  -> Nginx + Let's Encrypt
  -> http://127.0.0.1:3000
  -> MaritimeOps Docker web container
  -> Docker internal network
  -> PostgreSQL Docker container with no published ports
```

Public access should go through Nginx only. Do not forward or expose PostgreSQL. Do not expose app ports `3000` or `3001` publicly.

Recommended router forwarding:

```txt
80/tcp  -> Ubuntu server
443/tcp -> Ubuntu server
```

Do not forward:

```txt
22/tcp unless intentionally restricted
3000/tcp
3001/tcp
5432/tcp
5433/tcp
```

Recommended UFW setup:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 5432/tcp
sudo ufw deny 5433/tcp
sudo ufw deny 3000/tcp
sudo ufw deny 3001/tcp
sudo ufw enable
sudo ufw status verbose
```

Recommended Nginx and Certbot setup:

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d my-subdomain.go.ro
sudo certbot renew --dry-run
```

Use `docs/nginx-maritimeops.conf.example` as the starting Nginx site config. It proxies to `http://127.0.0.1:3000`, sets proxy headers, and includes basic security headers to add after HTTPS is working.

Before public exposure:

- set `NEXTAUTH_URL=https://my-subdomain.go.ro`
- generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`
- generate a strong `POSTGRES_PASSWORD`
- keep `.env` on the server only
- run `chmod 600 .env`
- change or disable all demo accounts using `admin123`
- confirm PostgreSQL has no `ports:` section in production Compose
- confirm the app is reachable only through Nginx

See also:

- `docs/DEPLOYMENT_SECURITY_CHECKLIST.md`
- `LOCAL_DEPLOYMENT_SECURITY_AUDIT.md`

## Deployment scope

The licenta version is designed for local Linux server deployment using Docker Compose.

Included:

- Docker
- Docker Compose
- PostgreSQL container
- Next.js web container
- Nginx reverse proxy
- Let's Encrypt SSL with Certbot
- Docker logs
- UFW documentation

Not required for the current version:

- Kubernetes
- Redis
- advanced monitoring
- production backup automation

## Final goal

The final goal is to produce a working prototype that demonstrates how a container terminal can manage basic operational flows using a web application, a relational database and a local Docker-based deployment.
