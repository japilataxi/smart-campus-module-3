"use client";

import { useEffect, useState } from "react";
import { BookOpen, Layers, Users, WalletCards, Server } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    books: 0,
    authors: 0,
    categories: 0,
    loans: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [books, authors, categories, loans] = await Promise.all([
          api.getBooks(),
          api.getAuthors(),
          api.getCategories(),
          api.getLoans(),
        ]);

        setStats({
          books: books.length,
          authors: authors.length,
          categories: categories.length,
          loans: loans.length,
        });
      } catch {
        setStats({ books: 0, authors: 0, categories: 0, loans: 0 });
      }
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

        <p className="mt-4 max-w-3xl text-lg text-white/80">
          This dashboard connects the web interface with the API Gateway,
          authentication service, and library microservice.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Badge text="API Gateway" />
          <Badge text="JWT Auth" />
          <Badge text="RBAC" />
          <Badge text="Library Service" />
        </div>
      </section>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Books"
          value={stats.books}
          icon={<BookOpen />}
          description="Registered books in the catalog"
        />

        <StatCard
          title="Authors"
          value={stats.authors}
          icon={<Users />}
          description="Academic authors available"
        />

        <StatCard
          title="Categories"
          value={stats.categories}
          icon={<Layers />}
          description="Library classification groups"
        />

        <StatCard
          title="Loans"
          value={stats.loans}
          icon={<WalletCards />}
          description="Book loan operations"
        />
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
              <Server size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#002b5c]">
                Distributed Systems Demo
              </h2>
              <p className="text-slate-500">
                Frontend connected only through API Gateway.
              </p>
            </div>
          </div>

          <p className="mt-6 leading-7 text-slate-600">
            The frontend consumes only the API Gateway. Internally, the gateway
            routes requests to auth-service and library-service, keeping the
            user interface decoupled from backend microservices.
          </p>
        </div>

        <div className="rounded-3xl bg-[#002b5c] p-8 text-white shadow-sm">
          <h3 className="text-2xl font-extrabold">Current Role</h3>
          <p className="mt-3 text-white/70">
            Access level assigned by the authentication microservice.
          </p>

          <div className="mt-8 rounded-2xl bg-white/10 p-5 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#f4c430]">
              Role
            </p>
            <p className="mt-2 text-3xl font-extrabold">
              {user?.primaryRole}
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