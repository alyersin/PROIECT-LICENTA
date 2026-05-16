# Local Deployment Security Audit

Date: 2026-05-17

Scope: Local Ubuntu Server deployment audit for MaritimeOps using Docker Compose, PostgreSQL, Nginx reverse proxy, Certbot/Let's Encrypt, and a Digi `*.go.ro` public domain/subdomain. This report is documentation-only; no application code or deployment files were modified.

## Executive Summary

The target architecture is sound: expose only Nginx on ports 80 and 443, terminate HTTPS with Let's Encrypt, proxy to the Next.js container through localhost or an internal Docker network, and keep PostgreSQL private on the Docker network.

The current repository is close to a local Docker development setup, not a production-safe home-server deployment. The main confirmed deployment risks are:

- `docker-compose.yml` publishes the web container on host port `3001` on all interfaces.
- `docker-compose.yml` publishes PostgreSQL on host port `${POSTGRES_PORT:-5433}`, which can become reachable from the LAN and possibly the Internet if UFW/router rules are wrong.
- `Dockerfile` runs the app as root and uses `npm install` instead of a locked production install.
- No Docker healthchecks or log rotation are configured.
- No Nginx, UFW, SSH, Fail2ban, backup, or production Compose files are present in the repository.
- No application-level security headers/CSP are configured yet, so Nginx should add defense-in-depth headers during deployment.

The deployment should not publish PostgreSQL. The app should not be public on `3000`/`3001`. Only Nginx should be public, with the router forwarding only 80 and 443.

## Target Secure Architecture

Recommended target:

```txt
Internet
  -> Digi router / ONT
  -> forwards only 80/tcp and 443/tcp
  -> Ubuntu Server
  -> UFW allows only SSH, 80/tcp, 443/tcp
  -> Nginx reverse proxy + Certbot Let's Encrypt
  -> http://127.0.0.1:3000 or Docker internal app service
  -> Next.js app container
  -> Docker internal network
  -> PostgreSQL container with no published ports
```

Key rules:

- Do not forward `5432`, `5433`, `3000`, or `3001` on the router.
- Do not allow public UFW access to `5432`, `5433`, `3000`, or `3001`.
- Do not publish PostgreSQL ports in production Compose.
- Bind the app port to localhost only if Nginx proxies to a host port: `127.0.0.1:3000:3000`.
- Set `NEXTAUTH_URL=https://my-subdomain.go.ro` in production.
- Use strong unique `POSTGRES_PASSWORD` and `NEXTAUTH_SECRET`.

## Critical Findings

No confirmed critical findings in repository files.

## High Findings

### Finding H-01

Severity: High
Category: Docker exposure
File(s): `docker-compose.yml`
Issue: PostgreSQL is published to the host with `ports: - "${POSTGRES_PORT:-5433}:5432"`.
Risk: PostgreSQL should not be reachable outside Docker. If UFW, Docker iptables behavior, router forwarding, or host network rules are misconfigured, the database could be reachable from the LAN or Internet.
Evidence: `docker-compose.yml` defines `db.ports` with host port `${POSTGRES_PORT:-5433}` mapped to container port `5432`.
Fix: Remove the `ports:` section from the PostgreSQL service in production. Let the app connect to `db:5432` over the Compose network using `DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}`.
Priority: P1

### Finding H-02

Severity: High
Category: Docker exposure
File(s): `docker-compose.yml`
Issue: The web container is published as `"3001:3000"` on all host interfaces.
Risk: The app can be reachable directly on port `3001`, bypassing Nginx HTTPS, security headers, request/body limits, and centralized logging. If the router forwards 3001 or UFW allows it, the app is exposed publicly.
Evidence: `docker-compose.yml` defines `web.ports` as `"3001:3000"`.
Fix: For Nginx-on-host deployments, bind the app only to loopback: `"127.0.0.1:3000:3000"`. Alternatively, run Nginx in Docker on the same network and do not publish the app at all.
Priority: P1

### Finding H-03

