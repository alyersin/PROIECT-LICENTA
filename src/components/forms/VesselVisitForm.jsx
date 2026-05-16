"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { mutationRequestHeaders } from "@/lib/apiSecurity";
import { VESSEL_VISIT_STATUSES } from "@/lib/constants";

function toDatetimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
}

export default function VesselVisitForm({ mode, vesselVisit, vessels = [] }) {
  const router = useRouter();

  const [form, setForm] = useState({
    id_vessel: vesselVisit?.id_vessel ? String(vesselVisit.id_vessel) : "",
    inbound_voyage_no: vesselVisit?.inbound_voyage_no || "",
    outbound_voyage_no: vesselVisit?.outbound_voyage_no || "",
    eta: toDatetimeLocal(vesselVisit?.eta),
    etd: toDatetimeLocal(vesselVisit?.etd),
    berth: vesselVisit?.berth || "",
    status: vesselVisit?.status || "planned",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
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

    const url = mode === "edit"
      ? `/api/vessel-visits/${vesselVisit.id_vessel_visit}`
      : "/api/vessel-visits";

    const method = mode === "edit" ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...mutationRequestHeaders(),
      },
      body: JSON.stringify({
        ...form,
        id_vessel: form.id_vessel ? Number(form.id_vessel) : null,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors(data.errors || {});
      setFormError(data.error || "Vessel visit could not be saved.");
      setSaving(false);
      return;
    }

    const id = data.vesselVisit.id_vessel_visit || vesselVisit?.id_vessel_visit;
    router.push(`/vessel-visits/${id}`);
    router.refresh();
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      {formError ? <div className="app-alert app-alert-danger">{formError}</div> : null}

      <div className="app-form-grid">
        <Select
          label="Vessel"
          value={form.id_vessel}
          onChange={(event) => updateField("id_vessel", event.target.value)}
          error={errors.id_vessel}
          required
        >
          <option value="">Select vessel</option>
          {vessels.map((vessel) => (
            <option key={vessel.id_vessel} value={vessel.id_vessel}>
              {vessel.name} {vessel.imo ? `- ${vessel.imo}` : ""}
            </option>
          ))}
        </Select>

        <Select
          label="Status"
          value={form.status}
          onChange={(event) => updateField("status", event.target.value)}
          error={errors.status}
          required
        >
          {VESSEL_VISIT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>

        <Input
          label="Inbound voyage no"
          value={form.inbound_voyage_no}
          onChange={(event) => updateField("inbound_voyage_no", event.target.value)}
          error={errors.inbound_voyage_no}
        />

        <Input
          label="Outbound voyage no"
          value={form.outbound_voyage_no}
          onChange={(event) => updateField("outbound_voyage_no", event.target.value)}
          error={errors.outbound_voyage_no}
        />

        <Input
          label="ETA"
          type="datetime-local"
          value={form.eta}
          onChange={(event) => updateField("eta", event.target.value)}
          error={errors.eta}
        />

        <Input
          label="ETD"
          type="datetime-local"
          value={form.etd}
          onChange={(event) => updateField("etd", event.target.value)}
          error={errors.etd}
        />

        <Input
          label="Berth"
          value={form.berth}
          onChange={(event) => updateField("berth", event.target.value)}
          error={errors.berth}
          placeholder="Example: Berth 2"
        />
      </div>

      <div className="app-form-actions">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Vessel Visit"}
        </Button>

        <Button href="/vessel-visits" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
