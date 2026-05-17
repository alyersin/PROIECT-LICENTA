import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRouteId, readJsonBody } from "@/lib/apiRequest";
import { validateMutationRequest } from "@/lib/apiSecurity";
import { getVesselVisitById } from "@/repositories/vesselVisits.repository";
import { updateVesselVisitFromPayload } from "@/services/vesselVisits.service";

export async function GET(_request, { params }) {
  const idResult = await getRouteId(params);

  if (!idResult.ok) {
    return idResult.response;
  }

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role_code !== "TERMINAL_OPERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vesselVisit = await getVesselVisitById(idResult.id);

  if (!vesselVisit) {
    return NextResponse.json({ error: "Vessel visit not found." }, { status: 404 });
  }

  return NextResponse.json({ vesselVisit });
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

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return body.response;
  }

  const result = await updateVesselVisitFromPayload(user, idResult.id, body.data);

  if (!result.ok) {
    return NextResponse.json(
      { errors: result.errors },
      { status: result.status || 400 }
    );
  }

  return NextResponse.json({ vesselVisit: result.vesselVisit });
}
