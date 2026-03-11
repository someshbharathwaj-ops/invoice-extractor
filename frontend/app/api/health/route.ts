import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "invoice-extractor-frontend",
    timestamp: new Date().toISOString()
  });
}
