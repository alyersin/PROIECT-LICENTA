# Deployment Remediation

Date: 2026-05-17

Scope completed: P1 local Ubuntu Server deployment security issues from `LOCAL_DEPLOYMENT_SECURITY_AUDIT.md`.

## What Was Fixed

### P1-01 PostgreSQL Public Exposure

- Removed PostgreSQL public port publishing from the main `docker-compose.yml`.
- PostgreSQL now has no `ports:` section in the production/default Compose file.
- The app continues to connect to PostgreSQL through the Docker service name:
  - `db:5432`

### P1-02 App Public Port Exposure

- Changed the app port binding from all interfaces to localhost only:
  - `127.0.0.1:3000:3000`
- This supports the target deployment where host Nginx is the only public entry point.

### P1-03 Docker Production Safety

- Kept `restart: unless-stopped`.
- Added Docker log rotation to both services:
  - `max-size: 10m`
  - `max-file: 3`
- Added a PostgreSQL healthcheck using `pg_isready`.
- Updated `depends_on` so the web service waits for the database healthcheck.
- Added an explicit internal Docker network.

### P1-04 Local Development Compatibility

- Added `docker-compose.dev.yml` for host-based local development.
- The dev override binds PostgreSQL to localhost only:
  - `127.0.0.1:${POSTGRES_PORT:-5433}:5432`
- This avoids public database exposure while still allowing local host tools or a host-run Next.js process to use PostgreSQL.

### P1-05 Deployment Documentation

- Updated `README.md` with Ubuntu Server, Digi `*.go.ro`, Nginx, Certbot, UFW, and production `.env` deployment guidance.
- Added `docs/nginx-maritimeops.conf.example`.
- Added `docs/DEPLOYMENT_SECURITY_CHECKLIST.md`.

## Files Changed

- `docker-compose.yml`
- `docker-compose.dev.yml`
- `README.md`
- `docs/nginx-maritimeops.conf.example`
- `docs/DEPLOYMENT_SECURITY_CHECKLIST.md`
- `DEPLOYMENT_REMEDIATION.md`

## Commands Run

- `npm run lint`
  - Passed with 0 errors.
  - Existing warnings remain:
    - `src/app/login/page.js`: `<img>` warning
    - `src/app/page.js`: `<img>` warning
    - `src/components/layout/Sidebar.jsx`: `<img>` warning

- `npm run build`
  - Passed successfully on Next.js `16.2.6`.

- Static verification search:
  - Confirmed main `docker-compose.yml` uses `127.0.0.1:3000:3000`.
  - Confirmed main `docker-compose.yml` has database healthcheck and log rotation.
  - Confirmed Nginx example uses `proxy_pass http://127.0.0.1:3000`.
  - Confirmed docs include UFW and Certbot commands.

## Remaining Manual Verification

These items cannot be confirmed from repository files:

- Digi router/ONT forwards only `80/tcp` and `443/tcp`.
- Router does not forward `22`, `3000`, `3001`, `5432`, or `5433`.
- UFW is enabled on Ubuntu and allows only intended ports.
- Nginx site config is installed and enabled on the server.
- Certbot certificate is issued and renewal dry-run passes.
- `NEXTAUTH_URL=https://my-subdomain.go.ro` is set in the server `.env`.
- Server `.env` has `chmod 600`.
- PostgreSQL is not reachable from another machine.
- The app is not reachable directly from another machine on `3000` or `3001`.
- SSH key login works before disabling password login.
- Fail2ban is installed and active.
- Demo accounts are changed or disabled before public exposure.
- PostgreSQL backups run and restore has been tested.

## Remaining Non-P1 Items

Not addressed in this pass:

- Dockerfile non-root runtime user.
- Dockerfile multi-stage / production-only dependency optimization.
- Application P2 issues from `SECURITY_REMEDIATION.md`, including CSV formula injection and app-level CSV size limits.
- Application-level security headers in `next.config.mjs`; Nginx example now provides deployment-level headers.
