export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Credenciais inválidas");
  }

  const json = await res.json();

  // 🔐 Guardar token (decisão conservadora e explícita)
  if (json?.token) {
    localStorage.setItem("auth_token", json.token);
  } else {
    throw new Error("Token não recebido do servidor");
  }

  return json;
}
