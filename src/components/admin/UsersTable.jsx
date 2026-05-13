import Link from "next/link";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

export default function UsersTable({ users = [] }) {
  if (!users.length) {
    return <EmptyState title="No users found" description="Create the first user account." />;
  }

  return (
    <div className="app-table-wrapper">
      <table className="app-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Customer</th>
            <th>Status</th>
            <th className="app-table-action">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id_user}>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>
                <Badge variant="blue">{user.role_code}</Badge>
              </td>
              <td>{user.customer_name || "-"}</td>
              <td>
                <Badge variant={user.is_active ? "green" : "red"}>
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="app-table-action">
                <Link className="app-link" href={`/admin/users/${user.id_user}/edit`}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
