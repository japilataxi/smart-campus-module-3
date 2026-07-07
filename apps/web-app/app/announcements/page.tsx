"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Megaphone,
  Radio,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Send,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: "ACADEMIC" | "MAINTENANCE" | "EMERGENCY" | "GENERAL" | "EVENT";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  targetAudience: "STUDENTS" | "STAFF" | "LIBRARIANS" | "ADMINS" | "ALL";
  createdByUserId?: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
};

type FormState = {
  title: string;
  content: string;
  category: Announcement["category"];
  priority: Announcement["priority"];
  targetAudience: Announcement["targetAudience"];
};

const initialForm: FormState = {
  title: "",
  content: "",
  category: "GENERAL",
  priority: "MEDIUM",
  targetAudience: "ALL",
};

export default function AnnouncementsPage() {

  

    const { user, isAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const metrics = useMemo(() => {
    return {
      total: announcements.length,
      published: announcements.filter((a) => a.status === "PUBLISHED").length,
      drafts: announcements.filter((a) => a.status === "DRAFT").length,
      critical: announcements.filter((a) => a.priority === "CRITICAL").length,
    };
  }, [announcements]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getAnnouncements();
      setAnnouncements(Array.isArray(data) ? data : data?.data || []);
    } catch {
      setError("No se pudieron cargar los anuncios institucionales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await api.updateAnnouncement(editingId, form);
        setMessage("Announcement updated successfully.");
      } else {
        await api.createAnnouncement({
            ...form,
            createdByUserId: user?.id || "admin-local",
            });
        setMessage("Announcement created successfully.");
      }

      resetForm();
      await loadAnnouncements();
    } catch {
      setError("No se pudo guardar el anuncio.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setForm({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
    });
  };

  const handlePublish = async (id: string) => {
    if (!isAdmin) return;

    try {
      setError("");
      setMessage("");
      await api.publishAnnouncement(id);
      setMessage("Announcement published successfully.");
      await loadAnnouncements();
    } catch {
      setError("No se pudo publicar el anuncio.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;

    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este anuncio?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setMessage("");
      await api.deleteAnnouncement(id);
      setMessage("Announcement deleted successfully.");
      await loadAnnouncements();
    } catch {
      setError("No se pudo eliminar el anuncio.");
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "Not published";
    return new Date(value).toLocaleString();
  };

  const badgeClass = (value: string) => {
    if (value === "CRITICAL" || value === "EMERGENCY") {
      return "bg-red-100 text-red-700";
    }

    if (value === "PUBLISHED") {
      return "bg-green-100 text-green-700";
    }

    if (value === "DRAFT") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-red-600 p-8 text-white shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Megaphone className="h-7 w-7" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Smart Campus Module 3
                </span>
              </div>

              <h1 className="text-3xl font-bold">
                Institutional Announcements
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-blue-50">
                Manage campus notices, emergency communications and institutional
                announcements through the API Gateway.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold md:grid-cols-4">
              <span className="rounded-full bg-white/20 px-3 py-2">
                Kafka Events
              </span>
              <span className="rounded-full bg-white/20 px-3 py-2">
                Campus Notices
              </span>
              <span className="rounded-full bg-white/20 px-3 py-2">
                WebSocket Notifications
              </span>
              <span className="rounded-full bg-white/20 px-3 py-2">
                API Gateway
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard icon={<Bell />} title="Total Announcements" value={metrics.total} />
          <MetricCard icon={<Send />} title="Published" value={metrics.published} />
          <MetricCard icon={<Pencil />} title="Drafts" value={metrics.drafts} />
          <MetricCard icon={<AlertTriangle />} title="Critical" value={metrics.critical} />
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
              {editingId ? "Edit Announcement" : "Create Announcement"}
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
                placeholder="Content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />

              <div className="grid gap-4 md:grid-cols-3">
                <select
                  className="rounded-xl border px-4 py-3 text-sm"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as Announcement["category"],
                    })
                  }
                >
                  <option value="ACADEMIC">Academic</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="GENERAL">General</option>
                  <option value="EVENT">Event</option>
                </select>

                <select
                  className="rounded-xl border px-4 py-3 text-sm"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value as Announcement["priority"],
                    })
                  }
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>

                <select
                  className="rounded-xl border px-4 py-3 text-sm"
                  value={form.targetAudience}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      targetAudience: e.target.value as Announcement["targetAudience"],
                    })
                  }
                >
                  <option value="STUDENTS">Students</option>
                  <option value="STAFF">Staff</option>
                  <option value="LIBRARIANS">Librarians</option>
                  <option value="ADMINS">Admins</option>
                  <option value="ALL">All</option>
                </select>
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
            <Radio className="h-5 w-5" />
            Announcement List
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading announcements...
            </div>
          ) : announcements.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500">
              <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              No announcements found.
            </div>
          ) : (
            <div className="grid gap-4">
              {announcements.map((announcement) => (
                <article
                  key={announcement.id}
                  className="rounded-2xl border p-5 transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {announcement.title}
                      </h3>

                      <p className="max-w-4xl text-sm text-gray-600">
                        {announcement.content}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <span className={`rounded-full px-3 py-1 ${badgeClass(announcement.category)}`}>
                          {announcement.category}
                        </span>
                        <span className={`rounded-full px-3 py-1 ${badgeClass(announcement.priority)}`}>
                          {announcement.priority}
                        </span>
                        <span className={`rounded-full px-3 py-1 ${badgeClass(announcement.status)}`}>
                          {announcement.status}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                          {announcement.targetAudience}
                        </span>
                      </div>

                      <div className="grid gap-1 text-xs text-gray-500 md:grid-cols-2">
                        <span>Published: {formatDate(announcement.publishedAt)}</span>
                        <span>Created: {formatDate(announcement.createdAt)}</span>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        {announcement.status !== "PUBLISHED" && (
                          <button
                            onClick={() => handlePublish(announcement.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                          >
                            <Send className="h-4 w-4" />
                            Publish
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
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