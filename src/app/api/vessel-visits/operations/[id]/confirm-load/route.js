import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { confirmLoadOperation } from "@/services/vesselOperations.service";

export async function POST(_request, { params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await confirmLoadOperation(user, id);

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
