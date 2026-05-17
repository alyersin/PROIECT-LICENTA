"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import Card from "@/components/ui/Card";
import ContainersTable from "@/components/containers/ContainersTable";
import { TERMINAL_AREAS } from "@/lib/constants";
import { escapeCsvFormulaRows } from "@/lib/csvExport";

const CONTAINER_STATUSES = ["planned", "in_terminal", "gate_out", "discharged", "loaded"];
const CONTAINER_CONDITIONS = ["empty", "full"];

const CSV_COLUMNS = [
  "container_number",
  "size",
  "iso_type",
  "status",
  "condition",
  "current_area",
  "current_position",
  "customer_name",
  "is_reefer",
];

function includesText(value, search) {
  return String(value || "").toLowerCase().includes(search);
}

function uniqueValues(containers, field) {
  return Array.from(
    new Set(containers.map((container) => container[field]).filter(Boolean))
  ).sort((first, second) => String(first).localeCompare(String(second)));
}

function buildCsvRows(containers) {
  return containers.map((container) => ({
    container_number: container.container_no || "",
    size: container.size_ft || "",
    iso_type: container.iso_type || "",
    status: container.status || "",
    condition: container.container_condition || "",
    current_area: container.current_area || "",
    current_position: container.current_position || "",
    customer_name: container.customer_name || "",
    is_reefer: container.is_reefer ? "Yes" : "No",
  }));
}

function downloadCsv(containers, filename) {
  const csv = Papa.unparse({
    fields: CSV_COLUMNS,
    data: escapeCsvFormulaRows(buildCsvRows(containers), CSV_COLUMNS),
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ContainersListPanel({
  containers = [],
  customers = [],
  basePath = "/containers",
  initialFilters = {},
  showCustomerFilter = false,
  showAdvancedFilters = false,
  showConditionFilter = false,
  showAreaFilter = false,
  showSizeFilter = false,
  showIsoTypeFilter = false,
  includeCustomerSearch = true,
  searchPlaceholder = "Search by container, ISO type or customer",
  exportFilename = "containers.csv",
}) {
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    current_area: initialFilters.current_area || "",
    status: initialFilters.status || "",
    condition: initialFilters.condition || "",
    id_customer: initialFilters.id_customer || "",
    size_ft: initialFilters.size_ft || "",
    iso_type: initialFilters.iso_type || "",
  });

  function updateFilter(name, value) {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  const areaOptions = useMemo(() => uniqueValues(containers, "current_area"), [containers]);
  const sizeOptions = useMemo(() => uniqueValues(containers, "size_ft"), [containers]);
  const isoTypeOptions = useMemo(() => uniqueValues(containers, "iso_type"), [containers]);

  const filteredContainers = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return containers.filter((container) => {
      if (search) {
        const matchesSearch =
          includesText(container.container_no, search) ||
          includesText(container.iso_type, search) ||
          (includeCustomerSearch && includesText(container.customer_name, search));

        if (!matchesSearch) {
          return false;
        }
      }

      if (filters.current_area && container.current_area !== filters.current_area) {
        return false;
      }

      if (filters.status && container.status !== filters.status) {
        return false;
      }

      if (filters.condition && container.container_condition !== filters.condition) {
        return false;
      }

      if (filters.id_customer && String(container.id_customer) !== String(filters.id_customer)) {
        return false;
      }

      if (filters.size_ft && String(container.size_ft || "") !== String(filters.size_ft)) {
        return false;
      }

      if (filters.iso_type && container.iso_type !== filters.iso_type) {
        return false;
      }

      return true;
    });
  }, [containers, filters, includeCustomerSearch]);

  const displayAreaFilter = showAdvancedFilters || showAreaFilter;
  const displaySizeFilter = showAdvancedFilters || showSizeFilter;

  return (
    <>
      <Card>
        <div className="app-filter-form">
          <input
            className="app-input"
            name="search"
            placeholder={searchPlaceholder}
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
          />

          {displayAreaFilter ? (
            <select
              className="app-select"
              name="current_area"
              value={filters.current_area}
              onChange={(event) => updateFilter("current_area", event.target.value)}
            >
              <option value="">AREA</option>
              {(showAdvancedFilters ? TERMINAL_AREAS : areaOptions).map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          ) : null}

          <select
            className="app-select"
            name="status"
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
          >
            <option value="">STATUS</option>
            {CONTAINER_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {showConditionFilter ? (
            <select
              className="app-select"
              name="condition"
              value={filters.condition}
              onChange={(event) => updateFilter("condition", event.target.value)}
            >
              <option value="">CONDITION</option>
              {CONTAINER_CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          ) : null}

          {showCustomerFilter ? (
            <select
              className="app-select"
              name="id_customer"
              value={filters.id_customer}
              onChange={(event) => updateFilter("id_customer", event.target.value)}
            >
              <option value="">CUSTOMER</option>
              {customers.map((customer) => (
                <option key={customer.id_customer} value={customer.id_customer}>
                  {customer.name}
                </option>
              ))}
            </select>
          ) : null}

          {displaySizeFilter ? (
            <select
              className="app-select"
              name="size_ft"
              value={filters.size_ft}
              onChange={(event) => updateFilter("size_ft", event.target.value)}
            >
              <option value="">SIZE</option>
              {(showAdvancedFilters ? [20, 40, 45] : sizeOptions).map((size) => (
                <option key={size} value={size}>{size} ft</option>
              ))}
            </select>
          ) : null}

          {showIsoTypeFilter ? (
            <select
              className="app-select"
              name="iso_type"
              value={filters.iso_type}
              onChange={(event) => updateFilter("iso_type", event.target.value)}
            >
              <option value="">ISO TYPE</option>
              {isoTypeOptions.map((isoType) => (
                <option key={isoType} value={isoType}>{isoType}</option>
              ))}
            </select>
          ) : null}

          <button
            className="app-button app-button-secondary"
            type="button"
            onClick={() => downloadCsv(filteredContainers, exportFilename)}
          >
            Export CSV
          </button>
        </div>
      </Card>

      <Card>
        <ContainersTable containers={filteredContainers} basePath={basePath} />
      </Card>
    </>
  );
}
