import Link from "next/link";

const variants = {
  primary: "app-button-primary",
  secondary: "app-button-secondary",
  danger: "app-button-danger",
};

export function Button({ children, variant = "primary", className = "", ...props }) {
  if (props.href) {
    return (
      <ButtonLink variant={variant} className={className} {...props}>
        {children}
      </ButtonLink>
    );
  }

  const variantClass = variants[variant] || variants.primary;

  return (
    <button className={`app-button ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ children, href, variant = "primary", className = "", ...props }) {
  const variantClass = variants[variant] || variants.primary;

  return (
    <Link className={`app-button ${variantClass} ${className}`.trim()} href={href} {...props}>
      {children}
    </Link>
  );
}

export default Button;
