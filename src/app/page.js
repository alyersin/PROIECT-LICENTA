import Image from "next/image";
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
      <header className="home-header">
        <Image
          className="home-logo"
          src="/images/logo/logo-maritimeops.png"
          alt="MaritimeOps logo"
          width={623}
          height={217}
          priority
        />
        <ButtonLink href="/login">Launch App</ButtonLink>
      </header>

      <div className="home-main">
        <section className="home-hero">
          <div className="home-hero-content">
            <p className="home-subtitle">
              Container Operations Management System
            </p>
            <p className="home-description">
              MaritimeOps is a bachelor project that presents a simplified system for managing container operations.
            </p>
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

        <section className="home-section home-section-features">
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

        <section className="home-section home-section-stack">
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
      </div>

    </main>
  );
}
