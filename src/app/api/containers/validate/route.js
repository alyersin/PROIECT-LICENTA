import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { validateMutationRequest } from "@/lib/apiSecurity";
import { validateContainerForOperation } from "@/services/containers.service";

export async function POST(request) {
  const requestCheck = validateMutationRequest(request);

  if (!requestCheck.ok) {
    return NextResponse.json(
      { error: requestCheck.error },
      { status: requestCheck.status }
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["GATE_OPERATOR", "TERMINAL_OPERATOR"].includes(user.role_code)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json();
  const result = await validateContainerForOperation(payload.container_no);

  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  return NextResponse.json(result);
}
