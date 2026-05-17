import { ButtonLink } from "@/components/ui/Button";

const featureModules = [
  {
    title: "Authentication & Role-Based Access",
    points: [
      "Secure login and logout workflow",
      "Role-specific dashboards and actions",
      "Protected administrative operations",
    ],
  },
  {
    title: "Container Management",
    points: [
      "Container status and location tracking",
      "Customer-linked operational records",
      "Validation for container identifiers",
    ],
  },
  {
    title: "Gate IN / Gate OUT Operations",
    points: [
      "Register truck and container movements",
      "Update terminal status automatically",
      "Create auditable operational events",
    ],
  },
  {
    title: "Vessel Visit Management",
    points: [
      "Plan and update vessel visits",
      "Manage discharge and loading operations",
      "Confirm terminal-side vessel activity",
    ],
  },
  {
    title: "Reports & CSV Export",
    points: [
      "Export operational CSV reports",
      "Process vessel operation lists",
      "Keep report access aligned with roles",
    ],
  },
];

const roles = [
  {
    title: "Administrator",
    description:
      "Manages user accounts, assigns roles, and keeps access rights aligned with terminal responsibilities.",
  },
  {
    title: "Gate Operator",
    description:
      "Registers Gate IN and Gate OUT operations, validates container entries, and records truck movement data.",
  },
  {
    title: "Terminal Operator",
    description:
      "Maintains vessel visits, imports CSV operation lists, confirms loading or discharge, and updates container locations.",
  },
  {
    title: "Customer / Line Agent",
    description:
      "Views assigned containers and customer-scoped operational reports without access to internal terminal administration.",
  },
];

const workflowSteps = [
  "Login",
  "Register Gate Operations",
  "Manage Vessel Visits",
  "Import CSV Lists",
  "Track Container Events",
];

const technologies = [
  "Next.js",
  "PostgreSQL",
  "NextAuth/Auth.js",
  "Tailwind CSS",
  "Docker",
  "PapaParse",
];

export default function HomePage() {
  return (
    <main className="home-shell">
      <section className="home-hero">
        <div className="home-hero-content">
          <img
            className="home-logo"
            src="/images/logo/logo-maritimeops.png"
            alt="MaritimeOps logo"
          />
          <h1>MaritimeOps</h1>
          <p className="home-subtitle">
            Operational Management System for Container Terminals
          </p>
          <p className="home-description">
            MaritimeOps is a university licenta project that presents a
            simplified container terminal management system. It brings together
            users, containers, gate activity, vessel visits, CSV processing, and
            operational history in one coherent application.
          </p>
          <div className="home-hero-actions">
            <ButtonLink href="/login">Open Login</ButtonLink>
          </div>
        </div>

        <div className="home-hero-panel" aria-label="Application overview">
          <div className="home-panel-row">
            <span>Gate status</span>
            <strong>IN / OUT</strong>
          </div>
          <div className="home-panel-row">
            <span>Operational history</span>
            <strong>Container events</strong>
          </div>
          <div className="home-panel-row">
            <span>Vessel workflows</span>
            <strong>CSV lists</strong>
          </div>
        </div>
      </section>

      <section className="home-section home-section-about">
        <div className="home-section-heading">
          <h2>About MaritimeOps</h2>
          <p>
            The application models core container-terminal workflows in a
            practical and beginner-friendly way.
          </p>
        </div>
        <p className="home-about-text">
          MaritimeOps is designed as a simplified but realistic operational
          system for a container terminal. It focuses on operational tracking,
          gate operations, vessel visit management, CSV list processing, and a
          clear event history for each container.
        </p>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <h2>Main Features / Modules</h2>
          <p>Core modules that support the main use cases of the terminal.</p>
        </div>
        <div className="home-card-grid home-card-grid-features">
          {featureModules.map((feature) => (
            <article className="home-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <ul>
                {feature.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <h2>User Roles</h2>
          <p>Each role has a focused operational responsibility.</p>
        </div>
        <div className="home-card-grid home-card-grid-roles">
          {roles.map((role) => (
            <article className="home-card home-role-card" key={role.title}>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <h2>Operational Workflow</h2>
          <p>A simple end-to-end flow from access to operational history.</p>
        </div>
        <div className="home-flow">
          {workflowSteps.map((step, index) => (
            <div className="home-flow-step" key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <h2>Technology Stack</h2>
          <p>Simple, focused technologies used to build and deploy the app.</p>
        </div>
        <div className="home-stack-list">
          {technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </section>

      <section className="home-final-cta">
        <div>
          <h2>Ready to access MaritimeOps?</h2>
          <p>Open the login page and continue with the assigned user role.</p>
        </div>
        <ButtonLink href="/login">Open Login</ButtonLink>
      </section>
    </main>
  );
}
