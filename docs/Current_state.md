# MaritimeOps Current State

## 1. Summary

MaritimeOps is now a partially built Next.js App Router application after batches 1-6.

The project has:

- Core Next.js project structure.
- Global CSS styling.
- PostgreSQL schema and seed SQL files.
- Basic `pg` database helper.
- NextAuth credentials authentication setup.
- Login, dashboard, profile, change-password, admin user, containers, and my-containers pages.
- User, profile password, and container API routes.
- Basic repositories and service layer for users, roles, customers, containers, and container events.

The app is not complete yet. Authentication, user management, containers, customer container viewing, container validation, container details, location updates, and password change are partially implemented. Gate IN, Gate OUT, vessel visits, CSV import, and full dashboard metrics are still missing.

## 2. Project stack

Current stack in the repository:

- Next.js 16.1.6
- React 19.2.3
- JavaScript
- Tailwind CSS v4 through `@tailwindcss/postcss`
- PostgreSQL planned through `pg`
- NextAuth/Auth.js through `next-auth`
- bcrypt through `bcrypt`
- Simple SQL files in `database/`
- Manual validation helpers in `src/lib/validation.js`

Not currently present:

- TypeScript
- Prisma
- Drizzle
- Zod
- Dockerfile
- `docker-compose.yml`
- PapaParse dependency

## 3. Package scripts and dependencies

Scripts in `package.json`:

- `dev`: `next dev`
- `build`: `next build`
- `start`: `next start`
- `lint`: `eslint`

Dependencies:

- `bcrypt`: `^5.1.1`
- `next`: `16.1.6`
- `next-auth`: `^4.24.11`
- `pg`: `^8.13.1`
- `react`: `19.2.3`
- `react-dom`: `19.2.3`

Dev dependencies:

- `@tailwindcss/postcss`: `^4`
- `babel-plugin-react-compiler`: `1.0.0`
- `eslint`: `^9`
- `eslint-config-next`: `16.1.6`
- `tailwindcss`: `^4`

Package status:

- `package.json` includes the runtime packages required by the copied batches.
- `package-lock.json` exists.
- No install/build/lint/test command was run during this inspection.

## 4. Root structure

Root folders:

- `.git/`
- `.next/`
- `database/`
- `docs/`
- `node_modules/`
- `public/`
- `src/`

Root files:

- `.env.example`
- `.gitignore`
- `AGENTS.md`
- `eslint.config.mjs`
- `jsconfig.json`
- `next.config.mjs`
- `package.json`
- `package-lock.json`
- `postcss.config.mjs`
- `README.md`
- `MaritimeOps_Baza_de_Date_v3_actualizat.docx`
- `MaritimeOps_Cazuri_de_utilizare_v3_actualizat.docx`
- `maritimeOps_ERD_v2.drawio`
- `maritimeOps_ERD_v2.svg`
- `MaritimeOps_UseCase_v2.drawio`
- `MaritimeOps_UseCase_v2.svg`

Not present at root:

- `Dockerfile`
- `docker-compose.yml`

## 5. Documentation files

Current `/docs` structure:

- `docs/Current_state.md`
- `docs/full_documentation/`

Files under `docs/full_documentation/`:

- `00_README.md`
- `01_project_overview.md`
- `02_requirements.md`
- `03_roles_permissions.md`
- `04_use_cases.md`
- `05_ui_ux_wireframes.md`
- `06_styling_globals_css.md`
- `07_frontend_architecture.md`
- `08_backend_architecture.md`
- `09_database_design.md`
- `10_sql_schema_plan.md`
- `11_csv_import_flow.md`
- `12_auth_security.md`
- `13_docker_containerization.md`
- `14_local_linux_deployment.md`
- `15_logs_maintenance.md`
- `16_testing_plan.md`
- `17_future_improvements.md`
- `18_build_implementation_plan.md`
- `19_relational_model_constraints.md`

Observation:

