import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { getMatches } from "@/lib/service";

export const dynamic = "force-dynamic";

// GET /api/matches -> mutual matches only, newest first
export async function GET() {
  return NextResponse.json({ matches: getMatches(readDb()) });
}
