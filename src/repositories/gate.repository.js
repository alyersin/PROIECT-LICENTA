import pool from "@/lib/db";

export async function createGateTransaction(client, data) {
  const executor = client || pool;

  const result = await executor.query(
    `
      INSERT INTO gate_transactions (
        id_container,
        id_user,
        transaction_type,
        truck_no,
        transaction_time,
        container_condition,
        seal_no,
        destination,
        area_after,
        position_after,
        observations
      )
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
    [
      data.id_container,
      data.id_user,
      data.transaction_type,
      data.truck_no,
      data.container_condition || null,
      data.seal_no || null,
      data.destination || null,
      data.area_after || null,
      data.position_after || null,
      data.observations || null,
    ]
  );

  return result.rows[0];
}

export async function getRecentGateTransactions(limit = 20) {
  const result = await pool.query(
    `
      SELECT
        gt.id_gate_transaction,
        gt.id_container,
        gt.id_user,
        gt.transaction_type,
        gt.truck_no,
        gt.transaction_time,
        gt.container_condition,
        gt.seal_no,
        gt.destination,
        gt.area_after,
        gt.position_after,
        gt.observations,
        c.container_no,
        u.full_name AS user_name
      FROM gate_transactions gt
      JOIN containers c ON c.id_container = gt.id_container
      JOIN users u ON u.id_user = gt.id_user
      ORDER BY gt.transaction_time DESC, gt.id_gate_transaction DESC
      LIMIT $1
    `,
    [limit]
  );

  return result.rows;
}