- The main documentation pack currently exists under `docs/full_documentation/`, not directly under `docs/`.
- The active current-state document exists as `docs/Current_state.md`. On this Windows workspace, this is the same target path as `docs/current_state.md`.

## 6. Database files

Current `/database` files:

- `database/schema.sql`
- `database/seed.sql`

`schema.sql` currently defines the final 10-table model:

- `roles`
- `customers`
- `users`
- `containers`
- `vessels`
- `vessel_visits`
- `gate_transactions`
- `vessel_visit_containers`
- `uploaded_files`
- `container_events`

It also defines indexes for users, containers, gate transactions, vessel visits, vessel visit containers, uploaded files, and container events.

`seed.sql` currently inserts:

- Roles
- Customers
- Vessels
- Containers

`seed.sql` does not currently insert users.

## 7. Frontend pages

Current App Router files:

- `src/app/layout.js`
- `src/app/page.js`
- `src/app/login/page.js`
- `src/app/dashboard/page.js`
- `src/app/profile/page.js`
- `src/app/change-password/page.js`
- `src/app/admin/users/page.js`
- `src/app/admin/users/create/page.js`
- `src/app/admin/users/[id]/edit/page.js`
- `src/app/containers/page.js`
- `src/app/containers/[id]/page.js`
- `src/app/my-containers/page.js`
- `src/app/my-containers/[id]/page.js`

Page status:

- `/`: basic public landing/project overview page.
- `/login`: login page using `LoginForm`.
- `/dashboard`: protected dashboard with placeholder counters.
- `/profile`: protected profile view.
- `/change-password`: protected change-password form page.
- `/admin/users`: protected admin user list page.
- `/admin/users/create`: protected admin create-user page.
- `/admin/users/[id]/edit`: protected admin edit-user page.
- `/containers`: protected container list/filter page for gate and terminal operators.
- `/containers/[id]`: protected container detail/history page with terminal-operator location update form.
- `/my-containers`: protected customer-agent container list page.
- `/my-containers/[id]`: protected customer-agent container detail/history page.

Missing frontend pages:

- `/gate/in`
- `/gate/out`
- `/vessel-visits`

## 8. API routes

Current API route files:

- `src/app/api/auth/[...nextauth]/route.js`
- `src/app/api/profile/change-password/route.js`
- `src/app/api/containers/route.js`
- `src/app/api/containers/validate/route.js`
- `src/app/api/containers/[id]/location/route.js`
- `src/app/api/users/route.js`
- `src/app/api/users/[id]/route.js`

Route status:

- `/api/auth/[...nextauth]`: NextAuth route handler.
- `/api/profile/change-password`: protected password update route.
- `/api/containers`: protected container list route.
- `/api/containers/validate`: protected container validation route.
- `/api/containers/[id]/location`: protected terminal-operator location update route.
- `/api/users`:
  - `GET`: admin-only user list.
  - `POST`: admin-only create user.
- `/api/users/[id]`:
  - `GET`: admin-only single user read.
  - `PATCH`: admin-only update user.
  - `DELETE`: admin-only logical delete through `is_active = false`.

Missing API routes:

- Gate IN route.
- Gate OUT route.
- Vessel visit routes.
- CSV upload/import routes.
- Customer-facing my-containers route, unless implemented as server-side page fetching later.

## 9. Components

Current component folders:

- `src/components/admin/`
- `src/components/containers/`
- `src/components/forms/`
- `src/components/layout/`
- `src/components/ui/`

Admin components:

- `UsersTable.jsx`

Container components:

- `ContainerDetails.jsx`
- `ContainerEventsTimeline.jsx`
- `ContainersTable.jsx`

Form components:

- `LoginForm.jsx`
- `UserForm.jsx`
- `ChangePasswordForm.jsx`
- `UpdateLocationForm.jsx`

Layout components:

- `AppShell.jsx`
- `Header.jsx`
- `LogoutButton.jsx`
- `Sidebar.jsx`

UI components:

