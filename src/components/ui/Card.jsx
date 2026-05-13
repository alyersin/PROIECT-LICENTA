export function Card({ title, description, value, children, action }) {
  return (
    <section className="app-card">
      {(title || description || action) && (
        <div className="app-card-header">
          <div>
            {title && <h2 className="app-card-title">{title}</h2>}
            {description && <p className="app-card-muted">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {value !== undefined && <div className="app-card-value">{value}</div>}
      {children}
    </section>
  );
}

export default Card;
