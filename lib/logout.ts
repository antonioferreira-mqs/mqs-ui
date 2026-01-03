export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  // redirect forçado (evita estado zombie)
  window.location.href = "/login";
}

