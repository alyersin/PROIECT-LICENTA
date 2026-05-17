import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readJsonBody } from "@/lib/apiRequest";
import { validateMutationRequest } from "@/lib/apiSecurity";
import { registerGateOut } from "@/services/gate.service";

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

  const body = await readJsonBody(request);

  if (!body.ok) {
    return body.response;
  }

  const result = await registerGateOut(user, body.data);

  if (!result.ok) {
    return NextResponse.json(
      { errors: result.errors },
      { status: result.status || 400 }
    );
  }

  return NextResponse.json(
    {
      container: result.container,
      gateTransaction: result.gateTransaction,
    },
    { status: 201 }
  );
}
