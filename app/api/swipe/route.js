import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { applySwipe } from "@/lib/service";

export const dynamic = "force-dynamic";

// POST /api/swipe { profileId, direction: "like" | "pass" } -> { match, profile? }
export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch { /* handled by validation below */ }
  const out = await withDb((db) => applySwipe(db, body.profileId, body.direction));
  return NextResponse.json(out.body, { status: out.status });
}
