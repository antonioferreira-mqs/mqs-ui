import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // cookie auth_token (igual ao middleware)
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    // workspaceId: tenta header (se já usares) e fallback para 1
    const workspaceId =
      req.headers.get("x-workspace-id") ||
      (process.env.DEFAULT_WORKSPACE_ID ?? "1");

    // base URL do BFF (configurável)
    const upstreamBase =
      process.env.BFF_BASE_URL || "http://localhost:3000";

    const url = new URL("/api/automations/overview", upstreamBase);

    // passthrough de query params (ex: ?windowMinutes=120)
    const reqUrl = new URL(req.url);
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
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Proxy error" },
      { status: 500 }
    );
  }
}
