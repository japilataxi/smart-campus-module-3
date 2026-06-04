"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Loading } from "./Loading";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <Loading />;

  if (!user) return null;

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <section className="flex-1 p-6 md:p-10">{children}</section>
    </main>
  );
}