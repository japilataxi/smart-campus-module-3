"use client";

import {
  BookOpen,
  CheckCircle2,
  LibraryBig,
  Shield,
  User,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export default function RolesPage() {
  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Role-Based Access Control
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">Roles & Permissions</h1>

        <p className="mt-4 max-w-3xl text-lg text-white/80">
          Smart Campus uses roles to control access to platform features and
          protect administrative operations.
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <RoleCard
          icon={<User />}
          title="Student"
          badgeClass="bg-green-50 text-green-700 ring-green-200"
          description="Basic access for academic users."
          permissions={[
            "View book catalog",
            "Request library loans",
            "View personal profile",
            "Access campus services",
          ]}
        />

        <RoleCard
          icon={<LibraryBig />}
          title="Librarian"
          badgeClass="bg-blue-50 text-blue-700 ring-blue-200"
          description="Operational access for library management."
          permissions={[
            "Manage books",
            "Manage authors",
            "Manage categories",
            "Review and manage loans",
          ]}
        />

        <RoleCard
          icon={<Shield />}
          title="Admin"
          badgeClass="bg-red-50 text-red-700 ring-red-200"
          description="Full access for platform administration."
          permissions={[
            "Manage users",
            "Assign roles",
            "Access all modules",
            "Review platform operations",
          ]}
        />
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
            <Users size={32} />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-[#002b5c]">
              RBAC Summary
            </h2>
            <p className="text-slate-500">
              Role permissions are used by the frontend and backend to protect
              routes, actions and management features.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <SummaryItem title="Student" text="Default role for new users." />
          <SummaryItem title="Librarian" text="Can manage library resources." />
          <SummaryItem title="Admin" text="Can manage users and roles." />
        </div>
      </section>
    </AppShell>
  );
}

function RoleCard({
  icon,
  title,
  description,
  permissions,
  badgeClass,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  permissions: string[];
  badgeClass: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
          {icon}
        </div>

        <span
          className={`rounded-full px-4 py-1 text-sm font-bold ring-1 ${badgeClass}`}
        >
          {title}
        </span>
      </div>

      <h2 className="text-2xl font-extrabold text-[#002b5c]">{title}</h2>

      <p className="mt-3 leading-7 text-slate-600">{description}</p>

      <div className="mt-6 space-y-3">
        {permissions.map((permission) => (
          <div key={permission} className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-green-600" />
            <span className="text-sm font-medium text-slate-600">
              {permission}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
      <p className="font-extrabold text-[#002b5c]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}