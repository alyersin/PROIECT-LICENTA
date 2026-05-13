export function Input({ label, error, id, ...props }) {
  const inputId = id || props.name;

  return (
    <label className="app-form-row" htmlFor={inputId}>
      {label && <span className="app-label">{label}</span>}
      <input id={inputId} className="app-input" {...props} />
      {error && <span className="app-error">{error}</span>}
    </label>
  );
}

export default Input;
