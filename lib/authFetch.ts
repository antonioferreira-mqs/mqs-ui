// lib/authFetch.ts

export async function authFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (res.status === 401) {
    // sessão inválida ou expirada
    const next =
      typeof window !== "undefined"
        ? encodeURIComponent(window.location.pathname)
        : "";

    window.location.href = `/login?next=${next}`;
    throw new Error("Sessão expirada");
  }

  return res;
}
