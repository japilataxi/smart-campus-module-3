"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User, Mail, Lock, GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "example@uce.edu.ec",
    password: "Password123",
  });

  const [error, setError] = useState("");

  function updateField(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!form.email.endsWith("@uce.edu.ec")) {
      setError("Only institutional emails ending in @uce.edu.ec are allowed.");
      return;
    }

    try {
      await register(form);
    } catch {
      setError("Registration failed. Please check the API Gateway.");
    }
  }

  return (
    <main className="min-h-screen bg-[#eef3f8] lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#002b5c] text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002b5c] via-[#003b7a] to-[#8b0000]" />
        <div className="absolute -right-28 top-0 h-full w-72 rotate-6 bg-[#f4c430]" />

        <div className="relative z-10 p-12">
          <div className="flex items-center gap-5">
            <div className="rounded-full bg-white p-3 shadow-xl">
              <Image src="/uce-logo.png" alt="UCE Logo" width={76} height={76} />
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
            Create account
          </p>

          <h2 className="max-w-2xl text-6xl font-extrabold leading-tight">
            Join the university digital ecosystem.
          </h2>

          <div className="mt-8 h-1 w-40 rounded-full bg-[#f4c430]" />

          <p className="mt-8 max-w-xl text-lg leading-8 text-white/85">
            Register with your institutional email and access library services,
            loans, and academic resources from one platform.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl rounded-3xl bg-white p-12 shadow-2xl ring-1 ring-slate-200"
        >
          <div className="mb-6 flex justify-center lg:hidden">
            <Image src="/uce-logo.png" alt="UCE Logo" width={90} height={90} />
          </div>

          <h1 className="text-center text-5xl font-extrabold text-[#002b5c]">
            Create Account
          </h1>

          <p className="mt-4 text-center text-lg text-slate-500">
            Use your institutional email to register.
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Input
              icon={<User size={20} />}
              placeholder="First Name"
              value={form.firstName}
              onChange={(value) => updateField("firstName", value)}
            />

            <Input
              icon={<User size={20} />}
              placeholder="Last Name"
              value={form.lastName}
              onChange={(value) => updateField("lastName", value)}
            />

            <Input
              icon={<Mail size={20} />}
              placeholder="Institutional Email"
              type="email"
              value={form.email}
              onChange={(value) => updateField("email", value)}
              className="md:col-span-2"
            />

            <Input
              icon={<Lock size={20} />}
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(value) => updateField("password", value)}
              className="md:col-span-2"
            />
          </div>

          <button className="mt-8 w-full rounded-xl bg-[#002b5c] px-5 py-5 text-lg font-bold text-white shadow-lg transition hover:bg-[#003b7a]">
            Register
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-bold text-[#8b0000]" href="/login">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function Input({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-slate-300 px-5 py-4 focus-within:border-[#f4c430] ${className}`}
    >
      <span className="text-slate-400">{icon}</span>
      <input
        className="w-full outline-none"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}