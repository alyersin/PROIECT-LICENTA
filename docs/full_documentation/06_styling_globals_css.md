# Styling Strategy - Tailwind CSS + globals.css

## 1. Styling approach

The project uses Tailwind CSS, but common styles are centralized in `globals.css`.

The goal is to avoid JSX elements full of long Tailwind class strings.

Instead of this:

```jsx
<button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
  Save
</button>
```

Use this:

```jsx
<button className="app-button-primary">
  Save
</button>
```

This keeps components cleaner and easier to read.

## 2. File location

```txt
src/app/globals.css
```

## 3. CSS variables

Use CSS variables for reusable colors and spacing:

```css
:root {
  --color-bg-main: #0f172a;
  --color-bg-sidebar: #020617;
  --color-bg-panel: #111827;
  --color-bg-card: #1e293b;

  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;

  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-danger: #dc2626;

  --color-text-main: #f8fafc;
  --color-text-muted: #94a3b8;

  --color-border: #334155;

  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.25rem;
}
```

## 4. Base layout classes

```css
.app-shell {
  min-height: 100vh;
  background: var(--color-bg-main);
  color: var(--color-text-main);
}

.app-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.app-main {
  padding: 1.5rem;
}

.app-header {
  height: 64px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-panel);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}
```

## 5. Sidebar classes

```css
.app-sidebar {
  background: var(--color-bg-sidebar);
  border-right: 1px solid var(--color-border);
  padding: 1rem;
}

.app-sidebar-logo {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.app-sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.app-sidebar-link {
  display: flex;
  align-items: center;
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  color: var(--color-text-muted);
  text-decoration: none;
}

.app-sidebar-link:hover,
.app-sidebar-link-active {
  background: var(--color-bg-card);
  color: var(--color-text-main);
}
```

## 6. Cards

```css
.app-card {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
}

.app-card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.app-card-value {
  font-size: 2rem;
  font-weight: 700;
}
```

## 7. Buttons

```css
.app-button {
  border: none;
  border-radius: var(--radius-md);
  padding: 0.625rem 1rem;
  font-weight: 600;
  cursor: pointer;
}

.app-button-primary {
  background: var(--color-primary);
  color: white;
}

.app-button-primary:hover {
  background: var(--color-primary-hover);
}

.app-button-secondary {
  background: var(--color-bg-card);
  color: var(--color-text-main);
  border: 1px solid var(--color-border);
}

.app-button-danger {
  background: var(--color-danger);
  color: white;
}
```

## 8. Forms

```css
.app-form {
  display: grid;
  gap: 1rem;
}

.app-form-row {
  display: grid;
  gap: 0.5rem;
}

.app-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-main);
}

.app-input,
.app-select,
.app-textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  background: #020617;
  color: var(--color-text-main);
  border-radius: var(--radius-md);
  padding: 0.625rem 0.875rem;
}

.app-input:focus,
.app-select:focus,
.app-textarea:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

.app-error {
  color: var(--color-danger);
  font-size: 0.875rem;
}
```

## 9. Tables

```css
.app-table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.app-table {
  width: 100%;
  border-collapse: collapse;
}

.app-table th {
  text-align: left;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-panel);
}

.app-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.app-table tr:hover {
  background: rgba(255, 255, 255, 0.03);
}
```

## 10. Badges

```css
.app-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.app-badge-blue {
  background: rgba(37, 99, 235, 0.15);
  color: #93c5fd;
}

.app-badge-green {
  background: rgba(22, 163, 74, 0.15);
  color: #86efac;
}

.app-badge-amber {
  background: rgba(245, 158, 11, 0.15);
  color: #fcd34d;
}

.app-badge-red {
  background: rgba(220, 38, 38, 0.15);
  color: #fca5a5;
}

.app-badge-gray {
  background: rgba(148, 163, 184, 0.15);
  color: #cbd5e1;
}
```

## 11. Responsive behavior

For the licenta demo, desktop layout is enough, but basic responsive behavior should exist.

```css
@media (max-width: 900px) {
  .app-layout {
    grid-template-columns: 1fr;
  }

  .app-sidebar {
    display: none;
  }

  .app-main {
    padding: 1rem;
  }
}
```

## 12. Benefits

This approach provides:

- cleaner JSX
- consistent design
- easier changes later
- reusable styles
- simpler explanation in documentation