Severity: High
Category: Secrets and environment
File(s): `.env.example`, `README.md`, `docker-compose.yml`, `database/seed.sql`
Issue: Production secret values cannot be confirmed from repository files. Examples correctly use placeholders, but deployment must replace them. Seed/demo users still use development-only `admin123` by design.
Risk: Reusing placeholder secrets or demo passwords on a public `*.go.ro` deployment can allow account takeover or session compromise.
Evidence: `.env.example` uses `replace_with_*` placeholders; `README.md` says secrets must be changed; `database/seed.sql` documents development-only `admin123`.
Fix: Generate production secrets on the server, set `chmod 600 .env`, do not commit `.env`, change or disable all seeded demo accounts before public exposure.
Priority: P1

### Finding H-04

Severity: High
Category: Ubuntu/router exposure
File(s): Needs manual verification
Issue: Router port forwarding and UFW state cannot be confirmed from repository files.
Risk: If ports `5432`, `5433`, `3000`, `3001`, Docker daemon ports, or unrestricted SSH are exposed, attackers can bypass Nginx or attack the database/server directly.
Evidence: No server firewall/router configuration files are present. Current Compose publishes app and DB host ports, which increases the impact of permissive firewall/router rules.
Fix: Forward only `80/tcp` and `443/tcp` on the Digi router/ONT. UFW should allow only SSH, `80/tcp`, and `443/tcp`, and deny database/app ports.
Priority: P1

## Medium Findings

### Finding M-01

Severity: Medium
Category: Docker runtime hardening
File(s): `Dockerfile`
Issue: The Dockerfile does not define a non-root user, so the container likely runs as root.
Risk: If the app process is compromised, root inside the container increases the blast radius within the container and can worsen host impact when combined with Docker/kernel misconfigurations.
Evidence: `Dockerfile` has no `USER` instruction.
Fix: Use a non-root user in the runtime image, such as the built-in `node` user on Alpine, and ensure copied files are readable by that user.
Priority: P2

### Finding M-02

Severity: Medium
Category: Docker build hardening
File(s): `Dockerfile`
Issue: The Dockerfile uses `npm install` and includes dev dependencies during image build. It is also not multi-stage.
Risk: The image is larger than necessary and may contain build-time dependencies in the runtime layer. Larger images increase maintenance and attack surface.
Evidence: `Dockerfile` runs `RUN npm install`, copies the full app, builds, then runs `npm start` in the same image.
Fix: Use `npm ci` for lockfile reproducibility. Consider a multi-stage build with a smaller runtime stage and production dependencies only.
Priority: P2

### Finding M-03

Severity: Medium
Category: Docker reliability/security
File(s): `docker-compose.yml`
Issue: No healthchecks are configured for the app or database.
Risk: Compose can report containers as running even when PostgreSQL is not ready or the app is unhealthy. This makes recovery and monitoring weaker.
Evidence: `docker-compose.yml` contains `restart: unless-stopped` but no `healthcheck`.
Fix: Add a PostgreSQL `pg_isready` healthcheck and an app HTTP healthcheck if a lightweight health endpoint exists or is added.
Priority: P2

### Finding M-04

Severity: Medium
Category: Logs and disk exhaustion
File(s): `docker-compose.yml`
Issue: Docker log rotation is not configured.
Risk: Long-running containers can fill disk through unbounded JSON logs, causing downtime and possible database corruption risk if the filesystem fills.
Evidence: `docker-compose.yml` has no `logging` options.
Fix: Add Docker logging limits per service or configure daemon-wide log rotation.
Priority: P2

### Finding M-05

