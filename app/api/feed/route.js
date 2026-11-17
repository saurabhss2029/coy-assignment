import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { getFeed } from "@/lib/service";

export const dynamic = "force-dynamic";

// GET /api/feed -> profiles the user has not swiped on yet
export async function GET() {
  return NextResponse.json({ profiles: getFeed(readDb()) });
}
