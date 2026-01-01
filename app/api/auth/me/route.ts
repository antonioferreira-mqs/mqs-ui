import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BFF_BASE_URL =
  process.env.MQS_BFF_BASE_URL ?? "http://localhost:3000";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { status: "error", message: "Não autenticado" },
      { status: 401 }
    );
  }

  // ⚠️ Workspace fixo por agora (V2.8)
  // Depois será dinâmico (selector / middleware)
  const workspaceId = "1";

  const res = await fetch(`${BFF_BASE_URL}/api/auth/me`, {
    headers: {
      authorization: `Bearer ${token}`,
      "x-workspace-id": workspaceId,
    },
    cache: "no-store",
  });

  const payload = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { status: "error", message: "Sessão inválida" },
      { status: res.status }
    );
  }

  return NextResponse.json(payload, { status: 200 });
}
