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
        latest_gate.container_condition,
        cust.name AS customer_name,
        cust.type AS customer_type
      FROM containers c
      LEFT JOIN customers cust ON cust.id_customer = c.id_customer
      LEFT JOIN LATERAL (
        SELECT gt.container_condition
        FROM gate_transactions gt
        WHERE gt.id_container = c.id_container
        ORDER BY gt.transaction_time DESC, gt.id_gate_transaction DESC
        LIMIT 1
      ) latest_gate ON true
      ${whereSql}
      ORDER BY c.container_no ASC
    `,
    params
  );

  return result.rows;
}

export async function getContainersByCustomer(idCustomer, filters = {}) {
  if (!idCustomer) {
    return [];
  }

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

export async function createContainer(client, data) {
  const executor = client || pool;

  const result = await executor.query(
    `
      INSERT INTO containers (
        container_no,
        iso_type,
        size_ft,
        status,
        is_reefer,
        gross_weight_kg,
        current_area,
        current_position,
        id_customer
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
    [
      data.container_no,
      data.iso_type || null,
      data.size_ft || null,
      data.status,
      data.is_reefer || false,
      data.gross_weight_kg || null,
      data.current_area || null,
      data.current_position || null,
      data.id_customer || null,
    ]
  );

  return result.rows[0];
}

export async function updateContainerAfterGateIn(client, idContainer, data) {
  const executor = client || pool;

  const result = await executor.query(
    `
      UPDATE containers
      SET
        iso_type = COALESCE($1, iso_type),
        size_ft = COALESCE($2, size_ft),
        status = 'in_terminal',
        is_reefer = $3,
        gross_weight_kg = COALESCE($4, gross_weight_kg),
        current_area = $5,
        current_position = $6,
        id_customer = COALESCE($7, id_customer)
      WHERE id_container = $8
      RETURNING *
    `,
    [
      data.iso_type || null,
      data.size_ft || null,
      data.is_reefer || false,
      data.gross_weight_kg || null,
      data.current_area,
      data.current_position,
      data.id_customer || null,
      idContainer,
    ]
  );

  return result.rows[0] || null;
}

export async function updateContainerAfterGateOut(client, idContainer) {
  const executor = client || pool;

  const result = await executor.query(
    `
      UPDATE containers
      SET status = 'gate_out'
      WHERE id_container = $1
      RETURNING *
    `,
    [idContainer]
  );

  return result.rows[0] || null;
}

export async function updateContainerAfterDischarge(client, idContainer, data) {
  const executor = client || pool;

  const result = await executor.query(
    `
      UPDATE containers
      SET
        status = 'discharged',
        current_area = $1,
        current_position = $2,
        gross_weight_kg = COALESCE($3, gross_weight_kg)
      WHERE id_container = $4
      RETURNING *
    `,
    [
      data.current_area,
      data.current_position,
      data.gross_weight_kg || null,
      idContainer,
    ]
  );

  return result.rows[0] || null;
}

export async function updateContainerAfterLoad(client, idContainer) {
  const executor = client || pool;

  const result = await executor.query(
    `
      UPDATE containers
      SET status = 'loaded'
      WHERE id_container = $1
      RETURNING *
    `,
    [idContainer]
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
