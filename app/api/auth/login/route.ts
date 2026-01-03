import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include", // 🔑 recebe Set-Cookie do backend
    });

    const data = await res.json();

    // Se backend devolveu erro, propaga
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Criar resposta para o browser
    const response = NextResponse.json(data);

    // 🔑 Reencaminhar cookie auth_token do backend
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Erro interno no login" },
      { status: 500 }
    );
  }
}
