import { NextResponse } from "next/server";

/**
 * Logout local (P9)
 * - Remove o cookie auth_token no domínio do UI
 * - Não depende do BFF
 * - Funciona mesmo se o backend estiver indisponível
 *
 * TODO (P10):
 * Se a autenticação passar a ser centralizada no BFF,
 * este endpoint poderá delegar o logout para o BFF
 * e deixar de manipular cookies localmente.
 */
export async function POST() {
  try {
    const res = NextResponse.json({ status: "ok" });

    // 🔐 Invalida sessão local
    res.cookies.set("auth_token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (err) {
    // 🛑 Falha improvável, mas mantém resposta explícita
    return NextResponse.json(
      { status: "error", message: "Falha ao terminar sessão" },
      { status: 500 }
    );
  }
}
