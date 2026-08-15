import { NextResponse } from "next/server";
import { deleteInactiveRooms } from "@/lib/cleanup";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorized =
    cronSecret != null
      ? request.headers.get("authorization") === `Bearer ${cronSecret}`
      : request.headers.get("x-vercel-cron") === "1";

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = await deleteInactiveRooms();
  return NextResponse.json({ ok: true, ...result });
}
