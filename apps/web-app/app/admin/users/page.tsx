"use client";

import { useEffect, useState } from "react";
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
        "Users endpoint is not available. Check API Gateway proxy: GET /api/auth/users."
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
      setError("Role update failed. Check PATCH /api/auth/users/{id}/roles.");
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
          Manage institutional users and assign real backend roles through the
          API Gateway.
        </p>
      </section>

      {!isAdmin && (
        <div className="mt-8 rounded-3xl bg-red-50 p-8 text-red-700">
          Access denied. Only admin users can manage roles.
        </div>
      )}

      {isAdmin && (
        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          {message && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-slate-500">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-sm uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Current Roles</th>
                    <th className="px-4 py-2">Change Role</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const currentRoles = normalizeUserRoles(user);

                    return (
                      <tr key={user.id} className="rounded-2xl bg-slate-50">
                        <td className="rounded-l-2xl px-4 py-4 font-bold text-[#002b5c]">
                          {user.firstName} {user.lastName}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {user.email}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {currentRoles.map((role) => (
                              <span
                                key={role}
                                className="rounded-full bg-[#f4c430]/20 px-3 py-1 text-sm font-bold capitalize text-[#002b5c]"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="rounded-r-2xl px-4 py-4">
                          <select
                            className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-[#002b5c] outline-none focus:border-[#f4c430]"
                            value={currentRoles[0]}
                            onChange={(event) =>
                              updateRole(user.id, event.target.value as UserRole)
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
                <p className="py-8 text-center text-slate-500">
                  No users found.
                </p>
              )}
            </div>
          )}
        </section>
      )}
    </AppShell>
  );
}