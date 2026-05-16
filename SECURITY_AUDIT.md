# MaritimeOps Security Audit

Date: 2026-05-16

Scope: Static review of project structure, package/config files, SQL schema/seed files, API routes, auth/session logic, page protection, services, repositories, frontend forms, CSV import/export logic, Docker files, and deployment-related configuration. Requested commands were run where possible.

## Executive Summary

The application has a clear role model and most backend API routes perform server-side session and role checks. SQL access is mostly parameterized through `pg`, React output escaping is used by default, `.env` is ignored by Git, and the final 10-table schema has useful foreign keys and check constraints.

The highest risk areas are request protection and operational authorization hardening. State-changing API routes do not implement explicit CSRF protection, login and mutation endpoints have no rate limiting, dependency audit reports high vulnerabilities including `next`, default/demo secrets and credentials are documented, and CSV exports are vulnerable to spreadsheet formula injection. There are also business-logic gaps around gate/vessel workflow transitions, request size limits, pagination, and admin self-deactivation.

No confirmed raw SQL injection or direct React XSS sink was found during static inspection.

## Critical Findings

No confirmed critical findings.

## High Findings

### Finding H-01

Severity: High
Category: CSRF and request protection
File(s): `src/app/api/users/route.js`, `src/app/api/users/[id]/route.js`, `src/app/api/gate/in/route.js`, `src/app/api/gate/out/route.js`, `src/app/api/profile/change-password/route.js`, `src/app/api/vessel-visits/route.js`, `src/app/api/vessel-visits/[id]/route.js`, `src/app/api/vessel-visits/[id]/upload-csv/route.js`, `src/app/api/vessel-visits/operations/[id]/confirm-discharge/route.js`, `src/app/api/vessel-visits/operations/[id]/confirm-load/route.js`, `src/app/api/containers/[id]/location/route.js`, `src/app/api/vessels/route.js`
Issue: State-changing API routes rely on the session cookie and role checks but do not validate an anti-CSRF token, Origin, Referer, or a custom same-origin request header.
Risk: If a logged-in user visits a malicious site, browser-submitted requests could attempt to create users, deactivate users, change passwords, register gate transactions, import CSV rows, or confirm vessel operations using the victim session.
Evidence: Routes call `getCurrentUser()` and then immediately process `request.json()` or mutate state, for example `src/app/api/gate/in/route.js:5-24`, `src/app/api/users/[id]/route.js:27-62`, and `src/app/api/profile/change-password/route.js:6-60`. No `middleware.*` file exists and no CSRF helper was found.
Fix: Add centralized CSRF protection for all unsafe methods. For JSON API routes, require and validate a CSRF token or enforce strict `Origin`/`Referer` checks plus a custom header such as `X-MaritimeOps-Request`. Keep NextAuth CSRF for its own auth endpoints.
Priority: P1

### Finding H-02

Severity: High
Category: Dependencies and infrastructure
File(s): `package.json`, `package-lock.json`
Issue: `npm audit` reports 9 vulnerabilities, including 6 high severity vulnerabilities. The affected package list includes `next`, `flatted`, `minimatch`, `picomatch`, and `tar`.
Risk: The reported `next` advisories include request smuggling, cache poisoning, middleware/proxy bypasses, SSRF, XSS, and DoS classes. Even if some features are not used, running vulnerable framework versions increases production exposure.
Evidence: `npm audit` returned high severity findings for `next 9.3.4-canary.0 - 16.3.0-canary.5`, `flatted <=3.4.1`, `minimatch`, `picomatch`, and `tar`; current `package.json` pins `next` to `16.1.6`.
Fix: Upgrade vulnerable packages using the smallest compatible updates. For Next.js, test an update to the patched version suggested by audit (`next@16.2.6` at audit time) or newer allowed by project constraints, then rerun lint/build and regression checks.
Priority: P1

### Finding H-03