- `Badge.jsx`
- `Button.jsx`
- `Card.jsx`
- `EmptyState.jsx`
- `Input.jsx`
- `PageHeader.jsx`
- `Select.jsx`
- `Table.jsx`
- `Textarea.jsx`

Status:

- Basic reusable UI and layout components exist.
- User-management components exist.
- Container list, details, history, and location-update components exist.
- Operational forms and tables for gate operations, vessel visits, and CSV import do not exist yet.

## 10. Lib helpers

Current files under `src/lib/`:

- `auth.js`
- `constants.js`
- `db.js`
- `navigation.js`
- `passwords.js`
- `permissions.js`
- `validation.js`

Helper status:

- `auth.js`: NextAuth credentials config, JWT/session callbacks, `getCurrentUser`, `requireUser`.
- `constants.js`: role codes, terminal areas, gate transaction types, container conditions, vessel visit statuses, operation statuses, uploaded file types, and container event types.
- `db.js`: `pg` pool, `query`, and `withTransaction`.
- `navigation.js`: role-based sidebar navigation.
- `passwords.js`: bcrypt hash and compare helpers.
- `permissions.js`: role permission helper functions.
- `validation.js`: validation helpers for login, users, change password, gate IN, gate OUT, container location, and vessel visits.

## 11. Repositories

Current files under `src/repositories/`:

- `customers.repository.js`
- `containers.repository.js`
- `events.repository.js`
- `roles.repository.js`
- `users.repository.js`

Repository status:

- `customers.repository.js`:
  - `getAllCustomers`
  - `getCustomerById`
- `roles.repository.js`:
  - `getAllRoles`
  - `getRoleById`
- `containers.repository.js`:
  - `getContainers`
  - `getContainersByCustomer`
  - `getContainerById`
  - `getContainerByNumber`
  - `updateContainerLocation`
- `events.repository.js`:
  - `getContainerEvents`
  - `createContainerEvent`
- `users.repository.js`:
  - `findUserByEmail`
  - `findUserById`
  - `getUsers`
  - `emailExists`
  - `createUser`
  - `updateUser`
  - `updateUserPassword`
  - `deactivateUser`

Missing repositories:

- Gate transactions
- Vessels
- Vessel visits
- Vessel visit containers
- Uploaded files

## 12. Services

Current files under `src/services/`:

- `users.service.js`
- `containers.service.js`

Service status:

- `users.service.js` handles create/update user payload normalization, validation, email uniqueness checks, role/customer checks, password hashing, and repository calls.
- `containers.service.js` handles container visibility, container validation, terminal-operator location updates, and location update event creation.

Missing services:

- Gate operation service.
- Vessel visit service.
- CSV import service.

## 13. Authentication and authorization

Authentication status:

- NextAuth credentials provider is configured in `src/lib/auth.js`.
- The auth route exists at `src/app/api/auth/[...nextauth]/route.js`.
- Login form exists and calls `signIn("credentials")`.
- Logout button exists and calls `signOut`.
- Password comparison uses bcrypt through `comparePassword`.
- Session data includes `id_user`, `id_customer`, `full_name`, `role_code`, `role_name`, and `customer_name`.

Authorization status:

- Admin user pages redirect non-admin users to `/dashboard`.
- User API routes enforce admin-only access.
- Permission helpers exist in `src/lib/permissions.js`.
- Sidebar navigation is role-based through `src/lib/navigation.js`.

Known auth limitation:

- `seed.sql` creates demo users with bcrypt hashes.
- Change password is implemented through a protected form and API route.

## 14. Database and seed status

Database schema status:

- `database/schema.sql` exists.
- It defines the expected 10 main tables.
- It includes `users.is_active` for logical user delete.
- It includes `container_events` for operational history.
- It does not include forbidden tables such as `user_roles`, `container_moves`, `yard_blocks`, `yard_slots`, or `container_visits`.
- It currently includes `users.id_customer`, which supports the current app code for customer-agent users.

Seed status:

