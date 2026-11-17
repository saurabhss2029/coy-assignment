import { NextResponse } from "next/server";
import { writeDb } from "@/lib/db";
import { buildSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

// POST /api/reset -> demo helper: wipes swipes and matches
export async function POST() {
  writeDb(buildSeed());
  return NextResponse.json({ ok: true });
}
