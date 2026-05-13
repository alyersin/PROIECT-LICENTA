import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createVessel, getAllVessels } from "@/repositories/vessels.repository";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role_code !== "TERMINAL_OPERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vessels = await getAllVessels();
  return NextResponse.json({ vessels });
}

export async function POST(request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role_code !== "TERMINAL_OPERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json();
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
