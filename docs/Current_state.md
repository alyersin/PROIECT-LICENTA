# MaritimeOps Current State

## 1. Summary

MaritimeOps is a Next.js App Router application after copied batches 1-10. Static inspection shows the project now contains the main application layers for authentication, users, containers, gate operations, vessel visits, CSV import, vessel operation confirmation, dashboard metrics, Docker files, and the final 10-table PostgreSQL model.

No lint, build, tests, dev server, Docker, or database commands were run, so this report does not prove runtime correctness. It documents code and file state only.

Important current findings:

- `AGENTS.md` references docs such as `docs/00_README.md`, but the numbered documentation files are actually under `docs/full_documentation/`.
- `papaparse` is installed in `package.json`.
- `Dockerfile`, `docker-compose.yml`, and `.dockerignore` exist.
- CSV import exists, but it is a textarea-based CSV content form, not a physical file picker workflow.
- Vessel discharge/load confirmation exists, but discharge confirmation cannot collect missing location values interactively from the operations table.
- Dashboard metrics are data-backed through `src/repositories/dashboard.repository.js`.
- Dashboard recent event links always point to `/containers/[id]`, which is correct for Gate and Terminal users but wrong for Customer Agent users and not accessible for Admin users.
- Dynamic routes use `await params`, and pages with query parameters use `await searchParams`, which is compatible with current Next.js App Router async params behavior.

## 2. Project stack

Implemented stack:

- Next.js `16.1.6`
- React `19.2.3`
- JavaScript
- Tailwind CSS v4 through `@tailwindcss/postcss`
- Global reusable CSS classes in `src/app/globals.css`
- PostgreSQL through `pg`
- NextAuth/Auth.js through `next-auth`
- bcrypt through `bcrypt`
- PapaParse through `papaparse`
- Docker / Docker Compose files
- Manual validation
- Simple SQL files in `database/`

No TypeScript, Prisma, Drizzle, Zod, Redis, Kubernetes, Nginx, HTTPS setup, or microservice structure was found.

## 3. Package scripts and dependencies

Scripts in `package.json`:

- `dev`: `next dev`
- `build`: `next build`
- `start`: `next start`
- `lint`: `eslint`

Runtime dependencies:

- `bcrypt`
- `next`
- `next-auth`
- `papaparse`
- `pg`
- `react`
- `react-dom`

Dev dependencies:

- `@tailwindcss/postcss`
- `babel-plugin-react-compiler`
- `eslint`
- `eslint-config-next`
- `tailwindcss`

Status:

- `package-lock.json` exists.
- PapaParse is installed, matching the Batch 09 CSV import requirement.
- No install command was run during this inspection.

## 4. Root structure

Root folders found:

- `.git/`
- `.next/`
- `database/`
- `docs/`
- `node_modules/`
- `public/`
- `src/`

Root files found:

- `.dockerignore`
- `.env.example`
- `.gitignore`
- `AGENTS.md`
- `Dockerfile`
- `docker-compose.yml`
- `eslint.config.mjs`
- `jsconfig.json`
- `next.config.mjs`
- `package.json`
- `package-lock.json`
- `postcss.config.mjs`
- `README.md`
- Draw.io/SVG/DOCX project artifacts for ERD and use cases

Observation:

- `.next/` and `node_modules/` are present locally, but their contents were not used as proof of build/runtime health.

## 5. Documentation files

Current docs structure:

- `docs/Current_state.md`
- `docs/full_documentation/00_README.md`
- `docs/full_documentation/01_project_overview.md`
- `docs/full_documentation/02_requirements.md`
- `docs/full_documentation/03_roles_permissions.md`
- `docs/full_documentation/04_use_cases.md`
- `docs/full_documentation/05_ui_ux_wireframes.md`
- `docs/full_documentation/06_styling_globals_css.md`
- `docs/full_documentation/07_frontend_architecture.md`
- `docs/full_documentation/08_backend_architecture.md`
- `docs/full_documentation/09_database_design.md`
- `docs/full_documentation/10_sql_schema_plan.md`
- `docs/full_documentation/11_csv_import_flow.md`
- `docs/full_documentation/12_auth_security.md`
- `docs/full_documentation/13_docker_containerization.md`
- `docs/full_documentation/14_local_linux_deployment.md`
- `docs/full_documentation/15_logs_maintenance.md`
- `docs/full_documentation/16_testing_plan.md`
- `docs/full_documentation/17_future_improvements.md`
- `docs/full_documentation/18_build_implementation_plan.md`
- `docs/full_documentation/19_relational_model_constraints.md`

