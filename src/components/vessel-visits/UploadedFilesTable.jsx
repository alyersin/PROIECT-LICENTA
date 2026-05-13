import EmptyState from "@/components/ui/EmptyState";
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

export default function UploadedFilesTable({ files = [] }) {
  if (!files.length) {
    return (
      <EmptyState
        title="No uploaded files"
        description="CSV files imported for this vessel visit will appear here."
      />
    );
  }

  return (
    <div className="app-table-wrapper">
      <table className="app-table">
        <thead>
          <tr>
            <th>File name</th>
            <th>Type</th>
            <th>Uploaded at</th>
            <th>Uploaded by</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id_file}>
              <td>{file.file_name}</td>
              <td>
                <Badge variant={file.file_type === "DISCHARGE_LIST" ? "amber" : "green"}>
                  {file.file_type}
                </Badge>
              </td>
              <td>{formatDate(file.uploaded_at)}</td>
              <td>{file.uploaded_by_name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
