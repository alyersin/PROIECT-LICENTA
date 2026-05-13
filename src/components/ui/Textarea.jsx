export function Textarea({ label, error, id, ...props }) {
  const textareaId = id || props.name;

  return (
    <label className="app-form-row" htmlFor={textareaId}>
      {label && <span className="app-label">{label}</span>}
      <textarea id={textareaId} className="app-textarea" {...props} />
      {error && <span className="app-error">{error}</span>}
    </label>
  );
}

export default Textarea;
