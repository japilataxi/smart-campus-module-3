"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { isAdmin, isLibrarian } from "@/lib/roles";

type Incident = {
  id: number;
  title: string;
  description: string;
  location: string;
  status: string;
};

const API_URL = "http://localhost:3000/api/incidents";

export default function IncidentsPage() {
  const { user } = useAuth();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const canManageIncidents = isLibrarian(user);
  const canDeleteIncidents = isAdmin(user);

  async function loadIncidents() {
    const response = await fetch(API_URL);
    const data = await response.json();
    setIncidents(data);
  }

  useEffect(() => {
    loadIncidents().catch(() => setIncidents([]));
  }, []);

  async function createIncident(e: React.FormEvent) {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, location }),
    });

    setTitle("");
    setDescription("");
    setLocation("");
    setMessage("Incident created successfully.");
    await loadIncidents();
  }

  async function updateIncident(id: number) {
    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "RESOLVED",
      }),
    });

    setMessage("Incident marked as resolved.");
    await loadIncidents();
  }

  async function deleteIncident(id: number) {
    if (!confirm("Are you sure you want to delete this incident?")) return;

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    setMessage("Incident deleted successfully.");
    await loadIncidents();
  }

  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-8 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Campus Incident Service
        </p>

        <h1 className="mt-3 text-4xl font-extrabold">
          Incident Management
        </h1>

        <p className="mt-2 text-white/75">
          Report, review, resolve, and manage campus incidents.
        </p>
      </section>

      {message && (
        <div className="mt-6 rounded-xl bg-[#f4c430]/20 p-4 font-bold text-[#002b5c]">
          {message}
        </div>
      )}

      <form
        onSubmit={createIncident}
        className="mt-8 grid gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:grid-cols-4"
      >
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          className="input"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white transition hover:bg-[#003b7a]">
          Create Incident
        </button>
      </form>

      <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left">
          <thead className="bg-[#002b5c] text-white">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Description</th>
              <th className="p-4">Location</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id} className="border-b border-slate-100">
                <td className="p-4 font-bold text-[#002b5c]">
                  {incident.id}
                </td>

                <td className="p-4 font-bold text-[#002b5c]">
                  {incident.title}
                </td>

                <td className="p-4 text-slate-600">
                  {incident.description}
                </td>

                <td className="p-4 text-slate-600">
                  {incident.location}
                </td>

                <td className="p-4">
                  <span
                    className={
                      incident.status === "RESOLVED"
                        ? "rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700"
                        : "rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700"
                    }
                  >
                    {incident.status}
                  </span>
                </td>

                <td className="flex gap-2 p-4">
                  {canManageIncidents && incident.status !== "RESOLVED" && (
                    <button
                      onClick={() => updateIncident(incident.id)}
                      className="rounded-xl bg-[#f4c430] px-4 py-2 font-bold text-[#002b5c]"
                    >
                      Resolve
                    </button>
                  )}

                  {canDeleteIncidents && (
                    <button
                      onClick={() => deleteIncident(incident.id)}
                      className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white"
                    >
                      Delete
                    </button>
                  )}

                  {!canManageIncidents && !canDeleteIncidents && (
                    <span className="text-sm text-slate-400">No action</span>
                  )}
                </td>
              </tr>
            ))}

            {incidents.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No incidents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}