"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, ShieldCheck, BookOpen, Server } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#002b5c] text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002b5c] via-[#003b7a] to-[#8b0000]" />
        <div className="absolute -right-32 top-0 h-full w-80 rotate-6 bg-[#f4c430]" />

        <div className="relative z-10 p-12">
          <div className="flex items-center gap-5">
            <div className="rounded-full bg-white p-3 shadow-xl">
              <Image
                src="/uce-logo.png"
                alt="Universidad Central del Ecuador"
                width={72}
                height={72}
                priority
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Smart Campus</h1>
              <p className="text-lg font-medium text-[#f4c430]">
                Universidad Central del Ecuador
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-12 pb-20">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
            Module 3
          </p>

          <h2 className="max-w-2xl text-6xl font-extrabold leading-tight">
            University services connected in one platform.
          </h2>

          <div className="mt-8 h-1 w-40 rounded-full bg-[#f4c430]" />

          <p className="mt-8 max-w-xl text-lg leading-8 text-white/85">
            Access library resources, manage loans, and explore academic
            services through a distributed microservices architecture.
          </p>

          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-5">
            <Feature icon={<BookOpen />} title="Library" text="Books and loans" />
            <Feature icon={<ShieldCheck />} title="Secure" text="JWT and RBAC" />
            <Feature icon={<Server />} title="Gateway" text="Microservices API" />
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200"
        >
          <div className="mb-8 flex justify-center lg:hidden">
            <Image
              src="/uce-logo.png"
              alt="Universidad Central del Ecuador"
              width={82}
              height={82}
              priority
            />
          </div>

          <h2 className="text-center text-4xl font-extrabold text-[#002b5c]">
            Welcome back
          </h2>

          <p className="mt-3 text-center text-slate-500">
            Sign in with your institutional account.
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-bold text-[#002b5c]">
                Institutional Email
              </label>

              <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 focus-within:border-[#f4c430]">
                <Mail size={20} className="text-slate-400" />
                <input
                  className="w-full outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-[#002b5c]">
                Password
              </label>

              <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 focus-within:border-[#f4c430]">
                <Lock size={20} className="text-slate-400" />
                <input
                  className="w-full outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </div>
            </div>
          </div>

          <button className="mt-8 w-full rounded-xl bg-[#002b5c] px-4 py-4 font-bold text-white shadow-lg transition hover:bg-[#003b7a]">
            Login
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Do not have an account?{" "}
            <Link className="font-bold text-[#8b0000]" href="/register">
              Register
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-[#f4c430]">
        {icon}
      </div>
      <p className="font-bold">{title}</p>
      <p className="text-sm text-white/70">{text}</p>
    </div>
  );
}