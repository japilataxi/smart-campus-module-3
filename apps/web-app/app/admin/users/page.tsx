"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { AppUser, UserRole } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

const roles: UserRole[] = ["student", "librarian", "admin"];

function normalizeUserRoles(user: AppUser): UserRole[] {
  if (!user.roles || !Array.isArray(user.roles)) return ["student"];

  const normalized = user.roles
    .map((role: any) => {
      if (typeof role === "string") return role;
      return role?.name;
    })
    .filter((role: string) => roles.includes(role as UserRole));

  return normalized.length > 0 ? normalized : ["student"];
}

function getRoleBadgeClass(role: UserRole) {
  if (role === "admin") return "bg-red-50 text-red-700 ring-red-200";
  if (role === "librarian") return "bg-blue-50 text-blue-700 ring-blue-200";
  return "bg-green-50 text-green-700 ring-green-200";
}

export default function AdminUsersPage() {
  const { isAdmin } = useAuth();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await api.getUsers();
      setUsers(data);
    } catch {
      setError(
        "Unable to load user information. Please verify that the authentication service is available and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(userId: string, role: UserRole) {
    try {
      setMessage("");
      setError("");

      await api.updateUserRoles(userId, [role]);
      setMessage("User role updated successfully.");
      await loadUsers();
    } catch {
      setError(
        "The selected role could not be updated. Please try again in a few moments."
      );
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Administration
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">Users Management</h1>

        <p className="mt-4 max-w-3xl text-lg text-white/80">
          Review institutional users, verify their assigned roles, and manage
          access permissions for the Smart Campus platform.
        </p>
      </section>

      {!isAdmin && (
        <div className="mt-8 rounded-3xl bg-red-50 p-8 text-red-700 ring-1 ring-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 shrink-0" />
            <div>
              <h2 className="text-xl font-extrabold">Access denied</h2>
              <p className="mt-2">
                Only administrator users can access user and role management.
              </p>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <>
          <section className="mt-8 grid gap-5 md:grid-cols-3">
            <InfoCard
              icon={<Users />}
              title="User Administration"
              text="View registered users and verify their institutional information."
            />

            <InfoCard
              icon={<Shield />}
              title="Role-Based Access"
              text="Assign platform roles such as student, librarian or administrator."
            />

            <InfoCard
              icon={<UserCheck />}
              title="Permission Control"
              text="Keep access permissions aligned with each user's responsibility."
            />
          </section>

          <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            {message && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-green-50 p-4 text-green-700 ring-1 ring-green-200">
                <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-700 ring-1 ring-red-200">
                <AlertCircle className="mt-0.5 shrink-0" size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <h2 className="text-2xl font-extrabold text-[#002b5c]">
                  Registered Users
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Use this table to review users and update their platform role.
                </p>
              </div>

              <span className="rounded-full bg-[#002b5c]/10 px-4 py-2 text-sm font-bold text-[#002b5c]">
                {users.length} users
              </span>
            </div>

            {loading ? (
              <p className="rounded-2xl bg-slate-50 p-6 text-slate-500">
                Loading users...
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-sm uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-2">User</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Current Roles</th>
                      <th className="px-4 py-2">Assign Role</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => {
                      const currentRoles = normalizeUserRoles(user);

                      return (
                        <tr key={user.id} className="bg-slate-50">
                          <td className="rounded-l-2xl px-4 py-4">
                            <p className="font-bold text-[#002b5c]">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-slate-500">
                              Institutional user
                            </p>
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {user.email}
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              {currentRoles.map((role) => (
                                <span
                                  key={role}
                                  className={`rounded-full px-3 py-1 text-sm font-bold capitalize ring-1 ${getRoleBadgeClass(
                                    role
                                  )}`}
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="rounded-r-2xl px-4 py-4">
                            <select
                              className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium capitalize text-[#002b5c] outline-none focus:border-[#f4c430]"
                              value={currentRoles[0]}
                              onChange={(event) =>
                                updateRole(
                                  user.id,
                                  event.target.value as UserRole
                                )
                              }
                            >
                              {roles.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {users.length === 0 && (
                  <div className="rounded-2xl bg-slate-50 p-8 text-center">
                    <Users className="mx-auto text-slate-400" size={36} />
                    <h3 className="mt-4 text-lg font-bold text-[#002b5c]">
                      No users are currently registered.
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Once users are created, they will appear here for role
                      management.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </AppShell>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 inline-flex rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
        {icon}
      </div>

      <h3 className="text-xl font-extrabold text-[#002b5c]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}