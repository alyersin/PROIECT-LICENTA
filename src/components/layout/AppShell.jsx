import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function AppShell({ user, children }) {
  return (
    <div className="app-shell">
      <div className="app-layout">
        <Sidebar user={user} />
        <div className="app-content">
          <Header user={user} />
          <main className="app-main">{children}</main>
        </div>
      </div>
    </div>
  );
}
