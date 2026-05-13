# Testing Plan

## 1. Overview

The goal of testing is to prove that MaritimeOps works correctly for the main licenta use cases.

Testing can be manual.

No complex automated testing framework is required for the first version.

## 2. Test users

Create these users:

| Email | Role |
|---|---|
| admin@maritimeops.local | ADMIN |
| gate@maritimeops.local | GATE_OPERATOR |
| terminal@maritimeops.local | TERMINAL_OPERATOR |
| customer@maritimeops.local | CUSTOMER_AGENT |

## 3. Authentication tests

### Test login success

Steps:

1. Open login page.
2. Enter valid email and password.
3. Submit form.

Expected result:

```txt
User is redirected to dashboard.
Correct role menu is displayed.
```

### Test login failure

Steps:

1. Enter wrong password.
2. Submit form.

Expected result:

```txt
Error message is displayed.
User remains on login page.
```

### Test logout

Steps:

1. Log in.
2. Click Logout.

Expected result:

```txt
Session is closed.
User is redirected to login page.
```

## 4. Profile and password tests

### View profile

Steps:

1. Log in with any role.
2. Open View Profile.

Expected result:

```txt
Full name, email, role and account status are displayed.
```

### Change password

Steps:

1. Log in with any role.
2. Open Change Password.
3. Enter current password and new password.
4. Save.

Expected result:

```txt
Password hash is updated.
User can log in with the new password.
```

## 5. Admin tests

### Create user

Steps:

1. Login as admin.
2. Open Manage Users
View Profile
Change Password.
3. Create a new user.
4. Select role.
5. Save.

Expected result:

```txt
User is created.
Password is hashed.
User appears in list.
```

### Deactivate user

Steps:

1. Open user edit page.
2. Set user inactive.
3. Save.
4. Try to login with that user.

Expected result:

```txt
Inactive user cannot log in.
```

## 6. Container tests

### View containers

Steps:

1. Login as Gate Operator.
2. Open Containers page.

Expected result:

```txt
Container list is displayed.
```

### Search container

Steps:

1. Search for container number.
2. Submit search.

Expected result:

```txt
Matching container is displayed.
```

### View details

Steps:

1. Open a container.
2. Check details and history.

Expected result:

```txt
Container details are displayed.
Operational history is displayed.
```

## 7. Validate Container tests

### Validate container before Gate IN

Steps:

1. Login as Gate Operator.
2. Open Gate IN.
3. Enter incomplete or invalid container data.
4. Submit.

Expected result:

```txt
Validate Container blocks the operation and displays errors.
No gate transaction is created.
```

## 8. Gate IN tests

### Successful Gate IN

Steps:

1. Login as Gate Operator.
2. Open Gate IN.
3. Enter valid data.
4. Submit.

Expected result:

```txt
Gate transaction is created.
Container status is updated.
Container area and position are updated.
GATE_IN event is created.
```

### Gate IN validation error

Steps:

1. Leave container number empty.
2. Submit form.

Expected result:

```txt
Validation error is displayed.
No database insert is made.
```

## 9. Gate OUT tests

### Successful Gate OUT

Steps:

1. Login as Gate Operator.
2. Open Gate OUT.
3. Enter valid data.
4. Submit.

Expected result:

```txt
Gate transaction is created.
Container status is updated.
GATE_OUT event is created.
```

### Gate OUT container not found

Steps:

1. Enter non-existing container number.
2. Submit.

Expected result:

```txt
System displays error.
Operation is not saved.
```

## 10. Vessel visit tests

### Create vessel visit

Steps:

1. Login as Terminal Operator.
2. Open Vessel Visits.
3. Create visit.
4. Enter vessel, voyage, ETA, ETD and berth.
5. Save.

Expected result:

```txt
Vessel visit is created.
Visit appears in list.
```

### Invalid ETA/ETD

Steps:

1. Enter ETD before ETA.
2. Submit form.

Expected result:

```txt
Validation error is displayed.
```

## 11. CSV import tests

### Import discharge list

Steps:

1. Login as Terminal Operator.
2. Open vessel visit.
3. Upload discharge CSV.
4. Confirm import.

Expected result:

```txt
uploaded_files row is created.
vessel_visit_containers rows are created.
Operation type is DISCHARGE.
```

### Import loading list

Steps:

1. Upload loading CSV.
2. Confirm import.

Expected result:

```txt
uploaded_files row is created.
vessel_visit_containers rows are created.
Operation type is LOAD.
```

### Invalid CSV

Steps:

1. Upload CSV without container_no column.

Expected result:

```txt
System displays validation error.
Rows are not saved.
```

## 12. Confirm discharge tests

Steps:

1. Open vessel visit operations.
2. Select a planned discharge container.
3. Enter area and position.
4. Confirm discharge.

Expected result:

```txt
operation_status becomes confirmed.
Container status is updated.
Container location is updated.
DISCHARGED event is created.
event_area and event_position are saved.
```

## 13. Confirm loading tests

Steps:

1. Open vessel visit operations.
2. Select a planned loading container.
3. Confirm loading.

Expected result:

```txt
operation_status becomes confirmed.
Container status is updated.
LOADED event is created.
```

## 14. Permission tests

### Gate Operator cannot manage users

Steps:

1. Login as Gate Operator.
2. Try to access `/admin/users`.

Expected result:

```txt
Access denied.
```

### Customer Agent cannot view all containers

Steps:

1. Login as Customer Agent.
2. Open My Containers.

Expected result:

```txt
Only associated containers are visible.
```

## 15. Deployment tests

Steps:

1. Start Docker containers.
2. Open app from browser.
3. Login.
4. Check logs.

Expected result:

```txt
Application runs on http://server-ip:3000.
Docker logs show no critical errors.
```
