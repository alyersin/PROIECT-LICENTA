# Local Linux Server Deployment

## 1. Overview

This document describes how to deploy MaritimeOps on a local Linux server using Docker Compose.

The deployment is intended for a licenta project and local demonstration.

## 2. Deployment architecture

```txt
Client browser
   ↓
http://server-ip:3001
   ↓
Ubuntu Linux Server
   ↓
Docker Compose
   ↓
Next.js container + PostgreSQL container
```

## 3. Requirements

Server requirements:

```txt
Ubuntu Server
Docker
Docker Compose
Git
UFW
```

## 4. Install Docker

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo systemctl enable docker
sudo systemctl start docker
```

Check:

```bash
docker --version
docker compose version
```

## 5. Clone project

```bash
git clone https://github.com/your-user/maritimeops.git
cd maritimeops
```

## 6. Create .env file

```bash
cp .env.example .env
nano .env
```

Example for full Docker Compose:

```txt
DATABASE_URL=postgres://maritimeops_user:maritimeops_password@db:5432/maritimeops_db
NEXTAUTH_SECRET=change_this_secret_123
NEXTAUTH_URL=http://localhost:3001
```

Example for local Next.js with PostgreSQL running in Docker:

```txt
DATABASE_URL=postgres://maritimeops_user:maritimeops_password@localhost:5433/maritimeops_db
NEXTAUTH_SECRET=change_this_secret_123
NEXTAUTH_URL=http://localhost:3000
```

For LAN access, set:

```txt
NEXTAUTH_URL=http://server-ip:3001
```

Example:

```txt
NEXTAUTH_URL=http://192.168.1.100:3001
```

## 7. Start application

```bash
docker compose up -d --build
```

## 8. Check containers

```bash
docker ps
```

Expected containers:

```txt
maritimeops-web
maritimeops-db
```

## 9. Run database schema

```bash
docker exec -i maritimeops-db psql -U maritimeops_user -d maritimeops_db < database/schema.sql
```

## 10. Run seed data

```bash
docker exec -i maritimeops-db psql -U maritimeops_user -d maritimeops_db < database/seed.sql
```

## 11. Open the application

From the server:

```txt
http://localhost:3001
```

From another computer in the same network:

```txt
http://server-ip:3001
```

## 12. Configure UFW

Allow SSH and app port:

```bash
sudo ufw allow 22
sudo ufw allow 3001
sudo ufw enable
sudo ufw status
```

## 13. Check logs

```bash
docker compose logs -f
```

Web logs:

```bash
docker compose logs -f web
```

Database logs:

```bash
docker compose logs -f db
```

## 14. Restart application

```bash
docker compose restart
```

## 15. Stop application

```bash
docker compose down
```

## 16. Update application

```bash
git pull
docker compose up -d --build
```

If database schema changed, run:

```bash
docker exec -i maritimeops-db psql -U maritimeops_user -d maritimeops_db < database/schema.sql
```

## 17. Optional manual backup

Backups are not mandatory for the licenta project, but a manual backup command can be included.

```bash
docker exec maritimeops-db pg_dump -U maritimeops_user maritimeops_db > backup.sql
```

Restore:

```bash
docker exec -i maritimeops-db psql -U maritimeops_user -d maritimeops_db < backup.sql
```

## 18. No HTTPS requirement

For this academic local deployment, HTTPS is not required.

Production note:

```txt
If the application is deployed publicly, HTTPS should be added.
```

## 19. No Nginx requirement

Nginx is not required because the application can be accessed directly on port 3001 in the current Compose setup.

Nginx may be added later if needed for:

- port 80
- HTTPS
- reverse proxy
- multiple apps on the same server
