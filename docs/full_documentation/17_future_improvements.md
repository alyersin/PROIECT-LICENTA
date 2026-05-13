# Future Improvements

## 1. Overview

The current MaritimeOps version is intentionally simplified for a licenta project.

Future versions can include more advanced features.

## 2. HTTPS and Nginx

For production, the app should use:

- HTTPS
- Nginx or Caddy reverse proxy
- domain name
- SSL certificate

## 3. Advanced backups

A production version should include:

- scheduled database backups
- backup rotation
- external backup storage
- restore testing

## 4. Better monitoring

Possible tools:

```txt
Grafana
Prometheus
Loki
Sentry
```

These are not needed for the licenta version.

## 5. Detailed yard planning

A future version could add:

- yard blocks
- yard bays
- rows
- tiers
- slot planning
- container moves
- yard map visualization

## 6. Internal container moves

A new table could be added:

```txt
container_moves
```

Possible fields:

```txt
id_move
id_container
from_area
from_position
to_area
to_position
id_user
move_reason
moved_at
```

## 7. Stowage plan module

The current version does not manage stowage plans.

A future version could include:

- stowage plan import
- bay plan visualization
- vessel cell positions
- load/discharge sequencing

## 8. EDI integration

Real terminals use standardized electronic messages.

Future integrations:

```txt
BAPLIE
COPRAR
CODECO
COARRI
```

## 9. Real-time notifications

The application could notify users when:

- a vessel visit status changes
- a container is discharged
- a container is loaded
- a gate transaction is registered

Possible technologies:

```txt
WebSockets
Server-Sent Events
```

## 10. Audit logs

The current `container_events` table stores operational history.

A future version could also include full user audit logs:

```txt
who changed what
when it changed
old value
new value
```

## 11. Advanced reporting

Possible reports:

- Gate IN per day
- Gate OUT per day
- containers by area
- vessel productivity
- pending loading list
- pending discharge list
- customer container report

## 12. Role improvements

Future version could support:

- multiple roles per user
- custom permissions
- department-based access
- customer-specific access rules

## 13. API documentation

The backend API could be documented with:

```txt
OpenAPI / Swagger
```

## 14. Automated tests

Future testing could include:

- unit tests
- integration tests
- end-to-end tests with Playwright

## 15. ORM migration

The current version uses simple SQL.

Future version could migrate to:

```txt
Prisma
Drizzle
```

This is optional and not required for the licenta version.

## 16. Cloud deployment

Future deployment options:

- VPS
- Docker on cloud server
- managed PostgreSQL
- Vercel frontend + external database

## 17. Mobile responsive improvements

The current dashboard can be optimized for desktop first.

Future improvements:

- mobile sidebar drawer
- responsive tables
- mobile-friendly forms


## 18. More detailed customer-user association

The current ERD keeps the customer association mainly through `containers.id_customer`. A future version could add a more detailed access model for Customer / Line Agent accounts, for example:

```txt
user_customers
```

Possible fields:

```txt
id_user
id_customer
assigned_at
```

This is not required for the current licenta version.

## 19. More formal audit model

The current system stores operational events in `container_events`. A future version could add a separate audit model for all system changes, not only container operations.
