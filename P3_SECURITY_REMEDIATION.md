# P3 Security Remediation

Date: 2026-05-17

Scope completed: final safe, low-risk P3 hardening pass after P1/P2 security remediation.

## Issues Fixed

### Consistent 401/403 API Responses

- Added shared API authorization helpers in `src/lib/apiRequest.js`.
- Admin user API routes now return:
  - `401 Unauthorized` when there is no session
  - `403 Forbidden` when a logged-in user is not an admin
- Profile password-change no longer returns a user-state-specific `404` if the session user no longer maps to an active DB user.

### Login Callback URL Allow-Listing

- `src/components/forms/LoginForm.jsx` now accepts only local relative callback paths.
- External URLs, protocol-relative URLs, backslash paths, and newline/control-style callback values fall back to `/dashboard`.
- After login, the client navigates to the sanitized local callback path.

### Uploaded CSV Filename Normalization

- CSV import filename handling now:
  - keeps only the basename
  - rejects control characters
  - removes leading dots
  - replaces unsafe filename characters with `_`
  - keeps the existing `.csv` requirement and length cap

### Optional Database CHECK Constraints

- Added seed-compatible database constraints in `database/schema.sql`:
  - container number format
  - container status values
  - non-negative container gross weight
  - non-negative vessel operation weight
- These constraints match current seed/demo data.

### Dockerfile Production Hardening

- Reworked `Dockerfile` into a multi-stage build.
- Uses `npm ci` for lockfile-based installs.
- Runtime stage installs production dependencies only with `npm ci --omit=dev`.
- Runtime runs as the non-root `node` user.

## Files Changed

- `Dockerfile`
- `database/schema.sql`
- `src/lib/apiRequest.js`
- `src/app/api/profile/change-password/route.js`
- `src/app/api/users/route.js`
- `src/app/api/users/[id]/route.js`
- `src/components/forms/LoginForm.jsx`
- `src/services/csvImport.service.js`
- `P3_SECURITY_REMEDIATION.md`

## Commands Run

- `npm run lint`
  - Passed with 0 errors.
  - Existing warnings remain for `<img>` usage in:
    - `src/app/login/page.js`
    - `src/app/page.js`
    - `src/components/layout/Sidebar.jsx`

- `npm run build`
  - Passed successfully on Next.js `16.2.6`.

- `npm audit`
  - Passed: `found 0 vulnerabilities`.

## Manual Verification Needed

- Login with no `callbackUrl` should redirect to `/dashboard`.
- Login with a relative callback such as `/containers` should redirect to that path.
- Login with an external or protocol-relative callback should still redirect to `/dashboard`.
- Unauthenticated calls to `/api/users` and `/api/users/[id]` should return `401`.
- Logged-in non-admin calls to `/api/users` and `/api/users/[id]` should return `403`.
- CSV import should still accept normal filenames such as `discharge-list.csv`.
- CSV import should reject or normalize unsafe names without storing path-like or control-character filenames.
- Fresh schema + seed should still apply successfully when the user chooses to recreate a local database.
- Docker image build should be tested manually before deployment:
  - `docker compose build web`
  - `docker compose up -d`
