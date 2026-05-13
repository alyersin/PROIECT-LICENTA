import Badge from "@/components/ui/Badge";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function VesselVisitDetails({ vesselVisit }) {
  return (
    <div className="app-details-grid">
      <div>
        <span className="app-detail-label">Vessel</span>
        <strong className="app-detail-value">{vesselVisit.vessel_name}</strong>
      </div>

      <div>
        <span className="app-detail-label">IMO</span>
        <strong className="app-detail-value">{vesselVisit.vessel_imo || "-"}</strong>
      </div>

      <div>
        <span className="app-detail-label">Inbound voyage</span>
        <strong className="app-detail-value">{vesselVisit.inbound_voyage_no || "-"}</strong>
      </div>

      <div>
        <span className="app-detail-label">Outbound voyage</span>
        <strong className="app-detail-value">{vesselVisit.outbound_voyage_no || "-"}</strong>
      </div>

      <div>
        <span className="app-detail-label">ETA</span>
        <strong className="app-detail-value">{formatDate(vesselVisit.eta)}</strong>
      </div>

      <div>
        <span className="app-detail-label">ETD</span>
        <strong className="app-detail-value">{formatDate(vesselVisit.etd)}</strong>
      </div>

      <div>
        <span className="app-detail-label">Berth</span>
        <strong className="app-detail-value">{vesselVisit.berth || "-"}</strong>
      </div>

      <div>
        <span className="app-detail-label">Status</span>
        <Badge variant="blue">{vesselVisit.status}</Badge>
      </div>

      <div>
        <span className="app-detail-label">Created by</span>
        <strong className="app-detail-value">{vesselVisit.created_by_name || "-"}</strong>
      </div>
    </div>
  );
}
