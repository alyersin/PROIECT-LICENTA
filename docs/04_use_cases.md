# Use Cases

## 1. Use case list

| Code | Use case | Actor |
|---|---|---|
| UC-01 | Login | User |
| UC-02 | Logout | User |
| UC-03 | Manage Users | Administrator |
| UC-04 | View Containers | Gate Operator / Terminal Operator / Customer Agent |
| UC-05 | Register Gate IN | Gate Operator |
| UC-06 | Register Gate OUT | Gate Operator |
| UC-07 | Manage Vessel Visits | Terminal Operator |

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
2. System closes the session.
3. System redirects user to the login page.

## UC-03 - Manage Users

### Description

The Administrator manages the user accounts of the system.

### Actor

Administrator

### Precondition

Administrator is authenticated.

### Main flow

1. Administrator opens Manage Users.
2. System displays user list.
3. Administrator chooses an operation:
   - create user
   - edit user
   - reset password
   - activate/deactivate user
   - change role
4. System displays the correct form.
5. Administrator enters or modifies data.
6. System performs manual validation.
7. System saves the changes.
8. System displays a success message.

### Manual validation examples

- full name is required
- email is required
- email must be unique
- role must be selected
- password is required when creating a user

## UC-04 - View Containers

### Description

Authorized users view containers and container details.

### Actors

- Gate Operator
- Terminal Operator
- Customer / Line Agent

### Precondition

User is authenticated and has viewing permission.

### Main flow

1. User opens Containers page.
2. System displays available containers.
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

### Alternative flows

No results:

1. System displays a message.
2. User can change filters.

Customer / Line Agent restriction:

1. System displays only containers associated with that customer.

### Location update

Only Terminal Operator can update location.

1. Terminal Operator opens container details.
2. Terminal Operator chooses a new area and position.
3. System validates values.
4. System updates container.
5. System creates a `LOCATION_UPDATED` event.

Allowed simplified areas:

```txt
Import Yard
Export Yard
Reefer Area
Empty Yard
ISO Tanks / IMDG Cargo Area
```

The position is textual and simplified. The same position can represent a container stack, but the application does not calculate the physical tier and does not verify if the position is free.

## UC-05 - Register Gate IN

### Description

Gate Operator registers the entry of a container into the terminal.

### Actor

Gate Operator

### Precondition

Gate Operator is authenticated.

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
4. System performs manual validation.
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

## UC-06 - Register Gate OUT

### Description

Gate Operator registers the exit of a container from the terminal.

### Actor

Gate Operator

### Precondition

Gate Operator is authenticated and container exists.

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
4. System validates data.
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

## UC-07 - Manage Vessel Visits

### Description

Terminal Operator manages vessel visits, imports CSV files and confirms vessel operations.

### Actor

Terminal Operator

### Precondition

Terminal Operator is authenticated.

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
11. Terminal Operator confirms discharge operations.
12. System updates container status/location and creates events.
13. Terminal Operator confirms loading operations.
14. System updates operation status and creates events.

### Alternative flows

Invalid visit data:

1. System displays error.
2. User corrects form.

Invalid CSV:

1. System displays row/column errors.
2. User uploads corrected file.

Missing location after discharge:

1. System asks Terminal Operator to complete area and position.
