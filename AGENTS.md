# AGENTS.md

## Project

MaritimeOps is a simplified Container Terminal Management System for a university licenta project.

Build and maintain the app according to the documentation in `/docs`.

Main source of truth:

- docs/00_README.md
- docs/02_requirements.md
- docs/03_roles_permissions.md
- docs/04_use_cases.md
- docs/08_backend_architecture.md
- docs/09_database_design.md
- docs/10_sql_schema_plan.md
- docs/18_build_implementation_plan.md
- docs/19_relational_model_constraints.md

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

Do not run commands unless the user explicitly asks for them in the current prompt.

Do not run automatically:
- npm run lint
- npm run build
- npm test
- npm install
- docker commands
- database commands
- migration/reset commands

Only run these commands when the user clearly says to run them.

Do not create long summaries after every change.

After each task, only say:

- files changed
- what was implemented
- what the user should run manually