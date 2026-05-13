# Frontend Architecture

## 1. Overview

The frontend is built with Next.js and JavaScript.

The application uses the Next.js App Router structure.

The frontend is responsible for:

- rendering pages
- displaying forms
- showing tables
- showing role-based navigation
- displaying success/error messages
- sending requests to backend route handlers or server actions

## 2. Recommended folder structure

```txt
src/
  app/
    layout.js
    globals.css
    page.js
    login/
      page.js
    dashboard/
      page.js
    profile/
      page.js
    change-password/
      page.js
    admin/
      users/
        page.js
        create/
          page.js
        [id]/
          edit/
            page.js
    containers/
      page.js
      [id]/
        page.js
    gate/
      page.js
      in/
        page.js
      out/
        page.js
    vessel-visits/
      page.js
      create/
        page.js
      [id]/
        page.js
        import/
          page.js
        operations/
          page.js
    my-containers/
      page.js
      [id]/
        page.js
  components/
    layout/
      AppShell.jsx
      Header.jsx
      Sidebar.jsx
    ui/
      Button.jsx
      Card.jsx
      Input.jsx
      Select.jsx
      Table.jsx
      Badge.jsx
      Modal.jsx
    forms/
      LoginForm.jsx
      ChangePasswordForm.jsx
      UserForm.jsx
      GateInForm.jsx
      GateOutForm.jsx
      VesselVisitForm.jsx
      CsvUploadForm.jsx
    containers/
      ContainersTable.jsx
      ContainerDetails.jsx
      ContainerEventsTimeline.jsx
    vessel-visits/
      VesselVisitsTable.jsx
      VesselVisitDetails.jsx
      VisitContainersTable.jsx
```

## 3. Pages

### Login page

Path:

```txt
/login
```

Purpose:

- show login form
- submit credentials
- display errors
- redirect after success

### Dashboard page

Path:

```txt
/dashboard
```

Purpose:

- show role-based dashboard
- display basic statistics
- show recent operational events

### Profile page

Path:

```txt
/profile
```

Purpose:

- show authenticated user information
- show full name, email, role and account status

### Change password page

Path:

```txt
/change-password
```

Purpose:

- allow authenticated user to change their own password
- validate current password
- save a new password hash

### Admin users page

Path:

```txt
/admin/users
```

Purpose:

- list users
- create users
- update users
- deactivate users as logical Delete User
- assign/change roles

### Containers page

Path:

```txt
/containers
```

Purpose:

- list containers
- search/filter containers
- navigate to container details

### Container details page

Path:

```txt
/containers/[id]
```

Purpose:

- show full container information
- show operational history
- allow Terminal Operator to update location

### Gate IN page

Path:

```txt
/gate/in
```

Purpose:

- register container entry into terminal

### Gate OUT page

Path:

```txt
/gate/out
```

Purpose:

- register container exit from terminal

### Vessel visits page

Path:

```txt
/vessel-visits
```

Purpose:

- list vessel visits
- create new visit
- open visit details

### Vessel visit details page

Path:

```txt
/vessel-visits/[id]
```

Purpose:

- show visit information
- show loading/discharge operations
- open CSV import
- confirm operations

### CSV import page

Path:

```txt
/vessel-visits/[id]/import
```

Purpose:

- upload CSV file
- select file type
- preview imported rows
- submit valid rows

## 4. Components

### AppShell

Wraps protected pages.

Contains:

- header
- sidebar
- main content

### Header

Displays:

- app name
- current user
- role
- logout button

### Sidebar

Displays role-based links.

### Button

Reusable button component.

### Table

Reusable table wrapper.

### Badge

Used for statuses and event types.

### Forms

Forms should be separated by feature:

```txt
LoginForm
ChangePasswordForm
UserForm
GateInForm
GateOutForm
VesselVisitForm
CsvUploadForm
```

## 5. Data fetching

For simplicity, use server-side data fetching in pages where possible.

Example:

```js
export default async function ContainersPage() {
  const containers = await getContainers();
  return <ContainersTable containers={containers} />;
}
```

For forms, use either:

- API routes with `fetch`
- server actions

For a beginner-friendly implementation, API routes may be easier to understand.

## 6. Manual validation in frontend

Frontend can perform basic checks before submit:

```js
if (!containerNo) {
  setError("Container number is required");
  return;
}
```

But the backend must also validate the same data, because frontend validation can be bypassed.

## 7. Role-based frontend rendering

The UI should hide links that the user cannot access.

Example:

```js
if (user.role_code === "ADMIN") {
  showUsersLink = true;
}
```

Important:

Hiding a link is not enough for security. The backend must also check permissions.

## 8. User feedback

The frontend should display:

- loading states
- success messages
- error messages
- empty table messages

Examples:

```txt
Container registered successfully.
CSV file imported successfully.
No containers found.
You do not have permission to access this page.
```

## 9. Suggested dashboard cards

For Gate Operator:

```txt
Gate IN today
Gate OUT today
Containers in terminal
Recent gate operations
```

For Terminal Operator:

```txt
Active vessel visits
Pending discharge
Pending loading
Recent container events
```

For Administrator:

```txt
Total users
Active users
Inactive users
Users by role
```

For Customer / Line Agent:

```txt
My containers
Containers in terminal
Loaded containers
Gate out containers
```

## 10. Frontend principles

- keep forms simple
- use reusable components
- use `globals.css` utility classes
- avoid too much business logic inside JSX
- keep permissions centralized
- show clear messages


## 11. Use case alignment

The frontend must reflect the final Use Case diagram:

- Login, Logout, View Profile and Change Password belong to the general `User` actor.
- Administrator has Manage Users, which includes Create User, Update User, Delete User and Assign / Change Role.
- Gate IN and Gate OUT include Validate Container as a logical validation step.
- Terminal Operator manages vessel visits, CSV import and loading/discharge confirmations.
- Manage Stowage Plan is not a separate page in the current build.
