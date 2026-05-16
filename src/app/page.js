import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="app-login-shell">
      <section className="app-login-card">
        <div className="app-page" style={{ gap: "1.5rem" }}>
          <div>
            <img
              className="app-page-logo"
              src="/images/logo/logo-maritimeops.png"
              alt="MaritimeOps logo"
            />
            <h1 className="app-page-title">MaritimeOps</h1>
            <p className="app-page-description">
              Simplified Container Terminal Management System for users, containers, gate operations, vessel visits and operational history.
            </p>
          </div>

          <Card title="Project modules">
            <div className="app-grid" style={{ gap: "0.75rem" }}>
              <p className="app-card-muted">Authentication and role-based access</p>
              <p className="app-card-muted">Gate IN and Gate OUT operations</p>
              <p className="app-card-muted">Vessel visits with CSV loading and discharge lists</p>
              <p className="app-card-muted">Container history through operational events</p>
            </div>
          </Card>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <ButtonLink href="/login">Open Login</ButtonLink>
            <Link className="app-button app-button-secondary" href="/dashboard">
              Demo Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
