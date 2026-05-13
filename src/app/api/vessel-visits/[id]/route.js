import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getVesselVisitById } from "@/repositories/vesselVisits.repository";
import { updateVesselVisitFromPayload } from "@/services/vesselVisits.service";

export async function GET(_request, { params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role_code !== "TERMINAL_OPERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vesselVisit = await getVesselVisitById(id);

  if (!vesselVisit) {
    return NextResponse.json({ error: "Vessel visit not found." }, { status: 404 });
  }

  return NextResponse.json({ vesselVisit });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const result = await updateVesselVisitFromPayload(user, id, payload);

  if (!result.ok) {
    return NextResponse.json(
      { errors: result.errors },
      { status: result.status || 400 }
    );
  }

  return NextResponse.json({ vesselVisit: result.vesselVisit });
}