Mismatch:

- `AGENTS.md` names `docs/00_README.md`, `docs/02_requirements.md`, and similar root-level docs as source of truth.
- Those root-level numbered docs do not exist; the actual files are inside `docs/full_documentation/`.

## 6. Database files

Database files:

- `database/schema.sql`
- `database/seed.sql`

`schema.sql` defines the expected final 10 tables:

- `roles`
- `users`
- `customers`
- `containers`
- `gate_transactions`
- `vessels`
- `vessel_visits`
- `vessel_visit_containers`
- `uploaded_files`
- `container_events`

No forbidden tables were found in the schema: no `user_roles`, `container_moves`, `yard_blocks`, `yard_slots`, `container_visits`, or stowage plan tables.

Static schema risks:

- `schema.sql` starts with `DROP TABLE IF EXISTS`, so it is destructive if run against a database with data.
- `customers.name` is not unique, while `seed.sql` uses `WHERE NOT EXISTS` checks for customer inserts.
- `containers.status` has no CHECK constraint, while app code uses statuses such as `planned`, `in_terminal`, `gate_out`, `discharged`, and `loaded`.

## 7. Environment and Docker files

Environment:

- `.env.example` exists.
- It defines `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`.
- The example `DATABASE_URL` uses host `db`, which matches Docker Compose networking.
- No real `.env` file was inspected.

Docker:

- `Dockerfile` exists.
- `docker-compose.yml` exists.
- `.dockerignore` exists.

Dockerfile status:

- Uses `node:20-alpine`.
- Runs `npm install`.
- Copies the project.
- Runs `npm run build`.
- Starts with `npm start`.

Docker Compose status:

- Defines `web` and `db` services.
- Uses `postgres:16`.
- Publishes web port `3000:3000`.
- Uses a persistent `maritimeops_pgdata` volume.

Deployment gaps by inspection:

- Compose does not automatically run `database/schema.sql` or `database/seed.sql`.
- `.dockerignore` excludes `docs`, `README.md`, DOCX/Draw.io/SVG files, and also lists `Dockerfile` and `docker-compose.yml`.
- Build/runtime readiness is unverified because Docker commands and build commands were not run.

## 8. Frontend pages

Pages found under `src/app`:

- `/`
- `/login`
- `/dashboard`
- `/profile`
- `/change-password`
- `/admin/users`
- `/admin/users/create`
- `/admin/users/[id]/edit`
- `/containers`
- `/containers/[id]`
- `/gate`
- `/gate/in`
- `/gate/out`
- `/my-containers`
- `/my-containers/[id]`
- `/vessel-visits`
- `/vessel-visits/create`
- `/vessel-visits/[id]`
- `/vessel-visits/[id]/edit`
- `/vessel-visits/[id]/import`

Status:

- Protected pages redirect unauthenticated users to `/login`.
- Role-specific pages redirect unauthorized users to `/dashboard`.
- Navigation paths in `src/lib/navigation.js` all point to existing pages.
- The home page links to `/login` and `/dashboard`; `/dashboard` exists but is protected.

## 9. API routes

API routes found:

- `/api/auth/[...nextauth]`
- `/api/profile/change-password`
- `/api/users`
- `/api/users/[id]`
- `/api/containers`
- `/api/containers/validate`
- `/api/containers/[id]/location`
- `/api/gate/in`
- `/api/gate/out`
- `/api/vessels`
- `/api/vessel-visits`
- `/api/vessel-visits/[id]`
- `/api/vessel-visits/[id]/upload-csv`
- `/api/vessel-visits/operations/[id]/confirm-discharge`
- `/api/vessel-visits/operations/[id]/confirm-load`

