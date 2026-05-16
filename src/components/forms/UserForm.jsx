"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { mutationRequestHeaders } from "@/lib/apiSecurity";

export default function UserForm({ mode, user, roles = [], customers = [] }) {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    password: "",
    id_role: user?.id_role ? String(user.id_role) : "",
    id_customer: user?.id_customer ? String(user.id_customer) : "",
    is_active: user?.is_active === false ? "false" : "true",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedRole = useMemo(() => {
    return roles.find((role) => String(role.id_role) === String(form.id_role));
  }, [roles, form.id_role]);

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

    const payload = {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      id_role: form.id_role ? Number(form.id_role) : null,
      id_customer: form.id_customer ? Number(form.id_customer) : null,
      is_active: form.is_active === "true",
    };

    const url = mode === "edit" ? `/api/users/${user.id_user}` : "/api/users";
    const method = mode === "edit" ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...mutationRequestHeaders(),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors(data.errors || {});
      setFormError(data.error || "The user could not be saved.");
      setSaving(false);
      return;
    }

    router.push("/admin/users");
    router.refresh();
  }

  async function handleDeactivate() {
    if (mode !== "edit") {
      return;
    }

    setSaving(true);
    setErrors({});
    setFormError("");

    const response = await fetch(`/api/users/${user.id_user}`, {
      method: "DELETE",
      headers: mutationRequestHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      setFormError(data.error || "The user could not be deactivated.");
      setSaving(false);
      return;
    }

    router.push("/admin/users");
    router.refresh();
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      {formError ? <div className="app-alert app-alert-danger">{formError}</div> : null}

      <Input
        label="Full name"
        value={form.full_name}
        onChange={(event) => updateField("full_name", event.target.value)}
        error={errors.full_name}
        required
      />

      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(event) => updateField("email", event.target.value)}
        error={errors.email}
        required
      />

      <Select
        label="Role"
        value={form.id_role}
        onChange={(event) => updateField("id_role", event.target.value)}
        error={errors.id_role}
        required
      >
        <option value="">Select role</option>
        {roles.map((role) => (
          <option key={role.id_role} value={role.id_role}>
            {role.code} - {role.name}
          </option>
        ))}
      </Select>

      {selectedRole?.code === "CUSTOMER_AGENT" ? (
        <Select
          label="Customer"
          value={form.id_customer}
          onChange={(event) => updateField("id_customer", event.target.value)}
          error={errors.id_customer}
          required
        >
          <option value="">Select customer</option>
          {customers.map((customer) => (
            <option key={customer.id_customer} value={customer.id_customer}>
              {customer.name}
            </option>
          ))}
        </Select>
      ) : null}

      <Input
        label={mode === "edit" ? "New password optional" : "Password"}
        type="password"
        value={form.password}
        onChange={(event) => updateField("password", event.target.value)}
        error={errors.password}
        required={mode === "create"}
      />

      <Select
        label="Status"
        value={form.is_active}
        onChange={(event) => updateField("is_active", event.target.value)}
      >
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </Select>

      <div className="app-form-actions">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save User"}
        </Button>

        <Button href="/admin/users" variant="secondary">
          Cancel
        </Button>

        {mode === "edit" && user?.is_active ? (
          <button
            type="button"
            className="app-button app-button-danger"
            onClick={handleDeactivate}
            disabled={saving}
          >
            Deactivate
          </button>
        ) : null}
      </div>
    </form>
  );
}