Severity: High
Category: Authentication and brute-force protection
File(s): `src/lib/auth.js`, `src/app/api/auth/[...nextauth]/route.js`
Issue: The credentials login flow has no application-level rate limiting, lockout, IP throttling, or failed-attempt tracking.
Risk: Attackers can repeatedly guess credentials for known demo or real accounts. Generic login errors reduce user enumeration, but lack of throttling still enables brute-force and password spraying.
Evidence: `src/lib/auth.js:20-52` validates email/password and returns `null` on failure. No rate-limit storage, lockout field, or request throttling logic was found.
Fix: Add simple login throttling suitable for the stack, such as a database-backed failed login attempts table or in-process/IP rate limit for local academic deployment. Consider adding `users.failed_login_count` and `users.locked_until` only if acceptable for the project scope.
Priority: P1

### Finding H-04

Severity: High
Category: Secrets and configuration
File(s): `.env`, `.env.example`, `README.md`, `docker-compose.yml`, `database/seed.sql`
Issue: Development secrets and demo credentials are weak and documented. `.env` currently contains a placeholder `NEXTAUTH_SECRET`; `.env.example` and `README.md` show the same placeholder; `docker-compose.yml` hardcodes the database password; `database/seed.sql` documents all demo users use `admin123`.
Risk: If these values are reused outside local development, sessions and database access can be compromised. Publicly known demo passwords also make deployed demo instances easy to take over.
Evidence: `.env:3`, `.env.example:3`, `README.md:185`, and `README.md:193` contain `NEXTAUTH_SECRET=change_this_secret_123`; `docker-compose.yml:20` hardcodes `POSTGRES_PASSWORD`; `database/seed.sql:108-110` documents the demo password.
Fix: Keep examples clearly non-production, generate a strong local `NEXTAUTH_SECRET`, move Compose DB credentials to `.env`, and require changing seeded passwords before any shared demo. Verify `.env` remains untracked; `git ls-files` showed `.env` is not tracked.
Priority: P1

## Medium Findings

### Finding M-01

Severity: Medium
Category: File/export/report security
File(s): `src/lib/csvResponse.js`, `src/components/containers/ContainersListPanel.jsx`
Issue: CSV exports do not neutralize spreadsheet formulas.
Risk: Values beginning with `=`, `+`, `-`, `@`, tab, or carriage return can execute as formulas when an exported CSV is opened in Excel/LibreOffice. Stored fields such as customer name, container fields, vessel data, truck number, destination, or operator name could become formula injection vectors.
Evidence: Server exports call `Papa.unparse` directly in `src/lib/csvResponse.js:15-31`; client exports call `Papa.unparse` directly in `src/components/containers/ContainersListPanel.jsx:49-54`.
Fix: Escape formula-leading values before export, commonly by prefixing a single quote or tab after a documented policy. Apply the same helper to server-side and client-side CSV generation.
Priority: P2

### Finding M-02

