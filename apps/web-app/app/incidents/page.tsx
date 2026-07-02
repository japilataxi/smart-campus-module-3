"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { isAdmin, isLibrarian } from "@/lib/roles";
import { api } from "@/lib/api";

type Incident = {
  id: number;
  title: string;
  description: string;
  location: string;
  status: string;
};

type MessageType = "success" | "error";

export default function IncidentsPage() {
  const { user } = useAuth();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("success");

  const canManageIncidents = isLibrarian(user);
  const canDeleteIncidents = isAdmin(user);

  async function loadIncidents() {
    const data = await api.getIncidents();
    setIncidents(data);
  }

  useEffect(() => {
    loadIncidents().catch(() => setIncidents([]));
  }, []);

  async function createIncident(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.createIncident({ title, description, location });

      setTitle("");
      setDescription("");
      setLocation("");
      setMessageType("success");
      setMessage("Incident created successfully.");
      await loadIncidents();
    } catch {
      setMessageType("error");
      setMessage("The incident could not be created. Please try again.");
    }
  }

  async function updateIncident(id: number) {
    try {
      await api.updateIncident(id, {
        status: "RESOLVED",
      });

      setMessageType("success");
      setMessage("Incident marked as resolved.");
      await loadIncidents();
    } catch {
      setMessageType("error");
      setMessage("The incident status could not be updated. Please try again.");
    }
  }

  async function deleteIncident(id: number) {
    if (!confirm("Are you sure you want to delete this incident?")) return;

    try {
      await api.deleteIncident(id);

      setMessageType("success");
      setMessage("Incident deleted successfully.");
      await loadIncidents();
    } catch {
      setMessageType("error");
      setMessage("The incident could not be deleted. Please try again.");
    }
  }

  const resolvedIncidents = incidents.filter(
    (incident) => incident.status === "RESOLVED"
  );

  const activeIncidents = incidents.filter(
    (incident) => incident.status !== "RESOLVED"
  );

  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Campus Incident Service
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">Incident Management</h1>

        <p className="mt-4 max-w-3xl text-lg text-white/80">
          Report campus incidents, review operational issues, update their
          status and keep a clear record of campus events.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Badge text="Incident Reports" />
          <Badge text="Status Tracking" />
          <Badge text="Campus Operations" />
          <Badge text="Event Notifications" />
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <InfoCard
          icon={<AlertTriangle />}
          title="Total Incidents"
          value={incidents.length}
          text="Campus incidents registered in the system."
        />

        <InfoCard
          icon={<AlertCircle />}
          title="Active Incidents"
          value={activeIncidents.length}
          text="Incidents that still require attention."
        />

        <InfoCard
          icon={<CheckCircle2 />}
          title="Resolved Incidents"
          value={resolvedIncidents.length}
          text="Incidents already marked as resolved."
        />
      </section>

      {message && <AlertMessage type={messageType} message={message} />}

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#002b5c]">
            Report Incident
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Register a campus issue with a title, description and location so it
            can be reviewed and managed.
          </p>
        </div>

        <form onSubmit={createIncident} className="grid gap-4 md:grid-cols-4">
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]"
            placeholder="Incident title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white shadow-sm transition hover:bg-[#003b7a]">
            Create Incident
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-[#002b5c]">
              Incident Records
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review reported incidents, current status, location and available
              actions.
            </p>
          </div>

          <span className="rounded-full bg-[#002b5c]/10 px-4 py-2 text-sm font-bold text-[#002b5c]">
            {incidents.length} records
          </span>
        </div>

        {incidents.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-10 text-center ring-1 ring-slate-200">
            <AlertTriangle className="mx-auto text-slate-400" size={42} />
            <h3 className="mt-4 text-xl font-extrabold text-[#002b5c]">
              No incidents found
            </h3>
            <p className="mt-2 text-slate-500">
              Once an incident is reported, it will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="text-sm uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2">Incident</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id} className="bg-slate-50">
                    <td className="rounded-l-2xl px-4 py-4">
                      <p className="font-bold text-[#002b5c]">
                        {incident.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        ID #{incident.id}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {incident.description}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={16} className="text-[#002b5c]" />
                        {incident.location}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={incident.status} />
                    </td>

                    <td className="rounded-r-2xl px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {canManageIncidents &&
                          incident.status !== "RESOLVED" && (
                            <button
                              onClick={() => updateIncident(incident.id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-[#f4c430] px-4 py-2 font-bold text-[#002b5c] transition hover:bg-yellow-300"
                            >
                              <ShieldCheck size={16} />
                              Resolve
                            </button>
                          )}

                        {canDeleteIncidents && (
                          <button
                            onClick={() => deleteIncident(incident.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        )}

                        {!canManageIncidents && !canDeleteIncidents && (
                          <span className="text-sm text-slate-400">
                            No action
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

function InfoCard({
  icon,
  title,
  value,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  text: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 inline-flex rounded-2xl bg-[#f4c430]/20 p-4 text-[#002b5c]">
        {icon}
      </div>

      <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-extrabold text-[#002b5c]">{value}</h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const resolved = status === "RESOLVED";

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-bold ring-1 ${
        resolved
          ? "bg-green-50 text-green-700 ring-green-200"
          : "bg-yellow-50 text-yellow-700 ring-yellow-200"
      }`}
    >
      {resolved ? "Resolved" : status}
    </span>
  );
}

function AlertMessage({
  type,
  message,
}: {
  type: MessageType;
  message: string;
}) {
  const success = type === "success";

  return (
    <div
      className={`mt-6 flex items-start gap-3 rounded-xl p-4 text-sm font-medium ring-1 ${
        success
          ? "bg-green-50 text-green-700 ring-green-200"
          : "bg-red-50 text-red-700 ring-red-200"
      }`}
    >
      {success ? (
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}