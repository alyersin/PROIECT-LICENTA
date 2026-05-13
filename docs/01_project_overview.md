# MaritimeOps - Project Overview

## 1. Project name

**MaritimeOps**

## 2. Project type

Web application for simplified operational management in a container terminal.

## 3. Project purpose

MaritimeOps is designed as an academic licenta project. The application supports the most important simplified operations of a container terminal:

- user authentication
- logout
- profile viewing
- password change
- role-based access
- user management
- container search and visualization
- Gate IN operations
- Gate OUT operations
- container validation before gate operations
- vessel visit management
- CSV import for discharge and loading lists
- confirmation of loading and discharge operations
- container operational history

The system is not intended to replace a real industrial Terminal Operating System. Instead, it models the essential logic in a simplified and understandable way.

## 4. Main problem addressed

Container terminals manage many container movements and operational events. Even in a simplified environment, the terminal needs to know:

- which containers are in the terminal
- where each container is located
- which containers entered or exited through the gate
- which containers are assigned to a vessel visit
- which containers are planned for discharge or loading
- what operational history each container has

MaritimeOps centralizes these operations in one web application.

## 5. Simplified terminal model

The application uses a simplified terminal plan based on operational areas and positions.

Example areas:

```txt
Import Yard
Export Yard
Reefer Area
Empty Yard
ISO Tanks / IMDG Cargo Area
```

The system does not model detailed yard blocks, rows, tiers or individual slot algorithms. Each container stores:

```txt
current_area
current_position
```

The position is textual and simplified. The system does not automatically manage stacking levels, but the same position can represent a container stack. For example, B2-05 can be read as block/sector B2, position 05. If multiple containers are registered with the same position, they can be conceptually interpreted as being stacked in the same location. The application does not automatically calculate the physical tier and does not verify if the position is free.

## 6. Main users

The system has one general actor and four specialized roles.

| Actor / Role | Main responsibility |
|---|---|
| User | Login, Logout, View Profile, Change Password |
| Administrator | Manages users and roles |
| Gate Operator | Registers Gate IN and Gate OUT operations |
| Terminal Operator | Manages vessel visits and operational container updates |
| Customer / Line Agent | Views associated containers |

Administrator, Gate Operator, Terminal Operator and Customer / Line Agent inherit the general User actor.

## 7. Main application modules

| Module | Description |
|---|---|
| Authentication | Login and logout |
| Profile | View Profile and Change Password |
| User Management | Create, update, deactivate users and assign/change roles |
| Container Management | View containers, details and history |
| Gate Operations | Register Gate IN and Gate OUT |
| Validate Container | Logical validation included by Gate IN and Gate OUT |
| Vessel Visits | Create visits, import CSV lists and confirm operations |
| CSV Import | Import discharge/loading lists |
| Operational History | Store container events |

## 8. Technology stack

```txt
Next.js
JavaScript
Tailwind CSS + globals.css
PostgreSQL
pg library
NextAuth/Auth.js
bcrypt
PapaParse
Docker
Docker Compose
Docker logs
UFW
.env variables
Manual validation
Simple SQL files
```

## 9. Why this stack is suitable

The chosen stack is simple, modern and realistic:

- Next.js provides both frontend and backend functionality.
- JavaScript keeps the project beginner-friendly.
- Tailwind CSS and `globals.css` allow fast styling with reusable classes.
- PostgreSQL is a professional relational database.
- The `pg` library keeps database access simple through SQL queries.
- NextAuth/Auth.js handles authentication.
- bcrypt secures user passwords.
- PapaParse simplifies CSV import.
- Docker allows easy local deployment.
- UFW provides basic firewall protection.
- Docker logs are enough for a licenta-level deployment.

## 10. Project scope

Included:

- login/logout
- view profile
- change password
- role-based dashboards
- manage users
- create user
- update user
- delete user through logical deactivation
- assign/change role
- view containers
- validate container before gate operations
- register Gate IN
- register Gate OUT
- manage vessel visits
- import CSV loading/discharge lists
- confirm loading/discharge operations
- show container history

Not included:

- complex yard slot planning
- automatic crane planning
- real stowage planning
- separate Manage Stowage Plan module
- EDI integration
- Kubernetes
- microservices
- Redis
- advanced monitoring
- HTTPS for local licenta demo
- Nginx reverse proxy

## 11. Stowage plan clarification

The official stowage plan is not created by MaritimeOps. In real operations, the official stowage plan is prepared or coordinated by the vessel side, shipping line, chief officer, commander or agent. MaritimeOps works with the operational loading/discharge lists received from outside the system and records confirmations inside the terminal.

## 12. Final goal

The final goal is to produce a working prototype that demonstrates how a container terminal can manage basic operational flows using a web application, a relational database and a local Docker-based deployment.
