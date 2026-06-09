"use client";

import { AppShell } from "@/components/AppShell";

export default function RolesPage() {
  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          RBAC
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">Roles</h1>

        <p className="mt-4 max-w-3xl text-lg text-white/80">
          Smart Campus uses role-based access control for students, librarians,
          and administrators.
        </p>
      </section>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <RoleCard
          title="Student"
          description="Can view books, request loans, and access personal profile."
        />
        <RoleCard
          title="Librarian"
          description="Can manage books, authors, categories, and loans."
        />
        <RoleCard
          title="Admin"
          description="Can manage users, roles, and all library operations."
        />
      </div>
    </AppShell>
  );
}

function RoleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-2xl font-extrabold text-[#002b5c]">{title}</h2>
      <p className="mt-4 text-slate-600">{description}</p>
    </div>
  );
}