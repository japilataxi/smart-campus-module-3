"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Building2,
  BusFront,
  Layers,
  QrCode,
  Server,
  Shield,
  Users,
  WalletCards,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    authors: 0,
    categories: 0,
    loans: 0,
    incidents: 0,
    qrLogs: 0,
    routes: 0,
    availableSpaces: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const results = await Promise.allSettled([
        api.getUsers(),
        api.getBooks(),
        api.getAuthors(),
        api.getCategories(),
        api.getLoans(),
        api.getIncidents(),
        api.getQrAccessLogs(),
        api.getTransportRoutes(),
        api.getAvailableSpaces(),
      ]);

      const getLength = (index: number) =>
        results[index].status === "fulfilled" && Array.isArray(results[index].value)
          ? results[index].value.length
          : 0;

      setStats({
        users: getLength(0),
        books: getLength(1),
        authors: getLength(2),
        categories: getLength(3),
        loans: getLength(4),
        incidents: getLength(5),
        qrLogs: getLength(6),
        routes: getLength(7),
        availableSpaces: getLength(8),
      });
    }

    loadStats();
  }, []);

  return (
    <AppShell>
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Smart Campus Module 3
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">
          Welcome, {user?.firstName || "Student"}
        </h1>

        <p className="mt-4 max-w-4xl text-lg text-white/80">
          This dashboard provides an overview of the Smart Campus platform, 
          including institutional services, operational metrics and user 
          access information.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Badge text="API Gateway" />
          <Badge text="Microservices" />
          <Badge text="JWT Auth" />
          <Badge text="RBAC" />
          <Badge text="RabbitMQ" />
          <Badge text="WebSocket" />
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-5">
          <h2 className="text-3xl font-extrabold text-[#002b5c]">
            Platform Overview
          </h2>
          <p className="mt-2 text-slate-600">
            General indicators collected from the available Smart Campus modules.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Users"
            value={stats.users}
            icon={<Users />}
            description="Registered institutional users"
          />

          <StatCard
            title="Books"
            value={stats.books}
            icon={<BookOpen />}
            description="Registered books in Library Service"
          />

          <StatCard
            title="Loans"
            value={stats.loans}
            icon={<WalletCards />}
            description="Book loan operations"
          />

          <StatCard
            title="Incidents"
            value={stats.incidents}
            icon={<AlertTriangle />}
            description="Campus incident reports"
          />

          <StatCard
            title="QR Logs"
            value={stats.qrLogs}
            icon={<QrCode />}
            description="QR access validation records"
          />

          <StatCard
            title="Routes"
            value={stats.routes}
            icon={<BusFront />}
            description="Transport routes available"
          />

          <StatCard
            title="Spaces"
            value={stats.availableSpaces}
            icon={<Building2 />}
            description="Available campus spaces"
          />

          <StatCard
            title="Categories"
            value={stats.categories}
            icon={<Layers />}
            description="Library classification groups"
          />
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 xl:col-span-2">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
              <Server size={32} />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#002b5c]">
                Microservices Summary
              </h2>
              <p className="text-slate-500">
                Main services available in the Smart Campus platform.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ServiceCard icon={<Shield />} title="Auth Service" text="Authentication, JWT and roles." />
            <ServiceCard icon={<BookOpen />} title="Library Service" text="Books, authors, categories and loans." />
            <ServiceCard icon={<Bell />} title="Notification Service" text="Real-time events and notifications." />
            <ServiceCard icon={<AlertTriangle />} title="Incident Service" text="Campus incident management." />
            <ServiceCard icon={<QrCode />} title="QR Access Service" text="QR generation, validation and logs." />
            <ServiceCard icon={<BusFront />} title="Transport Service" text="Routes, stops and schedules." />
            <ServiceCard icon={<Building2 />} title="Space Availability Service" text="Campus spaces and availability." />
          </div>
        </div>

        <div className="rounded-3xl bg-[#002b5c] p-8 text-white shadow-sm">
          <h3 className="text-2xl font-extrabold">Current Role</h3>

          <p className="mt-3 text-white/70">
            Access level assigned by the authentication service.
          </p>

          <div className="mt-8 rounded-2xl bg-white/10 p-5 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#f4c430]">
              Role
            </p>

            <p className="mt-2 text-3xl font-extrabold capitalize">
              {user?.primaryRole || "student"}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-white/10 p-5">
            <p className="font-bold text-[#f4c430]">System Information</p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              If a microservice is unavailable, its metric may appear as zero
              without affecting the rest of the dashboard.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
      {text}
    </span>
  );
}

function ServiceCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
      <div className="mb-3 inline-flex rounded-xl bg-[#f4c430]/20 p-3 text-[#002b5c]">
        {icon}
      </div>

      <h3 className="font-extrabold text-[#002b5c]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}