"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

const sampleDischarge = `container_no,iso_type,size_ft,weight_kg,port,area_after,position_after
MSCU5555555,45G1,40,24000,ROCND,Import Yard,A1-01
TCLU3333333,22G1,20,18000,ROCND,Import Yard,A1-02`;

const sampleLoading = `container_no,iso_type,size_ft,weight_kg,port
MSCU1234567,45G1,40,24000,TRIST
TCLU7654321,22G1,20,18000,ITGOA`;

function buildPreview(csvText) {
  const lines = String(csvText || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].split(",").map((value) => value.trim());
  const rows = lines.slice(1, 6).map((line) => {
    const values = line.split(",").map((value) => value.trim());

    return headers.map((header, index) => ({
      header,
      value: values[index] || "",
    }));
  });

  return { headers, rows };
}

export default function CsvUploadForm({ vesselVisit }) {
  const router = useRouter();

  const [form, setForm] = useState({
    file_type: "DISCHARGE_LIST",
    file_name: "discharge-list.csv",
    csv_text: sampleDischarge,
  });

  const [errors, setErrors] = useState({});
  const [rowErrors, setRowErrors] = useState([]);
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const preview = useMemo(() => buildPreview(form.csv_text), [form.csv_text]);

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function loadSample(type) {
    setForm((current) => ({
      ...current,
      file_type: type,
      file_name: type === "DISCHARGE_LIST" ? "discharge-list.csv" : "loading-list.csv",
      csv_text: type === "DISCHARGE_LIST" ? sampleDischarge : sampleLoading,
    }));
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();

    setForm((current) => ({
      ...current,
      file_name: file.name,
      csv_text: text,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setRowErrors([]);
    setSuccess("");

    const response = await fetch(`/api/vessel-visits/${vesselVisit.id_vessel_visit}/upload-csv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors(data.errors || {});
      setRowErrors(data.errors?.rows || []);
      setSaving(false);
      return;
    }

    setSuccess(`${data.rowsImported} rows imported successfully.`);
    setSaving(false);
    router.refresh();
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      {success ? <div className="app-alert app-alert-success">{success}</div> : null}
      {errors.csv_text ? <div className="app-alert app-alert-danger">{errors.csv_text}</div> : null}

      <div className="app-form-grid">
        <Select
          label="File type"
          value={form.file_type}
          onChange={(event) => {
            updateField("file_type", event.target.value);
            loadSample(event.target.value);
          }}
          error={errors.file_type}
          required
        >
          <option value="DISCHARGE_LIST">Discharge list</option>
          <option value="LOADING_LIST">Loading list</option>
        </Select>

        <div className="app-form-row">
          <label className="app-label">File name</label>
          <input
            className="app-input"
            value={form.file_name}
            onChange={(event) => updateField("file_name", event.target.value)}
            required
          />
        </div>
      </div>

      <div className="app-form-row">
        <label className="app-label">Choose CSV file</label>
        <input
          className="app-file-input"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
        />
        <p className="app-helper-text">
          You can select a CSV file or paste CSV content manually below.
        </p>
      </div>

      <div className="app-sample-actions">
        <button
          className="app-button app-button-secondary"
          type="button"
          onClick={() => loadSample("DISCHARGE_LIST")}
        >
          Load discharge sample
        </button>
        <button
          className="app-button app-button-secondary"
          type="button"
          onClick={() => loadSample("LOADING_LIST")}
        >
          Load loading sample
        </button>
      </div>

      <Textarea
        label="CSV content"
        value={form.csv_text}
        onChange={(event) => updateField("csv_text", event.target.value)}
        error={typeof errors.csv_text === "string" ? errors.csv_text : ""}
        required
      />

      {preview.headers.length > 0 ? (
        <div className="app-preview-box">
          <div className="app-preview-header">
            <strong>Preview</strong>
            <span>Showing up to 5 rows before import</span>
          </div>
          <div className="app-table-wrapper">
            <table className="app-preview-table">
              <thead>
                <tr>
                  {preview.headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell) => (
                      <td key={`${rowIndex}-${cell.header}`}>{cell.value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {rowErrors.length > 0 ? (
        <div className="app-alert app-alert-danger">
          <strong>CSV row errors:</strong>
          <ul className="app-error-list">
            {rowErrors.map((error, index) => (
              <li key={`${error.row}-${error.field}-${index}`}>
                Row {error.row}: {error.field} - {error.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="app-form-actions">
        <Button type="submit" disabled={saving}>
          {saving ? "Importing..." : "Import CSV"}
        </Button>

        <Button href={`/vessel-visits/${vesselVisit.id_vessel_visit}`} variant="secondary">
          Back to visit
        </Button>
      </div>
    </form>
  );
}
