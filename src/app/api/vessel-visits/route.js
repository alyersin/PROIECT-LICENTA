import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { parseLimit, readJsonBody } from "@/lib/apiRequest";
import { validateMutationRequest } from "@/lib/apiSecurity";
import { DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT } from "@/lib/securityLimits";
import { getVesselVisits } from "@/repositories/vesselVisits.repository";
import { createVesselVisitFromPayload } from "@/services/vesselVisits.service";

export async function GET(request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role_code !== "TERMINAL_OPERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const vesselVisits = await getVesselVisits(
    parseLimit(searchParams.get("limit"), DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT)
  );
  return NextResponse.json({ vesselVisits });
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

  const body = await readJsonBody(request);

  if (!body.ok) {
    return body.response;
  }

  const result = await createVesselVisitFromPayload(user, body.data);

  if (!result.ok) {
    return NextResponse.json(
      { errors: result.errors },
      { status: result.status || 400 }
    );
  }

  return NextResponse.json({ vesselVisit: result.vesselVisit }, { status: 201 });
}