- `database/seed.sql` exists.
- It inserts roles, customers, vessels, and containers.
- It inserts demo user accounts.
- It inserts bcrypt password hashes for demo users.
- It inserts initial container location events.
- It does not insert vessel visits, vessel visit containers, uploaded files, or gate transactions.

## 15. Environment variables

`.env.example` exists and defines:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

Current example values:

- `DATABASE_URL=postgres://maritimeops_user:maritimeops_password@db:5432/maritimeops_db`
- `NEXTAUTH_SECRET=change_this_secret`
- `NEXTAUTH_URL=http://localhost:3000`

Status:

- Environment variable example file is present.
- No actual `.env` file was inspected.
- The `DATABASE_URL` host is `db`, which fits Docker Compose usage but may need changing for non-Docker local development.

## 16. Styling

Global styling exists in:

- `src/app/globals.css`

Styling status:

- Uses global reusable CSS classes.
- Defines colors, layout, sidebar, header, cards, forms, buttons, tables, badges, empty states, login shell, and responsive layout.
- Imports Tailwind with `@import "tailwindcss";`.
- The app mostly uses custom global CSS classes rather than Tailwind utility classes.

Potential styling issue:

- Mobile authenticated navigation is still incomplete because the sidebar is hidden below `900px` without a replacement menu.

## UI/layout static review

This review is based on static code inspection only. The UI was not tested in a browser, no dev server was started, and no screenshots or responsive visual checks were performed.

1. Existing layout structure

- `src/app/layout.js` provides a minimal root layout with global CSS.
- Authenticated pages use `AppShell`, which renders a two-column layout with `Sidebar`, `Header`, and `main.app-main`.
- Public home page uses `app-login-shell` and `app-login-card`.
- Admin and protected pages use `PageHeader`, `Card`, grid classes, tables, and form components.

2. Existing global CSS classes

- Layout: `app-shell`, `app-layout`, `app-main`, `app-sidebar`, `app-sidebar-logo`, `app-sidebar-subtitle`, `app-sidebar-nav`, `app-sidebar-link`, `app-header`, `app-header-user`.
- Page structure: `app-page`, `app-page-header`, `app-page-title`, `app-page-description`, `app-grid`, `app-grid-2`, `app-grid-3`, `app-grid-4`.
- Cards/buttons/forms: `app-card`, `app-card-title`, `app-card-muted`, `app-card-value`, `app-button`, `app-button-primary`, `app-button-secondary`, `app-button-danger`, `app-form`, `app-form-grid`, `app-form-row`, `app-label`, `app-input`, `app-select`, `app-textarea`, `app-error`, `app-success`.
- Tables/badges/empty states: `app-table-wrapper`, `app-table`, `app-badge`, badge variants, `app-empty`, `app-link`.
- Public shell: `app-login-shell`, `app-login-card`.

3. Pages that have UI implemented

- `/`: project overview card with login/dashboard links.
- `/login`: login page shell with `LoginForm`.
- `/dashboard`: protected dashboard with four summary cards.
- `/profile`: protected profile cards.
- `/change-password`: protected page with a password change form.
- `/admin/users`: admin table page with create-user action.
- `/admin/users/create`: admin user form page.
- `/admin/users/[id]/edit`: admin user edit form page.
- `/containers`: operator container list/filter page.
- `/containers/[id]`: container detail/history page with location update for terminal operators.
- `/my-containers`: customer-agent container list page.
- `/my-containers/[id]`: customer-agent detail/history page.

4. Components that have UI implemented

- Layout: `AppShell`, `Header`, `Sidebar`, `LogoutButton`.
- UI primitives: `Button`, `ButtonLink`, `Card`, `PageHeader`, `Input`, `Select`, `Textarea`, `Badge`, `EmptyState`, `Table`.
- Forms/admin/containers: `LoginForm`, `UserForm`, `ChangePasswordForm`, `UpdateLocationForm`, `UsersTable`, `ContainersTable`, `ContainerDetails`, `ContainerEventsTimeline`.

5. Missing CSS classes used by JSX

- No missing CSS classes were found by static inspection after batch 6 UI fixes.

