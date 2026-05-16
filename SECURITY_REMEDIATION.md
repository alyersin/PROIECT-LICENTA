# Security Remediation

Date: 2026-05-16

Scope completed: P1 findings from `SECURITY_AUDIT.md`.

## What Was Fixed

### P1-01 CSRF and Request Protection

- Added centralized mutation request protection in `src/lib/apiSecurity.js`.
- All app-owned unsafe API methods under `src/app/api` now validate:
  - custom header `X-MaritimeOps-Request: same-origin`
  - same-origin `Origin` or `Referer` when those headers are present
- NextAuth routes were not modified.
- Updated all current frontend JSON mutation fetch calls to send the required custom header.

Protected route groups:

- users create/update/delete/deactivate
- profile change password
- gate in/out
- container validate and location update
- vessel create
- vessel visit create/update
- vessel visit CSV upload/import
- vessel operation confirm discharge/load

### P1-02 Vulnerable Dependencies

- Ran `npm audit fix`.
- Updated:
  - `next` to `16.2.6`
  - `eslint-config-next` to `16.2.6`
  - `bcrypt` to `6.0.0`
- Added an npm `overrides` entry for `postcss` so the lockfile resolves to a patched `postcss` version.
- Final `npm audit` result: `found 0 vulnerabilities`.

### P1-03 Login Rate Limiting

- Added simple in-memory credentials-login rate limiting in `src/lib/apiSecurity.js`.
- Integrated it into the NextAuth credentials provider in `src/lib/auth.js`.
- Login attempts are limited by normalized email plus client IP.
- Successful login clears the limiter entry.
- Login errors remain generic because blocked attempts return `null` through the existing credentials flow.

Manual verification note: this is process-local memory. It is suitable for this local/simple project architecture, but a multi-instance deployment would need DB-backed or shared rate limiting.

### P1-04 Secrets and Config Hardening

- Replaced the local `.env` placeholder `NEXTAUTH_SECRET` with a generated 32-byte base64 secret.
- Added local `.env` database variables:
  - `POSTGRES_DB`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_PORT`
- Updated `docker-compose.yml` to read Postgres values from environment variables instead of hardcoding the password.
- Updated `.env.example` and `README.md` to use clear replacement placeholders instead of reusable secrets.
- Updated `database/seed.sql` comments to mark demo credentials as development-only.
- Verified `.env` is still untracked with `git ls-files .env`.

Manual verification note: because the local `.env` database password changed, an existing local Postgres Docker volume may still be initialized with the previous password. The user may need to update the DB user password manually or recreate the local database volume.

## Files Changed

- `.env` (ignored/untracked local config)
- `.env.example`
- `README.md`
- `SECURITY_REMEDIATION.md`
- `database/seed.sql`
- `docker-compose.yml`
- `package.json`
- `package-lock.json`
- `src/lib/apiSecurity.js`
- `src/lib/auth.js`
- `src/app/api/containers/[id]/location/route.js`
- `src/app/api/containers/validate/route.js`
- `src/app/api/gate/in/route.js`
- `src/app/api/gate/out/route.js`
- `src/app/api/profile/change-password/route.js`
- `src/app/api/users/[id]/route.js`
- `src/app/api/users/route.js`
- `src/app/api/vessel-visits/[id]/route.js`
- `src/app/api/vessel-visits/[id]/upload-csv/route.js`
- `src/app/api/vessel-visits/operations/[id]/confirm-discharge/route.js`
- `src/app/api/vessel-visits/operations/[id]/confirm-load/route.js`
- `src/app/api/vessel-visits/route.js`
- `src/app/api/vessels/route.js`
- `src/components/forms/ChangePasswordForm.jsx`
- `src/components/forms/CsvUploadForm.jsx`
- `src/components/forms/GateInForm.jsx`
- `src/components/forms/GateOutForm.jsx`
- `src/components/forms/UpdateLocationForm.jsx`
- `src/components/forms/UserForm.jsx`
- `src/components/forms/VesselVisitForm.jsx`
- `src/components/vessel-visits/VesselOperationActions.jsx`

## Commands Run

Initial P1 checkpoint after CSRF/rate-limit code:

- `npm run lint`
  - Passed with 0 errors and 3 existing warnings for `<img>` usage.
- `npm run build`
  - Passed on Next.js `16.1.6`.
- `npm audit`
  - Still reported the pre-existing dependency advisories before dependency remediation.

Dependency remediation:

- `npm audit fix`
  - Changed 9 packages.
  - Reduced audit output from 9 vulnerabilities to 4 remaining vulnerabilities.
- `npm install next@16.2.6 eslint-config-next@16.2.6 bcrypt@latest`
  - First sandboxed attempt failed with registry access error.
  - Reran with approved network access.
  - Updated Next.js, eslint config, and bcrypt.
- `npm audit`
  - Reported 2 remaining moderate `postcss` vulnerabilities under Next's nested dependency.
- `npm install`
  - After adding the `postcss` override, resolved dependencies successfully.
  - Reported `found 0 vulnerabilities`.

Final P1 checkpoint:

- `npm run lint`
  - Passed with 0 errors and 3 existing warnings:
    - `src/app/login/page.js`: `<img>` warning
    - `src/app/page.js`: `<img>` warning
    - `src/components/layout/Sidebar.jsx`: `<img>` warning
- `npm run build`
  - Passed on Next.js `16.2.6`.
- `npm audit`
  - Passed: `found 0 vulnerabilities`.
- `git ls-files .env`
  - No output; `.env` is not tracked.

## Remaining Issues From SECURITY_AUDIT.md

P1 issues are addressed.

Remaining P2/P3 items:

- M-01 CSV formula injection in exports.
- M-02 Missing security headers and CSP.
- M-03 Inconsistent backend container number validation.
- M-04 CSV upload/request size limits.
- M-05 Missing pagination/limits for list and report endpoints.
- M-06 Gate IN/Gate OUT accept client-supplied `transaction_time`.
- M-07 Vessel operation confirmation race condition and workflow transition gaps.
- M-08 Admin self-deactivation / last-admin protection.
- M-09 Dynamic ID and JSON parse validation.
- L-01 Inconsistent 401/403 semantics and some account-state response details.
- L-02 Login callback URL allow-listing.
- L-03 CSV uploaded filename normalization.
- L-04 Additional database constraints for container status, weights, and container number format.

## Manual Verification Needed

- Confirm login, logout, and all mutation forms manually in a browser after the custom CSRF header change.
- Confirm any external API client or manual API testing workflow now sends `X-MaritimeOps-Request: same-origin` for unsafe methods.
- Confirm local Docker/Postgres credentials if an existing DB volume was initialized with the old password.
- Confirm production `NEXTAUTH_SECRET`, `POSTGRES_PASSWORD`, and `NEXTAUTH_URL` are set per environment and are not copied from examples.
- Confirm in-memory login rate limiting is acceptable for the deployment model; use DB-backed/shared rate limiting if running multiple app instances.
