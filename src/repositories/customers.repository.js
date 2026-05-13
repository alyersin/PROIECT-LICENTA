import pool from "@/lib/db";

export async function getAllCustomers() {
  const result = await pool.query(`
    SELECT id_customer, name, type
    FROM customers
    ORDER BY name ASC
  `);

  return result.rows;
}

export async function getCustomerById(idCustomer) {
  const result = await pool.query(
    `
      SELECT id_customer, name, type
      FROM customers
      WHERE id_customer = $1
    `,
    [idCustomer]
  );

  return result.rows[0] || null;
}
