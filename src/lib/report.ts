import type { AnalysisResult } from "./password";

/**
 * Generates a printable HTML report and opens the browser print dialog,
 * letting the user "Save as PDF". Fully client-side, no dependencies.
 */
export function exportAnalysisReport(result: AnalysisResult): void {
  if (typeof window === "undefined") return;

  const rulesRows = result.rules
    .map(
      (r) =>
        `<tr><td>${r.label}</td><td style="color:${r.passed ? "#16a34a" : "#dc2626"};font-weight:600">${r.passed ? "PASS" : "FAIL"}</td></tr>`,
    )
    .join("");

  const suggestions =
    result.suggestions.length > 0
      ? `<ul>${result.suggestions.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`
      : "<p>No specific recommendations — this password looks solid.</p>";

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>SecurePass Analysis Report</title>
<style>
  *{box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;margin:0;padding:40px;background:#fff}
  .wrap{max-width:720px;margin:0 auto}
  h1{font-size:24px;margin:0}
  .sub{color:#64748b;margin:4px 0 28px}
  .badge{display:inline-block;padding:6px 14px;border-radius:999px;background:#0ea5a4;color:#fff;font-weight:600}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0}
  .card{border:1px solid #e2e8f0;border-radius:12px;padding:16px}
  .label{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#64748b}
  .val{font-size:20px;font-weight:700;margin-top:4px}
  table{width:100%;border-collapse:collapse;margin-top:8px}
  td{padding:8px 4px;border-bottom:1px solid #eef2f7;font-size:14px}
  h2{font-size:15px;text-transform:uppercase;letter-spacing:.05em;color:#334155;margin:28px 0 8px}
  .foot{margin-top:36px;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0;padding-top:12px}
</style></head>
<body><div class="wrap">
  <h1>🛡️ SecurePass Analysis Report</h1>
  <p class="sub">Generated ${new Date().toLocaleString()} · 100% client-side · password value not stored</p>
  <span class="badge">${result.label} · ${result.security.label}</span>
  <div class="grid">
    <div class="card"><div class="label">Strength score</div><div class="val">${result.score} / 4</div></div>
    <div class="card"><div class="label">Entropy</div><div class="val">${result.entropy.toFixed(1)} bits</div></div>
    <div class="card"><div class="label">Estimated crack time</div><div class="val">${escapeHtml(result.crackTime)}</div></div>
    <div class="card"><div class="label">Guesses needed</div><div class="val">10^${result.guessesLog10}</div></div>
  </div>
  <h2>Security checks</h2>
  <table>${rulesRows}</table>
  <h2>Recommendations</h2>
  ${result.warning ? `<p style="color:#b45309"><strong>Warning:</strong> ${escapeHtml(result.warning)}</p>` : ""}
  ${suggestions}
  <p class="foot">SecurePass Analyzer — this report contains analysis metrics only and never includes the analyzed password.</p>
</div>
<script>window.onload=function(){setTimeout(function(){window.print();},250);};</script>
</body></html>`;

  const win = window.open("", "_blank", "width=820,height=900");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
