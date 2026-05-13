"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button className="app-button app-button-secondary" type="button" onClick={() => signOut({ callbackUrl: "/login" })}>
      Logout
    </button>
  );
}
