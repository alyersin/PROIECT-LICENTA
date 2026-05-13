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

export default function GateTransactionsTable({ transactions = [] }) {
  if (!transactions.length) {
    return (
      <EmptyState
        title="No gate transactions found"
        description="Gate operations will appear here after Gate IN or Gate OUT."
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
            <th>Type</th>
            <th>Truck</th>
            <th>Condition</th>
            <th>Destination</th>
            <th>Area</th>
            <th>Position</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id_gate_transaction}>
              <td>{formatDate(transaction.transaction_time)}</td>
              <td>
                <Link className="app-link" href={`/containers/${transaction.id_container}`}>
                  {transaction.container_no}
                </Link>
              </td>
              <td>
                <Badge variant={transaction.transaction_type === "GATE_IN" ? "blue" : "red"}>
                  {transaction.transaction_type}
                </Badge>
              </td>
              <td>{transaction.truck_no}</td>
              <td>{transaction.container_condition || "-"}</td>
              <td>{transaction.destination || "-"}</td>
              <td>{transaction.area_after || "-"}</td>
              <td>{transaction.position_after || "-"}</td>
              <td>{transaction.user_name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
