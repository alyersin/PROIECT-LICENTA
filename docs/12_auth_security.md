# Authentication and Security

## 1. Authentication approach

The project uses:

```txt
NextAuth/Auth.js
Credentials login
bcrypt
Database sessions or application sessions
```

Users log in with:

```txt
email
password
```

## 2. Why bcrypt is required

Passwords must not be stored in plain text.

Bad:

```txt
password = admin123
```

Good:

```txt
password_hash = $2b$10$...
```

bcrypt is used to:

- hash the password when creating a user
- compare the typed password during login

## 3. Password creation flow

When Administrator creates a user:

```txt
Admin enters email, full name, role and password
↓
System validates data
↓
System hashes password with bcrypt
↓
System stores password_hash in users table
```

Example:

```js
import bcrypt from "bcrypt";

const passwordHash = await bcrypt.hash(password, 10);
```

## 4. Login flow

```txt
User enters email and password
↓
System finds user by email
↓
System checks if user is active
↓
System compares password with bcrypt
↓
System loads role
↓
System creates session
↓
System redirects to dashboard
```

Example:

```js
const passwordOk = await bcrypt.compare(password, user.password_hash);
```

## 5. Role-based authorization

Authentication answers:

```txt
Who is the user?
```

Authorization answers:

```txt
What is the user allowed to do?
```

Example:

```js
if (user.role_code !== "ADMIN") {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}
```

## 6. Manual validation

The project uses manual validation instead of Zod.

Validation is still necessary.

Examples:

- email is required
- password is required
- container number is required
- truck number is required
- ETA and ETD must be valid
- CSV must contain required columns
- area and position must be valid

Example:

```js
if (!email) {
  errors.email = "Email is required";
}

if (!password) {
  errors.password = "Password is required";
}
```

## 7. Environment variables

Secrets should be stored in `.env`.

Example:

```txt
DATABASE_URL=postgres://maritimeops_user:password@db:5432/maritimeops_db
NEXTAUTH_SECRET=change_this_secret
NEXTAUTH_URL=http://localhost:3000
```

Do not commit `.env` to GitHub.

Use:

```txt
.env.example
```

for documentation.

## 8. Database security

For the local Docker setup:

- PostgreSQL runs inside Docker
- PostgreSQL should not be publicly exposed
- only the web container should connect to PostgreSQL
- use a strong database password

Good Docker Compose idea:

```yaml
db:
  image: postgres:16
  expose:
    - "5432"
```

Avoid exposing database publicly:

```yaml
ports:
  - "5432:5432"
```

## 9. UFW firewall

For a simple local Linux server demo:

```bash
sudo ufw allow 22
sudo ufw allow 3000
sudo ufw enable
sudo ufw status
```

If SSH is not needed from outside, restrict it to local network.

## 10. HTTPS

HTTPS is not required for the local licenta demo.

Recommended explanation:

> The academic version is deployed on a local Linux server in a controlled environment, so HTTPS is not mandatory. In a production environment, HTTPS would be required.

## 11. Nginx

Nginx is not required for the simple local demo.

The application can be accessed directly:

```txt
http://server-ip:3000
```

Nginx could be added later for:

- port 80 access
- HTTPS
- reverse proxy
- multiple applications on the same server

## 12. Docker logs

Docker logs are enough for the project.

Commands:

```bash
docker compose logs
docker compose logs -f web
docker compose logs -f db
```

## 13. Security summary

Implemented:

```txt
bcrypt password hashing
role-based access
manual validation
environment variables
UFW firewall
Docker network isolation
```

Not required for licenta:

```txt
HTTPS
Nginx
Fail2ban
advanced monitoring
SIEM
Kubernetes security
```
