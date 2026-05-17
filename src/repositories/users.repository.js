import pool from "@/lib/db";
import { DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT } from "@/lib/securityLimits";

export async function findUserByEmail(email) {
  const result = await pool.query(
    `
      SELECT
        u.id_user,
        u.id_role,
        u.id_customer,
        u.email,
        u.password_hash,
        u.full_name,
        u.is_active,
        u.created_at,
        r.code AS role_code,
        r.name AS role_name,
        c.name AS customer_name
      FROM users u
      JOIN roles r ON r.id_role = u.id_role
      LEFT JOIN customers c ON c.id_customer = u.id_customer
      WHERE LOWER(u.email) = LOWER($1)
      LIMIT 1
    `,
    [email]
  );

  return result.rows[0] || null;
}

export async function findUserById(idUser) {
  const result = await pool.query(
    `
      SELECT
        u.id_user,
        u.id_role,
        u.id_customer,
        u.email,
        u.full_name,
        u.is_active,
        u.created_at,
        r.code AS role_code,
        r.name AS role_name,
        c.name AS customer_name
      FROM users u
      JOIN roles r ON r.id_role = u.id_role
      LEFT JOIN customers c ON c.id_customer = u.id_customer
      WHERE u.id_user = $1
      LIMIT 1
    `,
    [idUser]
  );

  return result.rows[0] || null;
}

export async function getUsers(limit = DEFAULT_LIST_LIMIT) {
  const safeLimit = Math.min(Number(limit) || DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT);

  const result = await pool.query(`
    SELECT
      u.id_user,
      u.id_role,
      u.id_customer,
      u.email,
      u.full_name,
      u.is_active,
      u.created_at,
      r.code AS role_code,
      r.name AS role_name,
      c.name AS customer_name
    FROM users u
    JOIN roles r ON r.id_role = u.id_role
    LEFT JOIN customers c ON c.id_customer = u.id_customer
    ORDER BY u.created_at DESC, u.id_user DESC
    LIMIT $1
  `, [safeLimit]);

  return result.rows;
}

export async function emailExists(email, excludedUserId = null) {
  const params = [email];
  let query = `
    SELECT id_user
    FROM users
    WHERE LOWER(email) = LOWER($1)
  `;

  if (excludedUserId) {
    params.push(excludedUserId);
    query += ` AND id_user <> $2`;
  }

  query += ` LIMIT 1`;

  const result = await pool.query(query, params);
  return Boolean(result.rows[0]);
}

export async function createUser(data) {
  const result = await pool.query(
    `
      INSERT INTO users (
        id_role,
        id_customer,
        email,
        password_hash,
        full_name,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_user
    `,
    [
      data.id_role,
      data.id_customer || null,
      data.email,
      data.password_hash,
      data.full_name,
      data.is_active,
    ]
  );

  return result.rows[0];
}

export async function updateUser(idUser, data) {
  const result = await pool.query(
    `
      UPDATE users
      SET
        id_role = $1,
        id_customer = $2,
        email = $3,
        full_name = $4,
        is_active = $5
      WHERE id_user = $6
      RETURNING id_user
    `,
    [
      data.id_role,
      data.id_customer || null,
      data.email,
      data.full_name,
      data.is_active,
      idUser,
    ]
  );

  return result.rows[0] || null;
}

export async function updateUserPassword(idUser, passwordHash) {
  const result = await pool.query(
    `
      UPDATE users
      SET password_hash = $1
      WHERE id_user = $2
      RETURNING id_user
    `,
    [passwordHash, idUser]
  );

  return result.rows[0] || null;
}

export async function deactivateUser(idUser) {
  const result = await pool.query(
    `
      UPDATE users
      SET is_active = false
      WHERE id_user = $1
      RETURNING id_user
    `,
    [idUser]
  );

  return result.rows[0] || null;
}

export async function countActiveAdmins(excludedUserId = null) {
  const params = [];
  let excludedSql = "";

  if (excludedUserId) {
    params.push(excludedUserId);
    excludedSql = `AND u.id_user <> $${params.length}`;
  }

  const result = await pool.query(
    `
      SELECT COUNT(*)::int AS count
      FROM users u
      JOIN roles r ON r.id_role = u.id_role
      WHERE r.code = 'ADMIN'
        AND u.is_active = true
        ${excludedSql}
    `,
    params
  );

  return result.rows[0]?.count || 0;
}
