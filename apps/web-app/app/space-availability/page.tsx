"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { api, getAccessToken } from "@/lib/api";
import { normalizeRoles } from "@/lib/roles";
import {
  Building2,
  CheckCircle2,
  CalendarDays,
  XCircle,
  Search,
  ClipboardCheck,
} from "lucide-react";

type SpaceType =
  | "classroom"
  | "laboratory"
  | "auditorium"
  | "library_room"
  | "meeting_room"
  | "study_area";

type SpaceStatus = "active" | "inactive" | "maintenance";
type AvailabilityStatus = "available" | "occupied" | "reserved" | "unavailable";

type CampusSpace = {
  id: string;
  name: string;
  type: SpaceType;
  location: string;
  capacity: number;
  status: SpaceStatus;
  availabilityStatus: AvailabilityStatus;
  openingTime: string;
  closingTime: string;
  createdAt?: string;
  updatedAt?: string;
};

type AvailabilityResult = {
  spaceId: string;
  available: boolean;
  status: SpaceStatus;
  availabilityStatus: AvailabilityStatus;
  openingTime: string;
  closingTime: string;
};

const spaceTypes: SpaceType[] = [
  "classroom",
  "laboratory",
  "auditorium",
  "library_room",
  "meeting_room",
  "study_area",
];

const availabilityStatuses: AvailabilityStatus[] = [
  "available",
  "occupied",
  "reserved",
  "unavailable",
];

const formInitial = {
  name: "",
  type: "classroom" as SpaceType,
  location: "",
  capacity: "30",
  status: "active" as SpaceStatus,
  availabilityStatus: "available" as AvailabilityStatus,
  openingTime: "07:00",
  closingTime: "21:00",
};

function normalizeSpace(record: any): CampusSpace {
  return {
    id: String(record.id),
    name: String(record.name || ""),
    type: String(record.type || "classroom") as SpaceType,
    location: String(record.location || ""),
    capacity: Number(record.capacity || 0),
    status: String(record.status || "active") as SpaceStatus,
    availabilityStatus: String(record.availabilityStatus || "available") as AvailabilityStatus,
    openingTime: String(record.openingTime || ""),
    closingTime: String(record.closingTime || ""),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function formatLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function getSpaceErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.name === "401") {
      return "Your session has expired. Please sign in again.";
    }

    if (error.name === "403") {
      return "You do not have permission to perform this action.";
    }

    if (
      error.message === "Failed to fetch" ||
      error.message.toLowerCase().includes("fetch")
    ) {
      return "Space Availability Service is currently unavailable. Please try again in a few moments.";
    }

    return "Unable to complete the requested operation. Please try again.";
  }

  return "An unexpected error occurred. Please try again.";
}

function statusClass(status: SpaceStatus) {
  if (status === "active") return "bg-emerald-100 text-emerald-700";
  if (status === "maintenance") return "bg-amber-100 text-amber-700";
  return "bg-slate-200 text-slate-700";
}

function availabilityClass(status: AvailabilityStatus) {
  if (status === "available") return "bg-emerald-100 text-emerald-700";
  if (status === "occupied") return "bg-red-100 text-red-700";
  if (status === "reserved") return "bg-amber-100 text-amber-700";
  return "bg-slate-200 text-slate-700";
}

