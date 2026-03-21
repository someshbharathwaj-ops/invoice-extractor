import { NextResponse } from "next/server";

import { getBackendStatusSnapshot } from "@/lib/system-status";

export async function GET() {
  const backend = await getBackendStatusSnapshot();

  return NextResponse.json({
    status: "ok",
    service: "invoice-extractor-frontend",
    timestamp: new Date().toISOString(),
    backend
  });
}
