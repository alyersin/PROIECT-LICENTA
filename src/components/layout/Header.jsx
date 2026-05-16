import Link from "next/link";
import LogoutButton from "@/components/layout/LogoutButton";

export default function Header({ user }) {
  return (
    <header className="app-header">
      <div className="app-header-brand">
        <div>
          {/* <p className="app-header-subtitle">Container Terminal Management</p> */}
        </div>
      </div>

      <details className="app-account-menu">
        <summary className="app-account-trigger">
          <span className="app-user-block">
            <span className="app-user-name">{user?.full_name || "User"}</span>
            <span className="app-user-role">{user?.role_code || "ROLE"}</span>
          </span>
          <span className="app-account-caret" aria-hidden="true">▾</span>
        </summary>

        <div className="app-account-dropdown">
          <Link className="app-account-link" href="/profile">
            View Profile
          </Link>
          <Link className="app-account-link" href="/change-password">
            Change Password
          </Link>
          <LogoutButton className="app-account-link app-account-logout" />
        </div>
      </details>
    </header>
  );
}
