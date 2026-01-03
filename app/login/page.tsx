"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Se já existir sessão válida, não faz sentido ficar no login
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!cancelled && res.ok) {
          const next = searchParams.get("next");
          router.replace(next || "/dashboard");
        }
      } catch {
        // silencioso: se falhar, fica no login
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);

      const next = searchParams.get("next");
      router.replace(next || "/dashboard");
    } catch {
      setError("Email ou password incorretos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 400 }}>
      <h1>Login</h1>
      <p>Faz login para aceder ao dashboard.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: 20 }}>
          {loading ? "A entrar..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
