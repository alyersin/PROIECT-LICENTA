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

function eventVariant(type) {
  if (type === "GATE_IN") {
    return "blue";
  }

  if (type === "GATE_OUT") {
    return "red";
  }

  if (type === "DISCHARGED") {
    return "amber";
  }

  if (type === "LOADED") {
    return "green";
  }

  if (type === "LOCATION_UPDATED") {
    return "purple";
  }

  return "gray";
}

function containerCell(event, linkMode) {
  if (linkMode === "containers" && event.id_container) {
    return (
      <Link className="app-link" href={`/containers/${event.id_container}`}>
        {event.container_no}
      </Link>
    );
  }

  if (linkMode === "my-containers" && event.id_container) {
    return (
      <Link className="app-link" href={`/my-containers/${event.id_container}`}>
        {event.container_no}
      </Link>
    );
  }

  return event.container_no || "-";
}

export default function RecentEventsTable({ events = [], linkMode = "none" }) {
  if (!events.length) {
    return (
      <EmptyState
        title="No recent events"
        description="Operational events will appear after Gate, vessel or location operations."
      />
    );
  }

  return (
    <div className="app-table-wrapper">
      <table className="app-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Container</th>
            <th>Event</th>
            <th>Area</th>
            <th>Position</th>
            <th>User</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id_container_event}>
              <td>{formatDate(event.event_time)}</td>
              <td>{containerCell(event, linkMode)}</td>
              <td>
                <Badge variant={eventVariant(event.event_type)}>
                  {event.event_type}
                </Badge>
              </td>
              <td>{event.event_area || "-"}</td>
              <td>{event.event_position || "-"}</td>
              <td>{event.user_name || "-"}</td>
              <td>{event.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
