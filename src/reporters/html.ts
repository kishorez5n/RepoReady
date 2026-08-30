import type { ReadinessReport } from "../types.js";
import { escapeHtml } from "../utils.js";

export function htmlReport(report: ReadinessReport): string {
  const dimensions = report.dimensions
    .map(
      (item) => `<div class="dimension"><div><strong>${escapeHtml(item.label)}</strong><span>${item.score}/100 · weight ${item.weight}%</span></div><div class="bar"><i style="width:${item.score}%"></i></div></div>`,
    )
    .join("");
  const findings = report.results
    .filter((item) => item.status === "fail")
    .map(
      (item) => `<article class="finding ${item.severity}"><header><code>${escapeHtml(item.ruleId)}</code><span>${escapeHtml(item.severity)}</span></header><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p>${item.evidence.length ? `<ul>${item.evidence.map((evidence) => `<li>${escapeHtml(evidence.message)}${evidence.file ? ` — <code>${escapeHtml(evidence.file)}${evidence.line ? `:${evidence.line}` : ""}</code>` : ""}${evidence.value ? `: ${escapeHtml(evidence.value)}` : ""}</li>`).join("")}</ul>` : ""}${item.remediation ? `<p class="fix"><strong>Fix:</strong> ${escapeHtml(item.remediation)}</p>` : ""}</article>`,
    )
    .join("");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agent Readiness — ${report.score}/100</title>
<style>:root{font-family:Inter,ui-sans-serif,system-ui;color:#172033;background:#f5f7fb}body{margin:0}main{max-width:960px;margin:0 auto;padding:48px 24px}.hero{background:#172033;color:white;border-radius:20px;padding:32px;display:flex;justify-content:space-between;align-items:end}.score{font-size:64px;font-weight:800;line-height:1}.grade{font-size:24px;color:#9ee6c3}.panel{background:white;border:1px solid #dfe4ee;border-radius:16px;padding:24px;margin-top:20px}.dimension{margin:16px 0}.dimension>div:first-child{display:flex;justify-content:space-between}.dimension span{color:#647085}.bar{height:8px;background:#e9edf4;border-radius:8px;margin-top:7px;overflow:hidden}.bar i{display:block;height:100%;background:#287f61}.finding{background:white;border:1px solid #dfe4ee;border-left:5px solid #d19a24;border-radius:10px;padding:18px;margin:12px 0}.finding.high{border-left-color:#db6d28}.finding.critical{border-left-color:#c9384f}.finding header{display:flex;justify-content:space-between;color:#647085;text-transform:uppercase}.finding h3{margin-bottom:6px}.fix{background:#f5f7fb;padding:12px;border-radius:8px}code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace}small{color:#aeb8cb}</style></head>
<body><main><section class="hero"><div><small>AGENT-READY REPOSITORY SCORE</small><div class="score">${report.score}<small>/100</small></div><div class="grade">Grade ${escapeHtml(report.grade)}</div></div><div>${escapeHtml(report.profile)} · ${escapeHtml(report.mode)}<br><small>${escapeHtml(report.root)}</small></div></section><section class="panel"><h2>Dimensions</h2>${dimensions}</section><section><h2>Findings (${report.summary.failed})</h2>${findings || '<div class="panel">No readiness deductions found.</div>'}</section></main></body></html>`;
}
