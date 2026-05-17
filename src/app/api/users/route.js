import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { parseLimit, readJsonBody, requireApiRole } from "@/lib/apiRequest";
import { validateMutationRequest } from "@/lib/apiSecurity";
import { DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT } from "@/lib/securityLimits";
import { getUsers } from "@/repositories/users.repository";
import { createUserFromPayload } from "@/services/users.service";

export async function GET(request) {
  const user = await getCurrentUser();
  const authResponse = requireApiRole(user, ["ADMIN"]);

  if (authResponse) {
    return authResponse;
  }

  const { searchParams } = new URL(request.url);
  const users = await getUsers(
    parseLimit(searchParams.get("limit"), DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT)
  );
  return NextResponse.json({ users });
}

export async function POST(request) {
  const requestCheck = validateMutationRequest(request);

  if (!requestCheck.ok) {
    return NextResponse.json(
      { error: requestCheck.error },
      { status: requestCheck.status }
    );
  }

  const user = await getCurrentUser();
  const authResponse = requireApiRole(user, ["ADMIN"]);

  if (authResponse) {
    return authResponse;
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return body.response;
  }

  const result = await createUserFromPayload(body.data);

  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  return NextResponse.json({ user: result.user }, { status: 201 });
}
