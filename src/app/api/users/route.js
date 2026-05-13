import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUsers } from "@/repositories/users.repository";
import { createUserFromPayload } from "@/services/users.service";

function isAdmin(user) {
  return user?.role_code === "ADMIN";
}

export async function GET() {
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await getUsers();
  return NextResponse.json({ users });
}

export async function POST(request) {
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json();
  const result = await createUserFromPayload(payload);

  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  return NextResponse.json({ user: result.user }, { status: 201 });
}
