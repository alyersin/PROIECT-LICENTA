import pool from "@/lib/db";
import { MAX_EXPORT_ROWS } from "@/lib/securityLimits";

function addLimit(params, filters = {}) {
  const requestedLimit = Number(filters.limit) || MAX_EXPORT_ROWS;
  const limit = Math.min(requestedLimit, MAX_EXPORT_ROWS);
  params.push(limit);
  return params.length;
}

export async function getContainersReportRows(filters = {}) {
  const params = [];
  const where = [];

  if (filters.id_customer) {
    params.push(filters.id_customer);
    where.push(`c.id_customer = $${params.length}`);
  }

  const limitParam = addLimit(params, filters);

  const result = await pool.query(
    `
      SELECT
        c.container_no AS container_number,
        c.iso_type,
        c.size_ft AS size,
        cust.name AS customer_name,
        c.current_area,
        c.current_position,
        c.status,
        latest_gate.container_condition AS condition
      FROM containers c
      LEFT JOIN customers cust ON cust.id_customer = c.id_customer
      LEFT JOIN LATERAL (
        SELECT gt.container_condition
        FROM gate_transactions gt
        WHERE gt.id_container = c.id_container
        ORDER BY gt.transaction_time DESC, gt.id_gate_transaction DESC
        LIMIT 1
      ) latest_gate ON true
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY c.container_no ASC
      LIMIT $${limitParam}
    `,
    params
  );

  return result.rows;
}

export async function getGateTransactionsReportRows(filters = {}) {
  const params = [];
  const where = [];

  if (filters.id_customer) {
    params.push(filters.id_customer);
    where.push(`c.id_customer = $${params.length}`);
  }

  const limitParam = addLimit(params, filters);

  const result = await pool.query(
    `
      SELECT
        gt.transaction_type,
        c.container_no AS container_number,
        cust.name AS customer_name,
        gt.container_condition,
        gt.truck_no AS truck_plate,
        '' AS driver_name,
        gt.transaction_time,
        u.full_name AS operator_name
      FROM gate_transactions gt
      JOIN containers c ON c.id_container = gt.id_container
      LEFT JOIN customers cust ON cust.id_customer = c.id_customer
      JOIN users u ON u.id_user = gt.id_user
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY gt.transaction_time DESC, gt.id_gate_transaction DESC
      LIMIT $${limitParam}
    `,
    params
  );

  return result.rows;
}

export async function getVesselVisitContainersReportRows(filters = {}) {
  const params = [];
  const limitParam = addLimit(params, filters);

  const result = await pool.query(`
    SELECT
      v.name AS vessel_name,
      vv.inbound_voyage_no,
      vv.outbound_voyage_no,
      vv.eta,
      vv.etd,
      c.container_no AS container_number,
      vvc.operation_type,
      vvc.operation_status AS status
    FROM vessel_visit_containers vvc
    JOIN vessel_visits vv ON vv.id_vessel_visit = vvc.id_vessel_visit
    JOIN vessels v ON v.id_vessel = vv.id_vessel
    JOIN containers c ON c.id_container = vvc.id_container
    ORDER BY vv.eta DESC NULLS LAST, v.name ASC, c.container_no ASC
    LIMIT $${limitParam}
  `, params);

  return result.rows;
}
