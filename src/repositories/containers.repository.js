import pool from "@/lib/db";

function buildContainerFilters(filters = {}) {
  const where = [];
  const params = [];

  if (filters.search) {
    params.push(`%${filters.search.toLowerCase()}%`);
    where.push(`(
      LOWER(c.container_no) LIKE $${params.length}
      OR LOWER(COALESCE(c.iso_type, '')) LIKE $${params.length}
      OR LOWER(COALESCE(cust.name, '')) LIKE $${params.length}
    )`);
  }

  if (filters.status) {
    params.push(filters.status);
    where.push(`c.status = $${params.length}`);
  }

  if (filters.current_area) {
    params.push(filters.current_area);
    where.push(`c.current_area = $${params.length}`);
  }

  if (filters.id_customer) {
    params.push(Number(filters.id_customer));
    where.push(`c.id_customer = $${params.length}`);
  }

  if (filters.size_ft) {
    params.push(Number(filters.size_ft));
    where.push(`c.size_ft = $${params.length}`);
  }

  if (filters.is_reefer === "true" || filters.is_reefer === true) {
    params.push(true);
    where.push(`c.is_reefer = $${params.length}`);
  }

  if (filters.is_reefer === "false" || filters.is_reefer === false) {
    params.push(false);
    where.push(`c.is_reefer = $${params.length}`);
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(" AND ")}` : "",
    params,
  };
}

export async function getContainers(filters = {}) {
  const { whereSql, params } = buildContainerFilters(filters);

  const result = await pool.query(
    `
      SELECT
        c.id_container,
        c.container_no,
        c.iso_type,
        c.size_ft,
        c.status,
        c.is_reefer,
        c.gross_weight_kg,
        c.current_area,
        c.current_position,
        c.id_customer,
        cust.name AS customer_name,
        cust.type AS customer_type
      FROM containers c
      LEFT JOIN customers cust ON cust.id_customer = c.id_customer
      ${whereSql}
      ORDER BY c.container_no ASC
    `,
    params
  );

  return result.rows;
}

export async function getContainersByCustomer(idCustomer, filters = {}) {
  return getContainers({
    ...filters,
    id_customer: idCustomer,
  });
}

export async function getContainerById(idContainer) {
  const result = await pool.query(
    `
      SELECT
        c.id_container,
        c.container_no,
        c.iso_type,
        c.size_ft,
        c.status,
        c.is_reefer,
        c.gross_weight_kg,
        c.current_area,
        c.current_position,
        c.id_customer,
        cust.name AS customer_name,
        cust.type AS customer_type
      FROM containers c
      LEFT JOIN customers cust ON cust.id_customer = c.id_customer
      WHERE c.id_container = $1
      LIMIT 1
    `,
    [idContainer]
  );

  return result.rows[0] || null;
}

export async function getContainerByNumber(containerNo) {
  const result = await pool.query(
    `
      SELECT
        c.id_container,
        c.container_no,
        c.iso_type,
        c.size_ft,
        c.status,
        c.is_reefer,
        c.gross_weight_kg,
        c.current_area,
        c.current_position,
        c.id_customer,
        cust.name AS customer_name,
        cust.type AS customer_type
      FROM containers c
      LEFT JOIN customers cust ON cust.id_customer = c.id_customer
      WHERE LOWER(c.container_no) = LOWER($1)
      LIMIT 1
    `,
    [containerNo]
  );

  return result.rows[0] || null;
}

export async function updateContainerLocation(client, idContainer, area, position) {
  const executor = client || pool;

  const result = await executor.query(
    `
      UPDATE containers
      SET
        current_area = $1,
        current_position = $2
      WHERE id_container = $3
      RETURNING id_container, current_area, current_position
    `,
    [area, position, idContainer]
  );

  return result.rows[0] || null;
}
