import Link from "next/link";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

function statusVariant(status) {
  if (["in_terminal", "discharged"].includes(status)) {
    return "green";
  }

  if (["planned"].includes(status)) {
    return "blue";
  }

  if (["loaded"].includes(status)) {
    return "amber";
  }

  if (["gate_out", "cancelled"].includes(status)) {
    return "red";
  }

  return "gray";
}

export default function ContainersTable({ containers = [], basePath = "/containers" }) {
  if (!containers.length) {
    return (
      <EmptyState
        title="No containers found"
        description="Change filters or add operational data through Gate IN or vessel visit import."
      />
    );
  }

  return (
    <div className="app-table-wrapper">
      <table className="app-table">
        <thead>
          <tr>
            <th>Container No</th>
            <th>Size</th>
            <th>ISO Type</th>
            <th>Status</th>
            <th>Condition</th>
            <th>Area</th>
            <th>Position</th>
            <th>Customer</th>
            <th>Reefer</th>
            <th className="app-table-action">Action</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((container) => (
            <tr key={container.id_container}>
              <td>{container.container_no}</td>
              <td>{container.size_ft || "-"}</td>
              <td>{container.iso_type || "-"}</td>
              <td>
                <Badge variant={statusVariant(container.status)}>
                  {container.status}
                </Badge>
              </td>
              <td>{container.container_condition || "-"}</td>
              <td>{container.current_area || "-"}</td>
              <td>{container.current_position || "-"}</td>
              <td>{container.customer_name || "-"}</td>
              <td>{container.is_reefer ? "Yes" : "No"}</td>
              <td className="app-table-action">
                <Link className="app-link" href={`${basePath}/${container.id_container}`}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
