"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { api, getAccessToken } from "@/lib/api";
import { normalizeRoles } from "@/lib/roles";
import { Activity, CheckCircle2, Play, RefreshCw, XCircle } from "lucide-react";

type WorkflowExecution = {
  id: string;
  workflowName: string;
  sourceService: string;
  eventType: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "RETRYING";
  errorMessage?: string | null;
  startedAt?: string;
  finishedAt?: string;
  createdAt?: string;
};

const workflowNames = [
  "incident-created-workflow",
  "user-registered-workflow",
  "library-loan-created-workflow",
  "critical-notification-workflow",
];

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function statusClass(status: WorkflowExecution["status"]) {
  if (status === "SUCCESS") return "bg-emerald-100 text-emerald-700";
  if (status === "FAILED") return "bg-red-100 text-red-700";
  if (status === "RETRYING") return "bg-amber-100 text-amber-700";
  return "bg-slate-200 text-slate-700";
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.name === "401") return "Your session has expired. Please sign in again.";
    if (error.name === "403") return "Only admin users can trigger workflows manually.";
    if (error.message.toLowerCase().includes("fetch")) return "Workflow Service is currently unavailable.";
  }
  return "Unable to complete the workflow operation.";
}

export default function WorkflowsPage() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const roles = useMemo(() => normalizeRoles(user), [user]);
  const isAdmin = roles.includes("admin");

  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [workflowName, setWorkflowName] = useState(workflowNames[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadExecutions() {
    setIsLoading(true);
    setError("");
    try {
      setExecutions(await api.getWorkflowExecutions(50));
    } catch (requestError: any) {
      if (requestError?.name === "401") router.push("/login");
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!loading && !getAccessToken()) router.push("/login");
  }, [loading, router]);

  useEffect(() => {
    if (!loading && getAccessToken()) loadExecutions();
  }, [loading]);

  async function triggerWorkflow() {
    if (!isAdmin) return;
    setIsTriggering(true);
    setMessage("");
    setError("");
    try {
      await api.triggerWorkflow({
        workflowName,
        sourceService: "web-app",
        eventType: "ManualWorkflowTrigger",
        requestPayload: {
          message: "Manual workflow test from Smart Campus web-app",
          triggeredAt: new Date().toISOString(),
        },
        triggeredByUserId: String((user as any)?.id || (user as any)?.email || "admin"),
        idempotencyKey: `manual-${workflowName}-${Date.now()}`,
      });
      setMessage("Workflow triggered successfully. Check n8n and execution history.");
      await loadExecutions();
    } catch (requestError: any) {
      if (requestError?.name === "401") router.push("/login");
      setError(getErrorMessage(requestError));
    } finally {
      setIsTriggering(false);
    }
  }

  const totals = useMemo(
    () => ({
      total: executions.length,
      success: executions.filter((execution) => execution.status === "SUCCESS").length,
      failed: executions.filter((execution) => execution.status === "FAILED").length,
    }),
    [executions],
  );

  return (
    <AppShell>
      <main className="min-h-screen bg-slate-100 p-6 lg:p-10">
        <section className="rounded-3xl bg-gradient-to-r from-[#002b5c] via-[#003b7a] to-[#8b0000] p-10 text-white shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f4c430]">Automation</p>
          <h1 className="mt-4 text-5xl font-extrabold">Workflow Automation</h1>
          <p className="mt-4 max-w-4xl text-lg text-white/80">Trigger and monitor Smart Campus business workflows integrated with secure n8n webhooks.</p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><Activity className="mb-4 text-[#002b5c]" /><p className="text-sm font-bold text-slate-500">Executions</p><p className="mt-2 text-3xl font-black text-[#002b5c]">{totals.total}</p></div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><CheckCircle2 className="mb-4 text-emerald-600" /><p className="text-sm font-bold text-slate-500">Success</p><p className="mt-2 text-3xl font-black text-emerald-600">{totals.success}</p></div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><XCircle className="mb-4 text-red-600" /><p className="text-sm font-bold text-slate-500">Failed</p><p className="mt-2 text-3xl font-black text-red-600">{totals.failed}</p></div>
        </section>

        {(message || error) && <div className={`mt-6 rounded-2xl p-4 text-sm font-semibold ring-1 ${error ? "bg-red-50 text-red-700 ring-red-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200"}`}>{error || message}</div>}

        {isAdmin && <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-extrabold text-[#002b5c]">Manual Workflow Trigger</h2>
          <p className="mt-2 text-sm text-slate-500">Admin users can send a test event to workflow-service through the API Gateway.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
            <select className="rounded-xl border px-4 py-3" value={workflowName} onChange={(event) => setWorkflowName(event.target.value)}>{workflowNames.map((name) => <option key={name} value={name}>{name}</option>)}</select>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#002b5c] px-5 py-3 font-bold text-white disabled:opacity-50" disabled={isTriggering} onClick={triggerWorkflow}><Play size={18} /> {isTriggering ? "Triggering..." : "Trigger Workflow"}</button>
          </div>
        </section>}

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div><h2 className="text-2xl font-extrabold text-[#002b5c]">Execution History</h2><p className="mt-2 text-sm text-slate-500">Recent workflow execution records stored by workflow-service.</p></div>
            <button className="flex items-center gap-2 rounded-xl bg-[#f4c430] px-4 py-3 font-bold text-[#002b5c]" onClick={loadExecutions}><RefreshCw size={18} /> Refresh List</button>
          </div>
          {isLoading ? <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">Loading workflow executions...</div> : executions.length === 0 ? <div className="rounded-2xl border border-dashed p-10 text-center text-slate-500">No workflow executions found.</div> : <div className="overflow-x-auto rounded-2xl border"><table className="min-w-full bg-white text-sm"><thead className="bg-[#002b5c] text-white"><tr><th className="px-4 py-3 text-left">Workflow</th><th className="px-4 py-3 text-left">Source</th><th className="px-4 py-3 text-left">Event</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Started</th><th className="px-4 py-3 text-left">Finished</th><th className="px-4 py-3 text-left">Error</th></tr></thead><tbody>{executions.map((execution) => <tr key={execution.id} className="border-b last:border-b-0"><td className="px-4 py-3 font-bold text-[#002b5c]">{execution.workflowName}</td><td className="px-4 py-3">{execution.sourceService}</td><td className="px-4 py-3">{execution.eventType}</td><td className="px-4 py-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(execution.status)}`}>{execution.status}</span></td><td className="px-4 py-3">{formatDate(execution.startedAt || execution.createdAt)}</td><td className="px-4 py-3">{formatDate(execution.finishedAt)}</td><td className="px-4 py-3 text-red-600">{execution.errorMessage || "-"}</td></tr>)}</tbody></table></div>}
        </section>
      </main>
    </AppShell>
  );
}
