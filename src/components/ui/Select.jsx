export function Select({ label, error, id, options = [], children, ...props }) {
  const selectId = id || props.name;

  return (
    <label className="app-form-row" htmlFor={selectId}>
      {label && <span className="app-label">{label}</span>}
      <select id={selectId} className="app-select" {...props}>
        {children || options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="app-error">{error}</span>}
    </label>
  );
}

export default Select;
