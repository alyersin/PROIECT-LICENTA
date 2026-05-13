"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { CONTAINER_CONDITIONS, TERMINAL_AREAS } from "@/lib/constants";

export default function GateInForm({ customers = [] }) {
  const router = useRouter();

  const [form, setForm] = useState({
    container_no: "",
    truck_no: "",
    transaction_time: "",
    container_condition: "full",
    seal_no: "",
    area_after: "Export Yard",
    position_after: "",
    observations: "",
    iso_type: "",
    size_ft: "",
    gross_weight_kg: "",
    is_reefer: "false",
    id_customer: "",
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

    const response = await fetch("/api/gate/in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        is_reefer: form.is_reefer === "true",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors(data.errors || {});
      setFormError(data.error || "Gate IN could not be registered.");
      setSaving(false);
      return;
    }

    setSuccess(`Gate IN registered for ${data.container.container_no}.`);
    setForm((current) => ({
      ...current,
      container_no: "",
      truck_no: "",
      transaction_time: "",
      seal_no: "",
      position_after: "",
      observations: "",
      iso_type: "",
      size_ft: "",
      gross_weight_kg: "",
    }));
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
          label="Date and time"
          type="datetime-local"
          value={form.transaction_time}
          onChange={(event) => updateField("transaction_time", event.target.value)}
          error={errors.transaction_time}
        />

        <Select
          label="Condition"
          value={form.container_condition}
          onChange={(event) => updateField("container_condition", event.target.value)}
          error={errors.container_condition}
          required
        >
          {CONTAINER_CONDITIONS.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </Select>

        <Input
          label="Seal number"
          value={form.seal_no}
          onChange={(event) => updateField("seal_no", event.target.value)}
          error={errors.seal_no}
        />

        <Select
          label="Area after entry"
          value={form.area_after}
          onChange={(event) => updateField("area_after", event.target.value)}
          error={errors.area_after}
          required
        >
          {TERMINAL_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </Select>

        <Input
          label="Position after entry"
          value={form.position_after}
          onChange={(event) => updateField("position_after", event.target.value)}
          error={errors.position_after}
          placeholder="Example: B2-05"
          required
        />

        <Input
          label="ISO type"
          value={form.iso_type}
          onChange={(event) => updateField("iso_type", event.target.value)}
          error={errors.iso_type}
          placeholder="Example: 45G1"
        />

        <Select
          label="Size"
          value={form.size_ft}
          onChange={(event) => updateField("size_ft", event.target.value)}
          error={errors.size_ft}
        >
          <option value="">Unknown</option>
          <option value="20">20 ft</option>
          <option value="40">40 ft</option>
          <option value="45">45 ft</option>
        </Select>

        <Input
          label="Gross weight kg"
          type="number"
          value={form.gross_weight_kg}
          onChange={(event) => updateField("gross_weight_kg", event.target.value)}
          error={errors.gross_weight_kg}
        />

        <Select
          label="Reefer"
          value={form.is_reefer}
          onChange={(event) => updateField("is_reefer", event.target.value)}
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </Select>

        <Select
          label="Customer"
          value={form.id_customer}
          onChange={(event) => updateField("id_customer", event.target.value)}
          error={errors.id_customer}
        >
          <option value="">Unknown</option>
          {customers.map((customer) => (
            <option key={customer.id_customer} value={customer.id_customer}>
              {customer.name}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Observations"
        value={form.observations}
        onChange={(event) => updateField("observations", event.target.value)}
        error={errors.observations}
      />

      <div className="app-form-actions">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Register Gate IN"}
        </Button>
      </div>
    </form>
  );
}
