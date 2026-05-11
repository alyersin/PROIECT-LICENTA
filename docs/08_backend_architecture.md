# Backend Architecture

## 1. Overview

The backend is implemented inside the Next.js application using route handlers and server-side functions.

The backend is responsible for:

- authentication integration
- role checking
- manual validation
- SQL queries
- database transactions
- CSV processing
- operational event creation

## 2. Backend stack

```txt
Next.js Route Handlers
JavaScript
pg library
PostgreSQL
NextAuth/Auth.js
bcrypt
PapaParse
Manual validation
```

## 3. Recommended backend folder structure

```txt
src/
  lib/
    db.js
    auth.js
    permissions.js
    validation.js
    csv.js
  repositories/
    users.repository.js
    containers.repository.js
    gate.repository.js
    vessels.repository.js
    vesselVisits.repository.js
    events.repository.js
  services/
    users.service.js
    gate.service.js
    vesselVisits.service.js
    csvImport.service.js
  app/
    api/
      users/
        route.js
      users/[id]/
        route.js
      containers/
        route.js
      containers/[id]/
        route.js
      gate/in/
        route.js
      gate/out/
        route.js
      vessel-visits/
        route.js
      vessel-visits/[id]/
        route.js
      vessel-visits/[id]/upload-csv/
        route.js
      vessel-visits/[id]/confirm-discharge/
        route.js
      vessel-visits/[id]/confirm-load/
        route.js
```

## 4. Database connection

File:

```txt
src/lib/db.js
```

Example:

```js
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
```

## 5. Request flow

Typical backend request flow:

```txt
Route Handler
   ↓
Check session
   ↓
Check permission
   ↓
Manual validation
   ↓
Call service
   ↓
Call repository
   ↓
Execute SQL query
   ↓
Return response
```

## 6. Repository layer

Repositories contain SQL queries.

Example:

```js
import pool from "@/lib/db";

export async function findContainerByNumber(containerNo) {
  const result = await pool.query(
    "SELECT * FROM containers WHERE container_no = $1",
    [containerNo]
  );

  return result.rows[0];
}
```

## 7. Service layer

Services contain business logic.

Example Gate IN logic:

```txt
validate input
find or create container
create gate transaction
update container status and location
create container event
return result
```

The service layer avoids placing all logic directly inside route handlers.

## 8. Manual validation

The project uses manual validation instead of Zod.

Example:

```js
export function validateGateIn(data) {
  const errors = {};

  if (!data.container_no) {
    errors.container_no = "Container number is required";
  }

  if (!data.truck_no) {
    errors.truck_no = "Truck number is required";
  }

  if (!["empty", "full"].includes(data.container_condition)) {
    errors.container_condition = "Invalid container condition";
  }

  if (!data.area_after) {
    errors.area_after = "Area is required";
  }

  if (!data.position_after) {
    errors.position_after = "Position is required";
  }

  return errors;
}
```

For location validation, the accepted simplified areas are:

```txt
Import Yard
Export Yard
Reefer Area
Empty Yard
ISO Tanks / IMDG Cargo Area
```

The position value remains a simple text field. The backend validates that it is present when required, but it does not calculate stacking tiers and does not check whether the position is free.

## 9. Transactions

Some operations must be saved together.

Example Gate IN must:

1. insert gate transaction
2. update container
3. insert container event

These should run in one database transaction.

Example concept:

```js
const client = await pool.connect();

try {
  await client.query("BEGIN");

  await client.query("INSERT ...");
  await client.query("UPDATE ...");
  await client.query("INSERT ...");

  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
}
```

## 10. API routes

### Users

```txt
GET    /api/users
POST   /api/users
GET    /api/users/:id
PATCH  /api/users/:id
```

### Containers

```txt
GET    /api/containers
POST   /api/containers
GET    /api/containers/:id
PATCH  /api/containers/:id/location
```

### Gate

```txt
POST   /api/gate/in
POST   /api/gate/out
```

### Vessel visits

```txt
GET    /api/vessel-visits
POST   /api/vessel-visits
GET    /api/vessel-visits/:id
PATCH  /api/vessel-visits/:id
POST   /api/vessel-visits/:id/upload-csv
POST   /api/vessel-visits/:id/confirm-discharge
POST   /api/vessel-visits/:id/confirm-load
```

## 11. Permission checks

Example:

```js
export function requireRole(user, allowedRoles) {
  if (!user || !allowedRoles.includes(user.role_code)) {
    throw new Error("Forbidden");
  }
}
```

Usage:

```js
requireRole(user, ["GATE_OPERATOR"]);
```

## 12. Error handling

Backend should return clear errors:

```txt
400 Bad Request - validation error
401 Unauthorized - not logged in
403 Forbidden - no permission
404 Not Found - resource not found
500 Internal Server Error - unexpected error
```

Example response:

```json
{
  "error": "Container number is required"
}
```

## 13. Business rules

### Gate IN

- only Gate Operator can register Gate IN
- container number is required
- truck number is required
- container condition must be `empty` or `full`
- after Gate IN, container status becomes `in_terminal`
- event `GATE_IN` is created

### Gate OUT

- only Gate Operator can register Gate OUT
- container must exist
- after Gate OUT, container status becomes `gate_out`
- event `GATE_OUT` is created

### Vessel visit

- only Terminal Operator can manage vessel visits
- ETA and ETD must be valid
- CSV must have required columns
- loading/discharge confirmations create events

## 14. Backend simplicity

The backend intentionally avoids:

- ORM
- Prisma
- Drizzle
- complex microservices
- Redis
- message queues
- advanced logging

This keeps the project easier to understand and present.
