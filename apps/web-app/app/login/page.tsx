"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("kevin.amaguana@uce.edu.ec");
  const [password, setPassword] = useState("Password123");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      await login({ email, password });
    } catch {
      setError("Invalid credentials or API Gateway is not available.");
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 md:grid-cols-2">
      <section className="hidden bg-campus-navy p-12 text-white md:flex md:flex-col md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-campus-gold p-3 text-campus-navy">
            <GraduationCap />
          </div>
          <h1 className="text-2xl font-bold">Smart Campus</h1>
        </div>

        <div>
          <h2 className="text-5xl font-bold leading-tight">
            University services connected in one platform.
          </h2>
          <p className="mt-6 max-w-xl text-white/70">
            Access library resources, manage loans, and explore academic
            services through a distributed microservices architecture.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
        >
          <h2 className="text-3xl font-bold text-campus-navy">Welcome back</h2>
          <p className="mt-2 text-slate-500">
            Sign in with your institutional account.
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Institutional Email
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-campus-gold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-campus-gold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>
          </div>

          <button className="mt-6 w-full rounded-xl bg-campus-gold px-4 py-3 font-bold text-campus-navy transition hover:opacity-90">
            Login
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Do not have an account?{" "}
            <Link className="font-bold text-campus-navy" href="/register">
              Register
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}