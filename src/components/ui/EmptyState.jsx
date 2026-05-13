export function EmptyState({ title = "No data found", description }) {
  return (
    <div className="app-empty">
      <strong>{title}</strong>
      {description && <p>{description}</p>}
    </div>
  );
}

export default EmptyState;
