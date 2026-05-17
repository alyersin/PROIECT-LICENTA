import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { parseLimit, readJsonBody } from "@/lib/apiRequest";
import { validateMutationRequest } from "@/lib/apiSecurity";
import { DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT } from "@/lib/securityLimits";
import { createVessel, getAllVessels } from "@/repositories/vessels.repository";

export async function GET(request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role_code !== "TERMINAL_OPERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const vessels = await getAllVessels(
    parseLimit(searchParams.get("limit"), DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT)
  );
  return NextResponse.json({ vessels });
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

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role_code !== "TERMINAL_OPERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return body.response;
  }

  const payload = body.data;
  const name = String(payload.name || "").trim();
  const imo = String(payload.imo || "").trim();

  const errors = {};

  if (!name) {
    errors.name = "Vessel name is required.";
  }

  if (!imo) {
    errors.imo = "IMO number is required.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const vessel = await createVessel({ name, imo });
  return NextResponse.json({ vessel }, { status: 201 });
}