Status:

- Auth, profile password change, users, containers, validation, gate IN/OUT, vessels, vessel visits, CSV import, and operation confirmation routes exist.
- API authorization is mostly enforced by checking `getCurrentUser()` and `role_code`.
- Some admin API routes return `403 Forbidden` for both unauthenticated and non-admin users instead of distinguishing `401 Unauthorized`.

## 10. Components

Component folders found:

- `src/components/admin/`
- `src/components/containers/`
- `src/components/dashboard/`
- `src/components/forms/`
- `src/components/gate/`
- `src/components/layout/`
- `src/components/ui/`
- `src/components/vessel-visits/`

Notable components:

- Admin: `UsersTable`
- Containers: `ContainersTable`, `ContainerDetails`, `ContainerEventsTimeline`
- Dashboard: `DashboardStatGrid`, `RecentEventsTable`
- Forms: `LoginForm`, `ChangePasswordForm`, `UserForm`, `GateInForm`, `GateOutForm`, `UpdateLocationForm`, `VesselVisitForm`, `CsvUploadForm`
- Gate: `GateTransactionsTable`
- Layout: `AppShell`, `Header`, `Sidebar`, `LogoutButton`
- UI: `Badge`, `Button`, `Card`, `EmptyState`, `Input`, `PageHeader`, `Select`, `Table`, `Textarea`
- Vessel visits: `VesselVisitsTable`, `VesselVisitDetails`, `VisitContainersTable`, `UploadedFilesTable`, `VesselOperationActions`

Status:

- Basic UI coverage exists for all required modules.
- CSV import exists as pasted textarea content with sample CSV values.
- Operation confirmation exists as inline confirm buttons.

## 11. Lib helpers

Files under `src/lib/`:

- `auth.js`
- `constants.js`
- `csv.js`
- `db.js`
- `navigation.js`
- `passwords.js`
- `permissions.js`
- `validation.js`

Status:

- `auth.js` configures NextAuth Credentials Provider and session fields.
- `constants.js` centralizes role codes, areas, statuses, file types, and event types.
- `csv.js` uses PapaParse for header-based CSV parsing and row validation.
- `db.js` creates a `pg` pool and transaction helper.
- `navigation.js` defines role-based sidebar links.
- `passwords.js` wraps bcrypt hash/compare.
- `permissions.js` exists but some authorization checks are duplicated directly in services/pages.
- `validation.js` exists, but several services/routes also use local validation instead of consistently using this helper.

## 12. Repositories

Repository files found:

- `customers.repository.js`
- `containers.repository.js`
- `dashboard.repository.js`
- `events.repository.js`
- `gate.repository.js`
- `roles.repository.js`
- `uploadedFiles.repository.js`
- `users.repository.js`
- `vessels.repository.js`
- `vesselVisitContainers.repository.js`
- `vesselVisits.repository.js`

Status:

- Repositories cover users, roles, customers, containers, events, gate transactions, vessels, vessel visits, visit operations, uploaded files, and dashboard metrics.
- `dashboard.repository.js` contains role-specific summary metrics and recent events queries.
- `uploadedFiles.repository.js` tracks imported CSV records.
- `vesselVisitContainers.repository.js` creates and confirms planned operations.

## 13. Services

Service files found:

- `containers.service.js`
- `csvImport.service.js`
- `gate.service.js`
- `users.service.js`
- `vesselOperations.service.js`
- `vesselVisits.service.js`

Status:

- User create/update and password hashing are implemented.
- Container validation and location updates are implemented.
- Gate IN/OUT transactions update containers and create events.
- Vessel visit create/update is implemented.
- CSV import parses rows, creates uploaded file records, creates missing containers, and creates vessel visit operation records.
- Vessel operation confirmation updates operation status, updates container status/location, and creates `DISCHARGED` or `LOADED` events.

