"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton({ className = "app-button app-button-secondary" }) {
  return (
    <button className={className} type="button" onClick={() => signOut({ callbackUrl: "/login" })}>
      Logout
    </button>
  );
}
