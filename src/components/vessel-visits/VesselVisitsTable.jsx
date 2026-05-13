import Link from "next/link";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusVariant(status) {
  if (status === "completed") {
    return "green";
  }

  if (status === "in_operation") {
    return "amber";
  }

  if (status === "cancelled") {
    return "red";
  }

  if (status === "arrived") {
    return "blue";
  }

  return "gray";
}

export default function VesselVisitsTable({ vesselVisits = [] }) {
  if (!vesselVisits.length) {
    return (
      <EmptyState
        title="No vessel visits found"
        description="Create the first vessel visit for the terminal."
      />
    );
  }

  return (
    <div className="app-table-wrapper">
      <table className="app-table">
        <thead>
          <tr>
            <th>Vessel</th>
            <th>Inbound voyage</th>
            <th>Outbound voyage</th>
            <th>ETA</th>
            <th>ETD</th>
            <th>Berth</th>
            <th>Status</th>
            <th>Operations</th>
            <th className="app-table-action">Action</th>
          </tr>
        </thead>
        <tbody>
          {vesselVisits.map((visit) => (
            <tr key={visit.id_vessel_visit}>
              <td>{visit.vessel_name}</td>
              <td>{visit.inbound_voyage_no || "-"}</td>
              <td>{visit.outbound_voyage_no || "-"}</td>
              <td>{formatDate(visit.eta)}</td>
              <td>{formatDate(visit.etd)}</td>
              <td>{visit.berth || "-"}</td>
              <td>
                <Badge variant={statusVariant(visit.status)}>{visit.status}</Badge>
              </td>
              <td>{visit.operations_count || 0}</td>
              <td className="app-table-action">
                <Link className="app-link" href={`/vessel-visits/${visit.id_vessel_visit}`}>
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