6. Possible visual/layout risks by code inspection

- Authenticated mobile layout hides the sidebar, so users may lose navigation on small screens.
- Dashboard cards contain placeholder zero values, so the page may look functional but not data-backed.

7. Responsive/mobile status

- `globals.css` has media queries at `1100px` and `900px`.
- Grid layouts collapse from 4/3/2 columns to one column on smaller screens.
- At widths below `900px`, the sidebar is hidden.
- No mobile navigation replacement is implemented, so authenticated mobile users may lose sidebar navigation.
- Tables are wrapped in `overflow-x: auto`, which should help narrow screens.

8. Pages that may still look incomplete or placeholder-like

- `/dashboard`: summary cards show static placeholder values.

9. UI fixes recommended for the next batch

- Add mobile navigation when the sidebar is hidden.
- Add real dashboard metrics.
- Keep sidebar links aligned with pages that actually exist.

## 17. Implemented use cases

Implemented or partially implemented:

- Login: implemented through NextAuth, `LoginForm`, and seeded demo users.
- Logout: implemented through `LogoutButton`.
- View Profile: implemented as protected `/profile` page.
- Change Password: implemented through protected page, form, and API route.
- Manage Users: partially implemented through admin user list page and API.
- Create User: partially implemented through page, form, service, repository, and API.
- Update User: partially implemented through edit page, form, service, repository, and API.
- Delete User: partially implemented as logical delete using `is_active = false`.
- Assign / Change Role: partially implemented through admin user create/edit forms.
- View Containers: partially implemented through `/containers` and `/my-containers`.
- Validate Container: partially implemented through `/api/containers/validate`.

## 18. Missing use cases

Missing use cases from the final required set:

- Register Gate IN
- Register Gate OUT
- Manage Vessel Visits

Also missing:

- CSV import for vessel loading/discharge lists.
- Gate transaction repository/service/API/pages.
- Vessel/vessel visit repository/service/API/pages.

## 19. Issues or risks found by inspection

Known risks and issues:

- No build, lint, or test command was run, so compile/runtime status is not verified.
- `bcrypt` may require native install/build support depending on the local environment.
- `PapaParse` is documented as part of the planned stack but is not installed yet.
- `Dockerfile` and `docker-compose.yml` are missing even though Docker deployment is documented.
- Gate IN, Gate OUT, and vessel visit pages are still missing.
- Sidebar navigation was adjusted to avoid links to missing gate/vessel routes until those pages exist.
- Operational API routes are still missing for gate transactions, vessel visits, and CSV import.
- UI review was static only; no browser rendering was performed, so actual visual behavior is not verified.
- Mobile layout hides the sidebar without providing a replacement navigation menu.
- Dashboard may look placeholder-like because it contains static cards.
- The `docs` folder currently stores the main documentation under `docs/full_documentation/`, while `AGENTS.md` references paths like `docs/00_README.md`.
- `database/schema.sql` starts with `DROP TABLE IF EXISTS`, so it is destructive if run against a database with data.
- `database/seed.sql` inserts customers without `ON CONFLICT`, so rerunning it may create duplicate customer rows unless constrained elsewhere.
- `users.id_customer` exists in the current schema and code, but it should be kept aligned with the final documentation expectations.

## 20. Recommended next batch

Recommended next batch:

Build the missing gate operation module before vessel visits.

Suggested scope:

- Add `/gate/in` and `/gate/out` pages.
- Add gate transaction repository/service/API routes.
- Re-add gate links to `src/lib/navigation.js` after the pages exist.
- Write container events when gate operations are registered.
- Then move to the vessel visits module.

This order builds on the now-present container validation and container history foundation.

## Last inspection rules

- Read-only inspection commands were used for review.
- Source changes were limited to clear batch 1-6 compatibility fixes.
- No build, lint, test, install, Docker, or database commands were run.
- UI review was static code inspection only.
- No dev server or browser visual testing was performed.
- `docs/Current_state.md` was updated to reflect the fixes.
