import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { htmlReport } from "../src/reporters/html.js";
import { discoverRepository } from "../src/discovery.js";
import { scanRepository } from "../src/scanner.js";
import { gradeFor, scoreResults } from "../src/scoring.js";
import type { RuleResult } from "../src/types.js";
import { verifyRepository } from "../src/verification.js";

const fixture = (name: string): string => path.resolve(process.cwd(), "test", "fixtures", name);

test("a prepared repository earns a high evidence-backed score", async () => {
  const report = await scanRepository(fixture("good"), { mode: "scan" });
  assert.ok(report.score >= 90, `expected >= 90, received ${report.score}`);
  assert.equal(report.scoreCap, null);
  assert.equal(report.summary.critical, 0);
  assert.ok(report.results.some((item) => item.ruleId === "RR-CTX-003" && item.status === "pass"));
});

test("a likely credential caps the final score even when raw dimensions are higher", async () => {
  const report = await scanRepository(fixture("unsafe"), { mode: "scan" });
  assert.equal(report.scoreCap, 39);
  assert.ok(report.score <= 39);
  assert.ok(report.results.some((item) => item.ruleId === "RR-SAFE-002" && item.severity === "critical"));
});

test("verification executes the declared canonical command", async () => {
  const context = await discoverRepository(fixture("good"));
  const verification = await verifyRepository(context, 20, async (_root, name, command) => ({
    name,
    command,
    status: "passed",
    exitCode: 0,
    durationMs: 12,
    stdout: "",
    stderr: "",
  }));
  assert.equal(verification.commands.length, 1);
  assert.equal(verification.commands[0]?.name, "verify");
  assert.equal(verification.commands[0]?.status, "passed");
  assert.ok(verification.results.some((item) => item.ruleId === "RR-DYN-001" && item.status === "pass"));
});

test("grade boundaries are stable", () => {
  assert.equal(gradeFor(95), "A+");
  assert.equal(gradeFor(85), "A-");
  assert.equal(gradeFor(69), "C+");
  assert.equal(gradeFor(39), "F");
});

test("score caps cannot be averaged away", () => {
  const failure: RuleResult = {
    ruleId: "RR-TEST-001",
    title: "Critical gate",
    category: "safety",
    status: "fail",
    severity: "critical",
    deduction: 1,
    scoreCap: 39,
    summary: "Critical failure",
    evidence: [],
  };
  const report = scoreResults("fixture", "generic", "scan", [failure]);
  assert.equal(report.rawScore, 100);
  assert.equal(report.score, 39);
  assert.equal(report.grade, "F");
});

test("HTML reports escape repository-controlled content", () => {
  const result: RuleResult = {
    ruleId: "RR-XSS-001",
    title: "<script>alert(1)</script>",
    category: "context",
    status: "fail",
    severity: "warning",
    deduction: 5,
    summary: "unsafe <b>content</b>",
    evidence: [],
  };
  const rendered = htmlReport(scoreResults("<repo>", "generic", "scan", [result]));
  assert.ok(!rendered.includes("<script>alert(1)</script>"));
  assert.ok(rendered.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
});

test("invalid repository configuration fails explicitly", async () => {
  await assert.rejects(
    scanRepository(fixture("invalid-config"), { mode: "scan" }),
    /Invalid JSON in Repo Ready configuration/,
  );
});
