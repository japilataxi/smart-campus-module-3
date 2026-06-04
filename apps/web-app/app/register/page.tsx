"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "Kevin",
    lastName: "Amaguaña",
    email: "kevin.amaguana@uce.edu.ec",
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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-campus-navy">
          Create Smart Campus Account
        </h1>
        <p className="mt-2 text-slate-500">
          Register using your university institutional email.
        </p>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-campus-gold"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
          />

          <input
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-campus-gold"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
          />

          <input
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-campus-gold md:col-span-2"
            placeholder="Institutional Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />

          <input
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-campus-gold md:col-span-2"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
          />
        </div>

        <button className="mt-6 w-full rounded-xl bg-campus-gold px-4 py-3 font-bold text-campus-navy transition hover:opacity-90">
          Register
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-bold text-campus-navy" href="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}