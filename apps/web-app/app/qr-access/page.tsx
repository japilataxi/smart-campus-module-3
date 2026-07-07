"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { api, getAccessToken } from "@/lib/api";
import { normalizeRoles } from "@/lib/roles";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  KeyRound,
  MapPin,
  QrCode,
  RefreshCcw,
  ShieldCheck,
  Trash2,
} from "lucide-react";

type QrAccessStatus = "ACTIVE" | "USED" | "EXPIRED" | "REVOKED";

type QrAccessCode = {
  id: string;
  userId: string;
  qrCode: string;
  status: QrAccessStatus;
  expirationDate: string;
  location: string;
  accessType?: string;
};

type QrAccessLog = {
  id: string;
  userId: string;
  qrCode: string;
  status: QrAccessStatus;
  attemptDate: string;
  location: string;
  message: string;
};

const emptyForm = {
  userId: "",
  expirationDate: "",
  accessType: "campus-entry",
  location: "",
};

function normalizeStatus(status: unknown): QrAccessStatus {
  const value = String(status || "ACTIVE").toUpperCase();

  if (["ACTIVE", "USED", "EXPIRED", "REVOKED"].includes(value)) {
    return value as QrAccessStatus;
  }

  return "ACTIVE";
}

function formatDate(value?: string) {
  if (!value) return "Not provided";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.name === "401") {
      return "Your session has expired. Please sign in again.";
    }

    if (error.name === "403") {
      return "You do not have permission to perform this action.";
    }

    if (
      error.message === "Failed to fetch" ||
      error.message.includes("fetch")
    ) {
      return "QR Access Service is currently unavailable. Please try again in a few moments.";
    }

    return error.message;
  }

  return "An unexpected error occurred.";
}

function statusBadgeClass(status: QrAccessStatus) {
  const classes: Record<QrAccessStatus, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    USED: "bg-blue-100 text-blue-700",
    EXPIRED: "bg-yellow-100 text-yellow-700",
    REVOKED: "bg-red-100 text-red-700",
  };

  return `rounded-full px-3 py-1 text-xs font-bold ${classes[status]}`;
}

function normalizeQrAccessCode(record: any): QrAccessCode {
  return {
    id: String(record.id),
    userId: String(record.userId || record.user_id || ""),
    qrCode: String(record.qrCode || record.qr_code || record.code || ""),
    status: normalizeStatus(record.status),
    expirationDate: String(record.expirationDate || record.expiresAt || record.expires_at || ""),
    location: String(record.location || record.accessPoint || record.access_point || ""),
    accessType: record.accessType || record.access_type,
  };
}

function normalizeQrAccessLog(record: any): QrAccessLog {
  return {
    id: String(record.id),
    userId: String(record.userId || record.user_id || ""),
    qrCode: String(record.qrCode || record.qr_code || record.code || ""),
    status: normalizeStatus(record.status || record.result),
    attemptDate: String(record.attemptDate || record.lastAttemptAt || record.attemptedAt || record.createdAt || ""),
    location: String(record.location || record.accessPoint || record.access_point || ""),
    message: String(record.message || record.lastDenialReason || record.reason || "Access attempt registered."),
  };
}

function getValidationMessage(response: any) {
  const status = normalizeStatus(response?.status || response?.qrAccessCode?.status);
  const granted = response?.granted === true;
  const reason = String(response?.reason || response?.message || "").toLowerCase();

  if (granted) return "Access granted";
  if (status === "EXPIRED") return "QR expired";
  if (status === "REVOKED") return "QR revoked";
  if (status === "USED") {
    return reason.includes("already") ? "QR already used" : "Access granted";
  }
  return response?.reason || "Access denied";
}

