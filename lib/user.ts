export async function getMe() {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();

    // 🔒 Validação mínima do "user"
    if (!data || !data.id || !data.email) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}
