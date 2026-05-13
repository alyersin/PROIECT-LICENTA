import {
  createUser,
  emailExists,
  findUserById,
  updateUser,
  updateUserPassword,
} from "@/repositories/users.repository";
import { getRoleById } from "@/repositories/roles.repository";
import { getCustomerById } from "@/repositories/customers.repository";
import { hashPassword } from "@/lib/passwords";

function normalizeUserPayload(payload) {
  return {
    full_name: String(payload.full_name || "").trim(),
    email: String(payload.email || "").trim().toLowerCase(),
    password: String(payload.password || ""),
    id_role: payload.id_role ? Number(payload.id_role) : null,
    id_customer: payload.id_customer ? Number(payload.id_customer) : null,
    is_active: payload.is_active === false ? false : true,
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function validateUserPayload(data, options = {}) {
  const errors = {};

  if (!data.full_name) {
    errors.full_name = "Full name is required.";
  }

  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Email format is invalid.";
  } else if (await emailExists(data.email, options.excludedUserId || null)) {
    errors.email = "Email already exists.";
  }

  if (!data.id_role) {
    errors.id_role = "Role is required.";
  } else {
    const role = await getRoleById(data.id_role);

    if (!role) {
      errors.id_role = "Selected role is invalid.";
    } else if (role.code === "CUSTOMER_AGENT") {
      if (!data.id_customer) {
        errors.id_customer = "Customer is required for Customer / Line Agent.";
      } else {
        const customer = await getCustomerById(data.id_customer);
        if (!customer) {
          errors.id_customer = "Selected customer is invalid.";
        }
      }
    }
  }

  if (options.requirePassword && !data.password) {
    errors.password = "Password is required.";
  }

  if (data.password && data.password.length < 6) {
    errors.password = "Password must have at least 6 characters.";
  }

  return errors;
}

export async function createUserFromPayload(payload) {
  const data = normalizeUserPayload(payload);
  const errors = await validateUserPayload(data, { requirePassword: true });

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const passwordHash = await hashPassword(data.password);

  const created = await createUser({
    id_role: data.id_role,
    id_customer: data.id_customer,
    email: data.email,
    password_hash: passwordHash,
    full_name: data.full_name,
    is_active: data.is_active,
  });

  return { ok: true, user: created };
}

export async function updateUserFromPayload(idUser, payload) {
  const existingUser = await findUserById(idUser);

  if (!existingUser) {
    return { ok: false, status: 404, errors: { user: "User not found." } };
  }

  const data = normalizeUserPayload(payload);
  const errors = await validateUserPayload(data, {
    excludedUserId: Number(idUser),
    requirePassword: false,
  });

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const updated = await updateUser(idUser, {
    id_role: data.id_role,
    id_customer: data.id_customer,
    email: data.email,
    full_name: data.full_name,
    is_active: data.is_active,
  });

  if (data.password) {
    const passwordHash = await hashPassword(data.password);
    await updateUserPassword(idUser, passwordHash);
  }

  return { ok: true, user: updated };
}
