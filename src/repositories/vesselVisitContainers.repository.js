import pool from "@/lib/db";

export async function createVesselVisitContainer(client, data) {
  const executor = client || pool;

  const result = await executor.query(
    `
      INSERT INTO vessel_visit_containers (
        id_vessel_visit,
        id_container,
        operation_type,
        operation_status,
        port,
        weight_kg,
        area_after,
        position_after
      )
      VALUES ($1, $2, $3, 'planned', $4, $5, $6, $7)
      RETURNING id_vessel_visit_container
    `,
    [
      data.id_vessel_visit,
      data.id_container,
      data.operation_type,
      data.port || null,
      data.weight_kg || null,
      data.area_after || null,
      data.position_after || null,
    ]
  );

  return result.rows[0];
}

export async function getVesselVisitContainerById(idOperation) {
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
        c.current_area,
        c.current_position,
        c.status AS container_status
      FROM vessel_visit_containers vvc
      JOIN containers c ON c.id_container = vvc.id_container
      WHERE vvc.id_vessel_visit_container = $1
      LIMIT 1
    `,
    [idOperation]
  );

  return result.rows[0] || null;
}

export async function confirmVesselVisitContainer(client, idOperation) {
  const executor = client || pool;

  const result = await executor.query(
    `
      UPDATE vessel_visit_containers
      SET operation_status = 'confirmed'
      WHERE id_vessel_visit_container = $1
        AND operation_status = 'planned'
      RETURNING *
    `,
    [idOperation]
  );

  return result.rows[0] || null;
}
