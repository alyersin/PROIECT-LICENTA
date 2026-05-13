import Link from "next/link";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import VesselOperationActions from "@/components/vessel-visits/VesselOperationActions";

function operationVariant(type) {
  if (type === "DISCHARGE") {
    return "amber";
  }

  if (type === "LOAD") {
    return "green";
  }

  return "gray";
}

export default function VisitContainersTable({ operations = [] }) {
  if (!operations.length) {
    return (
      <EmptyState
        title="No operations yet"
        description="Import a loading or discharge CSV list to create planned operations."
      />
    );
  }

  return (
    <div className="app-table-wrapper">
      <table className="app-table">
        <thead>
          <tr>
            <th>Container</th>
            <th>Operation</th>
            <th>Status</th>
            <th>Port</th>
            <th>Weight</th>
            <th>Area after</th>
            <th>Position after</th>
            <th className="app-table-action">Action</th>
          </tr>
        </thead>
        <tbody>
          {operations.map((operation) => (
            <tr key={operation.id_vessel_visit_container}>
              <td>{operation.container_no}</td>
              <td>
                <Badge variant={operationVariant(operation.operation_type)}>
                  {operation.operation_type}
                </Badge>
              </td>
              <td>{operation.operation_status}</td>
              <td>{operation.port || "-"}</td>
              <td>{operation.weight_kg ? `${operation.weight_kg} kg` : "-"}</td>
              <td>{operation.area_after || "-"}</td>
              <td>{operation.position_after || "-"}</td>
              <td className="app-table-action">
                <div className="app-table-actions-inline">
                  <Link className="app-link" href={`/containers/${operation.id_container}`}>
                    View
                  </Link>
                  <VesselOperationActions operation={operation} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
