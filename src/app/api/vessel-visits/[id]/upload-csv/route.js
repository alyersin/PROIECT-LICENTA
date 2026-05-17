import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getRouteId, readJsonBody, validateContentLength } from "@/lib/apiRequest";
import { validateMutationRequest } from "@/lib/apiSecurity";
import { CSV_UPLOAD_MAX_BYTES } from "@/lib/securityLimits";
import { importCsvForVesselVisit } from "@/services/csvImport.service";

export async function POST(request, { params }) {
  const requestCheck = validateMutationRequest(request);

  if (!requestCheck.ok) {
    return NextResponse.json(
      { error: requestCheck.error },
      { status: requestCheck.status }
    );
  }

  const sizeCheck = validateContentLength(request, CSV_UPLOAD_MAX_BYTES + 10000);

  if (!sizeCheck.ok) {
    return sizeCheck.response;
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

  const result = await importCsvForVesselVisit(user, idResult.id, body.data);

  if (!result.ok) {
    return NextResponse.json(
      { errors: result.errors },
      { status: result.status || 400 }
    );
  }

  return NextResponse.json({
    rowsImported: result.rowsImported,
    uploadedFile: result.uploadedFile,
  });
}
