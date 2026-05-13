import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { findUserById, deactivateUser } from "@/repositories/users.repository";
import { updateUserFromPayload } from "@/services/users.service";

function isAdmin(user) {
  return user?.role_code === "ADMIN";
}

export async function GET(_request, { params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const selectedUser = await findUserById(id);

  if (!selectedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: selectedUser });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json();
  const result = await updateUserFromPayload(id, payload);

  if (!result.ok) {
    return NextResponse.json(
      { errors: result.errors },
      { status: result.status || 400 }
    );
  }

  return NextResponse.json({ user: result.user });
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await deactivateUser(id);

  if (!result) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
