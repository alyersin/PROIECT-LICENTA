import pool from "@/lib/db";

export async function createUploadedFile(client, data) {
  const executor = client || pool;

  const result = await executor.query(
    `
      INSERT INTO uploaded_files (
        id_vessel_visit,
        id_uploaded_by,
        file_type,
        file_name,
        uploaded_at
      )
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING id_file
    `,
    [
      data.id_vessel_visit,
      data.id_uploaded_by,
      data.file_type,
      data.file_name,
    ]
  );

  return result.rows[0];
}

export async function getUploadedFilesForVisit(idVesselVisit) {
  const result = await pool.query(
    `
      SELECT
        uf.id_file,
        uf.id_vessel_visit,
        uf.id_uploaded_by,
        uf.file_type,
        uf.file_name,
        uf.uploaded_at,
        u.full_name AS uploaded_by_name
      FROM uploaded_files uf
      JOIN users u ON u.id_user = uf.id_uploaded_by
      WHERE uf.id_vessel_visit = $1
      ORDER BY uf.uploaded_at DESC, uf.id_file DESC
    `,
    [idVesselVisit]
  );

  return result.rows;
}
