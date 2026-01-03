// mqs-ui/lib/auth.ts

export async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 🔑 OBRIGATÓRIO para cookies
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Credenciais inválidas");
  }

  // O cookie auth_token é definido pelo backend
  // Não é necessário guardar token no client
  return res.json();
}

export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  // opcional: força invalidação client-side
  // router.replace("/login");
}

