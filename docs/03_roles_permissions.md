# Roles and Permissions

## 1. Overview

MaritimeOps uses role-based access control. Each user has one role.

The roles are:

```txt
ADMIN
GATE_OPERATOR
TERMINAL_OPERATOR
CUSTOMER_AGENT
```

The simplified database stores the role directly in the `users` table through `id_role`.

## 2. General user

All authenticated users can:

- log in
- log out
- access their dashboard
- view only the pages allowed for their role

## 3. Administrator

The Administrator manages user accounts.

Permissions:

| Action | Allowed |
|---|---|
| Login | Yes |
| Logout | Yes |
| View dashboard | Yes |
| Manage users | Yes |
| Create user | Yes |
| Edit user | Yes |
| Reset password | Yes |
| Activate/deactivate user | Yes |
| Assign role | Yes |
| Register Gate IN | No |
| Register Gate OUT | No |
| Manage vessel visits | No |
| View all containers | Optional, not required |

Recommended pages:

```txt
/admin/users
/admin/users/create
/admin/users/[id]/edit
```

## 4. Gate Operator

The Gate Operator handles truck gate operations.

Permissions:

| Action | Allowed |
|---|---|
| Login | Yes |
| Logout | Yes |
| View dashboard | Yes |
| View containers | Yes |
| Register Gate IN | Yes |
| Register Gate OUT | Yes |
| Update container location manually | No |
| Manage vessel visits | No |
| Manage users | No |

Recommended pages:

```txt
/gate
/gate/in
/gate/out
/containers
/containers/[id]
```

## 5. Terminal Operator

The Terminal Operator handles vessel-related operations.

Permissions:

| Action | Allowed |
|---|---|
| Login | Yes |
| Logout | Yes |
| View dashboard | Yes |
| View containers | Yes |
| Update container location | Yes |
| Create vessel | Yes |
| Create vessel visit | Yes |
| Upload CSV lists | Yes |
| Confirm discharge | Yes |
| Confirm loading | Yes |
| Manage users | No |
| Register Gate IN | No |
| Register Gate OUT | No |

Recommended pages:

```txt
/vessel-visits
/vessel-visits/create
/vessel-visits/[id]
/vessel-visits/[id]/import
/vessel-visits/[id]/operations
/containers
/containers/[id]
```

## 6. Customer / Line Agent

The Customer / Line Agent is an external or semi-external user.

Permissions:

| Action | Allowed |
|---|---|
| Login | Yes |
| Logout | Yes |
| View own containers | Yes |
| View container details | Yes |
| View operational history | Yes, limited |
| Register gate operations | No |
| Manage vessel visits | No |
| Manage users | No |

Recommended pages:

```txt
/my-containers
/my-containers/[id]
```

## 7. Permission matrix

| Feature | Admin | Gate Operator | Terminal Operator | Customer / Line Agent |
|---|---:|---:|---:|---:|
| Login | Yes | Yes | Yes | Yes |
| Logout | Yes | Yes | Yes | Yes |
| Manage users | Yes | No | No | No |
| View containers | Optional | Yes | Yes | Own only |
| Register Gate IN | No | Yes | No | No |
| Register Gate OUT | No | Yes | No | No |
| Manage vessel visits | No | No | Yes | No |
| Upload CSV | No | No | Yes | No |
| Confirm discharge | No | No | Yes | No |
| Confirm loading | No | No | Yes | No |
| Update location | No | No | Yes | No |

## 8. Implementation idea

Create a simple permission helper:

```js
export function canManageUsers(user) {
  return user?.role_code === "ADMIN";
}

export function canRegisterGate(user) {
  return user?.role_code === "GATE_OPERATOR";
}

export function canManageVesselVisits(user) {
  return user?.role_code === "TERMINAL_OPERATOR";
}

export function canViewContainer(user, container) {
  if (!user) return false;
  if (user.role_code === "GATE_OPERATOR") return true;
  if (user.role_code === "TERMINAL_OPERATOR") return true;
  if (user.role_code === "CUSTOMER_AGENT") {
    return user.id_customer === container.id_customer;
  }
  return false;
}
```

## 9. Role-based navigation

The sidebar should show only relevant links.

Admin:

```txt
Dashboard
Users
Logout
```

Gate Operator:

```txt
Dashboard
Containers
Gate IN
Gate OUT
Logout
```

Terminal Operator:

```txt
Dashboard
Containers
Vessel Visits
Logout
```

Customer / Line Agent:

```txt
Dashboard
My Containers
Logout
```
