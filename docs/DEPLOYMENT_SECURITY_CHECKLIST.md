# Deployment Security Checklist

Use this checklist before exposing MaritimeOps through a Digi `*.go.ro` domain.

## Router / Digi go.ro

- Confirm `*.go.ro` points to your home public IP.
- Confirm you are not blocked by CGNAT. If you are behind CGNAT, inbound hosting may require ISP support or a VPN/tunnel.
- Forward only:
  - `80/tcp`
  - `443/tcp`
- Do not forward:
  - `22/tcp` unless intentionally restricted
  - `3000/tcp`
  - `3001/tcp`
  - `5432/tcp`
  - `5433/tcp`

## UFW

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

## Docker Compose

- Main `docker-compose.yml` must publish only the app on localhost:
  - `127.0.0.1:3000:3000`
- PostgreSQL must not have a `ports:` section in production.
- App must connect to PostgreSQL through Docker DNS:
  - `db:5432`
- Confirm containers restart automatically:
  - `restart: unless-stopped`
- Confirm Docker log rotation is configured.
- Confirm the database healthcheck passes:

```bash
docker compose ps
docker compose logs --tail 100 db
```

## Nginx and Certbot

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d my-subdomain.go.ro
sudo certbot renew --dry-run
```

- Nginx should proxy to:
  - `http://127.0.0.1:3000`
- Set `client_max_body_size 5m;`.
- Add security headers in the HTTPS server block.
- Enable HSTS only after HTTPS is confirmed working.

## Environment Secrets

- Production `.env` exists only on the server.
- `.env` permissions are strict:

```bash
chmod 600 .env
```

- `NEXTAUTH_SECRET` is generated with:

```bash
openssl rand -base64 32
```

- `POSTGRES_PASSWORD` is strong and unique.
- `NEXTAUTH_URL=https://my-subdomain.go.ro`.
- Do not commit `.env`.
- Do not reuse demo password `admin123`.

## SSH Hardening

- Use SSH key authentication.
- Confirm key login works before disabling password login.
- Recommended `/etc/ssh/sshd_config` settings:

```txt
PubkeyAuthentication yes
PasswordAuthentication no
PermitRootLogin no
```

- Validate and reload:

```bash
sudo sshd -t
sudo systemctl reload ssh
```

- Prefer VPN/Tailscale/WireGuard or IP restriction for remote SSH.

## Fail2ban

```bash
sudo apt install fail2ban
sudo systemctl enable --now fail2ban
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

Optional later work:

- Add Nginx filters for repeated abuse if logs show attacks.

## Backups

```bash
mkdir -p backups
chmod 700 backups
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backups/maritimeops_$(date +%F_%H%M%S).sql
gzip backups/maritimeops_*.sql
```

- Keep at least one encrypted off-server backup.
- Test restore before relying on backups.
- Do not store backups in Git or the Nginx web root.

## Logs and Monitoring

```bash
docker ps
docker compose ps
docker compose logs --tail 100
df -h
docker system df
sudo journalctl -u ssh
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

Do not log passwords, cookies, tokens, `NEXTAUTH_SECRET`, or full `DATABASE_URL`.

## Manual Verification

- Public site loads only on HTTPS.
- HTTP redirects to HTTPS.
- `http://server-ip:3000` is not reachable from another machine.
- `postgres` is not reachable from another machine on `5432` or `5433`.
- Login and logout work through the public domain.
- Mutating forms work through Nginx.
- CSV upload limit is acceptable.
- Demo accounts are changed or disabled.
