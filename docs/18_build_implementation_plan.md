# Build and Implementation Plan

## 1. Overview

This document describes the recommended step-by-step build order for MaritimeOps.

The goal is to build the project gradually, from foundation to operational features.

## 2. Phase 1 - Project setup

Tasks:

```txt
Create Next.js project
Install dependencies
Set up Tailwind CSS
Create globals.css design classes
Create basic folder structure
Create Dockerfile
Create docker-compose.yml
Create .env.example
```

Dependencies:

```bash
npm install pg bcrypt papaparse next-auth
```

## 3. Phase 2 - Database setup

Tasks:

```txt
Create database/schema.sql
Create database/seed.sql
Create roles table
Create users table
Create customers table
Create containers table
Create operational tables
Run schema in PostgreSQL container
Run seed data
```

Test:

```txt
Open PostgreSQL shell
Check tables
Check roles
Check test users
```

## 4. Phase 3 - Database connection

Tasks:

```txt
Create src/lib/db.js
Connect to PostgreSQL using pg
Test simple query
Create repository files
```

Repositories:

```txt
users.repository.js
containers.repository.js
gate.repository.js
vesselVisits.repository.js
events.repository.js
```

## 5. Phase 4 - Authentication

Tasks:

```txt
Configure NextAuth/Auth.js
Use Credentials Provider
Use bcrypt compare
Create login page
Create logout action
Protect dashboard routes
Load user role
```

Test:

```txt
Login as admin
Login as gate operator
Login as terminal operator
Login as customer agent
Try wrong password
Try inactive account
```

## 6. Phase 5 - Layout and navigation

Tasks:

```txt
Create AppShell
Create Header
Create Sidebar
Create role-based navigation
Create dashboard page
Create reusable UI components
```

Components:

```txt
Button
Input
Select
Card
Table
Badge
Modal
```

## 7. Phase 6 - User management

Tasks:

```txt
Create users list page
Create user form
Create user API routes
Add manual validation
Hash password with bcrypt
Allow activate/deactivate user
Allow role change
```

Role:

```txt
Only ADMIN can access.
```

## 8. Phase 7 - Containers module

Tasks:

```txt
Create containers page
Create search/filter
Create container details page
Create container events timeline
Create update location action for Terminal Operator
```

Test:

```txt
View all containers as Gate Operator
View all containers as Terminal Operator
View own containers as Customer Agent
Update location as Terminal Operator
Check LOCATION_UPDATED event
```

## 9. Phase 8 - Gate operations

Tasks:

```txt
Create Gate IN page
Create Gate OUT page
Create gate API routes
Add manual validation
Use database transactions
Create container events
```

Gate IN operation:

```txt
Create/update container
Create gate transaction
Update location
Create GATE_IN event
```

Gate OUT operation:

```txt
Find container
Create gate transaction
Update status
Create GATE_OUT event
```

## 10. Phase 9 - Vessel visits

Tasks:

```txt
Create vessels support
Create vessel visits page
Create vessel visit form
Create vessel visit details page
Create operations table
```

## 11. Phase 10 - CSV import

Tasks:

```txt
Create CSV upload form
Use PapaParse
Validate rows manually
Create uploaded_files record
Create vessel_visit_containers records
Display preview
Display errors
```

Test files:

```txt
sample-discharge-list.csv
sample-loading-list.csv
invalid-list.csv
```

## 12. Phase 11 - Confirm operations

Tasks:

```txt
Confirm discharge
Confirm loading
Update operation status
Update container status/location
Create DISCHARGED event
Create LOADED event
```

## 13. Phase 12 - Docker deployment

Tasks:

```txt
Build Docker image
Start Docker Compose
Run schema.sql
Run seed.sql
Open application on localhost:3000
Open application from LAN using server IP
```

## 14. Phase 13 - UFW and logs

Tasks:

```txt
Allow port 22
Allow port 3000
Enable UFW
Check docker logs
Document commands
```

## 15. Phase 14 - Final testing

Test all main flows:

```txt
Login
Logout
Manage Users
View Containers
Gate IN
Gate OUT
Create Vessel Visit
Upload CSV
Confirm Discharge
Confirm Loading
Role permissions
Docker deployment
```

## 16. Recommended build order summary

```txt
1. Setup project
2. Setup database
3. Connect database with pg
4. Add auth
5. Add layout
6. Add user management
7. Add containers
8. Add gate operations
9. Add vessel visits
10. Add CSV import
11. Add confirm operations
12. Add Docker deployment
13. Test everything
```
