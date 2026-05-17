# P2 Security Remediation

Date: 2026-05-17

Scope completed: P2 application security issues from `SECURITY_AUDIT.md`, `SECURITY_REMEDIATION.md`, `documentation/LOCAL_DEPLOYMENT_SECURITY_AUDIT.md`, and `DEPLOYMENT_REMEDIATION.md`.

## Issues Fixed

### CSV Formula Injection

- Added shared CSV export escaping in `src/lib/csvExport.js`.
- Server CSV exports now escape values starting with `=`, `+`, `-`, `@`, tab, or carriage return.
- Client-side container CSV export uses the same escaping helper.
- Normal CSV quoting and formatting still go through PapaParse.

### Security Headers and CSP

- Added pragmatic application security headers in `next.config.mjs`:
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `Content-Security-Policy`
- CSP includes `frame-ancestors 'none'`.
- HSTS was not added because this app is also used locally over HTTP.

### Container Number Validation

- Added one shared backend container-number error helper in `src/lib/validation.js`.
- Aligned Gate IN, Gate OUT, Validate Container, and CSV import validation to the same 4 letters + 7 digits rule.
- No database constraints were added in this pass, so existing seed/demo data remains compatible.

### CSV Upload and Request Limits

- Added shared limits in `src/lib/securityLimits.js`.
- Server-side CSV import now enforces:
  - maximum request/content size
  - maximum row count
  - maximum cell length
  - `.csv` file name requirement
  - file name length cap
- Client-side CSV file selection now validates:
  - `.csv` extension
  - file size
- Oversized CSV uploads return clear `400` errors.
- Nginx `client_max_body_size` remains deployment documentation, not app code.

### Pagination and Report Limits

- Added hard limits to container, user, vessel, vessel visit, event, and report queries.
- CSV report exports are capped by `MAX_EXPORT_ROWS`.
- Existing role filters and customer data isolation remain in place.

### Gate Transaction Time

- Gate IN and Gate OUT no longer accept `transaction_time` from normal client payloads.
- The repository stamps `CURRENT_TIMESTAMP` for gate transactions.
- Manual correction remains a future admin-only feature.

### Vessel Operation Race Condition

- Confirm discharge/load now updates only when `operation_status = 'planned'`.
- Duplicate or concurrent confirmations return a clean `409` response and do not create duplicate events.

### Admin Self-Deactivation and Last-Admin Protection

- Admins cannot deactivate their own account.
- Updates/deletes cannot leave zero active admins.
- Demoting or deactivating the last active admin returns a clear `400` error.

### Dynamic ID and JSON Parse Validation

- Added shared helpers in `src/lib/apiRequest.js`.
- Dynamic API route IDs are parsed as positive safe integers.
- Malformed IDs return consistent `400` responses.
- Malformed or non-object JSON request bodies return consistent `400` responses.

## Files Changed

- `next.config.mjs`
- `src/lib/apiRequest.js`
- `src/lib/csvExport.js`
- `src/lib/securityLimits.js`
- `src/lib/csv.js`
- `src/lib/csvResponse.js`
- `src/lib/validation.js`
- `src/app/api/containers/route.js`
- `src/app/api/containers/[id]/location/route.js`
- `src/app/api/containers/validate/route.js`
- `src/app/api/gate/in/route.js`
- `src/app/api/gate/out/route.js`
- `src/app/api/profile/change-password/route.js`
- `src/app/api/users/route.js`
- `src/app/api/users/[id]/route.js`
- `src/app/api/vessel-visits/route.js`
- `src/app/api/vessel-visits/[id]/route.js`
- `src/app/api/vessel-visits/[id]/upload-csv/route.js`
- `src/app/api/vessel-visits/operations/[id]/confirm-discharge/route.js`
- `src/app/api/vessel-visits/operations/[id]/confirm-load/route.js`
- `src/app/api/vessels/route.js`
- `src/components/containers/ContainersListPanel.jsx`
- `src/components/forms/CsvUploadForm.jsx`
- `src/repositories/containers.repository.js`
- `src/repositories/events.repository.js`
- `src/repositories/gate.repository.js`
- `src/repositories/reports.repository.js`
- `src/repositories/users.repository.js`
- `src/repositories/vesselVisitContainers.repository.js`
- `src/repositories/vesselVisits.repository.js`
- `src/repositories/vessels.repository.js`
- `src/services/containers.service.js`
- `src/services/csvImport.service.js`
- `src/services/gate.service.js`
- `src/services/users.service.js`
- `src/services/vesselOperations.service.js`
- `P2_SECURITY_REMEDIATION.md`

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

## Remaining P3 Issues

- Inconsistent unauthenticated vs forbidden response semantics in some admin/profile endpoints.
- Login callback URL local allow-listing.
- More complete uploaded file-name normalization policy for future download features.
- Optional database-level constraints for container status, positive weights, and container-number format.
- Dockerfile non-root runtime and multi-stage production image hardening.
- Backup/restore automation and SSH/server hardening require manual deployment work.

## Manual Verification Needed

- Login and logout still work after CSP headers.
- Admin user create/update/delete still works, including:
  - self-deactivation blocked
  - last active admin demotion/deactivation blocked
- Gate IN and Gate OUT still create transactions and show current server time.
- Validate Container rejects invalid container numbers consistently.
- CSV import accepts normal `.csv` files and rejects:
  - non-CSV names
  - oversized files
  - too many rows
  - very long cell values
  - invalid container numbers
- Report CSV exports open normally in spreadsheet software and formula-leading values are neutralized.
- Vessel discharge/load confirmation works once and duplicate confirmation is rejected cleanly.
- Browser console should be checked for CSP violations during normal dashboard, admin, gate, report, and vessel visit flows.
