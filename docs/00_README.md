# MaritimeOps Documentation Pack

MaritimeOps is a simplified Container Terminal Management System designed for a licenta project.

This updated documentation pack is aligned with the latest Use Case diagram, ERD and database documentation.

The documentation in this pack covers:

1. Project overview
2. Requirements
3. Roles and permissions
4. Use cases
5. UI/UX design and wireframes
6. Styling strategy with Tailwind CSS and `globals.css`
7. Frontend architecture
8. Backend architecture
9. Database design
10. SQL schema planning
11. CSV import flow
12. Authentication and security
13. Docker containerization
14. Local Linux server deployment
15. Logs and basic maintenance
16. Testing plan
17. Future improvements
18. Build and implementation plan
19. Formal relational model and constraints

Final simplified technology stack:

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

Main design principle:

> Keep the project realistic enough for a container terminal application, but simple enough to explain, build and present clearly for a licenta project.

The project does not implement a full Terminal Operating System like Navis. It focuses on the core academic workflows: users, roles, containers, gate transactions, vessel visits, CSV loading/discharge lists and container operational history.

Important modelling decisions:

- The general actor `User` has Login, Logout, View Profile and Change Password.
- Administrator, Gate Operator, Terminal Operator and Customer / Line Agent inherit the general `User` actor.
- `Manage Users` includes Create User, Update User, Delete User and Assign / Change Role.
- `Register Gate IN` and `Register Gate OUT` include `Validate Container`.
- `Manage Stowage Plan` is not implemented as a separate use case.
- The official stowage plan is considered external to the application and is received from the vessel, shipping line or agent.
- The application uses a simplified yard model with `current_area` and `current_position`.
- The database uses 10 main tables, without `Container_Moves`, `Yard_Blocks`, `Yard_Slots`, `Container_Visits` or `User_Roles`.
