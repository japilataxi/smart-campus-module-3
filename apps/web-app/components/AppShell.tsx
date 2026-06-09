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
    <main className="flex min-h-screen bg-[#eef3f8]">
      <Sidebar />
      <section className="relative flex-1 overflow-hidden p-6 md:p-10">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#f4c430]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#8b0000]/10 blur-3xl" />
        <div className="relative z-10">{children}</div>
      </section>
    </main>
  );
}