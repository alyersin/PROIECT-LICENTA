# AGENTS.md

## Project

This project is called MaritimeOps.

MaritimeOps is a simplified Container Terminal Management System built for a licenta project. The application manages users, roles, containers, Gate IN/Gate OUT operations, vessel visits, CSV import for loading/discharge lists, and container operational history.

Before making changes, read the documentation inside the `docs/` folder.

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

## Development Rules

Keep the project simple and suitable for a university licenta project.

Do not over-engineer the application.

Use simple SQL files:

- `database/schema.sql`
- `database/seed.sql`

Use the `pg` library for database access.

Keep database queries readable and close to standard SQL.

Use manual validation with simple `if` checks.

Use bcrypt for password hashing and password comparison.

Use PapaParse for CSV import.

Use NextAuth/Auth.js for authentication.

Use role-based access based on these roles:

- ADMIN
- GATE_OPERATOR
- TERMINAL_OPERATOR
- CUSTOMER_AGENT

## Styling Rules

Use Tailwind CSS, but avoid very long Tailwind class strings in JSX.

Prefer reusable classes defined in:

```txt
src/app/globals.css