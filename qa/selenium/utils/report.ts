import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { seleniumEnv } from "./env.js";

export type TestStatus = "aprobado" | "fallido";

export type TestReportEntry = {
  code: string;
  name: string;
  status: TestStatus;
  durationMs: number;
  executedAt: string;
  evidencePath: string;
  error?: string;
};

type ExecutionReport = {
  project: string;
  testType: string;
  tool: string;
  browser: string;
  generatedAt: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    totalDurationMs: number;
  };
  tests: TestReportEntry[];
};

function formatDuration(durationMs: number): string {
  return `${(durationMs / 1000).toFixed(2)} s`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toRelativeEvidencePath(evidencePath: string): string {
  return path.relative(path.resolve("reports"), evidencePath).replace(/\\/g, "/");
}

function buildReport(entries: TestReportEntry[]): ExecutionReport {
  return {
    project: "Smart Campus UCE - Modulo 3",
    testType: "Pruebas funcionales automatizadas con Selenium",
    tool: "Selenium WebDriver",
    browser: seleniumEnv.browser,
    generatedAt: new Date().toISOString(),
    summary: {
      total: entries.length,
      passed: entries.filter((entry) => entry.status === "aprobado").length,
      failed: entries.filter((entry) => entry.status === "fallido").length,
      totalDurationMs: entries.reduce((total, entry) => total + entry.durationMs, 0),
    },
    tests: entries,
  };
}

function buildHtmlReport(report: ExecutionReport): string {
  const rows = report.tests
    .map((entry) => {
      const evidenceHref = toRelativeEvidencePath(entry.evidencePath);
      const statusClass = entry.status === "aprobado" ? "status-passed" : "status-failed";

      return `
        <tr>
          <td>${escapeHtml(entry.code)}</td>
          <td>${escapeHtml(entry.name)}</td>
          <td><span class="status ${statusClass}">${escapeHtml(entry.status)}</span></td>
          <td>${formatDuration(entry.durationMs)}</td>
          <td><a href="${escapeHtml(evidenceHref)}" target="_blank">Ver captura</a></td>
        </tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reporte Selenium - Smart Campus UCE</title>
  <style>
    body {
      margin: 0;
      background: #eef3f8;
      color: #172033;
      font-family: Arial, Helvetica, sans-serif;
    }

    main {
      max-width: 1120px;
      margin: 32px auto;
      padding: 0 24px;
    }

    header {
      background: #002b5c;
      color: #ffffff;
      border-radius: 8px;
      padding: 28px 32px;
    }

    h1 {
      margin: 0;
      font-size: 28px;
    }

    .subtitle {
      margin: 10px 0 0;
      color: #d7e3f4;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin: 24px 0;
    }

    .card {
      background: #ffffff;
      border: 1px solid #d8e0ea;
      border-radius: 8px;
      padding: 18px;
    }

    .card span {
      display: block;
      color: #5d6b82;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .card strong {
      display: block;
      margin-top: 8px;
      color: #002b5c;
      font-size: 24px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: #ffffff;
      border: 1px solid #d8e0ea;
      border-radius: 8px;
      overflow: hidden;
    }

    th, td {
      padding: 14px 16px;
      border-bottom: 1px solid #e5ebf2;
      text-align: left;
      font-size: 14px;
    }

    th {
      background: #f5f8fb;
      color: #002b5c;
      font-size: 12px;
      text-transform: uppercase;
    }

    tr:last-child td {
      border-bottom: 0;
    }

    a {
      color: #8b0000;
      font-weight: 700;
      text-decoration: none;
    }

    .status {
      display: inline-block;
      border-radius: 999px;
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .status-passed {
      background: #dcfce7;
      color: #166534;
    }

    .status-failed {
      background: #fee2e2;
      color: #991b1b;
    }

    .meta {
      margin-top: 18px;
      color: #5d6b82;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>${escapeHtml(report.project)}</h1>
      <p class="subtitle">${escapeHtml(report.testType)}</p>
      <p class="subtitle">Herramienta: ${escapeHtml(report.tool)} | Navegador: ${escapeHtml(report.browser)}</p>
    </header>

    <section class="summary">
      <div class="card"><span>Total de pruebas</span><strong>${report.summary.total}</strong></div>
      <div class="card"><span>Aprobadas</span><strong>${report.summary.passed}</strong></div>
      <div class="card"><span>Fallidas</span><strong>${report.summary.failed}</strong></div>
      <div class="card"><span>Duracion total</span><strong>${formatDuration(report.summary.totalDurationMs)}</strong></div>
    </section>

    <table>
      <thead>
        <tr>
          <th>Codigo</th>
          <th>Nombre del caso</th>
          <th>Estado</th>
          <th>Duracion</th>
          <th>Evidencia</th>
        </tr>
      </thead>
      <tbody>${rows}
      </tbody>
    </table>

    <p class="meta">Fecha y hora de ejecucion: ${escapeHtml(report.generatedAt)}</p>
  </main>
</body>
</html>`;
}

export async function writeExecutionReport(entries: TestReportEntry[]): Promise<string> {
  const reportsDir = path.resolve("reports");
  await mkdir(reportsDir, { recursive: true });

  const report = buildReport(entries);
  const jsonReportPath = path.join(reportsDir, "selenium-functional-report.json");
  const htmlReportPath = path.join(reportsDir, "selenium-functional-report.html");

  await writeFile(jsonReportPath, JSON.stringify(report, null, 2), "utf8");
  await writeFile(htmlReportPath, buildHtmlReport(report), "utf8");

  return htmlReportPath;
}