import Link from "next/link";
import { getNavigationForRole } from "@/lib/navigation";

export function Sidebar({ user }) {
  const role = user?.role_code || "ADMIN";
  const items = getNavigationForRole(role);

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-logo">
        MaritimeOps
        <div className="app-sidebar-subtitle">Simplified terminal operations</div>
      </div>

      <nav className="app-sidebar-nav">
        {items.map((item) => (
          <Link key={item.href} className="app-sidebar-link" href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
