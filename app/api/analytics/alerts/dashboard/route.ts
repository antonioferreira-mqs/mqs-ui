import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BFF_BASE_URL =
  process.env.MQS_BFF_BASE_URL ?? "http://localhost:3000";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Não autenticado" },
        { status: 401 }
      );
    }

    // ⚠️ Workspace fixo por agora (V2.8)
    const workspaceId = "1";

    // Repasse de query params (?window=30d, etc.)
    const url = new URL(req.url);
    const upstreamUrl = new URL(
      `${BFF_BASE_URL}/api/analytics/alerts/dashboard`
    );

    url.searchParams.forEach((v, k) =>
      upstreamUrl.searchParams.set(k, v)
    );

    const upstreamRes = await fetch(upstreamUrl.toString(), {
      headers: {
        authorization: `Bearer ${token}`,
        "x-workspace-id": workspaceId,
        accept: "application/json",
      },
      cache: "no-store",
    });

    const payload = await upstreamRes.json();

    return NextResponse.json(payload, {
      status: upstreamRes.status,
    });
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Proxy error" },
      { status: 500 }
    );
  }
}
