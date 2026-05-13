# AGENTS.md

## Project

MaritimeOps is a simplified Container Terminal Management System for a university licenta project.

Build and maintain the app according to the documentation in `/docs/full_documentation`.

Main source of truth:

- docs/full_documentation/00_README.md
- docs/full_documentation/02_requirements.md
- docs/full_documentation/03_roles_permissions.md
- docs/full_documentation/04_use_cases.md
- docs/full_documentation/08_backend_architecture.md
- docs/full_documentation/09_database_design.md
- docs/full_documentation/10_sql_schema_plan.md
- docs/full_documentation/18_build_implementation_plan.md
- docs/full_documentation/19_relational_model_constraints.md
- docs/Current_state.md

Use other docs only when relevant to the task.

## Stack

Use only:

- Next.js
- JavaScript
- Tailwind CSS
- global reusable CSS classes in `src/app/globals.css`
- PostgreSQL
- pg
- NextAuth/Auth.js
- bcrypt
- PapaParse
- manual validation
- Docker / Docker Compose
- simple SQL files

Do not add:

- TypeScript
- Prisma
- Drizzle
- Zod
- Redis
- Kubernetes
- Nginx
- HTTPS setup
- microservices
- advanced monitoring
- unnecessary dependencies

## Database rules

Use the final 10-table model:

- roles
- users
- customers
- containers
- gate_transactions
- vessels
- vessel_visits
- vessel_visit_containers
- uploaded_files
- container_events

Do not create:

- user_roles
- container_moves
- yard_blocks
- yard_slots
- container_visits
- stowage plan management

Use `users.is_active` for logical user delete.

Use `container_events` for operational history.

`Validate Container` is application logic, not a database table.

## Use case rules

Final use cases:

- Login
- Logout
- View Profile
- Change Password
- Manage Users
- Create User
- Update User
- Delete User
- Assign / Change Role
- View Containers
- Validate Container
- Register Gate IN
- Register Gate OUT
- Manage Vessel Visits

Do not reintroduce `Manage Stowage Plan`.

## Work rules

Keep the project simple, readable, and beginner-friendly.

Make focused changes.

Allowed without asking:

- read-only inspection commands for listing and reading files

Do not run build/test/install/deployment/database commands unless the user explicitly asks.

Do not run automatically:

- npm run lint
- npm run build
- npm test
- npm install
- npm run dev
- docker commands
- database commands
- migration/reset commands
- delete/reset/cleanup commands

The user will run commands manually.

Do not create long summaries after every change.

After each task, only say:

- files changed
- what was implemented
- what the user should run manually
