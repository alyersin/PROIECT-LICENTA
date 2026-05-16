export const MARITIME_REQUEST_HEADER = "X-MaritimeOps-Request";
export const MARITIME_REQUEST_HEADER_VALUE = "same-origin";

const UNSAFE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_BLOCK_MS = 15 * 60 * 1000;
const MAX_LOGIN_FAILURES = 5;

const globalForSecurity = globalThis;

function getLoginAttemptsStore() {
  if (!globalForSecurity.maritimeOpsLoginAttempts) {
    globalForSecurity.maritimeOpsLoginAttempts = new Map();
  }

  return globalForSecurity.maritimeOpsLoginAttempts;
}

function normalizeOrigin(value) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getRequestHeader(request, name) {
  const headers = request?.headers;

  if (!headers) {
    return null;
  }

  if (typeof headers.get === "function") {
    return headers.get(name);
  }

  return headers[name] || headers[name.toLowerCase()] || null;
}

function getAllowedOrigins(request) {
  const origins = new Set();
  const requestOrigin = request?.nextUrl?.origin;
  const nextAuthOrigin = normalizeOrigin(process.env.NEXTAUTH_URL);
  const forwardedHost = getRequestHeader(request, "x-forwarded-host");
  const forwardedProto = getRequestHeader(request, "x-forwarded-proto") || "http";
  const host = getRequestHeader(request, "host");

  if (requestOrigin) origins.add(requestOrigin);
  if (nextAuthOrigin) origins.add(nextAuthOrigin);
  if (forwardedHost) origins.add(`${forwardedProto}://${forwardedHost}`);
  if (host) origins.add(`http://${host}`);
  if (host) origins.add(`https://${host}`);

  return origins;
}

function isSameOriginRequest(request) {
  const allowedOrigins = getAllowedOrigins(request);
  const origin = getRequestHeader(request, "origin");
  const referer = getRequestHeader(request, "referer");

  if (origin) {
    return allowedOrigins.has(origin);
  }

  const refererOrigin = normalizeOrigin(referer);

  if (refererOrigin) {
    return allowedOrigins.has(refererOrigin);
  }

  return true;
}

export function mutationRequestHeaders() {
  return {
    [MARITIME_REQUEST_HEADER]: MARITIME_REQUEST_HEADER_VALUE,
  };
}

export function validateMutationRequest(request) {
  if (!request || !UNSAFE_METHODS.includes(request.method)) {
    return { ok: true };
  }

  const requestHeader = getRequestHeader(request, MARITIME_REQUEST_HEADER);

  if (requestHeader !== MARITIME_REQUEST_HEADER_VALUE) {
    return {
      ok: false,
      status: 403,
      error: "Invalid request.",
    };
  }

  if (!isSameOriginRequest(request)) {
    return {
      ok: false,
      status: 403,
      error: "Invalid request origin.",
    };
  }

  return { ok: true };
}

export function getClientIp(request) {
  const forwardedFor = getRequestHeader(request, "x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return getRequestHeader(request, "x-real-ip") || "unknown";
}

export function isLoginRateLimited(email, ip) {
  const key = `${String(email || "").toLowerCase()}|${ip || "unknown"}`;
  const now = Date.now();
  const store = getLoginAttemptsStore();
  const attempt = store.get(key);

  if (!attempt) {
    return false;
  }

  if (attempt.blockedUntil && attempt.blockedUntil > now) {
    return true;
  }

  if (attempt.firstAttemptAt + LOGIN_WINDOW_MS < now) {
    store.delete(key);
  }

  return false;
}

export function recordLoginAttempt(email, ip, success) {
  const key = `${String(email || "").toLowerCase()}|${ip || "unknown"}`;
  const store = getLoginAttemptsStore();

  if (success) {
    store.delete(key);
    return;
  }

  const now = Date.now();
  const existing = store.get(key);
  const attempt =
    existing && existing.firstAttemptAt + LOGIN_WINDOW_MS >= now
      ? existing
      : { count: 0, firstAttemptAt: now, blockedUntil: null };

  attempt.count += 1;

  if (attempt.count >= MAX_LOGIN_FAILURES) {
    attempt.blockedUntil = now + LOGIN_BLOCK_MS;
  }

  store.set(key, attempt);
}
