"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VesselOperationActions({ operation }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (operation.operation_status === "confirmed") {
    return null;
  }

  async function confirmOperation() {
    setSaving(true);
    setError("");

    const isDischarge = operation.operation_type === "DISCHARGE";
    const url = isDischarge
      ? `/api/vessel-visits/operations/${operation.id_vessel_visit_container}/confirm-discharge`
      : `/api/vessel-visits/operations/${operation.id_vessel_visit_container}/confirm-load`;

    const payload = isDischarge
      ? {
          area_after: operation.area_after || "",
          position_after: operation.position_after || "",
        }
      : {};

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data.errors?.area_after ||
        data.errors?.position_after ||
        data.errors?.operation ||
        "Operation could not be confirmed.";

      setError(message);
      setSaving(false);
      return;
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <div className="app-inline-action">
      <button
        type="button"
        className="app-mini-button"
        onClick={confirmOperation}
        disabled={saving}
      >
        {saving ? "Confirming..." : "Confirm"}
      </button>
      {error ? <span className="app-mini-error">{error}</span> : null}
    </div>
  );
}