export default function QrAccessPage() {
  const router = useRouter();
  const { user } = useAuth();

  const roles = useMemo(() => normalizeRoles(user), [user]);
  const isAdmin = roles.includes("admin");
  const isStudent = roles.includes("student");
  const canGenerate = isAdmin;
  const canValidate =
    isAdmin ||
    isStudent ||
    roles.includes("librarian") ||
    roles.includes("staff");
  const canRevoke = isAdmin;
  const canViewLogs = isAdmin;

  const [qrCodes, setQrCodes] = useState<QrAccessCode[]>([]);
  const [logs, setLogs] = useState<QrAccessLog[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [validationQrCode, setValidationQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleAuthError(errorValue: unknown) {
    if (errorValue instanceof Error && errorValue.name === "401") {
      router.push("/login");
    }
  }

  async function loadQrCodes() {
    const data = await api.getQrAccessCodes();
    const normalized = data.map(normalizeQrAccessCode);

    if (isStudent && user?.id) {
      setQrCodes(normalized.filter((item) => item.userId === user.id));
      return;
    }

    setQrCodes(normalized);
  }

  async function loadLogs() {
    if (!canViewLogs) return;

    setLogsLoading(true);
    try {
      const data = await api.getQrAccessLogs();
      setLogs(data.map(normalizeQrAccessLog));
    } catch (errorValue) {
      handleAuthError(errorValue);
      setError(getErrorMessage(errorValue));
    } finally {
      setLogsLoading(false);
    }
  }

  async function refreshPageData() {
    setLoading(true);
    setError("");

    try {
      await loadQrCodes();
      await loadLogs();
    } catch (errorValue) {
      handleAuthError(errorValue);
      setError(getErrorMessage(errorValue));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getAccessToken()) {
      router.push("/login");
      return;
    }

    refreshPageData();
  }, [router, user?.id, canViewLogs]);

  async function generateQrAccess(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.createQrAccessCode(form);
      setForm(emptyForm);
      setMessage("QR access code generated successfully.");
      await refreshPageData();
    } catch (errorValue) {
      handleAuthError(errorValue);
      setError(getErrorMessage(errorValue));
    }
  }

  async function validateQrAccess(qrCode = validationQrCode) {
    if (!qrCode.trim()) {
      setError("Enter a QR code to validate.");
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await api.validateQrAccessCode({ qrCode });
      setMessage(getValidationMessage(response));
      setValidationQrCode("");
      await refreshPageData();
    } catch (errorValue) {
      handleAuthError(errorValue);
      setError(getErrorMessage(errorValue));
    }
  }

  async function revokeQrAccess(id: string) {
    if (!confirm("Are you sure you want to revoke this QR access code?")) return;

    setError("");
    setMessage("");

    try {
      await api.revokeQrAccessCode(id);
      setMessage("QR access code revoked successfully.");
      await refreshPageData();
    } catch (errorValue) {
      handleAuthError(errorValue);
      setError(getErrorMessage(errorValue));
    }
  }

  const activeQrCodes = qrCodes.filter((item) => item.status === "ACTIVE").length;
  const usedQrCodes = qrCodes.filter((item) => item.status === "USED").length;
  const revokedQrCodes = qrCodes.filter((item) => item.status === "REVOKED").length;

return (
  <AppShell>
    <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
        QR Access Service
      </p>

      <h1 className="mt-4 text-5xl font-extrabold">
        QR Access Management
      </h1>

      <p className="mt-4 max-w-3xl text-lg text-white/80">
        Manage secure campus access using temporary QR codes. Generate
        credentials, validate entries, revoke access and review validation
        history from a single interface.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Badge text="QR Generation" />
        <Badge text="Access Validation" />
        <Badge text="Revocation Control" />
        <Badge text="Access History" />
      </div>
    </section>

    <section className="mt-8 grid gap-5 md:grid-cols-4">
      <InfoCard
        icon={<QrCode />}
        title="Total QR Codes"
        value={qrCodes.length}
        text="QR credentials generated in the system."
      />

      <InfoCard
        icon={<ShieldCheck />}
        title="Active Codes"
        value={activeQrCodes}
        text="QR codes currently available for validation."
      />

      <InfoCard
        icon={<CheckCircle2 />}
        title="Used Codes"
        value={usedQrCodes}
        text="QR codes already validated."
      />

      <InfoCard
        icon={<Trash2 />}
        title="Revoked Codes"
        value={revokedQrCodes}
        text="QR codes manually revoked."
      />
    </section>

    {message && (
      <AlertMessage type="success" message={message} />
    )}

    {error && (
      <AlertMessage type="error" message={error} />
    )}

    <section className="mt-8 grid gap-6 xl:grid-cols-[2fr_1fr]">
      {canGenerate && (
        <form
          onSubmit={generateQrAccess}
          className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-[#002b5c]">
              Generate QR Access Code
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Create a temporary QR credential for a user, location and access
              type.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]"
              placeholder="User ID"
              value={form.userId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  userId: event.target.value,
                }))
              }
              required
            />

            <input
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]"
              type="datetime-local"
              value={form.expirationDate}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  expirationDate: event.target.value,
                }))
              }
              required
            />

            <input
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]"
              placeholder="Access Type"
              value={form.accessType}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  accessType: event.target.value,
                }))
              }
              required
            />

            <input
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#f4c430]"
              placeholder="Location"
              value={form.location}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
              required
            />

            <button className="rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white transition hover:bg-[#003b7a] md:col-span-2">
              Generate QR
            </button>
          </div>
        </form>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          validateQrAccess();
        }}
        className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#002b5c]">
            Validate Campus Access
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter a generated QR code to verify whether the user is authorized
            to access the campus location.
          </p>
        </div>

        <input
          className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none focus:border-[#f4c430]"
          placeholder="QR Code"
          value={validationQrCode}
          onChange={(event) => setValidationQrCode(event.target.value)}
          disabled={!canValidate}
        />

        <button
          disabled={!canValidate}
          className="mt-4 w-full rounded-xl bg-[#f4c430] px-5 py-3 font-bold text-[#002b5c] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          Validate QR
        </button>
      </form>
    </section>

    <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-[#002b5c]">
            Issued QR Codes
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {isStudent
              ? "Review your campus QR access codes and their current status."
              : "Review generated campus QR access codes, expiration dates and available actions."}
          </p>
        </div>

        <span className="rounded-full bg-[#002b5c]/10 px-4 py-2 text-sm font-bold text-[#002b5c]">
          {qrCodes.length} records
        </span>
      </div>

      {loading ? (
        <EmptyState
          icon={<QrCode />}
          title="Loading QR access codes..."
          text="Please wait while access credentials are loaded."
        />
      ) : qrCodes.length === 0 ? (
        <EmptyState
          icon={<QrCode />}
          title="No QR access codes found"
          text="Generated QR credentials will appear here."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3 text-left">
            <thead>
              <tr className="text-sm uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2">QR Access</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Expiration</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {qrCodes.map((qrAccess) => (
                <tr key={qrAccess.id} className="bg-slate-50">
                  <td className="rounded-l-2xl px-4 py-4">
                    <p className="font-bold text-[#002b5c]">
                      QR #{qrAccess.id}
                    </p>
                    <p className="mt-1 max-w-xs truncate font-mono text-xs text-slate-500">
                      {qrAccess.qrCode}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {qrAccess.userId}
                  </td>

                  <td className="px-4 py-4">
                    <span className={statusBadgeClass(qrAccess.status)}>
                      {qrAccess.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <Clock size={16} className="text-[#002b5c]" />
                      {formatDate(qrAccess.expirationDate)}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={16} className="text-[#002b5c]" />
                      {qrAccess.location || "Not provided"}
                    </span>
                  </td>

                  <td className="rounded-r-2xl px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {canValidate && qrAccess.status === "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => validateQrAccess(qrAccess.qrCode)}
                          className="rounded-xl bg-[#f4c430] px-4 py-2 font-bold text-[#002b5c] transition hover:bg-yellow-300"
                        >
                          Validate
                        </button>
                      )}

                      {canRevoke && qrAccess.status === "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => revokeQrAccess(qrAccess.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700"
                        >
                          <Trash2 size={16} />
                          Revoke
                        </button>
                      )}

                      {!canValidate && !canRevoke && (
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

    {canViewLogs && (
      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-[#002b5c]">
              Access History
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review validation attempts, locations, status results and audit
              messages.
            </p>
          </div>

          <button
            type="button"
            onClick={loadLogs}
            className="inline-flex items-center gap-2 rounded-xl bg-[#002b5c] px-4 py-2 font-bold text-white transition hover:bg-[#003b7a]"
          >
            <RefreshCcw size={16} />
            Refresh Logs
          </button>
        </div>

        {logsLoading ? (
          <EmptyState
            icon={<KeyRound />}
            title="Loading access history..."
            text="Please wait while validation attempts are loaded."
          />
        ) : logs.length === 0 ? (
          <EmptyState
            icon={<KeyRound />}
            title="No access attempts found"
            text="Validation attempts will appear here once QR codes are used."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="text-sm uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2">Attempt</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Message</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="bg-slate-50">
                    <td className="rounded-l-2xl px-4 py-4">
                      <p className="font-bold text-[#002b5c]">
                        Attempt #{log.id}
                      </p>
                      <p className="mt-1 max-w-xs truncate font-mono text-xs text-slate-500">
                        {log.qrCode}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {log.userId}
                    </td>

                    <td className="px-4 py-4">
                      <span className={statusBadgeClass(log.status)}>
                        {log.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {formatDate(log.attemptDate)}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {log.location || "Not provided"}
                    </td>

                    <td className="rounded-r-2xl px-4 py-4 text-slate-600">
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    )}
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

      <h2 className="mt-2 text-3xl font-extrabold text-[#002b5c]">
        {value}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {text}
      </p>
    </div>
  );
}

function AlertMessage({
  type,
  message,
}: {
  type: "success" | "error";
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

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-10 text-center ring-1 ring-slate-200">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 ring-1 ring-slate-200">
        {icon}
      </div>

      <h3 className="mt-4 text-xl font-extrabold text-[#002b5c]">
        {title}
      </h3>

      <p className="mt-2 text-slate-500">
        {text}
      </p>
    </div>
  );
}