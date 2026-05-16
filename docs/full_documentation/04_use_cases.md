# Use Cases

## 1. Use case list

| Code | Use case | Actor |
|---|---|---|
| UC-01 | Login | User |
| UC-02 | Logout | User |
| UC-03 | View Profile | User |
| UC-04 | Change Password | User |
| UC-05 | Manage Users | Administrator |
| UC-06 | View Containers | Gate Operator / Terminal Operator / Customer / Line Agent |
| UC-07 | Validate Container | System, included by Gate IN and Gate OUT |
| UC-08 | Register Gate IN | Gate Operator |
| UC-09 | Register Gate OUT | Gate Operator |
| UC-10 | Manage Vessel Visits | Terminal Operator |
| UC-11 | Export Operational Reports | Gate Operator / Terminal Operator / Customer / Line Agent |

## 2. Actor inheritance

The general actor `User` represents any authenticated user.

The specialized actors inherit `User`:

```txt
Administrator
Gate Operator
Terminal Operator
Customer / Line Agent
```

This means all specialized users can access:

```txt
Login
Logout
View Profile
Change Password
```

## UC-01 - Login

### Description

The user authenticates in MaritimeOps using email and password.

### Actor

User

### Precondition

The user account exists and is active.

### Main flow

1. User opens the login page.
2. System displays login form.
3. User enters email and password.
4. System validates that both fields are completed.
5. System searches the user by email.
6. System compares the password using bcrypt.
7. System identifies the user's role.
8. System creates a session.
9. System redirects the user to the correct dashboard.

### Alternative flows

Invalid email/password:

1. System displays an error message.
2. User can try again.

Inactive account:

1. System displays an account inactive message.
2. Login is not allowed.

## UC-02 - Logout

### Description

The authenticated user exits the application.

### Actor

User

### Precondition

The user is authenticated.

### Main flow

1. User selects Logout.
2. System asks for confirmation if required.
3. User confirms logout.
4. System closes the session.
5. System redirects user to the login page.

### Alternative flow

User cancels logout:

1. System keeps the session active.

## UC-03 - View Profile

### Description

The authenticated user views account profile information.

### Actor

User

### Precondition

The user is authenticated.

### Main flow

1. User opens View Profile.
2. System identifies the authenticated user.
3. System reads data from `users` and `roles`.
4. System displays full name, email, role and account status.

### Alternative flow

Invalid session:

1. System redirects the user to Login.

## UC-04 - Change Password

### Description

The authenticated user changes their own password.

### Actor

User

### Precondition

The user is authenticated.

### Main flow

1. User opens Change Password.
2. System displays the change password form.
3. User enters current password and new password.
4. System checks the current password using bcrypt.
5. System validates the new password.
6. User confirms the change.
7. System saves the new `password_hash` in `users`.
8. System displays confirmation.

### Alternative flows

Incomplete data:

1. System displays a validation error.

Wrong current password or invalid new password:

1. System displays an error.
2. User corrects the data.

## UC-05 - Manage Users

### Description

The Administrator manages the user accounts of the system. This use case includes Create User, Update User, Delete User and Assign / Change Role.

### Actor

Administrator

### Precondition

Administrator is authenticated and has administration rights.

### Main flow

1. Administrator opens Manage Users.
2. System displays user list.
3. Administrator chooses an operation:
   - Create User
   - Update User
   - Delete User
   - Assign / Change Role
4. System displays the correct form.
5. Administrator enters or modifies data.
6. System performs manual validation.
7. System saves the changes.
8. System displays a success message.

### Notes

Delete User is implemented as logical deactivation through `users.is_active`, not as physical deletion. This keeps the operational history valid.

### Manual validation examples

- full name is required
- email is required
- email must be unique
- role must be selected
- password is required when creating a user

## UC-06 - View Containers

### Description

Authorized users view containers and container details. Terminal Operator can also update the simplified area and position when needed.

### Actors

- Gate Operator
- Terminal Operator
- Customer / Line Agent

### Precondition

User is authenticated and has viewing permission.

### Main flow

1. User opens Containers page.
2. System displays available containers for the authenticated role.
3. User searches or filters the list.
4. System displays filtered results.
5. User selects one container.
6. System displays:
   - container number
   - ISO type
   - size
   - status
   - current area
   - current position
   - customer
   - operational history
7. If the user is Terminal Operator, the system allows location correction.
8. Terminal Operator selects a new area and position.
9. System validates the values.
10. System updates the container and creates a `LOCATION_UPDATED` event.

### Alternative flows

No results:

1. System displays a message.
2. User can change filters.

Customer / Line Agent restriction:

1. System displays only containers associated with the allowed customer/line context.

Invalid location update:

1. System displays error.
2. Container data remains unchanged.

Allowed simplified areas:

```txt
Import Yard
Export Yard
Reefer Area
Empty Yard
ISO Tanks / IMDG Cargo Area
```

The position is textual and simplified. The same position can represent a container stack, but the application does not calculate the physical tier and does not verify if the position is free.

