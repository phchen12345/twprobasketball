"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "../components/auth/AuthProvider";
import { verifyAdminAccess } from "../lib/authClient";

type AdminState = "loading" | "authorized";

export default function AdminPage() {
  const router = useRouter();
  const { accessToken, isLoading, user } = useAuth();
  const [state, setState] = useState<AdminState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      if (isLoading) {
        return;
      }

      if (!accessToken || user?.role !== "admin") {
        router.replace("/");
        return;
      }

      try {
        await verifyAdminAccess(accessToken);

        if (!cancelled) {
          setState("authorized");
        }
      } catch {
        router.replace("/");
      }
    }

    void checkAccess();

    return () => {
      cancelled = true;
    };
  }, [accessToken, isLoading, router, user?.role]);

  return (
    <main className="min-h-screen bg-[#0b0d12] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Link href="/">
          <Button variant="pill" size="pill">
            回首頁
          </Button>
        </Link>

        <section className="rounded-2xl border border-white/10 bg-white/8 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold">管理後台</h1>

          {state === "loading" ? (
            <p className="mt-4 text-sm text-white/70">驗證權限中</p>
          ) : (
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              <p>已通過管理員權限驗證。</p>
              <p>目前管理員：{user?.email}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
