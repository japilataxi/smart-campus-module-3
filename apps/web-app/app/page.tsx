"use client";

import { useRouter } from "next/navigation";
import {
  Server,
  Bell,
  BookOpen,
  Shield,
  Database,
  Cloud,
  Network,
  Activity,
  Lock,
  ArrowRight,
  CheckCircle2,
  Radio,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const microservices = [
    {
      icon: <Shield />,
      title: "Auth Service",
      text: "Authentication, JWT security, user roles and RBAC authorization.",
      tag: "Security",
    },
    {
      icon: <BookOpen />,
      title: "Library Service",
      text: "Books, authors, categories, loans and return management.",
      tag: "Business",
    },
    {
      icon: <Bell />,
      title: "Notification Service",
      text: "RabbitMQ consumer, Redis counters and real-time WebSocket delivery.",
      tag: "Event-driven",
    },
    {
      icon: <Server />,
      title: "Incident Service",
      text: "Campus incident registration, tracking and status management.",
      tag: "Operations",
    },
    {
      icon: <Lock />,
      title: "QR Access Service",
      text: "QR generation, validation, access logs and security events.",
      tag: "Access",
    },
    {
      icon: <Radio />,
      title: "Transport Service",
      text: "Routes, stops, vehicles and transport schedule management.",
      tag: "Mobility",
    },
    {
      icon: <Database />,
      title: "Space Availability",
      text: "Campus spaces, availability status and reservation events.",
      tag: "Resources",
    },
    {
      icon: <Network />,
      title: "API Gateway",
      text: "Central REST entry point for routing requests to backend services.",
      tag: "Gateway",
    },
  ];

  const technologies = [
    "NestJS",
    "Next.js",
    "PostgreSQL",
    "Redis",
    "RabbitMQ",
    "Docker",
    "AWS",
    "Terraform",
    "Prometheus",
    "Grafana",
    "WebSocket",
    "GitHub Actions",
  ];

  const qualityItems = [
    "Health checks",
    "Prometheus metrics",
    "Grafana dashboards",
    "Docker deployment",
    "AWS infrastructure",
    "CI/CD pipeline",
  ];

  return (
    <main className="min-h-screen bg-[#eef3f8] text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-20 h-80 w-80 rounded-full bg-[#f4c430] blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-8 py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-bold tracking-[0.35em] text-[#f4c430]">
              SMART CAMPUS MODULE 3
            </p>

            <h1 className="mt-6 max-w-4xl text-5xl font-extrabold leading-tight md:text-6xl">
              Distributed Smart Campus Platform
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85">
              University platform built with microservices, API Gateway,
              RabbitMQ, WebSockets, PostgreSQL, Redis, Docker, monitoring and
              AWS deployment.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/login")}
                className="rounded-xl bg-[#f4c430] px-6 py-3 font-bold text-[#002b5c] shadow-lg transition hover:scale-105 hover:bg-yellow-300"
              >
                Login
              </button>

              <button
                onClick={() => router.push("/register")}
                className="rounded-xl border border-white/70 px-6 py-3 font-bold text-white transition hover:bg-white hover:text-[#002b5c]"
              >
                Register
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="rounded-xl bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Dashboard
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-2xl font-extrabold">Platform Architecture</h2>

            <div className="mt-6 space-y-4">
              <HeroFlow text="Clients" />
              <HeroFlow text="API Gateway" />
              <HeroFlow text="Business Microservices" />
              <HeroFlow text="RabbitMQ + Notification Service" />
              <HeroFlow text="Redis + WebSocket + PostgreSQL" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-16">
        <SectionTitle
          label="Implemented services"
          title="Microservices"
          description="Each service owns a specific business capability and can be deployed independently."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {microservices.map((service) => (
            <Card key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-16">
        <SectionTitle
          label="Technical stack"
          title="Technologies"
          description="Technologies used to support communication, persistence, deployment and observability."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {technologies.map((tech) => (
            <div
              key={tech}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="font-bold text-[#002b5c]">{tech}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <SectionTitle
            label="Communication model"
            title="Architecture Flow"
            description="Smart Campus combines synchronous REST communication with asynchronous event-driven processing."
          />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Flow text="Frontend" />
            <Arrow />
            <Flow text="API Gateway" />
            <Arrow />
            <Flow text="Microservices" />
            <Arrow />
            <Flow text="RabbitMQ" />
            <Arrow />
            <Flow text="Notification Service" />
            <Arrow />
            <Flow text="WebSocket" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <InfoBox
            icon={<Cloud />}
            title="Cloud Deployment"
            text="Designed for AWS infrastructure using Docker, Terraform and load-balanced services."
          />

          <InfoBox
            icon={<Activity />}
            title="Observability"
            text="Services expose health checks and metrics for Prometheus and Grafana dashboards."
          />

          <InfoBox
            icon={<Database />}
            title="Independent Data"
            text="Microservices keep their own persistence layer using PostgreSQL, Redis and event messages."
          />
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-extrabold text-[#002b5c]">
            QA Readiness
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {qualityItems.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#002b5c] px-8 py-12 text-center text-white">
        <h2 className="text-3xl font-extrabold">Smart Campus Team</h2>

        <p className="mt-3 text-white/80">
          Kevin Amaguaña • Jefferson Pilataxi • Diego Lema
        </p>

        <p className="mt-4 text-sm text-white/60">
          Distributed Systems Project • Module 3
        </p>
      </footer>
    </main>
  );
}

function SectionTitle({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#8b0000]">
        {label}
      </p>

      <h2 className="mt-2 text-4xl font-extrabold text-[#002b5c]">{title}</h2>

      <p className="mt-3 max-w-3xl text-slate-600">{description}</p>
    </div>
  );
}

function Card({
  icon,
  title,
  text,
  tag,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tag: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
          {icon}
        </div>

        <span className="rounded-full bg-[#002b5c]/10 px-3 py-1 text-xs font-bold text-[#002b5c]">
          {tag}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-extrabold text-[#002b5c]">{title}</h3>

      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function Flow({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-[#002b5c] px-5 py-3 text-sm font-bold text-white shadow-sm">
      {text}
    </div>
  );
}

function HeroFlow({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 font-bold text-white">
      {text}
    </div>
  );
}

function Arrow() {
  return <ArrowRight className="hidden h-5 w-5 text-[#8b0000] md:block" />;
}

function InfoBox({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="inline-flex rounded-2xl bg-[#002b5c]/10 p-4 text-[#002b5c]">
        {icon}
      </div>

      <h3 className="mt-5 text-2xl font-extrabold text-[#002b5c]">{title}</h3>

      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </div>
  );
}