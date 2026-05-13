import LogoutButton from "@/components/layout/LogoutButton";

export default function Header({ user }) {
  return (
    <header className="app-header">
      <div>
        <p className="app-header-subtitle">Container Terminal Management</p>
        <h1 className="app-header-title">MaritimeOps</h1>
      </div>

      <div className="app-header-user">
        <div className="app-user-block">
          <span className="app-user-name">{user?.full_name || "User"}</span>
          <span className="app-user-role">{user?.role_code || "ROLE"}</span>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
