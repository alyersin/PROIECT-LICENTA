"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function getSafeCallbackUrl(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  if (value.includes("\\") || value.includes("\r") || value.includes("\n")) {
    return "/dashboard";
  }

  return value;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email, password, or inactive account.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <div className="app-form-row">
        <label className="app-label" htmlFor="email">Email</label>
        <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
      </div>

      <div className="app-form-row">
        <label className="app-label" htmlFor="password">Password</label>
        <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
      </div>

      {error ? <p className="app-error">{error}</p> : null}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
