import type { ReadinessReport, RuleResult, Severity } from "../types.js";

const severityRank: Record<Severity, number> = {
  critical: 4,
  high: 3,
  warning: 2,
  info: 1,
};

function bar(score: number): string {
  const filled = Math.round(score / 10);
  return `${"█".repeat(filled)}${"░".repeat(10 - filled)}`;
}

function finding(item: RuleResult): string {
  const lines = [`${item.severity.toUpperCase().padEnd(8)} ${item.ruleId}  ${item.summary}`];
  for (const evidence of item.evidence.slice(0, 3)) {
    const location = evidence.file
      ? ` (${evidence.file}${evidence.line ? `:${evidence.line}` : ""})`
      : "";
    lines.push(`           - ${evidence.message}${location}${evidence.value ? `: ${evidence.value}` : ""}`);
  }
  if (item.remediation) lines.push(`             Fix: ${item.remediation}`);
  return lines.join("\n");
}

export function terminalReport(report: ReadinessReport): string {
  const output: string[] = [
    "",
    `Agent Readiness: ${report.score}/100 — Grade ${report.grade}`,
    `Profile: ${report.profile}  Mode: ${report.mode}`,
  ];
  if (report.scoreCap !== null) {
    output.push(`Score capped at ${report.scoreCap} by a critical readiness gate (raw score ${report.rawScore}).`);
  }
  output.push("", "Dimensions");
  for (const dimension of report.dimensions) {
    output.push(
      `  ${dimension.label.padEnd(30)} ${bar(dimension.score)} ${String(dimension.score).padStart(3)}/100  (${dimension.weight}%)`,
    );
  }

  const failures = report.results
    .filter((item) => item.status === "fail")
    .sort((a, b) => severityRank[b.severity] - severityRank[a.severity] || b.deduction - a.deduction);
  output.push("", `Findings (${failures.length})`);
  if (failures.length === 0) output.push("  No readiness deductions found.");
  for (const item of failures) output.push(finding(item));

  if (report.commands.length > 0) {
    output.push("", "Verification commands");
    for (const command of report.commands) {
      output.push(
        `  ${command.status.toUpperCase().padEnd(9)} ${(command.durationMs / 1000).toFixed(1).padStart(6)}s  ${command.command}`,
      );
    }
  }
  output.push(
    "",
    `${report.summary.passed} passed · ${report.summary.failed} failed · ${report.summary.skipped} skipped`,
    "",
  );
  return output.join("\n");
}
