"use client";

import { useRouter } from "next/navigation";
import {
  Server,
  Bell,
  BookOpen,
  Shield,
  Database,
  Cloud,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#eef3f8]">
      <section className="bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] text-white">
        <div className="mx-auto max-w-7xl px-8 py-24">
          <p className="font-bold tracking-[0.3em] text-[#f4c430]">
            SMART CAMPUS MODULE 3
          </p>

          <h1 className="mt-6 text-6xl font-extrabold">
            Distributed Smart Campus Platform
          </h1>

          <p className="mt-6 max-w-3xl text-xl text-white/80">
            University platform built with Microservices, RabbitMQ,
            WebSockets, PostgreSQL, Redis, Docker and AWS.
          </p>

          <div className="mt-10 flex gap-4">
            <button
              onClick={() => router.push("/login")}
              className="rounded-xl bg-[#f4c430] px-6 py-3 font-bold text-[#002b5c]"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/register")}
              className="rounded-xl border border-white px-6 py-3 font-bold"
            >
              Register
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-16">
        <h2 className="text-4xl font-extrabold text-[#002b5c]">
          Microservices
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card
            icon={<Shield />}
            title="Auth Service"
            text="Authentication, JWT and RBAC."
          />

          <Card
            icon={<BookOpen />}
            title="Library Service"
            text="Books, authors, categories and loans."
          />

          <Card
            icon={<Bell />}
            title="Notification Service"
            text="RabbitMQ, Redis and WebSockets."
          />

          <Card
            icon={<Server />}
            title="Incident Service"
            text="Campus incident management."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-16">
        <h2 className="text-4xl font-extrabold text-[#002b5c]">
          Technologies
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3 xl:grid-cols-6">
          {[
            "NestJS",
            "Next.js",
            "PostgreSQL",
            "Redis",
            "RabbitMQ",
            "Docker",
            "Terraform",
            "AWS",
            "Prometheus",
            "Grafana",
          ].map((tech) => (
            <div
              key={tech}
              className="rounded-2xl bg-white p-5 text-center shadow"
            >
              <p className="font-bold">{tech}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-20">
        <div className="rounded-3xl bg-white p-10 shadow">
          <h2 className="text-4xl font-extrabold text-[#002b5c]">
            Architecture
          </h2>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Flow text="Frontend" />
            <Flow text="API Gateway" />
            <Flow text="Microservices" />
            <Flow text="RabbitMQ" />
            <Flow text="Notification Service" />
            <Flow text="WebSocket" />
          </div>
        </div>
      </section>

      <section className="bg-[#002b5c] py-16 text-center text-white">
        <h2 className="text-4xl font-extrabold">
          Smart Campus Team
        </h2>

        <p className="mt-4 text-white/80">
          Kevin Amaguaña • Jefferson Pilataxi • Diego Lema
        </p>
      </section>
    </main>
  );
}

function Card({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow">
      <div className="mb-4 inline-flex rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
        {icon}
      </div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="mt-2 text-slate-600">{text}</p>
    </div>
  );
}

function Flow({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white">
      {text}
    </div>
  );
}