Severity: Medium
Category: Nginx and application hardening
File(s): `next.config.mjs`, Nginx config needs manual creation
Issue: No security headers or CSP are configured in Next.js, and no Nginx config exists in the repository.
Risk: Missing headers reduce protection against clickjacking, MIME sniffing, some XSS impact, referrer leakage, and unnecessary browser permissions.
Evidence: `next.config.mjs` only enables `reactCompiler`; no Nginx config file exists.
Fix: Add security headers in Nginx and/or Next.js: CSP, `X-Frame-Options` or `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and HSTS after HTTPS is confirmed working.
Priority: P2

### Finding M-06

Severity: Medium
Category: File upload / request body limits
File(s): `src/components/forms/CsvUploadForm.jsx`, `src/app/api/vessel-visits/[id]/upload-csv/route.js`, Nginx config needs manual creation
Issue: CSV upload/import body size limits are not enforced at Nginx or confirmed in app code.
Risk: Large request bodies can consume memory/CPU in Nginx, Next.js, JSON parsing, and CSV parsing.
Evidence: Existing `SECURITY_AUDIT.md` identified CSV upload size limits as a remaining P2 item; no Nginx `client_max_body_size` exists because no Nginx config is present.
Fix: Set a realistic Nginx `client_max_body_size`, for example `2m` or `5m`, and later add app-level CSV size and row-count limits.
Priority: P2

### Finding M-07

Severity: Medium
Category: Backup and recovery
File(s): Needs manual verification
Issue: No backup/restore process is present in repository deployment files.
Risk: Hardware failure, bad updates, accidental deletes, or database corruption can permanently lose project data.
Evidence: `docker-compose.yml` uses a named volume `maritimeops_pgdata`, but no backup scripts or documented restore commands exist in deployment files.
Fix: Add a scheduled `pg_dump` backup process, encrypt/copy backups off-server, and periodically test restore.
Priority: P2

### Finding M-08

Severity: Medium
Category: SSH hardening
File(s): Needs manual verification
Issue: SSH server hardening cannot be confirmed.
Risk: Password-based SSH, root login, or broad router forwarding of SSH increases brute-force and server takeover risk.
Evidence: No Ubuntu `sshd_config`, UFW, Fail2ban, or router config is in the repository.
Fix: Use SSH keys, disable root login, disable password login after confirming key access, restrict SSH by IP or VPN/Tailscale/WireGuard where possible, and enable Fail2ban.
Priority: P2

### Finding M-09

Severity: Medium
Category: Application-specific deployment risk
File(s): `src/app/api/reports/*`, `src/lib/csvResponse.js`, `SECURITY_AUDIT.md`
Issue: CSV/report hardening remains incomplete from the application audit.
Risk: Reports can leak data if authorization regresses, and CSV formula injection remains a known issue until fixed.
Evidence: `SECURITY_REMEDIATION.md` lists remaining issue M-01: CSV formula injection in exports. Report routes are server-protected by role/customer checks, but export hardening remains pending.
Fix: Complete remaining application P2 remediation before public deployment, especially CSV formula escaping and report limits.
Priority: P2

## Low Findings

### Finding L-01

Severity: Low
Category: Docker metadata
File(s): `Dockerfile`
Issue: `EXPOSE 3000` documents the app port. This does not publish the port by itself, but it can be misunderstood.
Risk: Low direct risk; actual exposure comes from Compose `ports`.
Evidence: `Dockerfile` contains `EXPOSE 3000`.
Fix: Keep it if useful for documentation, but ensure production Compose does not publish it publicly.
Priority: P3

### Finding L-02

Severity: Low
Category: Deployment environment
File(s): `.env.example`, `README.md`
Issue: Example `NEXTAUTH_URL` values are localhost for development. Production value must be changed.
Risk: Incorrect `NEXTAUTH_URL` can break callbacks/cookies and may weaken same-origin checks.
Evidence: `.env.example` uses `NEXTAUTH_URL=http://localhost:3000`; README shows localhost examples.
Fix: Set production `.env` to `NEXTAUTH_URL=https://my-subdomain.go.ro`.
Priority: P3

### Finding L-03

Severity: Low
Category: Docker socket and mounts
File(s): `docker-compose.yml`
Issue: No dangerous Docker socket mounts were found.
Risk: Positive finding; mounting `/var/run/docker.sock` into app containers would be high risk.
Evidence: `docker-compose.yml` only mounts the named volume `maritimeops_pgdata:/var/lib/postgresql/data`.
Fix: Keep Docker socket out of application containers.
Priority: P3

## Docker and docker-compose Review

Confirmed current state:

- `web` service:
  - `build: .`
  - `restart: unless-stopped`
  - publishes `"3001:3000"` on all interfaces
  - loads `.env`
  - overrides `DATABASE_URL` to use `db:5432`
- `db` service:
  - uses `postgres:16`
  - `restart: unless-stopped`
  - reads DB name/user/password from environment variables
  - stores data in named volume `maritimeops_pgdata`
  - publishes `"${POSTGRES_PORT:-5433}:5432"` on all interfaces
- No Docker socket mount found.
- No healthchecks found.
- No Docker log rotation found.
- No explicit non-root user in `Dockerfile`.

Required production changes:

- Remove DB `ports` entirely.
- Change app port mapping to localhost-only if Nginx runs on the host:

```yaml
ports:
  - "127.0.0.1:3000:3000"
```

- Keep database access through Docker service name:

```txt
postgres://maritimeops_user:strong_password@db:5432/maritimeops_db
```

- Add healthchecks and log rotation.
- Run the app container as non-root when practical.

## PostgreSQL Exposure Review

Confirmed issue:

- PostgreSQL is currently published to the host in `docker-compose.yml`.

Production requirement:

- PostgreSQL must not have:

```yaml
ports:
  - "5432:5432"
```

- It also should not have:

```yaml
ports:
  - "${POSTGRES_PORT:-5433}:5432"
```

Recommended production behavior:

- Keep PostgreSQL internal-only on the Docker network.
- App connects to `db:5432`.
- Do not forward `5432` or `5433` on the router.
- Do not allow `5432` or `5433` through UFW.

Least-privilege recommendation:

- For a bachelor project, one app DB user is acceptable if kept private and strong.
- For stronger separation, create:
  - owner/migration user for schema changes
  - app runtime user with only required privileges on app tables/sequences
- Do not use the default `postgres` superuser as `DATABASE_URL`.

Backups:

- Use `pg_dump` from the DB container:

```bash
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backups/maritimeops_$(date +%F_%H%M%S).sql
```

- Compress backup:

```bash
gzip backups/maritimeops_YYYY-MM-DD_HHMMSS.sql
```

- Restore test:

```bash
cat backups/maritimeops_backup.sql | docker compose exec -T db psql -U "$POSTGRES_USER" "$POSTGRES_DB"
```

Store backups encrypted and off-server, for example on an encrypted USB drive or private cloud storage.

`pg_hba.conf` / `postgresql.conf`:

- In this Docker setup, the most important protection is no published DB port.
- Custom `pg_hba.conf` is usually not needed for this project if PostgreSQL is only accessible on the private Docker network.

## Nginx and HTTPS Review

Nginx should be the only public entry point.

Recommended Certbot setup:

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d my-subdomain.go.ro
sudo certbot renew --dry-run
```

Recommended behavior:

- HTTP redirects to HTTPS.
- HTTPS proxies to `http://127.0.0.1:3000`.
- Nginx sets proxy headers:
  - `Host`
  - `X-Real-IP`
  - `X-Forwarded-For`
  - `X-Forwarded-Proto`
- Nginx limits upload body size for CSV imports.
- Nginx adds security headers.
- Add HSTS only after HTTPS is confirmed working.

CSV body size:

```nginx
client_max_body_size 5m;
```

If your CSV files are small, use `2m`. Keep it as low as practical.

## Ubuntu Firewall / UFW Checklist

Recommended UFW commands:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 5432/tcp
sudo ufw deny 5433/tcp
sudo ufw deny 3000/tcp
sudo ufw deny 3001/tcp
sudo ufw enable
sudo ufw status verbose
```

If using a custom SSH port:

```bash
sudo ufw allow <custom-ssh-port>/tcp
```

Do not allow:

- `5432/tcp`
- `5433/tcp`
- `3000/tcp`
- `3001/tcp`
- Docker daemon ports such as `2375/tcp` or `2376/tcp`

Router/ONT:

- Forward only `80/tcp` and `443/tcp` to the Ubuntu server.
- Do not forward `22`, `5432`, `5433`, `3000`, or `3001` unless there is a deliberate, restricted reason.
- For remote SSH, prefer VPN/Tailscale/WireGuard or IP-restricted forwarding.

Important Docker/UFW note:

- Docker can add iptables rules that bypass some UFW assumptions. Do not rely on UFW alone to protect published container ports. The safest fix is not publishing PostgreSQL and binding the app only to `127.0.0.1`.

## SSH Hardening Checklist

Recommended:

- Create a dedicated deployment user.
- Use SSH key authentication.
- Confirm key login works before disabling password login.
- Disable root SSH login.
- Disable password login if you have reliable key/recovery access.
- Optionally change SSH port, but do not treat that as primary security.
- Install Fail2ban.

Example `/etc/ssh/sshd_config` settings:

```txt
PubkeyAuthentication yes
PasswordAuthentication no
PermitRootLogin no
```

Apply carefully:

```bash
sudo sshd -t
sudo systemctl reload ssh
```

Keep a recovery method before disabling password login, especially on a home server.

## Secrets and Environment Review

Confirmed:

- `.gitignore` ignores `.env*`.
- `git ls-files .env` returned no output during the prior remediation, meaning `.env` was not tracked at that time.
- `.env.example` uses placeholder values.
- `docker-compose.yml` reads DB credentials from environment variables.

Production requirements:

- On Ubuntu, create `.env` on the server only.
- Set strict permissions:

```bash
chmod 600 .env
```

- Generate a strong `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

- Generate a strong database password:

```bash
openssl rand -base64 32
```

Production `.env` pattern:

```txt
POSTGRES_DB=maritimeops_db
POSTGRES_USER=maritimeops_user
POSTGRES_PASSWORD=<strong_unique_password>
DATABASE_URL=postgres://maritimeops_user:<strong_unique_password>@db:5432/maritimeops_db
NEXTAUTH_SECRET=<openssl_rand_base64_32>
NEXTAUTH_URL=https://my-subdomain.go.ro
NODE_ENV=production
```

Do not:

- commit `.env`
- reuse example placeholders
- reuse demo password `admin123`
- log full `DATABASE_URL`
- paste tokens/passwords into public screenshots or docs

## Backup and Restore Plan

Create a backup directory:

```bash
mkdir -p backups
chmod 700 backups
```

Manual backup:

```bash
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backups/maritimeops_$(date +%F_%H%M%S).sql
gzip backups/maritimeops_*.sql
```

Example restore to an existing database:

```bash
gunzip -c backups/maritimeops_backup.sql.gz | docker compose exec -T db psql -U "$POSTGRES_USER" "$POSTGRES_DB"
```

Operational recommendations:

- Schedule backups with cron or a systemd timer.
- Keep at least one off-server copy.
- Encrypt backups before moving them off-server.
- Test restore before relying on backups.
- Do not store backups in the public web root.
- Do not commit backups to Git.

## Monitoring and Logs

Basic commands:

```bash
docker ps
docker compose ps
docker compose logs --tail 100 web
docker compose logs --tail 100 db
df -h
docker system df
sudo journalctl -u ssh
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

Docker log rotation options per service:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

Do not log:

- passwords
- tokens
- cookies
- full `DATABASE_URL`
- `NEXTAUTH_SECRET`

## Recommended Production docker-compose.yml Pattern

Host Nginx reverse proxy pattern:

```yaml
services:
  web:
    build: .
    container_name: maritimeops-web
    restart: unless-stopped
    env_file:
      - .env
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    ports:
      - "127.0.0.1:3000:3000"
    depends_on:
      db:
        condition: service_healthy
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - maritimeops_internal

  db:
    image: postgres:16
    container_name: maritimeops-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - maritimeops_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - maritimeops_internal

volumes:
  maritimeops_pgdata:

networks:
  maritimeops_internal:
    driver: bridge
```

Important:

- No `ports` on `db`.
- `web` bound to `127.0.0.1`.
- Nginx proxies to `127.0.0.1:3000`.

## Recommended Nginx Config Pattern

Before Certbot, use a simple HTTP server block. Certbot can then modify it for HTTPS.

```nginx
server {
    listen 80;
    server_name my-subdomain.go.ro;

    client_max_body_size 5m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

After HTTPS is working, include security headers in the HTTPS server block:

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
```

CSP note:

- The above CSP is a starting point for a Next.js app. It may need tightening after browser testing.
- `unsafe-inline` / `unsafe-eval` may be needed depending on Next.js/runtime behavior. Test before removing.

Add HSTS only after HTTPS is confirmed:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

Certbot:

```bash
sudo certbot --nginx -d my-subdomain.go.ro
sudo certbot renew --dry-run
```

## Exact Commands Checklist

Server setup:

```bash
sudo apt update
sudo apt upgrade
sudo apt install nginx certbot python3-certbot-nginx ufw fail2ban unattended-upgrades
```

UFW:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 5432/tcp
sudo ufw deny 5433/tcp
sudo ufw deny 3000/tcp
sudo ufw deny 3001/tcp
sudo ufw enable
sudo ufw status verbose
```

Certbot:

```bash
sudo certbot --nginx -d my-subdomain.go.ro
sudo certbot renew --dry-run
```

SSH checks:

```bash
sudo sshd -t
sudo systemctl reload ssh
sudo journalctl -u ssh
```

Fail2ban:

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

Docker monitoring:

```bash
docker ps
docker compose ps
docker compose logs --tail 100
docker system df
df -h
```

Backups:

```bash
mkdir -p backups
chmod 700 backups
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backups/maritimeops_$(date +%F_%H%M%S).sql
gzip backups/maritimeops_*.sql
```

Secrets:

```bash
openssl rand -base64 32
chmod 600 .env
```

## Files Inspected

- `docker-compose.yml`
- `Dockerfile`
- `.dockerignore`
- `.gitignore`
- `.env.example`
- `README.md`
- `package.json`
- `next.config.mjs`
- `database/seed.sql`
- `SECURITY_AUDIT.md`
- `SECURITY_REMEDIATION.md`
- Relevant app route and auth files through static search:
  - `src/app/**`
  - `src/lib/auth.js`
  - `src/lib/apiSecurity.js`
  - `src/lib/csvResponse.js`

Read-only commands used:

- `Get-Content ...`
- `git ls-files ...`
- `rg --line-number ...`

No build, test, Docker, database, deployment, or network commands were run for this audit.

## Needs Manual Verification

Server/router:

- Digi `*.go.ro` DNS/DDNS points to the correct public IP.
- Whether Digi uses CGNAT for your connection. If CGNAT is present, inbound public hosting may not work without ISP support or a tunnel/VPN solution.
- Router forwards only `80/tcp` and `443/tcp`.
- Router does not forward `22`, `5432`, `5433`, `3000`, or `3001`.
- UFW is enabled and only allows intended ports.
- Docker-published ports are not externally reachable.
- SSH keys work before disabling password login.
- Root SSH login is disabled.
- Fail2ban is installed and active.
- Certbot renewal works.
- Nginx HTTP to HTTPS redirect works.
- `NEXTAUTH_URL=https://my-subdomain.go.ro` in production `.env`.
- Production `.env` has `chmod 600`.
- Demo users are changed/disabled before exposure.
- PostgreSQL cannot be reached from another machine.
- Backups run and restore has been tested.

Application:

- Login/logout work through the public domain.
- Cookies are secure over HTTPS.
- Mutating forms still work through Nginx after CSRF header remediation.
- CSV upload size limit is acceptable for your real files.
- Reports do not leak unauthorized data.
- Production errors do not expose stack traces.
- `NODE_ENV=production` is set in the app container.
- No source maps/debug output are publicly exposed. `next.config.mjs` does not enable `productionBrowserSourceMaps`, which is good.

## Final Deployment Checklist

Before public exposure:

- Remove PostgreSQL port publishing from production Compose.
- Bind app host port to `127.0.0.1` only or keep it internal to Docker.
- Configure Nginx as the only public entry point.
- Set Certbot HTTPS for `my-subdomain.go.ro`.
- Set `NEXTAUTH_URL=https://my-subdomain.go.ro`.
- Generate strong `NEXTAUTH_SECRET`.
- Generate strong `POSTGRES_PASSWORD`.
- `chmod 600 .env`.
- Ensure `.env` is not committed.
- Change or disable all demo accounts/passwords.
- Enable UFW with only SSH, 80, and 443.
- Ensure router forwards only 80 and 443.
- Harden SSH and enable Fail2ban.
- Configure Docker log rotation.
- Configure PostgreSQL backups and test restore.
- Confirm `npm audit` remains clean before building the deployment image.
- Complete remaining application P2 fixes from `SECURITY_REMEDIATION.md`, especially CSV formula injection and upload/request limits, before relying on the app for real data.