## UC-07 - Validate Container

### Description

The system validates the container before Gate IN and Gate OUT operations.

### Actor

System, triggered by Register Gate IN or Register Gate OUT.

### Precondition

The Gate Operator entered container data in the form.

### Main flow

1. Gate operation sends container data for verification.
2. System checks container number format and required fields.
3. System checks if the container exists or can be introduced as a new record.
4. System checks current container status and operation permission.
5. System returns valid result or error message.

### Alternative flow

Invalid container or missing data:

1. System stops the operation.
2. System asks the user to correct the data.

### Note

Validate Container is not a separate table. It is a logical validation step used by Gate IN and Gate OUT.

## UC-08 - Register Gate IN

### Description

Gate Operator registers the entry of a container into the terminal and sets the initial area and position.

### Actor

Gate Operator

### Precondition

Gate Operator is authenticated and the container can be identified or introduced as a new record.

### Main flow

1. Gate Operator opens Gate IN page.
2. System displays Gate IN form.
3. Gate Operator enters:
   - container number
   - truck number
   - date/time
   - empty/full condition
   - seal number
   - area after entry
   - position after entry
   - observations
4. System includes Validate Container.
5. System creates or updates the container record.
6. System creates a gate transaction.
7. System updates container status and location.
8. System creates a `GATE_IN` container event.
9. System displays success message.

### Alternative flows

Data incomplete:

1. System displays validation errors.
2. User corrects the form.

Invalid area/position:

1. System displays error.
2. User selects a valid area and position.

## UC-09 - Register Gate OUT

### Description

Gate Operator registers the exit of a container from the terminal.

### Actor

Gate Operator

### Precondition

Gate Operator is authenticated, the container exists and it has the right to exit.

### Main flow

1. Gate Operator opens Gate OUT page.
2. System displays Gate OUT form.
3. Gate Operator enters:
   - container number
   - truck number
   - date/time
   - destination
   - seal number
   - observations
4. System includes Validate Container.
5. System checks if container can exit.
6. System creates a gate transaction.
7. System updates container status.
8. System creates a `GATE_OUT` event.
9. System displays success message.

### Alternative flows

Container not found:

1. System displays error.
2. Operation stops.

Container cannot exit:

1. System displays reason.
2. Operation is blocked until resolved.

## UC-10 - Manage Vessel Visits

### Description

Terminal Operator manages vessel visits, imports CSV files and confirms vessel operations. This use case includes the CSV discharge/loading lists and the confirmation of discharge/loading operations.

### Actor

Terminal Operator

### Precondition

Terminal Operator is authenticated. For CSV import, a list is received from the vessel agent or line.

### Main flow

1. Terminal Operator opens Vessel Visits.
2. System displays vessel visit list.
3. Terminal Operator creates or edits a visit.
4. Terminal Operator enters:
   - vessel
   - inbound voyage number
   - outbound voyage number
   - ETA
   - ETD
   - berth
   - status
5. System validates data.
6. Terminal Operator uploads discharge and/or loading CSV.
7. System reads file with PapaParse.
8. System validates CSV rows.
9. System saves uploaded file record.
10. System creates vessel visit container records.
11. Terminal Operator confirms discharge operations and sets area/position after discharge.
12. System updates container status/location and creates `DISCHARGED` events.
13. Terminal Operator confirms loading operations.
14. System updates operation status and creates `LOADED` events.
15. System displays confirmation.

### Alternative flows

Invalid visit data:

1. System displays error.
2. User corrects form.

Invalid CSV:

1. System displays row/column errors.
2. User uploads corrected file.

Missing location after discharge:

1. System asks Terminal Operator to complete area and position.

## UC-11 - Export Operational Reports

### Description

Authorized users export simple CSV reports generated live from existing MaritimeOps operational data.

### Actors

- Gate Operator
- Terminal Operator
- Customer / Line Agent

### Precondition

User is authenticated and has report access for their role.

### Main flow

1. User opens Containers or My Containers.
2. System displays the container list allowed for the authenticated role.
3. User searches or filters the visible container rows.
4. User selects Export CSV.
5. System exports the currently visible filtered rows.
6. System applies role-based visibility rules.
7. System returns a CSV file for download.

### Report availability

- Gate Operator and Terminal Operator can export filtered Containers CSV from the Containers page.
- Customer / Line Agent can export only customer-scoped filtered Containers CSV from the My Containers page where `containers.id_customer` matches the current user customer.
- Separate report routes may exist for operational CSVs, but the main workflow is direct export from the filtered container list.

### Notes

No ERD or database schema change is required. Reports are generated from existing tables: `containers`, `customers`, `gate_transactions`, `users`, `vessels`, `vessel_visits`, and `vessel_visit_containers`.

## 3. Removed use case

`Manage Stowage Plan` is not implemented as a separate use case.

Reason:

The official stowage plan is created or coordinated outside the terminal application, by the vessel side, shipping line, chief officer, commander or agent. MaritimeOps only manages the operational loading/discharge lists and terminal confirmations.
