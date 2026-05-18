import Link from "next/link";

export default function CubeButtonLink({ children, className = "", ...props }) {
  return (
    <Link className={`cube-button cube-button-hover ${className}`.trim()} {...props}>
      <span className="cube-button-bg-top">
        <span className="cube-button-bg-inner" />
      </span>
      <span className="cube-button-bg-right">
        <span className="cube-button-bg-inner" />
      </span>
      <span className="cube-button-bg">
        <span className="cube-button-bg-inner" />
      </span>
      <span className="cube-button-text">{children}</span>
    </Link>
  );
}
