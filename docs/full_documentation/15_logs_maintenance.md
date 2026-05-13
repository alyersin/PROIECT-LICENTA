# Logs and Basic Maintenance

## 1. Logging approach

For the licenta version, Docker logs are enough.

The project does not need advanced monitoring tools.

Not required:

```txt
Grafana
Prometheus
Loki
ELK
Datadog
Sentry
```

## 2. View all logs

```bash
docker compose logs
```

## 3. Follow logs live

```bash
docker compose logs -f
```

## 4. Web application logs

```bash
docker compose logs -f web
```

## 5. Database logs

```bash
docker compose logs -f db
```

## 6. Restart containers

```bash
docker compose restart
```

Restart only web:

```bash
docker compose restart web
```

Restart only database:

```bash
docker compose restart db
```

## 7. Check running containers

```bash
docker ps
```

## 8. Check stopped containers

```bash
docker ps -a
```

## 9. Stop application

```bash
docker compose down
```

## 10. Start application again

```bash
docker compose up -d
```

## 11. Rebuild after code change

```bash
docker compose up -d --build
```

## 12. Check disk usage

```bash
docker system df
```

## 13. Clean unused Docker resources

Use carefully:

```bash
docker system prune
```

## 14. Manual database backup

Backups are optional for the licenta project.

Manual backup:

```bash
docker exec maritimeops-db pg_dump -U maritimeops_user maritimeops_db > backup.sql
```

## 15. Restore backup

```bash
docker exec -i maritimeops-db psql -U maritimeops_user -d maritimeops_db < backup.sql
```

## 16. Basic maintenance checklist

Before presentation:

```txt
docker ps shows web and db running
application opens in browser
login works
admin user exists
sample containers exist
Gate IN works
Gate OUT works
vessel visit page works
CSV import works
logs show no critical errors
UFW allows port 3000
```
