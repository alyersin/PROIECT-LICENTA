import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

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

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ContainerEventsTimeline({ events = [] }) {
  if (!events.length) {
    return (
      <EmptyState
        title="No events found"
        description="Operational history will appear after Gate IN, Gate OUT, discharge, loading or location updates."
      />
    );
  }

  return (
    <div className="app-timeline">
      {events.map((event) => (
        <article className="app-timeline-item" key={event.id_container_event}>
          <div className="app-timeline-dot" />
          <div className="app-timeline-content">
            <div className="app-timeline-header">
              <Badge variant={eventVariant(event.event_type)}>{event.event_type}</Badge>
              <span>{formatDate(event.event_time)}</span>
            </div>

            <p className="app-timeline-description">{event.description}</p>

            <div className="app-timeline-meta">
              <span>User: {event.user_name || event.user_email || "-"}</span>
              <span>Area: {event.event_area || "-"}</span>
              <span>Position: {event.event_position || "-"}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
