"use client";

import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <AppShell>
      <h1 className="text-4xl font-bold text-campus-navy">User Profile</h1>
      <p className="mt-2 text-slate-500">
        Authenticated information loaded from the API Gateway.
      </p>

      <section className="mt-8 max-w-2xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-campus-navy text-3xl font-bold text-campus-gold">
          {user?.firstName?.charAt(0) || "U"}
        </div>

        <div className="space-y-4">
          <ProfileRow label="First Name" value={user?.firstName} />
          <ProfileRow label="Last Name" value={user?.lastName} />
          <ProfileRow label="Email" value={user?.email} />
          <ProfileRow label="Role" value={user?.role || "student"} />
        </div>
      </section>
    </AppShell>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-bold text-campus-navy">{value || "Not available"}</p>
    </div>
  );
}