## 14. Authentication and authorization

Authentication:

- NextAuth Credentials Provider is configured.
- Login uses `signIn("credentials")`.
- Logout uses `signOut`.
- bcrypt password comparison is used.
- Session includes user id, customer id, full name, role code/name, and customer name.

Authorization:

- Sidebar navigation is role-based.
- Admin pages and user APIs require `ADMIN`.
- Gate pages and routes require `GATE_OPERATOR`.
- Vessel visit pages and routes require `TERMINAL_OPERATOR`.
- Customer container pages require `CUSTOMER_AGENT`.
- Container detail viewing is role-aware in `containers.service.js`.

Known issues:

- `src/lib/permissions.js` has a `canViewContainer` function that allows all Customer Agents to view any container if used, while `src/services/containers.service.js` has the stricter customer-id check. Current detail pages use the stricter service function.
- Admin dashboard recent event links point to `/containers/[id]`, but Admin cannot access `/containers/[id]`.
- Customer dashboard recent event links also point to `/containers/[id]`, but Customer Agent users should use `/my-containers/[id]`.

## 15. Database and seed status

Schema alignment:

- The implemented schema matches the final 10-table ERD model.
- `users.is_active` is present for logical delete.
- `container_events` is present for operational history.
- `uploaded_files` and `vessel_visit_containers` are present for CSV import and vessel operations.
- `users.id_customer` is present to support Customer Agent access.

Seed status:

- Roles are seeded.
- Customers are seeded.
- Vessels are seeded.
- Demo containers are seeded.
- Demo users are seeded.
- Initial container location events are seeded.

Demo users in `seed.sql`:

- `admin@maritimeops.local`
- `gate@maritimeops.local`
- `terminal@maritimeops.local`
- `customer@maritimeops.local`

Password status:

- `seed.sql` stores the same bcrypt hash for all demo users.
- Documentation under `docs/full_documentation/12_auth_security.md` gives `admin123` as an example password, but the actual password behind the seed hash was not verified because no non-read-only command was run.

Seed gaps:

- No vessel visits are seeded.
- No vessel visit container operations are seeded.
- No uploaded files are seeded.
- No gate transactions are seeded.

## 16. Dashboard status

Implemented:

- Role-specific dashboard titles, descriptions, cards, and recent events.
- Admin metrics: total users, active users, inactive users, roles.
- Gate metrics: Gate IN today, Gate OUT today, containers in terminal, containers gate out.
- Terminal metrics: active vessel visits, pending discharge, pending loading, containers in terminal.
- Customer metrics: my containers, in terminal, loaded, gate out.
- Recent events table for operational history.

Issue:

- Recent event container links are not role-aware. They always link to `/containers/[id]`.
- This is correct for Gate Operator and Terminal Operator.
- It is incorrect for Customer Agent, who should link to `/my-containers/[id]`.
- It is also not accessible for Admin, because Admin does not have access to `/containers/[id]`.

## 17. UI/layout static review

Static UI status:

- `AppShell` uses a sidebar, header, and main content layout.
- `globals.css` defines reusable app classes for layout, cards, forms, buttons, tables, badges, alerts, timelines, and login shell.
- Tables use horizontal overflow wrappers.
- Grids collapse responsively.
- Sidebar is hidden under `900px`.

CSS class inspection:

- No obvious JSX class names were found that lack a matching global CSS definition.
- Some classes are defined but not necessarily used, which is not a functional problem.

UI risks:

- No mobile navigation replaces the sidebar below `900px`.
- The app uses a dark blue/slate-heavy palette.
- `Card` supports an `action` prop, but `.app-card-header` is not styled as a flex header, so card header actions may not align as intended.
- CSV import is not a real file upload UI; users paste CSV text.
- Discharge confirmation has no inline form for missing `area_after` or `position_after`.

## 18. Implemented use cases

Implemented or mostly implemented:

