import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { comparePassword, hashPassword } from "@/lib/passwords";
import { findUserByEmail, updateUserPassword } from "@/repositories/users.repository";

export async function POST(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const currentPassword = String(payload.current_password || "");
  const newPassword = String(payload.new_password || "");
  const confirmPassword = String(payload.confirm_password || "");

  const errors = {};

  if (!currentPassword) {
    errors.current_password = "Current password is required.";
  }

  if (!newPassword) {
    errors.new_password = "New password is required.";
  } else if (newPassword.length < 6) {
    errors.new_password = "New password must have at least 6 characters.";
  }

  if (!confirmPassword) {
    errors.confirm_password = "Password confirmation is required.";
  } else if (newPassword !== confirmPassword) {
    errors.confirm_password = "Password confirmation does not match.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const userWithPassword = await findUserByEmail(currentUser.email);

  if (!userWithPassword || !userWithPassword.is_active) {
    return NextResponse.json({ error: "User not found or inactive." }, { status: 404 });
  }

  const currentPasswordOk = await comparePassword(
    currentPassword,
    userWithPassword.password_hash
  );

  if (!currentPasswordOk) {
    return NextResponse.json(
      { errors: { current_password: "Current password is incorrect." } },
      { status: 400 }
    );
  }

  const newPasswordHash = await hashPassword(newPassword);
  await updateUserPassword(currentUser.id_user, newPasswordHash);

  return NextResponse.json({ ok: true });
}
