import pool from "@/lib/db";

export async function getAllVessels() {
  const result = await pool.query(`
    SELECT id_vessel, name, imo
    FROM vessels
    ORDER BY name ASC
  `);

  return result.rows;
}

export async function getVesselById(idVessel) {
  const result = await pool.query(
    `
      SELECT id_vessel, name, imo
      FROM vessels
      WHERE id_vessel = $1
      LIMIT 1
    `,
    [idVessel]
  );

  return result.rows[0] || null;
}

export async function createVessel(data) {
  const result = await pool.query(
    `
      INSERT INTO vessels (name, imo)
      VALUES ($1, $2)
      ON CONFLICT (imo) DO UPDATE
      SET name = EXCLUDED.name
      RETURNING id_vessel, name, imo
    `,
    [data.name, data.imo || null]
  );

  return result.rows[0];
}
