import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { validateMutationRequest } from "@/lib/apiSecurity";
import { importCsvForVesselVisit } from "@/services/csvImport.service";

export async function POST(request, { params }) {
  const requestCheck = validateMutationRequest(request);

  if (!requestCheck.ok) {
    return NextResponse.json(
      { error: requestCheck.error },
      { status: requestCheck.status }
    );
  }

  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const result = await importCsvForVesselVisit(user, id, payload);

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
