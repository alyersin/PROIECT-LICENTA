# UI / UX Design and Wireframes

## 1. Design goals

The interface should be:

- simple
- clean
- professional
- easy to explain
- easy to use during demo
- optimized for dashboard operations

MaritimeOps should look like an operational management system, not like a public marketing website.

## 2. General layout

The application uses a dashboard layout:

```txt
---------------------------------------------------------
| MaritimeOps                          User | Logout     |
---------------------------------------------------------
| Sidebar             | Main content area                 |
|                     |                                   |
| Dashboard           | Page title                        |
| Containers          | Filters / Forms / Tables          |
| Gate IN             |                                   |
| Gate OUT            |                                   |
| Vessel Visits       |                                   |
| Users               |                                   |
---------------------------------------------------------
```

## 3. Main layout areas

### Header

Contains:

- application name
- logged-in user name
- role badge
- profile link
- change password link
- logout button

### Sidebar

Contains role-based navigation.

### Main content

Displays:

- dashboard cards
- tables
- forms
- details pages
- import screens

## 4. Color palette

Recommended maritime-style color palette:

```txt
Main background: #0f172a
Panel background: #111827
Card background: #1e293b
Primary blue: #2563eb
Primary blue hover: #1d4ed8
Success green: #16a34a
Warning amber: #f59e0b
Danger red: #dc2626
Text main: #f8fafc
Text muted: #94a3b8
Border: #334155
```

## 5. Typography

Recommended font:

```txt
Inter
Arial fallback
sans-serif
```

Text hierarchy:

```txt
Page title: 28px / 32px, bold
Section title: 20px / 24px, semibold
Table text: 14px / 20px
Form label: 14px / 20px, medium
Small helper text: 12px / 16px
```

## 6. Dashboard wireframe

```txt
Dashboard
---------------------------------------------------
[ Containers in terminal ] [ Vessel visits today  ]
[ Gate IN today         ] [ Gate OUT today       ]
[ Pending discharge     ] [ Pending loading      ]
---------------------------------------------------

Recent Events
---------------------------------------------------
Time        Container       Event          User
10:20       MSCU1234567     GATE_IN        Gate Op
10:45       TCLU7654321     DISCHARGED     Terminal Op
---------------------------------------------------
```

## 7. Login page wireframe

```txt
---------------------------------------------------
|                                                 |
|                 MaritimeOps                     |
|       Container Terminal Management System      |
|                                                 |
|          Email                                  |
|          [________________________]             |
|                                                 |
|          Password                               |
|          [________________________]             |
|                                                 |
|          [ Login ]                              |
|                                                 |
---------------------------------------------------
```

## 8. Containers page wireframe

```txt
Containers
---------------------------------------------------
Search: [ container number, customer, status ]

Filters:
[ Area ] [ Status ] [ Size ] [ Customer ]

---------------------------------------------------
Container No | Size | Status | Area | Position | Customer | Action
MSCU1234567  | 40   | In Terminal | Export Yard | B2-05 | Maersk | View
TCLU7654321  | 20   | In Terminal | ISO Tanks / IMDG Cargo Area | T1-03 | MSC | View
---------------------------------------------------
```

## 9. Container details wireframe

```txt
Container MSCU1234567
---------------------------------------------------
Status: In Terminal
Size: 40
ISO Type: 45G1
Reefer: No
Gross weight: 24000 kg
Customer: Maersk
Current area: Export Yard
Current position: B2-05

[ Update location ] only for Terminal Operator
---------------------------------------------------

Operational History
---------------------------------------------------
Date/time           Event              User
2026-05-11 09:00    GATE_IN            gate.operator@test.com
2026-05-11 11:20    LOCATION_UPDATED   terminal.operator@test.com
---------------------------------------------------
```

## 10. Gate IN page wireframe

```txt
Register Gate IN
---------------------------------------------------
Container number    [________________]
Truck number        [________________]
Date/time           [________________]
Condition           [ empty | full ]
Seal number         [________________]
Area after entry    [ Export Yard v ]
Position after      [ B2-05 ________]
Observations        [________________]

[ Register Gate IN ]
---------------------------------------------------
```

## 11. Gate OUT page wireframe

```txt
Register Gate OUT
---------------------------------------------------
Container number    [________________]
Truck number        [________________]
Date/time           [________________]
Destination         [________________]
Seal number         [________________]
Observations        [________________]

[ Register Gate OUT ]
---------------------------------------------------
```

## 12. Vessel visits page wireframe

```txt
Vessel Visits
---------------------------------------------------
[ Create vessel visit ]

Vessel       Voyage In | Voyage Out | ETA       | ETD       | Status
MSC Maya     IN123     | OUT456     | 2026-05-11| 2026-05-12| Planned
Maersk Lima  IN789     | OUT900     | 2026-05-14| 2026-05-15| In operation
---------------------------------------------------
```

## 13. Vessel visit details wireframe

```txt
Vessel Visit - MSC Maya
---------------------------------------------------
Vessel: MSC Maya
Inbound voyage: IN123
Outbound voyage: OUT456
ETA: 2026-05-11 08:00
ETD: 2026-05-12 18:00
Berth: Berth 2
Status: In operation

[ Upload CSV ] [ Edit visit ]
---------------------------------------------------

Operations
---------------------------------------------------
Container No | Operation | Status | Port | Weight | Action
MSCU1234567  | DISCHARGE | planned | ROCND| 24000  | Confirm discharge
TCLU7654321  | LOAD      | planned | TRIST| 22000  | Confirm loading
---------------------------------------------------
```

## 14. CSV upload wireframe

```txt
Upload CSV
---------------------------------------------------
Vessel Visit: MSC Maya - IN123 / OUT456

File type:
( ) Discharge list
( ) Loading list

CSV file:
[ Choose file ]

[ Upload and validate ]
---------------------------------------------------

Preview
---------------------------------------------------
Container No | Operation | Port | Weight | Status
MSCU1234567  | DISCHARGE | ROCND| 24000  | Valid
---------------------------------------------------
```

## 15. User management wireframe

```txt
Manage Users
---------------------------------------------------
[ Create user ]

Name        | Email                | Role              | Status | Action
Admin User  | admin@test.com       | ADMIN             | Active | Edit
Gate User   | gate@test.com        | GATE_OPERATOR     | Active | Edit
---------------------------------------------------
```

## 16. Form behavior

Forms should show:

- clear labels
- required field indicators
- error messages under fields
- success messages after saving
- disabled submit button while processing

## 17. Badge examples

Status badges:

```txt
planned       gray
arrived       blue
in_operation  amber
completed     green
cancelled     red
```

Container operation badges:

```txt
GATE_IN            blue
GATE_OUT           red
DISCHARGED         amber
LOADED             green
LOCATION_UPDATED   purple
```


## 18. Profile page wireframe

```txt
View Profile
---------------------------------------------------
Full name:        Admin User
Email:            admin@maritimeops.local
Role:             ADMIN
Account status:   Active

[ Change Password ]
---------------------------------------------------
```

## 19. Change password page wireframe

```txt
Change Password
---------------------------------------------------
Current password   [________________]
New password       [________________]
Confirm password   [________________]

[ Save new password ]
---------------------------------------------------
```

## 20. Use case alignment note

The final Use Case diagram includes common actions for the general `User` actor: Login, Logout, View Profile and Change Password. These pages should be available for all authenticated roles through the header or sidebar.

The Administrator page supports Manage Users, including Create User, Update User, Delete User through deactivation and Assign / Change Role.

The application does not include a separate Manage Stowage Plan screen in the current version.
