import pool from "@/lib/db";

export async function getAllRoles() {
  const result = await pool.query(`
    SELECT id_role, code, name
    FROM roles
    ORDER BY id_role ASC
  `);

  return result.rows;
}

export async function getRoleById(idRole) {
  const result = await pool.query(
    `
      SELECT id_role, code, name
      FROM roles
      WHERE id_role = $1
    `,
    [idRole]
  );

  return result.rows[0] || null;
}
