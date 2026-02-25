export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f14] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#1dd3b0]/25 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#4f46e5]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-96 rounded-full bg-[#f59e0b]/15 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-16 lg:px-10">
        <header className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-[#1dd3b0] via-[#22c55e] to-[#4f46e5] text-3xl font-semibold text-black shadow-[0_20px_40px_-20px_rgba(29,211,176,0.8)]">
              AD
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                Maritime Operations
              </p>
              <h1 className="text-3xl font-semibold sm:text-4xl">
                Anya Dalton
              </h1>
              <p className="mt-2 max-w-xl text-base text-white/70">
                Executive leader specializing in offshore logistics, fleet
                modernization, and crisis-ready port operations.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
              Schedule Briefing
            </button>
            <button className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-white/60 hover:text-white">
              Download CV
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_-60px_rgba(0,0,0,0.6)]">
            <div className="flex flex-wrap gap-6">
              <div className="min-w-[180px]">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Current Focus
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Fleet Readiness
                </p>
                <p className="mt-1 text-sm text-white/60">
                  North Atlantic corridors
                </p>
              </div>
              <div className="min-w-[180px]">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Location
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Seattle, WA
                </p>
                <p className="mt-1 text-sm text-white/60">
                  Global operations coverage
                </p>
              </div>
              <div className="min-w-[180px]">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Availability
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Q2 2026
                </p>
                <p className="mt-1 text-sm text-white/60">
                  Advisory or interim roles
                </p>
              </div>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                { label: "Fleet Uptime", value: "98.6%" },
                { label: "Ports Optimized", value: "17" },
                { label: "Ops Budget", value: "$1.4B" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-[#0f1720]/80 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    FY25 performance
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] via-[#0b0f14] to-[#111827] p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Core Strengths
            </p>
            <div className="mt-4 space-y-4">
              {[
                {
                  title: "Operational Resilience",
                  detail:
                    "Built dual-hub playbooks for extreme weather and geopolitical disruption.",
                },
                {
                  title: "Digital Fleet Control",
                  detail:
                    "Unified telemetry and predictive maintenance across 64 vessels.",
                },
                {
                  title: "People & Safety",
                  detail:
                    "Reduced incident rates by 31% through scenario-based training.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-base font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-white/65">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Experience
            </p>
            <div className="mt-6 space-y-5">
              {[
                {
                  role: "Chief of Maritime Ops",
                  org: "Aegis Shipping Group",
                  period: "2022 - Present",
                },
                {
                  role: "Director, Fleet Strategy",
                  org: "Northwave Logistics",
                  period: "2017 - 2022",
                },
                {
                  role: "Port Ops Lead",
                  org: "Seagate Authority",
                  period: "2012 - 2017",
                },
              ].map((item) => (
                <div
                  key={item.role}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#0f1720]/70 p-4"
                >
                  <div>
                    <p className="text-base font-semibold text-white">
                      {item.role}
                    </p>
                    <p className="text-sm text-white/60">{item.org}</p>
                  </div>
                  <p className="text-sm text-white/50">{item.period}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Signature Initiatives
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Arctic Supply Chain",
                  detail:
                    "Secured year-round access by integrating ice-class vessel rotations.",
                },
                {
                  title: "Port Automation",
                  detail:
                    "Accelerated berth turnaround by 22% with AI-assisted routing.",
                },
                {
                  title: "Sustainability Charter",
                  detail:
                    "Delivered 18% emissions reduction through LNG retrofit program.",
                },
                {
                  title: "Emergency Response",
                  detail:
                    "Built a cross-agency command center for rapid response drills.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-[#0f1720]/70 p-4"
                >
                  <p className="text-base font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-white/60">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0f1720] via-[#111827] to-[#0b0f14] p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Quick Contact
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                Ready to audit a new corridor?
              </p>
              <p className="mt-2 text-sm text-white/60">
                I lead executive readiness reviews, crisis simulations, and
                rapid deployment strategies for maritime teams.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-[#1dd3b0] px-6 py-2 text-sm font-semibold text-black transition hover:bg-[#20e3c2]">
                Request Audit
              </button>
              <button className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-white/60 hover:text-white">
                +1 (206) 555-0129
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
