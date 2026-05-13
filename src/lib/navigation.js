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
    ];
  }

  if (roleCode === "TERMINAL_OPERATOR") {
    return [
      ...baseLinks,
      { href: "/containers", label: "Containers" },
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
