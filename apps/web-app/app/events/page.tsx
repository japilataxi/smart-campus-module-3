"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  Activity,
  Plus,
  Pencil,
  XCircle,
  Loader2,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

type CampusEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  category: "ACADEMIC" | "CULTURAL" | "SPORTS" | "TECHNOLOGY" | "SOCIAL" | "GENERAL";
  startDate: string;
  endDate: string;
  capacity: number;
  status: "ACTIVE" | "CANCELLED" | string;
  createdByUserId: string;
  createdAt: string;
  updatedAt?: string;
};

type FormState = {
  title: string;
  description: string;
  location: string;
  category: CampusEvent["category"];
  startDate: string;
  endDate: string;
  capacity: number;
};

const initialForm: FormState = {
  title: "",
  description: "",
  location: "",
  category: "GENERAL",
  startDate: "",
  endDate: "",
  capacity: 50,
};

export default function EventsPage() {
  const { user, isAdmin } = useAuth();

  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const metrics = useMemo(() => {
    const now = new Date();

    return {
      total: events.length,
      active: events.filter((e) => e.status === "ACTIVE").length,
      cancelled: events.filter((e) => e.status === "CANCELLED").length,
      upcoming: events.filter((e) => new Date(e.startDate) > now).length,
    };
  }, [events]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.getEvents();

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (Array.isArray(data?.value)) {
        setEvents(data.value);
      } else if (Array.isArray(data?.data)) {
        setEvents(data.data);
      } else {
        setEvents([]);
      }
    } catch {
      setError("No se pudieron cargar los eventos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const formatDateForInput = (value: string) => {
    if (!value) return "";
    return value.slice(0, 16);
  };

  const toIsoDate = (value: string) => {
    return new Date(value).toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...form,
        capacity: Number(form.capacity),
        startDate: toIsoDate(form.startDate),
        endDate: toIsoDate(form.endDate),
        createdByUserId: user?.id,
      };

      if (editingId) {
        await api.updateEvent(editingId, payload);
        setMessage("Event updated successfully.");
      } else {
        await api.createEvent(payload);
        setMessage("Event created successfully.");
      }

      resetForm();
      await loadEvents();
    } catch {
      setError("No se pudo guardar el evento.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (event: CampusEvent) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      location: event.location,
      category: event.category,
      startDate: formatDateForInput(event.startDate),
      endDate: formatDateForInput(event.endDate),
      capacity: event.capacity,
    });
  };

  const handleCancelEvent = async (id: string) => {
    if (!isAdmin) return;

    const confirmCancel = window.confirm("¿Seguro que deseas cancelar este evento?");
    if (!confirmCancel) return;

    try {
      setError("");
      setMessage("");
      await api.cancelEvent(id);
      setMessage("Event cancelled successfully.");
      await loadEvents();
    } catch {
      setError("No se pudo cancelar el evento.");
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "No date";
    return new Date(value).toLocaleString();
  };

  const badgeClass = (value: string) => {
    if (value === "CANCELLED") return "bg-red-100 text-red-700";
    if (value === "ACTIVE") return "bg-green-100 text-green-700";
    if (value === "TECHNOLOGY") return "bg-blue-100 text-blue-700";
    if (value === "ACADEMIC") return "bg-purple-100 text-purple-700";
    if (value === "SPORTS") return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-red-600 p-8 text-white shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays className="h-7 w-7" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Smart Campus Module 3
                </span>
              </div>

              <h1 className="text-3xl font-bold">Events</h1>

              <p className="mt-2 max-w-2xl text-sm text-blue-50">
                Manage academic, cultural, sports and technology events across the Smart Campus platform.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold md:grid-cols-4">
              <span className="rounded-full bg-white/20 px-3 py-2">PostgreSQL</span>
              <span className="rounded-full bg-white/20 px-3 py-2">Kafka Events</span>
              <span className="rounded-full bg-white/20 px-3 py-2">JWT Protected</span>
              <span className="rounded-full bg-white/20 px-3 py-2">Event Service</span>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard icon={<CalendarDays />} title="Total Events" value={metrics.total} />
          <MetricCard icon={<Activity />} title="Active Events" value={metrics.active} />
          <MetricCard icon={<Clock />} title="Upcoming Events" value={metrics.upcoming} />
          <MetricCard icon={<XCircle />} title="Cancelled" value={metrics.cancelled} />
        </section>

        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isAdmin && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
              <Plus className="h-5 w-5" />
              {editingId ? "Edit Event" : "Create Event"}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <textarea
                className="min-h-28 rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />

              <div className="grid gap-4 md:grid-cols-3">
                <input
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />

                <select
                  className="rounded-xl border px-4 py-3 text-sm"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as CampusEvent["category"],
                    })
                  }
                >
                  <option value="ACADEMIC">Academic</option>
                  <option value="CULTURAL">Cultural</option>
                  <option value="SPORTS">Sports</option>
                  <option value="TECHNOLOGY">Technology</option>
                  <option value="SOCIAL">Social</option>
                  <option value="GENERAL">General</option>
                </select>

                <input
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  min={1}
                  placeholder="Capacity"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  required
                />

                <input
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Update" : "Create"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <CalendarDays className="h-5 w-5" />
            Event List
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500">
              <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              No events found.
            </div>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border p-5 transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {event.title}
                      </h3>

                      <p className="max-w-4xl text-sm text-gray-600">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <span className={`rounded-full px-3 py-1 ${badgeClass(event.category)}`}>
                          {event.category}
                        </span>
                        <span className={`rounded-full px-3 py-1 ${badgeClass(event.status)}`}>
                          {event.status}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                          <Users className="h-3 w-3" />
                          Capacity: {event.capacity}
                        </span>
                      </div>

                      <div className="grid gap-1 text-xs text-gray-500 md:grid-cols-2">
                        <span>Start: {formatDate(event.startDate)}</span>
                        <span>End: {formatDate(event.endDate)}</span>
                        <span>Created: {formatDate(event.createdAt)}</span>
                        <span>Updated: {formatDate(event.updatedAt)}</span>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        {event.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleCancelEvent(event.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function MetricCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}