import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BFF_BASE_URL =
  process.env.MQS_BFF_BASE_URL ?? "http://localhost:3000";

export async function GET(req: Request) {
  try {
    // ⬇️ AWAIT obrigatório
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Não autenticado" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);

    const upstreamUrl = new URL(
      `${BFF_BASE_URL}/api/analytics/alerts/dashboard`
    );

    // Repassar query params
    url.searchParams.forEach((v, k) =>
      upstreamUrl.searchParams.set(k, v)
    );

    const upstreamRes = await fetch(upstreamUrl.toString(), {
      cache: "no-store",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
        "x-workspace-id": "1", // depois tornamos dinâmico
      },
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
