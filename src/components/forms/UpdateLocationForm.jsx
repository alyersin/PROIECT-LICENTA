"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { TERMINAL_AREAS, TERMINAL_POSITIONS_BY_AREA } from "@/lib/constants";

export default function UpdateLocationForm({ container }) {
  const router = useRouter();

  const [form, setForm] = useState({
    current_area: container.current_area || "",
    current_position: container.current_position || "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateArea(value) {
    setForm((current) => ({
      ...current,
      current_area: value,
      current_position: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError("");
    setSuccess("");

    const response = await fetch(`/api/containers/${container.id_container}/location`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors(data.errors || {});
      setFormError(data.error || "Location could not be updated.");
      setSaving(false);
      return;
    }

    setSuccess("Location updated successfully.");
    setSaving(false);
    router.refresh();
  }

  const availablePositions = TERMINAL_POSITIONS_BY_AREA[form.current_area] || [];
  const hasCustomPosition = form.current_position && !availablePositions.includes(form.current_position);

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      {formError ? <div className="app-alert app-alert-danger">{formError}</div> : null}
      {success ? <div className="app-alert app-alert-success">{success}</div> : null}

      <Select
        label="Current area"
        value={form.current_area}
        onChange={(event) => updateArea(event.target.value)}
        error={errors.current_area}
        required
      >
        <option value="">Select area</option>
        {TERMINAL_AREAS.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </Select>

      <Select
        label="Current position"
        value={form.current_position}
        onChange={(event) => updateField("current_position", event.target.value)}
        error={errors.current_position}
        required
      >
        <option value="">Select position</option>
        {hasCustomPosition ? (
          <option value={form.current_position}>{form.current_position}</option>
        ) : null}
        {availablePositions.map((position) => (
          <option key={position} value={position}>
            {position}
          </option>
        ))}
      </Select>

      <div className="app-form-actions">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Location"}
        </Button>
      </div>
    </form>
  );
}
