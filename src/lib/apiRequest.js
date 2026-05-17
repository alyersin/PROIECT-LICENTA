import { NextResponse } from "next/server";

export function parsePositiveInteger(value) {
  const text = String(value || "").trim();

  if (!/^[1-9][0-9]*$/.test(text)) {
    return null;
  }

  const number = Number(text);
  return Number.isSafeInteger(number) ? number : null;
}

export async function readJsonBody(request) {
  try {
    const data = await request.json();

    if (!data || Array.isArray(data) || typeof data !== "object") {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "JSON request body must be an object." },
          { status: 400 }
        ),
      };
    }

    return { ok: true, data };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      ),
    };
  }
}

export async function getRouteId(params, name = "id") {
  const resolvedParams = await params;
  const id = parsePositiveInteger(resolvedParams?.[name]);

  if (!id) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid ID." },
        { status: 400 }
      ),
    };
  }

  return { ok: true, id };
}

export function parseLimit(value, defaultLimit, maxLimit) {
  const parsed = parsePositiveInteger(value);

  if (!parsed) {
    return defaultLimit;
  }

  return Math.min(parsed, maxLimit);
}

export function validateContentLength(request, maxBytes) {
  const contentLength = request.headers.get("content-length");

  if (!contentLength) {
    return { ok: true };
  }

  const bytes = Number(contentLength);

  if (!Number.isFinite(bytes) || bytes <= maxBytes) {
    return { ok: true };
  }

  return {
    ok: false,
    response: NextResponse.json(
      { errors: { csv_text: `Request body is too large. Maximum ${maxBytes} bytes are allowed.` } },
      { status: 400 }
    ),
  };
}

export function requireApiUser(user) {
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export function requireApiRole(user, allowedRoles) {
  const unauthorized = requireApiUser(user);

  if (unauthorized) {
    return unauthorized;
  }

  if (!allowedRoles.includes(user.role_code)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
