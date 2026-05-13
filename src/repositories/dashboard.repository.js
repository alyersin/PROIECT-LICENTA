import pool from "@/lib/db";

function startOfTodaySql() {
  return "CURRENT_DATE";
}

export async function getAdminDashboardStats() {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS total_users,
      (SELECT COUNT(*)::int FROM users WHERE is_active = true) AS active_users,
      (SELECT COUNT(*)::int FROM users WHERE is_active = false) AS inactive_users,
      (SELECT COUNT(*)::int FROM roles) AS total_roles
  `);

  return result.rows[0];
}

export async function getGateDashboardStats() {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM containers WHERE status = 'in_terminal') AS containers_in_terminal,
      (
        SELECT COUNT(*)::int
        FROM gate_transactions
        WHERE transaction_type = 'GATE_IN'
          AND transaction_time >= ${startOfTodaySql()}
      ) AS gate_in_today,
      (
        SELECT COUNT(*)::int
        FROM gate_transactions
        WHERE transaction_type = 'GATE_OUT'
          AND transaction_time >= ${startOfTodaySql()}
      ) AS gate_out_today,
      (SELECT COUNT(*)::int FROM containers WHERE status = 'gate_out') AS containers_gate_out
  `);

  return result.rows[0];
}

export async function getTerminalDashboardStats() {
  const result = await pool.query(`
    SELECT
      (
        SELECT COUNT(*)::int
        FROM vessel_visits
        WHERE status IN ('planned', 'arrived', 'in_operation')
      ) AS active_vessel_visits,
      (
        SELECT COUNT(*)::int
        FROM vessel_visit_containers
        WHERE operation_type = 'DISCHARGE'
          AND operation_status = 'planned'
      ) AS pending_discharge,
      (
        SELECT COUNT(*)::int
        FROM vessel_visit_containers
        WHERE operation_type = 'LOAD'
          AND operation_status = 'planned'
      ) AS pending_loading,
      (SELECT COUNT(*)::int FROM containers WHERE status = 'in_terminal') AS containers_in_terminal
  `);

  return result.rows[0];
}

export async function getCustomerDashboardStats(idCustomer) {
  const result = await pool.query(
    `
      SELECT
        (SELECT COUNT(*)::int FROM containers WHERE id_customer = $1) AS my_containers,
        (
          SELECT COUNT(*)::int
          FROM containers
          WHERE id_customer = $1
            AND status = 'in_terminal'
        ) AS in_terminal,
        (
          SELECT COUNT(*)::int
          FROM containers
          WHERE id_customer = $1
            AND status = 'loaded'
        ) AS loaded,
        (
          SELECT COUNT(*)::int
          FROM containers
          WHERE id_customer = $1
            AND status = 'gate_out'
        ) AS gate_out
    `,
    [idCustomer]
  );

  return result.rows[0];
}

export async function getRecentContainerEvents(limit = 8) {
  const result = await pool.query(
    `
      SELECT
        ce.id_container_event,
        ce.id_container,
        ce.event_type,
        ce.event_time,
        ce.event_area,
        ce.event_position,
        ce.description,
        c.container_no,
        u.full_name AS user_name
      FROM container_events ce
      JOIN containers c ON c.id_container = ce.id_container
      JOIN users u ON u.id_user = ce.id_user
      ORDER BY ce.event_time DESC, ce.id_container_event DESC
      LIMIT $1
    `,
    [limit]
  );

  return result.rows;
}

export async function getRecentContainerEventsForCustomer(idCustomer, limit = 8) {
  const result = await pool.query(
    `
      SELECT
        ce.id_container_event,
        ce.id_container,
        ce.event_type,
        ce.event_time,
        ce.event_area,
        ce.event_position,
        ce.description,
        c.container_no,
        u.full_name AS user_name
      FROM container_events ce
      JOIN containers c ON c.id_container = ce.id_container
      JOIN users u ON u.id_user = ce.id_user
      WHERE c.id_customer = $1
      ORDER BY ce.event_time DESC, ce.id_container_event DESC
      LIMIT $2
    `,
    [idCustomer, limit]
  );

  return result.rows;
}
