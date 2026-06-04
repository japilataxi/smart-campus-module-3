"use client";

import { useEffect, useState } from "react";
import { BookOpen, Layers, Users, WalletCards } from "lucide-react";
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
        setStats({
          books: 0,
          authors: 0,
          categories: 0,
          loans: 0,
        });
      }
    }

    loadStats();
  }, []);

  return (
    <AppShell>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-campus-gold">
          Smart Campus Module 3
        </p>

        <h1 className="mt-2 text-4xl font-bold text-campus-navy">
          Welcome, {user?.firstName || "Student"}
        </h1>

        <p className="mt-3 max-w-3xl text-slate-500">
          This dashboard connects the web interface with the API Gateway,
          authentication service, and library microservice.
        </p>
      </div>

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

      <section className="mt-8 rounded-3xl bg-campus-navy p-8 text-white">
        <h2 className="text-2xl font-bold">Distributed Systems Demo</h2>
        <p className="mt-3 max-w-4xl text-white/70">
          The frontend consumes only the API Gateway. Internally, the gateway
          routes requests to auth-service and library-service, keeping the user
          interface decoupled from backend microservices.
        </p>
      </section>
    </AppShell>
  );
}