export default function SpaceAvailabilityPage() {
  const router = useRouter();
  const { loading, user } = useAuth();

  const roles = useMemo(() => normalizeRoles(user), [user]);
  const canManage = roles.includes("admin") || roles.includes("librarian");

  const [spaces, setSpaces] = useState<CampusSpace[]>([]);
  const [form, setForm] = useState(formInitial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({ type: "", availabilityStatus: "", location: "" });
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadSpaces() {
    setIsLoading(true);
    setError("");

    try {
      const data = await api.getSpaces({
        type: filters.type || undefined,
        availabilityStatus: filters.availabilityStatus || undefined,
        location: filters.location || undefined,
      });
      const normalized = data.map(normalizeSpace);
      setSpaces(normalized);
      if (!selectedSpaceId && normalized[0]) setSelectedSpaceId(normalized[0].id);
    } catch (requestError: any) {
      if (requestError?.name === "401") router.push("/login");
      setError(getSpaceErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!loading && !getAccessToken()) router.push("/login");
  }, [loading, router]);

  useEffect(() => {
    if (!loading && getAccessToken()) loadSpaces();
  }, [loading]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManage) return;

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
      };

      if (editingId) {
        await api.updateSpace(editingId, payload);
        setMessage("Space updated successfully.");
      } else {
        await api.createSpace(payload);
        setMessage("Space created successfully.");
      }

      setForm(formInitial);
      setEditingId(null);
      await loadSpaces();
    } catch (requestError: any) {
      if (requestError?.name === "401") router.push("/login");
      setError(getSpaceErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(space: CampusSpace) {
    setEditingId(space.id);
    setForm({
      name: space.name,
      type: space.type,
      location: space.location,
      capacity: String(space.capacity),
      status: space.status,
      availabilityStatus: space.availabilityStatus,
      openingTime: space.openingTime,
      closingTime: space.closingTime,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function changeAvailability(spaceId: string, availabilityStatus: AvailabilityStatus) {
    setError("");
    setMessage("");

    try {
      await api.updateSpaceAvailability(spaceId, { availabilityStatus });
      setMessage(`Space marked as ${formatLabel(availabilityStatus)}.`);
      await loadSpaces();
    } catch (requestError: any) {
      if (requestError?.name === "401") router.push("/login");
      setError(getSpaceErrorMessage(requestError));
    }
  }

  async function deactivate(spaceId: string) {
    setError("");
    setMessage("");

    try {
      await api.deactivateSpace(spaceId);
      setMessage("Space deactivated successfully.");
      await loadSpaces();
    } catch (requestError: any) {
      if (requestError?.name === "401") router.push("/login");
      setError(getSpaceErrorMessage(requestError));
    }
  }

  async function deleteSpace(spaceId: string) {
    setError("");
    setMessage("");

    try {
      await api.deleteSpace(spaceId);
      setMessage("Space deleted successfully.");
      await loadSpaces();
    } catch (requestError: any) {
      if (requestError?.name === "401") router.push("/login");
      setError(getSpaceErrorMessage(requestError));
    }
  }

  async function checkAvailability(spaceId = selectedSpaceId) {
    if (!spaceId) return;
    setError("");
    setMessage("");

    try {
      const result = await api.checkSpaceAvailability(spaceId);
      setAvailabilityResult(result);
      setMessage(result.available ? "Space is currently available." : "Space is not currently available.");
    } catch (requestError: any) {
      if (requestError?.name === "401") router.push("/login");
      setError(getSpaceErrorMessage(requestError));
    }
  }

  const totals = useMemo(() => {
    return {
      total: spaces.length,
      available: spaces.filter((space) => space.availabilityStatus === "available").length,
      reserved: spaces.filter((space) => space.availabilityStatus === "reserved").length,
      occupied: spaces.filter((space) => space.availabilityStatus === "occupied").length,
    };
  }, [spaces]);

 return (
  <AppShell>
    <main className="min-h-screen bg-slate-100 p-6 lg:p-10">
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          Campus Operations
        </p>

        <h1 className="mt-4 text-5xl font-extrabold">Space Availability</h1>

        <p className="mt-4 max-w-4xl text-lg text-white/80">
          Manage classrooms, laboratories, auditoriums, library rooms, meeting
          rooms and study areas with capacity, schedules and real-time
          availability status.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <Building2 className="mb-4 text-[#002b5c]" />
          <p className="text-sm font-bold text-slate-500">Total Spaces</p>
          <p className="mt-2 text-3xl font-black text-[#002b5c]">
            {totals.total}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <CheckCircle2 className="mb-4 text-emerald-600" />
          <p className="text-sm font-bold text-slate-500">Available</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">
            {totals.available}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <CalendarDays className="mb-4 text-amber-600" />
          <p className="text-sm font-bold text-slate-500">Reserved</p>
          <p className="mt-2 text-3xl font-black text-amber-600">
            {totals.reserved}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <XCircle className="mb-4 text-red-600" />
          <p className="text-sm font-bold text-slate-500">Occupied</p>
          <p className="mt-2 text-3xl font-black text-red-600">
            {totals.occupied}
          </p>
        </div>
      </section>

      {(message || error) && (
        <div
          className={`mt-6 rounded-2xl p-4 text-sm font-semibold ring-1 ${
            error
              ? "bg-red-50 text-red-700 ring-red-200"
              : "bg-emerald-50 text-emerald-700 ring-emerald-200"
          }`}
        >
          {error || message}
        </div>
      )}

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-[#002b5c]">
              {editingId ? "Edit Campus Space" : "Create New Campus Space"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Register university facilities and define capacity, operating
              hours and availability status.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600"
              onClick={() => {
                setEditingId(null);
                setForm(formInitial);
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-4">
          <input className="rounded-xl border px-4 py-3" placeholder="Space name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required disabled={!canManage} />

          <select className="rounded-xl border px-4 py-3" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as SpaceType })} disabled={!canManage}>
            {spaceTypes.map((type) => (
              <option key={type} value={type}>{formatLabel(type)}</option>
            ))}
          </select>

          <input className="rounded-xl border px-4 py-3" placeholder="Campus location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} required disabled={!canManage} />

          <input className="rounded-xl border px-4 py-3" type="number" min="1" placeholder="Capacity" value={form.capacity} onChange={(event) => setForm({ ...form, capacity: event.target.value })} required disabled={!canManage} />

          <select className="rounded-xl border px-4 py-3" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as SpaceStatus })} disabled={!canManage}>
            {["active", "inactive", "maintenance"].map((status) => (
              <option key={status} value={status}>{formatLabel(status)}</option>
            ))}
          </select>

          <select className="rounded-xl border px-4 py-3" value={form.availabilityStatus} onChange={(event) => setForm({ ...form, availabilityStatus: event.target.value as AvailabilityStatus })} disabled={!canManage}>
            {availabilityStatuses.map((status) => (
              <option key={status} value={status}>{formatLabel(status)}</option>
            ))}
          </select>

          <input className="rounded-xl border px-4 py-3" type="time" value={form.openingTime} onChange={(event) => setForm({ ...form, openingTime: event.target.value })} required disabled={!canManage} />

          <input className="rounded-xl border px-4 py-3" type="time" value={form.closingTime} onChange={(event) => setForm({ ...form, closingTime: event.target.value })} required disabled={!canManage} />

          <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white transition hover:bg-[#003b7a] disabled:opacity-50 lg:col-span-4" disabled={!canManage || isSaving}>
            {isSaving ? "Saving..." : editingId ? "Update Space" : "Create Space"}
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-[#002b5c]">
              Space Directory
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Search, filter, check availability and manage registered campus
              spaces.
            </p>
          </div>

          <span className="rounded-full bg-[#002b5c]/10 px-4 py-2 text-sm font-bold text-[#002b5c]">
            {spaces.length} registered spaces
          </span>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-4">
          <select className="rounded-xl border px-4 py-3" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}>
            <option value="">All types</option>
            {spaceTypes.map((type) => (
              <option key={type} value={type}>{formatLabel(type)}</option>
            ))}
          </select>

          <select className="rounded-xl border px-4 py-3" value={filters.availabilityStatus} onChange={(event) => setFilters({ ...filters, availabilityStatus: event.target.value })}>
            <option value="">All availability</option>
            {availabilityStatuses.map((status) => (
              <option key={status} value={status}>{formatLabel(status)}</option>
            ))}
          </select>

          <input className="rounded-xl border px-4 py-3" placeholder="Location" value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} />

          <button className="rounded-xl bg-[#f4c430] px-4 py-3 font-bold text-[#002b5c]" onClick={() => loadSpaces()}>
            Refresh List
          </button>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <select className="rounded-xl border px-4 py-3" value={selectedSpaceId} onChange={(event) => setSelectedSpaceId(event.target.value)}>
            <option value="">Select a space to check availability</option>
            {spaces.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name} - {space.location}
              </option>
            ))}
          </select>

          <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white" onClick={() => checkAvailability()}>
            Check Availability
          </button>
        </div>

        {availabilityResult && (
          <div className="mb-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
              Availability Result
            </p>

            <p className="mt-2 text-2xl font-extrabold text-[#002b5c]">
              {availabilityResult.available ? "Available" : "Not Available"}
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Operating hours: {availabilityResult.openingTime} -{" "}
              {availabilityResult.closingTime}. Current status:{" "}
              {formatLabel(availabilityResult.availabilityStatus)}.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">
            Loading spaces...
          </div>
        ) : spaces.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">
            <Building2 className="mx-auto mb-4 text-slate-400" size={42} />
            <p className="text-xl font-extrabold text-[#002b5c]">
              No campus spaces found
            </p>
            <p className="mt-2">
              Create your first classroom, laboratory, meeting room or study
              area.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-[#002b5c] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Space</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Capacity</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Availability</th>
                  <th className="px-4 py-3 text-left">Operating Hours</th>
                  <th className="px-4 py-3 text-left">Last Updated</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {spaces.map((space) => (
                  <tr key={space.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-bold text-[#002b5c]">
                      {space.name}
                    </td>
                    <td className="px-4 py-3">{formatLabel(space.type)}</td>
                    <td className="px-4 py-3">{space.location}</td>
                    <td className="px-4 py-3">{space.capacity}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(space.status)}`}>
                        {formatLabel(space.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${availabilityClass(space.availabilityStatus)}`}>
                        {formatLabel(space.availabilityStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {space.openingTime} - {space.closingTime}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(space.updatedAt || space.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-72 flex-wrap gap-2">
                        <button className="rounded-lg bg-[#002b5c] px-3 py-2 text-xs font-bold text-white" onClick={() => checkAvailability(space.id)}>
                          Check
                        </button>

                        {canManage && (
                          <button className="rounded-lg bg-[#f4c430] px-3 py-2 text-xs font-bold text-[#002b5c]" onClick={() => startEdit(space)}>
                            Edit
                          </button>
                        )}

                        {canManage && (
                          <select className="rounded-lg border px-3 py-2 text-xs font-bold text-slate-700" value={space.availabilityStatus} onChange={(event) => changeAvailability(space.id, event.target.value as AvailabilityStatus)}>
                            {availabilityStatuses.map((status) => (
                              <option key={status} value={status}>
                                {formatLabel(status)}
                              </option>
                            ))}
                          </select>
                        )}

                        {canManage && (
                          <button className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-bold text-white" onClick={() => deactivate(space.id)}>
                            Deactivate
                          </button>
                        )}

                        {canManage && (
                          <button className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white" onClick={() => deleteSpace(space.id)}>
                            Delete
                          </button>
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
    </main>
  </AppShell>
);
}
