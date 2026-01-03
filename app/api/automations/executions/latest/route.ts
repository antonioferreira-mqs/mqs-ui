// mqs-ui/app/api/automations/executions/latest/route.ts
import { NextResponse } from "next/server";

const BFF =
  process.env.BFF_BASE_URL || "http://localhost:3001";
const DEFAULT_WORKSPACE_ID =
  process.env.DEFAULT_WORKSPACE_ID || "1";

/**
 * GET /api/automations/executions/latest
 * Proxy Next → BFF
 */
export async function GET(req: Request) {
  try {
    // 🔐 Extrair auth_token do cookie (padrão do projeto)
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const workspaceId = DEFAULT_WORKSPACE_ID;

    // 🔁 Passar query params (ex: ?limit=10)
    const reqUrl = new URL(req.url);
    const url = new URL(
      "/api/automations/executions/latest",
      BFF
    );
    reqUrl.searchParams.forEach((v, k) =>
      url.searchParams.set(k, v)
    );

    const upstream = await fetch(url.toString(), {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
        "x-workspace-id": workspaceId,
        accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Proxy error" },
      { status: 500 }
    );
  }
}
