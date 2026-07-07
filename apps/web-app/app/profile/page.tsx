"use client";

import { Mail, Shield, UserRound, IdCard } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";

function formatRoles(user: any) {
  const roles = user?.normalizedRoles || user?.roles || [];

  if (!Array.isArray(roles) || roles.length === 0) return "student";

  return roles
    .map((role: any) => (typeof role === "string" ? role : role?.name))
    .filter(Boolean)
    .join(", ");
}

export default function ProfilePage() {
  const { user } = useAuth();

  const initials = `${user?.firstName?.charAt(0) || "U"}${
    user?.lastName?.charAt(0) || ""
  }`;

  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          User Account
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">User Profile</h1>

        <p className="mt-4 max-w-3xl text-lg text-white/80">
          Review your authenticated account information, institutional email and
          assigned access role.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#002b5c] text-4xl font-extrabold text-[#f4c430] shadow-lg">
            {initials}
          </div>

          <h2 className="mt-6 text-2xl font-extrabold text-[#002b5c]">
            {user?.firstName || "User"} {user?.lastName || ""}
          </h2>

          <p className="mt-2 text-slate-500">{user?.email || "Not available"}</p>

          <span className="mt-5 inline-flex rounded-full bg-[#f4c430]/20 px-4 py-2 text-sm font-bold capitalize text-[#002b5c]">
            {user?.primaryRole || "student"}
          </span>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-extrabold text-[#002b5c]">
            Account Information
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            This information is used to identify your account and control access
            to Smart Campus services.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ProfileRow icon={<UserRound />} label="First Name" value={user?.firstName} />
            <ProfileRow icon={<UserRound />} label="Last Name" value={user?.lastName} />
            <ProfileRow icon={<Mail />} label="Institutional Email" value={user?.email} />
            <ProfileRow icon={<Shield />} label="Assigned Roles" value={formatRoles(user)} />
            <ProfileRow icon={<IdCard />} label="Primary Role" value={user?.primaryRole || "student"} />
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
      <div className="mb-3 inline-flex rounded-xl bg-[#f4c430]/20 p-3 text-[#002b5c]">
        {icon}
      </div>

      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-1 font-extrabold capitalize text-[#002b5c]">
        {value || "Not available"}
      </p>
    </div>
  );
}