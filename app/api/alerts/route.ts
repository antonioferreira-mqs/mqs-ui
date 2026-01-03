// mqs-ui/app/api/alerts/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // cookie auth_token (mesmo padrão de automations)
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const workspaceId =
      req.headers.get("x-workspace-id") ||
      (process.env.DEFAULT_WORKSPACE_ID ?? "1");

    const upstreamBase =
      process.env.BFF_BASE_URL || "http://localhost:3001";

    const reqUrl = new URL(req.url);
    const url = new URL("/api/alerts", upstreamBase);
    reqUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

    const upstreamRes = await fetch(url.toString(), {
      headers: {
        authorization: `Bearer ${token}`,
        "x-workspace-id": String(workspaceId),
        accept: "application/json",
      },
      cache: "no-store",
    });

    const payload = await upstreamRes.json();

    return NextResponse.json(payload, { status: upstreamRes.status });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Proxy error" },
      { status: 500 }
    );
  }
}
