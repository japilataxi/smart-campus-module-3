"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { api, getAccessToken } from "@/lib/api";
import { normalizeRoles } from "@/lib/roles";

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
    if (error.name === "401") return "Session expired. Please log in again.";
    if (error.name === "403") return "You do not have permission to perform this action.";
    return error.message;
  }

  return "Unexpected request error.";
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

  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-8 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">
          QR Access Service
        </p>

        <h1 className="mt-3 text-4xl font-extrabold">
          QR Access Management
        </h1>

        <p className="mt-2 text-white/75">
          Generate, validate, revoke, and monitor campus QR access codes.
        </p>
      </section>

      {message && (
        <div className="mt-6 rounded-xl bg-[#f4c430]/20 p-4 font-bold text-[#002b5c]">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 font-bold text-red-700 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <section className="mt-8 grid gap-6 xl:grid-cols-[2fr_1fr]">
        {canGenerate && (
          <form
            onSubmit={generateQrAccess}
            className="grid gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:grid-cols-2"
          >
            <input
              className="input"
              placeholder="User ID"
              value={form.userId}
              onChange={(event) =>
                setForm((current) => ({ ...current, userId: event.target.value }))
              }
              required
            />

            <input
              className="input"
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
              className="input"
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
              className="input"
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
          </form>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            validateQrAccess();
          }}
          className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
        >
          <h2 className="text-xl font-extrabold text-[#002b5c]">
            Validate QR
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Enter a QR code to verify campus access.
          </p>

          <input
            className="input mt-5 w-full"
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

      <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#002b5c]">
              QR Access Codes
            </h2>
            <p className="text-sm text-slate-500">
              {isStudent ? "Your campus QR access codes." : "Generated campus QR access codes."}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-[#002b5c] text-white">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">User ID</th>
                <th className="p-4">QR Code</th>
                <th className="p-4">Status</th>
                <th className="p-4">Expiration Date</th>
                <th className="p-4">Location</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Loading QR access codes...
                  </td>
                </tr>
              )}

              {!loading &&
                qrCodes.map((qrAccess) => (
                  <tr key={qrAccess.id} className="border-b border-slate-100">
                    <td className="p-4 font-bold text-[#002b5c]">
                      {qrAccess.id}
                    </td>
                    <td className="p-4 text-slate-600">{qrAccess.userId}</td>
                    <td className="p-4 font-mono text-sm text-slate-700">
                      {qrAccess.qrCode}
                    </td>
                    <td className="p-4">
                      <span className={statusBadgeClass(qrAccess.status)}>
                        {qrAccess.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      {formatDate(qrAccess.expirationDate)}
                    </td>
                    <td className="p-4 text-slate-600">{qrAccess.location}</td>
                    <td className="flex flex-wrap gap-2 p-4">
                      {canValidate && qrAccess.status === "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => validateQrAccess(qrAccess.qrCode)}
                          className="rounded-xl bg-[#f4c430] px-4 py-2 font-bold text-[#002b5c]"
                        >
                          Validate
                        </button>
                      )}

                      {canRevoke && qrAccess.status === "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => revokeQrAccess(qrAccess.id)}
                          className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white"
                        >
                          Revoke
                        </button>
                      )}

                      {canViewLogs && (
                        <button
                          type="button"
                          onClick={loadLogs}
                          className="rounded-xl bg-[#002b5c] px-4 py-2 font-bold text-white"
                        >
                          View Logs
                        </button>
                      )}

                      {!canValidate && !canRevoke && !canViewLogs && (
                        <span className="text-sm text-slate-400">No action</span>
                      )}
                    </td>
                  </tr>
                ))}

              {!loading && qrCodes.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No QR access codes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {canViewLogs && (
        <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#002b5c]">
                Access Attempts
              </h2>
              <p className="text-sm text-slate-500">
                Validation attempts and QR access audit messages.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-[#002b5c] text-white">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">User ID</th>
                  <th className="p-4">QR Code</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Attempt Date</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Message</th>
                </tr>
              </thead>

              <tbody>
                {logsLoading && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Loading access attempts...
                    </td>
                  </tr>
                )}

                {!logsLoading &&
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100">
                      <td className="p-4 font-bold text-[#002b5c]">{log.id}</td>
                      <td className="p-4 text-slate-600">{log.userId}</td>
                      <td className="p-4 font-mono text-sm text-slate-700">
                        {log.qrCode}
                      </td>
                      <td className="p-4">
                        <span className={statusBadgeClass(log.status)}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        {formatDate(log.attemptDate)}
                      </td>
                      <td className="p-4 text-slate-600">{log.location}</td>
                      <td className="p-4 text-slate-600">{log.message}</td>
                    </tr>
                  ))}

                {!logsLoading && logs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No access attempts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </AppShell>
  );
}
