import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { confirmDischargeOperation } from "@/services/vesselOperations.service";

export async function POST(request, { params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const result = await confirmDischargeOperation(user, id, payload);

  if (!result.ok) {
    return NextResponse.json(
      { errors: result.errors },
      { status: result.status || 400 }
    );
  }

  return NextResponse.json({
    operation: result.confirmedOperation,
    container: result.container,
  });
}
