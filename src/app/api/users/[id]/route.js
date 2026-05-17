import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRouteId, readJsonBody, requireApiRole } from "@/lib/apiRequest";
import { validateMutationRequest } from "@/lib/apiSecurity";
import { findUserById } from "@/repositories/users.repository";
import { deactivateUserFromPayload, updateUserFromPayload } from "@/services/users.service";

export async function GET(_request, { params }) {
  const idResult = await getRouteId(params);

  if (!idResult.ok) {
    return idResult.response;
  }

  const user = await getCurrentUser();
  const authResponse = requireApiRole(user, ["ADMIN"]);

  if (authResponse) {
    return authResponse;
  }

  const selectedUser = await findUserById(idResult.id);

  if (!selectedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: selectedUser });
}

export async function PATCH(request, { params }) {
  const requestCheck = validateMutationRequest(request);

  if (!requestCheck.ok) {
    return NextResponse.json(
      { error: requestCheck.error },
      { status: requestCheck.status }
    );
  }

  const idResult = await getRouteId(params);

  if (!idResult.ok) {
    return idResult.response;
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

  const result = await updateUserFromPayload(idResult.id, body.data, user);

  if (!result.ok) {
    return NextResponse.json(
      { errors: result.errors },
      { status: result.status || 400 }
    );
  }

  return NextResponse.json({ user: result.user });
}

export async function DELETE(request, { params }) {
  const requestCheck = validateMutationRequest(request);

  if (!requestCheck.ok) {
    return NextResponse.json(
      { error: requestCheck.error },
      { status: requestCheck.status }
    );
  }

  const idResult = await getRouteId(params);

  if (!idResult.ok) {
    return idResult.response;
  }

  const user = await getCurrentUser();
  const authResponse = requireApiRole(user, ["ADMIN"]);

  if (authResponse) {
    return authResponse;
  }

  const result = await deactivateUserFromPayload(idResult.id, user);

  if (!result.ok) {
    return NextResponse.json(
      { errors: result.errors },
      { status: result.status || 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
