// app/api/alerts/automations/run/route.ts
import { NextResponse } from "next/server";

const BFF = process.env.BFF_BASE_URL || "http://localhost:3000";
const DEFAULT_WORKSPACE_ID = process.env.DEFAULT_WORKSPACE_ID || "1";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const workspaceId = DEFAULT_WORKSPACE_ID;

  const body = await req.text(); // pode ser {} ou { ruleId: number }

  const upstream = await fetch(`${BFF}/api/alerts/automations/run`, {
    method: "POST",
    headers: {
      cookie,
      "x-workspace-id": workspaceId,
      "Content-Type": "application/json",
    },
    body,
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
