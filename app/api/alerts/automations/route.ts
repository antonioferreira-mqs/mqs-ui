// app/api/alerts/automations/route.ts
import { NextResponse } from "next/server";

const BFF = process.env.BFF_BASE_URL || "http://localhost:3000";
const DEFAULT_WORKSPACE_ID = process.env.DEFAULT_WORKSPACE_ID || "1";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const workspaceId = DEFAULT_WORKSPACE_ID;

  const upstream = await fetch(`${BFF}/api/alerts/automations`, {
    method: "GET",
    headers: {
      cookie,
      "x-workspace-id": workspaceId,
    },
    cache: "no-store",
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
