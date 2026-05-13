# Docker Containerization

## 1. Overview

MaritimeOps uses Docker and Docker Compose for local deployment.

The application has two main containers:

```txt
web - Next.js application
db  - PostgreSQL database
```

No Nginx is required for the simple licenta version.

## 2. Folder structure

```txt
maritimeops/
  Dockerfile
  docker-compose.yml
  .env
  .env.example
  package.json
  src/
  database/
    schema.sql
    seed.sql
```

## 3. Dockerfile

Example Dockerfile:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 4. docker-compose.yml

Example:

```yaml
services:
  web:
    build: .
    container_name: maritimeops-web
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - db

  db:
    image: postgres:16
    container_name: maritimeops-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: maritimeops_db
      POSTGRES_USER: maritimeops_user
      POSTGRES_PASSWORD: maritimeops_password
    volumes:
      - maritimeops_pgdata:/var/lib/postgresql/data
    expose:
      - "5432"

volumes:
  maritimeops_pgdata:
```

## 5. Environment variables

Example `.env`:

```txt
DATABASE_URL=postgres://maritimeops_user:maritimeops_password@db:5432/maritimeops_db
NEXTAUTH_SECRET=change_this_secret
NEXTAUTH_URL=http://localhost:3000
```

## 6. Build and start

```bash
docker compose up -d --build
```

## 7. Stop containers

```bash
docker compose down
```

## 8. View running containers

```bash
docker ps
```

## 9. View logs

```bash
docker compose logs
docker compose logs -f web
docker compose logs -f db
```

## 10. Run database schema

After containers start:

```bash
docker exec -i maritimeops-db psql -U maritimeops_user -d maritimeops_db < database/schema.sql
```

## 11. Run seed data

```bash
docker exec -i maritimeops-db psql -U maritimeops_user -d maritimeops_db < database/seed.sql
```

## 12. Connect to PostgreSQL shell

```bash
docker exec -it maritimeops-db psql -U maritimeops_user -d maritimeops_db
```

## 13. Test database tables

Inside psql:

```sql
\dt
SELECT * FROM roles;
SELECT * FROM users;
```

## 14. Access application

From server:

```txt
http://localhost:3000
```

From another machine in local network:

```txt
http://server-ip:3000
```

Example:

```txt
http://192.168.1.100:3000
```

## 15. Why Docker is useful

Docker makes deployment simpler because:

- the app runs the same way on any machine
- PostgreSQL is isolated
- dependencies are installed inside the container
- the project can be started with one command
- the professor can understand the deployment architecture easily

## 16. Container architecture

```txt
Browser
   ↓
http://server-ip:3000
   ↓
web container - Next.js
   ↓
Docker internal network
   ↓
db container - PostgreSQL
```

## 17. Not included

The licenta version does not require:

- Kubernetes
- Docker Swarm
- Nginx
- HTTPS certificates
- external database hosting
