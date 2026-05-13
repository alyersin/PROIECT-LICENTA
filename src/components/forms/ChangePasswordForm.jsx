"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ChangePasswordForm() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
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

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError("");
    setSuccess("");

    const response = await fetch("/api/profile/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors(data.errors || {});
      setFormError(data.error || "The password could not be changed.");
      setSaving(false);
      return;
    }

    setForm({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
    setSuccess("Password changed successfully.");
    setSaving(false);
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      {formError ? <div className="app-alert app-alert-danger">{formError}</div> : null}
      {success ? <div className="app-alert app-alert-success">{success}</div> : null}

      <Input
        label="Current password"
        type="password"
        value={form.current_password}
        onChange={(event) => updateField("current_password", event.target.value)}
        error={errors.current_password}
        required
      />

      <Input
        label="New password"
        type="password"
        value={form.new_password}
        onChange={(event) => updateField("new_password", event.target.value)}
        error={errors.new_password}
        required
      />

      <Input
        label="Confirm new password"
        type="password"
        value={form.confirm_password}
        onChange={(event) => updateField("confirm_password", event.target.value)}
        error={errors.confirm_password}
        required
      />

      <div className="app-form-actions">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
}
