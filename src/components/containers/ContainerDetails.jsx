import Badge from "@/components/ui/Badge";

export default function ContainerDetails({ container }) {
  return (
    <div className="app-details-grid">
      <div>
        <span className="app-detail-label">Container number</span>
        <strong className="app-detail-value">{container.container_no}</strong>
      </div>

      <div>
        <span className="app-detail-label">Status</span>
        <Badge variant="blue">{container.status}</Badge>
      </div>

      <div>
        <span className="app-detail-label">ISO type</span>
        <strong className="app-detail-value">{container.iso_type || "-"}</strong>
      </div>

      <div>
        <span className="app-detail-label">Size</span>
        <strong className="app-detail-value">{container.size_ft ? `${container.size_ft} ft` : "-"}</strong>
      </div>

      <div>
        <span className="app-detail-label">Reefer</span>
        <strong className="app-detail-value">{container.is_reefer ? "Yes" : "No"}</strong>
      </div>

      <div>
        <span className="app-detail-label">Gross weight</span>
        <strong className="app-detail-value">
          {container.gross_weight_kg ? `${container.gross_weight_kg} kg` : "-"}
        </strong>
      </div>

      <div>
        <span className="app-detail-label">Current area</span>
        <strong className="app-detail-value">{container.current_area || "-"}</strong>
      </div>

      <div>
        <span className="app-detail-label">Current position</span>
        <strong className="app-detail-value">{container.current_position || "-"}</strong>
      </div>

      <div>
        <span className="app-detail-label">Customer</span>
        <strong className="app-detail-value">{container.customer_name || "-"}</strong>
      </div>

      <div>
        <span className="app-detail-label">Customer type</span>
        <strong className="app-detail-value">{container.customer_type || "-"}</strong>
      </div>
    </div>
  );
}
