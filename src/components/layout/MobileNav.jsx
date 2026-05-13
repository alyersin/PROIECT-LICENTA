"use client";

import { useState } from "react";
import Link from "next/link";
import { getNavigationForRole } from "@/lib/navigation";

export default function MobileNav({ user }) {
  const [open, setOpen] = useState(false);
  const links = getNavigationForRole(user?.role_code);

  return (
    <nav className="app-mobile-nav">
      <button
        type="button"
        className="app-mobile-nav-toggle"
        onClick={() => setOpen((current) => !current)}
      >
        <span>Menu</span>
        <span>{open ? "Close" : "Open"}</span>
      </button>

      {open ? (
        <div className="app-mobile-nav-panel">
          {links.map((link) => (
            <Link
              className="app-mobile-nav-link"
              href={link.href}
              key={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
