import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/components/forms/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Login | MaritimeOps",
};

export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/dashboard");
  }

  return (
    <main className="app-login-shell">
      <section className="app-login-card">
        <div className="app-login-header">
          {/* <p className="app-login-kicker">Container Terminal Management</p> */}

          <Link href="/" aria-label="Go to MaritimeOps homepage">
            <img
              className="app-login-logo"
              src="/images/logo/logo-maritimeops.png"
              alt="MaritimeOps logo"
            />
          </Link>
          {/* <h1>MaritimeOps</h1> */}
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