- Login
- Logout
- View Profile
- Change Password
- Manage Users
- Create User
- Update User
- Delete User through `users.is_active = false`
- Assign / Change Role
- View Containers
- Validate Container
- Register Gate IN
- Register Gate OUT
- Manage Vessel Visits

Manage Vessel Visits includes:

- Vessel visit list/create/detail/edit pages.
- CSV import route and UI.
- Uploaded files table.
- Vessel visit operation records.
- Confirm discharge and confirm loading actions.
- Container events for `DISCHARGED` and `LOADED`.

## 19. Missing or incomplete features

Incomplete by inspection:

- CSV import is textarea-based and does not use a browser file input.
- CSV preview is not implemented before import.
- Discharge confirmation cannot collect missing area/position values from the operation row.
- No seeded vessel visits or operations, so vessel visit features need manual data setup after seeding.
- Dashboard recent event links are not role-aware.
- No mobile authenticated navigation when sidebar is hidden.
- No automated schema/seed execution in Docker Compose.
- No explicit audit log outside `container_events`, which is acceptable for current scope.

## 20. Issues or risks found by inspection

Potential broken or suspicious paths:

- Main documentation path mismatch: `AGENTS.md` references root `docs/*.md`, but actual numbered docs are under `docs/full_documentation/`.
- Dashboard recent event links can route Admin and Customer Agent users to inaccessible `/containers/[id]` pages.
- No missing local import target was obvious from static import inspection.
- All navigation paths in `src/lib/navigation.js` exist.

Next.js App Router params:

- Dynamic route pages and API routes use `const { id } = await params;`.
- Pages with query parameters use `const resolvedSearchParams = await searchParams;`.
- This is compatible with current async App Router params behavior.

Server/client component risks:

- Client components receive objects loaded from PostgreSQL, including possible Date/numeric values. This should be watched during build/runtime testing.
- `CsvUploadForm` receives the full `vesselVisit` object but only needs the id.

Database/service risks:

- Re-importing the same CSV operation can violate `uq_vvc_visit_container_operation`; no graceful duplicate handling was found.
- `createVessel` may throw on duplicate `imo`; no conflict handling was found in the API route.
- `containers.status` is free text in the schema.
- User deletion deactivates users but does not prevent deactivating the currently logged-in admin by inspection.
- Validation rules are split between `src/lib/validation.js` and service-local validation.

Build/dependency risks:

- No build/lint/test command was run.
- `bcrypt` native behavior can be environment-sensitive.
- `next.config.mjs` enables `reactCompiler: true`; build status was not verified.

Placeholder/sample content:

- CSV import form includes sample CSV content by default.
- Home page describes project modules rather than a production landing experience, which is acceptable for a licenta prototype.

## 21. Docker/deployment readiness

Ready by file presence:

- `Dockerfile` exists.
- `docker-compose.yml` exists.
- `.env.example` exists.
- PostgreSQL service is defined.
- Web service is defined.

Not fully ready by automation:

- Schema and seed are not automatically applied by Compose.
- No health checks are defined.
- No production secret is provided; `.env.example` uses placeholder `NEXTAUTH_SECRET`.
- Build success is unknown because `npm run build` was not run.
- Database initialization success is unknown because no Docker or database commands were run.

## 22. Recommended next step

Recommended next step:

Run the first verification pass manually in this order:

1. Confirm the intended demo password for the seeded bcrypt hash, or regenerate/update the seed hash and document the demo password clearly.
2. Run lint/build manually to catch compile, import, serialization, and Next.js App Router issues.
3. Run Docker Compose manually and apply `schema.sql` plus `seed.sql`.
4. Login with each seeded role and manually test the full flows: dashboard, users, containers, gate IN/OUT, vessel visit create/import/confirm, profile, and change password.
5. Fix the dashboard recent event link routing for Admin and Customer Agent users.

## Last inspection rules

- Only read-only inspection commands were used.
- No build, lint, test, install, dev server, Docker, or database commands were run.
- No source code was changed.
- Only docs/Current_state.md was changed.
- UI review was static code inspection only.
