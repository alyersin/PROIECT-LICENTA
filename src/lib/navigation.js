export function getNavigationForRole(roleCode) {
  const baseLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
    { href: "/change-password", label: "Change Password" },
  ];

  if (roleCode === "ADMIN") {
    return [
      ...baseLinks,
      { href: "/admin/users", label: "Users" },
    ];
  }

  if (roleCode === "GATE_OPERATOR") {
    return [
      ...baseLinks,
      { href: "/containers", label: "Containers" },
      { href: "/gate", label: "Gate Overview" },
      { href: "/gate/in", label: "Gate IN" },
      { href: "/gate/out", label: "Gate OUT" },
    ];
  }

  if (roleCode === "TERMINAL_OPERATOR") {
    return [
      ...baseLinks,
      { href: "/containers", label: "Containers" },
      { href: "/vessel-visits", label: "Vessel Visits" },
    ];
  }

  if (roleCode === "CUSTOMER_AGENT") {
    return [
      ...baseLinks,
      { href: "/my-containers", label: "My Containers" },
    ];
  }

  return baseLinks;
}
