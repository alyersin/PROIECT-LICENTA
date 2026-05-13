export function PageHeader({ title, description, action }) {
  return (
    <div className="app-page-header">
      <div>
        <h1 className="app-page-title">{title}</h1>
        {description && <p className="app-page-description">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default PageHeader;
