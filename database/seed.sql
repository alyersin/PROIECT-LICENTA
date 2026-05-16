INSERT INTO roles (code, name)
VALUES
  ('ADMIN', 'Administrator'),
  ('GATE_OPERATOR', 'Gate Operator'),
  ('TERMINAL_OPERATOR', 'Terminal Operator'),
  ('CUSTOMER_AGENT', 'Customer / Line Agent')
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name;

INSERT INTO customers (name, type)
SELECT 'Maersk Line', 'shipping_line'
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE name = 'Maersk Line');

INSERT INTO customers (name, type)
SELECT 'MSC', 'shipping_line'
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE name = 'MSC');

INSERT INTO customers (name, type)
SELECT 'Demo Import Client', 'client'
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE name = 'Demo Import Client');

INSERT INTO customers (name, type)
SELECT 'Demo Agent', 'agent'
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE name = 'Demo Agent');

INSERT INTO vessels (name, imo)
VALUES
  ('MSC Maya', 'IMO1234567'),
  ('Maersk Lima', 'IMO7654321')
ON CONFLICT (imo) DO UPDATE
SET name = EXCLUDED.name;

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
VALUES
  (
    'MSCU1234567',
    '45G1',
    40,
    'in_terminal',
    false,
    24000,
    'Export Yard',
    'B2-05',
    (SELECT id_customer FROM customers WHERE name = 'Maersk Line' LIMIT 1)
  ),
  (
    'TCLU7654321',
    '22G1',
    20,
    'in_terminal',
    false,
    18000,
    'Import Yard',
    'A1-02',
    (SELECT id_customer FROM customers WHERE name = 'MSC' LIMIT 1)
  ),
  (
    'MSCU9999999',
    '45R1',
    40,
    'in_terminal',
    true,
    22000,
    'Reefer Area',
    'R1-03',
    (SELECT id_customer FROM customers WHERE name = 'Demo Import Client' LIMIT 1)
  ),
  (
    'TCLU8888888',
    '22T1',
    20,
    'planned',
    false,
    16000,
    'ISO Tanks / IMDG Cargo Area',
    'T1-01',
    (SELECT id_customer FROM customers WHERE name = 'Demo Agent' LIMIT 1)
  )
ON CONFLICT (container_no) DO UPDATE
SET
  iso_type = EXCLUDED.iso_type,
  size_ft = EXCLUDED.size_ft,
  status = EXCLUDED.status,
  is_reefer = EXCLUDED.is_reefer,
  gross_weight_kg = EXCLUDED.gross_weight_kg,
  current_area = EXCLUDED.current_area,
  current_position = EXCLUDED.current_position,
  id_customer = EXCLUDED.id_customer;

INSERT INTO users (
  id_role,
  id_customer,
  email,
  password_hash,
  full_name,
  is_active
)
-- Development-only demo password intended for local seeded users: admin123
-- Change these passwords before any shared demo or production-like deployment.
-- If login fails, regenerate bcrypt hash with:
-- node -e "const bcrypt=require('bcrypt'); bcrypt.hash('admin123',10).then(console.log)"
VALUES
  (
    (SELECT id_role FROM roles WHERE code = 'ADMIN'),
    NULL,
    'admin@maritimeops.local',
    '$2b$10$fOjlt3y9F1.kw9cNkLfDp.iDrrqKD34gqetuMOFVxPxZ4b.GMUoP2',
    'Admin User',
    true
  ),
  (
    (SELECT id_role FROM roles WHERE code = 'GATE_OPERATOR'),
    NULL,
    'gate@maritimeops.local',
    '$2b$10$fOjlt3y9F1.kw9cNkLfDp.iDrrqKD34gqetuMOFVxPxZ4b.GMUoP2',
    'Gate Operator',
    true
  ),
  (
    (SELECT id_role FROM roles WHERE code = 'TERMINAL_OPERATOR'),
    NULL,
    'terminal@maritimeops.local',
    '$2b$10$fOjlt3y9F1.kw9cNkLfDp.iDrrqKD34gqetuMOFVxPxZ4b.GMUoP2',
    'Terminal Operator',
    true
  ),
  (
    (SELECT id_role FROM roles WHERE code = 'CUSTOMER_AGENT'),
    (SELECT id_customer FROM customers WHERE name = 'Maersk Line' LIMIT 1),
    'customer@maritimeops.local',
    '$2b$10$fOjlt3y9F1.kw9cNkLfDp.iDrrqKD34gqetuMOFVxPxZ4b.GMUoP2',
    'Customer Agent',
    true
  )
ON CONFLICT (email) DO UPDATE
SET
  id_role = EXCLUDED.id_role,
  id_customer = EXCLUDED.id_customer,
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  is_active = EXCLUDED.is_active;

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
SELECT
  c.id_container,
  u.id_user,
  NULL,
  NULL,
  'LOCATION_UPDATED',
  CURRENT_TIMESTAMP,
  c.current_area,
  c.current_position,
  'Initial demo location imported from seed data.'
FROM containers c
CROSS JOIN users u
WHERE u.email = 'admin@maritimeops.local'
  AND NOT EXISTS (
    SELECT 1
    FROM container_events ce
    WHERE ce.id_container = c.id_container
      AND ce.event_type = 'LOCATION_UPDATED'
      AND ce.description = 'Initial demo location imported from seed data.'
  );