Severity: Medium
Category: Security headers and CSP
File(s): `next.config.mjs`, `src/app/layout.js`
Issue: No security headers or Content Security Policy are configured.
Risk: Missing CSP, frame protections, referrer policy, and MIME protections reduce defense in depth for XSS, clickjacking, content sniffing, and data leakage.
Evidence: `next.config.mjs:1-6` only enables `reactCompiler`; `src/app/layout.js:1-14` defines metadata only. No `headers()` config was found.
Fix: Add security headers in `next.config.mjs`: `Content-Security-Policy`, `X-Frame-Options` or `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. Add HSTS only when deployed exclusively over HTTPS.
Priority: P2

### Finding M-03

Severity: Medium
Category: Input validation and sanitization
File(s): `src/services/gate.service.js`, `src/services/containers.service.js`, `src/lib/validation.js`, `database/schema.sql`
Issue: Container number validation is inconsistent and weaker on backend operational routes than in shared validation.
Risk: Invalid container identifiers can be created or accepted, causing data integrity issues and making later authorization/reporting assumptions weaker.
Evidence: `src/lib/validation.js:16-18` requires `^[A-Z]{4}[0-9]{7}$`, but `src/services/gate.service.js:28-40` and `src/services/containers.service.js:34-51` only enforce length between 4 and 20. `database/schema.sql:40` only declares `container_no VARCHAR(20) NOT NULL UNIQUE` without a format check.
Fix: Use one backend validator for all container number entry points and add a database check constraint if the academic model accepts ISO-style numbers.
Priority: P2

### Finding M-04

Severity: Medium
Category: File upload and request size limits
File(s): `src/components/forms/CsvUploadForm.jsx`, `src/app/api/vessel-visits/[id]/upload-csv/route.js`, `src/services/csvImport.service.js`
Issue: CSV import accepts pasted or file-read CSV text in JSON with no explicit file size, row count, or field length limits.
Risk: Large payloads can exhaust memory or CPU during JSON parsing, PapaParse parsing, validation, and row-by-row inserts. Very long cell values can also cause database errors or oversized UI rendering.
Evidence: The client reads any selected CSV with `file.text()` in `src/components/forms/CsvUploadForm.jsx:76-86`; the API parses JSON in `src/app/api/vessel-visits/[id]/upload-csv/route.js:13`; the service converts `payload.csv_text` to a string and parses all rows in `src/services/csvImport.service.js:33-63`.
Fix: Enforce client and server maximums, such as maximum bytes, maximum rows, maximum cell lengths, and accepted MIME/extension checks. Reject oversized requests before parsing when possible.
Priority: P2

### Finding M-05

Severity: Medium
Category: API security and availability
File(s): `src/app/api/containers/route.js`, `src/repositories/containers.repository.js`, `src/repositories/reports.repository.js`, `src/repositories/events.repository.js`
Issue: List/report endpoints generally return full result sets without pagination or hard limits.
Risk: Users with broad roles can trigger heavy queries or large CSV responses, causing slow responses or memory pressure as data grows.
Evidence: `src/app/api/containers/route.js:5-38` returns all matched containers; `src/repositories/containers.repository.js:52-86` has no `LIMIT`; `src/repositories/reports.repository.js:3-90` exports all report rows; `src/repositories/events.repository.js:3-24` returns all events for one container.
Fix: Add pagination and maximum export sizes. For CSV reports, require date/customer filters or stream responses if large exports are needed.
Priority: P2

### Finding M-06

Severity: Medium
Category: Business logic vulnerabilities
File(s): `src/services/gate.service.js`, `src/repositories/gate.repository.js`
Issue: Gate IN and Gate OUT accept `transaction_time` from the request payload, although the UI states transaction time is automatic.
Risk: A caller can backdate or future-date gate movements, affecting audit trails, reports, and daily dashboard statistics.
Evidence: `src/services/gate.service.js:50` and `src/services/gate.service.js:162` read `payload.transaction_time`; `src/repositories/gate.repository.js:29` uses that value with `COALESCE($5, CURRENT_TIMESTAMP)`.
Fix: Ignore client-supplied transaction time for normal gate operators. If manual correction is needed, expose a separate admin/terminal correction workflow with audit reason.
Priority: P2

### Finding M-07

Severity: Medium
Category: Business logic and race conditions
File(s): `src/services/vesselOperations.service.js`, `src/repositories/vesselVisitContainers.repository.js`, `src/repositories/containers.repository.js`
Issue: Vessel operation confirmation checks status before a transaction, then updates by ID without adding `operation_status = 'planned'` to the `UPDATE` predicate.
Risk: Two concurrent requests can both pass the pre-check and write duplicate events or inconsistent state. Similar workflow transitions do not validate vessel visit status.
Evidence: `src/services/vesselOperations.service.js:28-41` and `src/services/vesselOperations.service.js:84-88` check `operation.operation_status`; `src/repositories/vesselVisitContainers.repository.js:63-74` updates the row by ID only.
Fix: Make confirmation atomic with `UPDATE ... WHERE id = $1 AND operation_status = 'planned' RETURNING *`, and reject if no row is returned. Add allowed workflow-transition checks for vessel visit/container statuses.
Priority: P2

### Finding M-08

Severity: Medium
Category: Account management security
File(s): `src/app/api/users/[id]/route.js`, `src/repositories/users.repository.js`, `src/services/users.service.js`
Issue: Admin users can deactivate or demote their own account; no guard prevents removing the last active admin.
Risk: An admin can lock themselves or the application out of administration, either accidentally or through CSRF/social engineering.
Evidence: `src/app/api/users/[id]/route.js:48-62` calls `deactivateUser(id)` for any ID; `src/services/users.service.js:94-123` updates any selected user role/status.
Fix: Prevent self-deactivation and prevent changes that would leave zero active admins. Require current-password reauthentication for sensitive self/admin changes if appropriate.
Priority: P2

### Finding M-09

Severity: Medium
Category: Validation and error handling
File(s): `src/app/api/*`, `src/repositories/*`
Issue: API routes do not consistently validate URL IDs and request JSON parse failures before database use.
Risk: Malformed IDs or malformed JSON can produce unhandled exceptions and framework error responses. This can leak implementation details in development and reduce availability in production.
Evidence: Dynamic routes pass raw `params.id` into services/repositories, for example `src/app/api/users/[id]/route.js:10-18`, `src/app/api/containers/[id]/location/route.js:5-18`, and `src/app/api/vessel-visits/[id]/route.js:6-40`.
Fix: Add a small request parsing/validation layer for integer IDs and JSON bodies. Return consistent 400 errors before repository calls.
Priority: P2

## Low Findings

### Finding L-01

Severity: Low
Category: Error semantics and user enumeration
File(s): `src/app/api/users/route.js`, `src/app/api/users/[id]/route.js`, `src/app/api/profile/change-password/route.js`
Issue: Some admin endpoints return `403 Forbidden` for unauthenticated users instead of `401 Unauthorized`; change-password can return `404 User not found or inactive`.
Risk: Mostly semantic, but inconsistent responses complicate clients and can reveal account state in some contexts.
Evidence: `src/app/api/users/route.js:10-17` uses `isAdmin(user)` and returns 403 when `user` is null; `src/app/api/profile/change-password/route.js:41-44` returns user-not-found/inactive.
Fix: Return 401 when no session exists and 403 when a session lacks role permission. Keep user-facing auth failures generic.
Priority: P3

### Finding L-02

Severity: Low
Category: Frontend security
File(s): `src/components/forms/LoginForm.jsx`
Issue: Login passes `callbackUrl` from the query string to `signIn`.
Risk: NextAuth normally validates callback URLs, but this should be verified in the deployed configuration to avoid open redirect behavior.
Evidence: `src/components/forms/LoginForm.jsx:28-33` uses `searchParams.get("callbackUrl") || "/dashboard"`.
Fix: Restrict accepted callback paths locally, for example allow only relative URLs beginning with `/` and reject `//` or external origins.
Priority: P3

### Finding L-03

Severity: Low
Category: File metadata handling
File(s): `src/services/csvImport.service.js`, `src/repositories/uploadedFiles.repository.js`, `src/components/vessel-visits/UploadedFilesTable.jsx`
Issue: Uploaded CSV file names are accepted from the client and stored without length/content normalization beyond trimming.
Risk: The file name is not used as a filesystem path, so path traversal was not confirmed. However, long or misleading names can affect UI/reporting and future download features.
Evidence: `src/services/csvImport.service.js:33` reads `payload.file_name`; `src/repositories/uploadedFiles.repository.js:8-23` stores it; `database/schema.sql:113` allows up to 255 characters.
Fix: Normalize to a safe basename, enforce `.csv`, reject control characters, and cap length below the database limit.
Priority: P3

### Finding L-04

Severity: Low
Category: Database security
File(s): `database/schema.sql`
Issue: The schema has no database-level constraints for some domain values, such as `containers.status`, positive weights, and ISO/container number format.
Risk: Application bugs or direct database writes can create invalid operational state.
Evidence: `database/schema.sql:38-51` defines `containers.status` as plain `VARCHAR(50) NOT NULL`; weights are numeric without positive checks.
Fix: Add check constraints for accepted statuses and non-negative weights if aligned with the final documentation.
Priority: P3

## Positive Things Already Done Well

- Most routes enforce authentication and role checks server-side, not only by hiding UI.
- Customer container access is scoped in the customer API/report paths using `user.id_customer`.
- SQL queries are predominantly parameterized with `$1`, `$2`, etc.; no confirmed user-controlled raw SQL injection was found.
- React renders user-controlled values through normal JSX escaping; no `dangerouslySetInnerHTML`, `eval`, `Function`, `innerHTML`, `localStorage`, `sessionStorage`, or `NEXT_PUBLIC` usage was found in source/config search.
- `.env` is ignored by `.gitignore`, and `git ls-files` showed `.env` is not tracked.
- Passwords are hashed with bcrypt.
- Database schema includes foreign keys, uniqueness constraints, and useful checks for roles, customer types, gate transaction types, vessel visit statuses, operation types, uploaded file types, and terminal areas.
- Unauthenticated login errors are generic: `Invalid email, password, or inactive account.`
- Customer detail page checks `canViewContainer` before showing a container.

## Files Inspected

Primary source and config inspected:

- `package.json`, `package-lock.json`, `.env`, `.env.example`, `.gitignore`, `next.config.mjs`, `Dockerfile`, `docker-compose.yml`, `README.md`
- `database/schema.sql`, `database/seed.sql`
- `src/lib/auth.js`, `src/lib/db.js`, `src/lib/passwords.js`, `src/lib/permissions.js`, `src/lib/validation.js`, `src/lib/csv.js`, `src/lib/csvResponse.js`, `src/lib/constants.js`, `src/lib/navigation.js`
- All files under `src/app/api/**`
- Auth/protected pages under `src/app/**/page.js`
- Services under `src/services/**`
- Repositories under `src/repositories/**`
- Forms under `src/components/forms/**`
- Relevant table/export/layout components under `src/components/**`

Project structure was read with `rg --files`. No `middleware.*` file was found.

## Commands Run and Results

- `Get-ChildItem -Force`: confirmed project root files/folders, including `.env`, `.env.example`, Docker files, `database`, `docs`, `src`, and `package*.json`.
- `rg --files`: listed all project files for audit scope.
- `git status --short`: no output; worktree was clean before creating this report.
- `npm audit`: first sandboxed attempt failed because the audit endpoint was unavailable from the sandbox. Reran with approved network access. Result: 9 vulnerabilities, 3 moderate and 6 high.
- `npm run lint`: completed with 0 errors and 3 warnings, all `@next/next/no-img-element` warnings in `src/app/login/page.js`, `src/app/page.js`, and `src/components/layout/Sidebar.jsx`.
- `npm run build`: completed successfully with Next.js 16.1.6.
- Dangerous pattern search: no matches for `dangerouslySetInnerHTML`, `eval(`, `new Function`, `innerHTML`, `localStorage`, `sessionStorage`, `NEXT_PUBLIC`, or `console.log` in source/config.
- Server action search: no `use server` or server action form handlers found.
- Secret/config search: `.env` is untracked; placeholder `NEXTAUTH_SECRET` appears in `.env`, `.env.example`, and README; hardcoded Compose DB password appears in `docker-compose.yml`.

## Priority Order for Remediation

1. Add CSRF protection for all state-changing API routes.
2. Upgrade vulnerable dependencies, especially Next.js, then rerun lint/build.
3. Add login rate limiting and account lockout/throttling.
4. Replace placeholder/default secrets and document production-safe secret setup.
5. Escape spreadsheet formulas in all CSV exports.
6. Add security headers and a pragmatic CSP.
7. Enforce one backend container-number validator and add matching DB constraints if accepted.
8. Add CSV/request size limits and row/cell length limits.
9. Add pagination/limits for list and report endpoints.
10. Make vessel operation confirmations atomic and tighten workflow-transition validation.
11. Prevent self-deactivation and last-admin removal.
12. Normalize dynamic IDs/JSON parse failures into consistent 400 responses.

## Extra Hardening Recommendations

- Add a small shared API guard module for `requireApiUser`, `requireApiRole`, safe JSON parsing, integer ID parsing, and CSRF validation.
- Add a single authorization matrix close to `src/lib/permissions.js` to avoid duplicated role strings drifting.
- Consider setting explicit NextAuth cookie options for production if defaults are not enough for your deployment: `httpOnly`, `sameSite`, `secure`, and cookie prefix behavior. Needs verification in deployed environment.
- Add audit events for sensitive admin actions: create user, update user, role change, deactivate user, password change, CSV import, gate correction, and operation confirmation.
- Add graceful duplicate CSV import handling for `uq_vvc_visit_container_operation`.
- Add database least-privilege notes: app user should not own schema in production-like deployments. Needs verification against actual deployment.
- Avoid deploying seed demo accounts, or force password change on first login.
- Add production `NODE_ENV=production`, HTTPS, and strong `NEXTAUTH_URL` deployment checks.
