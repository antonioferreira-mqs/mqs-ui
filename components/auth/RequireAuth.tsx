"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getMe } from "@/lib/user";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const user = await getMe();

        if (!user) {
          router.replace(
            `/login?next=${encodeURIComponent(pathname)}`
          );
          return;
        }

        if (mounted) {
          setLoading(false);
        }
      } catch {
        router.replace(
          `/login?next=${encodeURIComponent(pathname)}`
        );
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router, pathname]);

  if (loading) {
    return <p>A verificar sessão…</p>;
  }

  return <>{children}</>;
}
