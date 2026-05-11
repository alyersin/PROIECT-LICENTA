# Requirements

## 1. Functional requirements

### FR-01 - User login

The system must allow users to authenticate using email and password.

The login flow:

```txt
User opens login page
User enters email and password
System checks credentials
System identifies user role
System redirects user to the correct dashboard
```

### FR-02 - User logout

The system must allow authenticated users to log out.

### FR-03 - Role-based access

The system must restrict access based on user role.

Roles:

```txt
ADMIN
GATE_OPERATOR
TERMINAL_OPERATOR
CUSTOMER_AGENT
```

### FR-04 - Manage users

The Administrator must be able to:

- create user accounts
- edit user details
- reset passwords
- activate/deactivate accounts
- assign a role to each user

### FR-05 - View containers

Authorized users must be able to view containers.

Gate Operator and Terminal Operator can view operational container data.

Customer / Line Agent can view only containers associated with their customer account.

### FR-06 - Search and filter containers

The system must support searching and filtering containers by:

- container number
- status
- current area
- customer
- size
- reefer status

### FR-07 - View container details

The system must display container details:

- container number
- ISO type
- size
- status
- reefer flag
- gross weight
- current area
- current position
- customer
- operational history

### FR-08 - Update container location

The Terminal Operator must be able to update a container's current area and current position when needed.

Allowed simplified areas:

```txt
Import Yard
Export Yard
Reefer Area
Empty Yard
ISO Tanks / IMDG Cargo Area
```

Every location update must create a container event.

### FR-09 - Register Gate IN

The Gate Operator must be able to register the entry of a container into the terminal.

Gate IN data:

- container number
- truck number
- transaction date/time
- empty/full condition
- seal number
- area after entry
- position after entry
- observations

After Gate IN, the system must:

- create a gate transaction
- update container status
- update container area/position
- create a container event

### FR-10 - Register Gate OUT

The Gate Operator must be able to register the exit of a container from the terminal.

Gate OUT data:

- container number
- truck number
- transaction date/time
- destination
- seal number
- observations

After Gate OUT, the system must:

- create a gate transaction
- update container status
- create a container event

### FR-11 - Manage vessels

The Terminal Operator must be able to create and manage vessels.

Vessel data:

- vessel name
- IMO number

### FR-12 - Manage vessel visits

The Terminal Operator must be able to create and manage vessel visits.

Vessel visit data:

- vessel
- inbound voyage number
- outbound voyage number
- ETA
- ETD
- berth
- status

### FR-13 - Import discharge list CSV

The Terminal Operator must be able to upload a discharge list CSV for a vessel visit.

The system must:

- read the CSV file
- validate required columns
- create imported file record
- create vessel visit container records with operation type `DISCHARGE`

### FR-14 - Import loading list CSV

The Terminal Operator must be able to upload a loading list CSV for a vessel visit.

The system must:

- read the CSV file
- validate required columns
- create imported file record
- create vessel visit container records with operation type `LOAD`

### FR-15 - Confirm discharge

The Terminal Operator must be able to confirm that a container has been discharged from a vessel.

After confirmation, the system must:

- update operation status to `confirmed`
- update container status
- set area and position
- create a `DISCHARGED` event

### FR-16 - Confirm loading

The Terminal Operator must be able to confirm that a container has been loaded on a vessel.

After confirmation, the system must:

- update operation status to `confirmed`
- update container status
- create a `LOADED` event

### FR-17 - Container event history

The system must store operational events for containers.

Event types:

```txt
GATE_IN
GATE_OUT
DISCHARGED
LOADED
LOCATION_UPDATED
VESSEL_VISIT_ASSIGNED
```

## 2. Non-functional requirements

### NFR-01 - Simplicity

The application must remain simple enough to be understood and presented for a licenta project.

### NFR-02 - Maintainability

The code should be organized into clear folders:

```txt
app/
components/
lib/
repositories/
database/
```

### NFR-03 - Security

The system must:

- hash passwords using bcrypt
- protect private pages
- restrict pages by role
- use environment variables for secrets
- avoid exposing PostgreSQL publicly

### NFR-04 - Usability

The interface should be clear, modern and easy to use.

### NFR-05 - Local deployment

The system must run on a local Linux server using Docker Compose.

### NFR-06 - Logging

Docker logs are enough for this project.

### NFR-07 - Firewall

UFW is used to allow only necessary ports.

## 3. Out of scope

The following are not required for this version:

- real-time crane control
- yard slot optimization
- advanced stowage planning
- payment module
- public API
- Kubernetes
- Redis cache
- Nginx reverse proxy
- HTTPS for local demo
- advanced monitoring stack
