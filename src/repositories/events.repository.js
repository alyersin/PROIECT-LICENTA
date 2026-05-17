import pool from "@/lib/db";
import { DEFAULT_EVENT_LIMIT, MAX_EVENT_LIMIT } from "@/lib/securityLimits";

export async function getContainerEvents(idContainer, limit = DEFAULT_EVENT_LIMIT) {
  const safeLimit = Math.min(Number(limit) || DEFAULT_EVENT_LIMIT, MAX_EVENT_LIMIT);

  const result = await pool.query(
    `
      SELECT
        ce.id_container_event,
        ce.id_container,
        ce.id_user,
        ce.id_vessel_visit,
        ce.id_gate_transaction,
        ce.event_type,
        ce.event_time,
        ce.event_area,
        ce.event_position,
        ce.description,
        u.full_name AS user_name,
        u.email AS user_email
      FROM container_events ce
      JOIN users u ON u.id_user = ce.id_user
      WHERE ce.id_container = $1
      ORDER BY ce.event_time DESC, ce.id_container_event DESC
      LIMIT $2
    `,
    [idContainer, safeLimit]
  );

  return result.rows;
}

export async function createContainerEvent(client, data) {
  const executor = client || pool;

  const result = await executor.query(
    `
      INSERT INTO container_events (
        id_container,
        id_user,
        id_vessel_visit,
        id_gate_transaction,
        event_type,
        event_time,
        event_area,
        event_position,
        description
      )
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7, $8)
      RETURNING id_container_event
    `,
    [
      data.id_container,
      data.id_user,
      data.id_vessel_visit || null,
      data.id_gate_transaction || null,
      data.event_type,
      data.event_area || null,
      data.event_position || null,
      data.description,
    ]
  );

  return result.rows[0];
}
