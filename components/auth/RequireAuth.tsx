"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/user";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const user = await getMe();

        if (!user) {
          router.replace("/login");
          return;
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (err) {
        router.replace("/login");
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return <p>A verificar sessão…</p>;
  }

  return <>{children}</>;
}
