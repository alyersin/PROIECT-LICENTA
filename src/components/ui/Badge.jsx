const variants = {
  blue: "app-badge-blue",
  green: "app-badge-green",
  amber: "app-badge-amber",
  red: "app-badge-red",
  gray: "app-badge-gray",
  purple: "app-badge-purple",
};

export function Badge({ children, variant = "gray" }) {
  const variantClass = variants[variant] || variants.gray;

  return <span className={`app-badge ${variantClass}`}>{children}</span>;
}

export default Badge;
