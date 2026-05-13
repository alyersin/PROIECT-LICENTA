import pool from "@/lib/db";

export async function getVesselVisits() {
  const result = await pool.query(`
    SELECT
      vv.id_vessel_visit,
      vv.id_vessel,
      vv.id_created_by,
      vv.inbound_voyage_no,
      vv.outbound_voyage_no,
      vv.eta,
      vv.etd,
      vv.berth,
      vv.status,
      vv.created_at,
      v.name AS vessel_name,
      v.imo AS vessel_imo,
      u.full_name AS created_by_name,
      COUNT(vvc.id_vessel_visit_container) AS operations_count
    FROM vessel_visits vv
    JOIN vessels v ON v.id_vessel = vv.id_vessel
    JOIN users u ON u.id_user = vv.id_created_by
    LEFT JOIN vessel_visit_containers vvc
      ON vvc.id_vessel_visit = vv.id_vessel_visit
    GROUP BY
      vv.id_vessel_visit,
      v.name,
      v.imo,
      u.full_name
    ORDER BY vv.eta DESC NULLS LAST, vv.created_at DESC
  `);

  return result.rows;
}

export async function getVesselVisitById(idVesselVisit) {
  const result = await pool.query(
    `
      SELECT
        vv.id_vessel_visit,
        vv.id_vessel,
        vv.id_created_by,
        vv.inbound_voyage_no,
        vv.outbound_voyage_no,
        vv.eta,
        vv.etd,
        vv.berth,
        vv.status,
        vv.created_at,
        v.name AS vessel_name,
        v.imo AS vessel_imo,
        u.full_name AS created_by_name
      FROM vessel_visits vv
      JOIN vessels v ON v.id_vessel = vv.id_vessel
      JOIN users u ON u.id_user = vv.id_created_by
      WHERE vv.id_vessel_visit = $1
      LIMIT 1
    `,
    [idVesselVisit]
  );

  return result.rows[0] || null;
}

export async function createVesselVisit(data) {
  const result = await pool.query(
    `
      INSERT INTO vessel_visits (
        id_vessel,
        id_created_by,
        inbound_voyage_no,
        outbound_voyage_no,
        eta,
        etd,
        berth,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id_vessel_visit
    `,
    [
      data.id_vessel,
      data.id_created_by,
      data.inbound_voyage_no || null,
      data.outbound_voyage_no || null,
      data.eta || null,
      data.etd || null,
      data.berth || null,
      data.status || "planned",
    ]
  );

  return result.rows[0];
}

export async function updateVesselVisit(idVesselVisit, data) {
  const result = await pool.query(
    `
      UPDATE vessel_visits
      SET
        id_vessel = $1,
        inbound_voyage_no = $2,
        outbound_voyage_no = $3,
        eta = $4,
        etd = $5,
        berth = $6,
        status = $7
      WHERE id_vessel_visit = $8
      RETURNING id_vessel_visit
    `,
    [
      data.id_vessel,
      data.inbound_voyage_no || null,
      data.outbound_voyage_no || null,
      data.eta || null,
      data.etd || null,
      data.berth || null,
      data.status,
      idVesselVisit,
    ]
  );

  return result.rows[0] || null;
}

export async function getVesselVisitContainers(idVesselVisit) {
  const result = await pool.query(
    `
      SELECT
        vvc.id_vessel_visit_container,
        vvc.id_vessel_visit,
        vvc.id_container,
        vvc.operation_type,
        vvc.operation_status,
        vvc.port,
        vvc.weight_kg,
        vvc.area_after,
        vvc.position_after,
        c.container_no,
        c.iso_type,
        c.size_ft,
        c.status AS container_status,
        c.current_area,
        c.current_position
      FROM vessel_visit_containers vvc
      JOIN containers c ON c.id_container = vvc.id_container
      WHERE vvc.id_vessel_visit = $1
      ORDER BY vvc.operation_type ASC, c.container_no ASC
    `,
    [idVesselVisit]
  );

  return result.rows;
}
