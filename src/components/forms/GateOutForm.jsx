"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

export default function GateOutForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    container_no: "",
    truck_no: "",
    destination: "",
    seal_no: "",
    observations: "",
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

    const response = await fetch("/api/gate/out", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors(data.errors || {});
      setFormError(data.error || "Gate OUT could not be registered.");
      setSaving(false);
      return;
    }

    setSuccess(`Gate OUT registered for ${data.container.container_no}.`);
    setForm({
      container_no: "",
      truck_no: "",
      destination: "",
      seal_no: "",
      observations: "",
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      {formError ? <div className="app-alert app-alert-danger">{formError}</div> : null}
      {success ? <div className="app-alert app-alert-success">{success}</div> : null}

      <div className="app-form-grid">
        <Input
          label="Container number"
          value={form.container_no}
          onChange={(event) => updateField("container_no", event.target.value.toUpperCase())}
          error={errors.container_no}
          required
        />

        <Input
          label="Truck number"
          value={form.truck_no}
          onChange={(event) => updateField("truck_no", event.target.value)}
          error={errors.truck_no}
          required
        />

        <Input
          label="Destination"
          value={form.destination}
          onChange={(event) => updateField("destination", event.target.value)}
          error={errors.destination}
          required
        />

        <Input
          label="Seal number"
          value={form.seal_no}
          onChange={(event) => updateField("seal_no", event.target.value)}
          error={errors.seal_no}
        />
      </div>

      <Textarea
        label="Observations"
        value={form.observations}
        onChange={(event) => updateField("observations", event.target.value)}
        error={errors.observations}
      />

      <div className="app-form-actions">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Register Gate OUT"}
        </Button>
        <p className="app-form-note">Transaction time is recorded automatically when the form is submitted.</p>
      </div>
    </form>
  );
}
