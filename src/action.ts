import { appendFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { scanRepository } from "./scanner.js";
import { htmlReport } from "./reporters/html.js";
import { terminalReport } from "./reporters/terminal.js";
import type { ScanMode } from "./types.js";

async function setOutput(name: string, value: string): Promise<void> {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) await appendFile(outputFile, `${name}=${value}\n`, "utf8");
}

async function run(): Promise<void> {
  const target = process.env.INPUT_PATH || ".";
  const mode: ScanMode = process.env.INPUT_MODE === "verify" ? "verify" : "scan";
  const minimum = Number(process.env["INPUT_MIN-SCORE"] || "0");
  const output = process.env.INPUT_OUTPUT || ".repo-ready/report.json";
  const report = await scanRepository(target, { mode });
  const outputPath = path.resolve(output);
  const htmlPath = outputPath.toLowerCase().endsWith(".json")
    ? outputPath.slice(0, -5) + ".html"
    : `${outputPath}.html`;
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(htmlPath, htmlReport(report), "utf8");
  process.stdout.write(terminalReport(report));
  await setOutput("score", String(report.score));
  await setOutput("grade", report.grade);
  await setOutput("report", outputPath);
  if (Number.isFinite(minimum) && report.score < minimum) throw new Error(`Agent readiness ${report.score}/100 is below the required ${minimum}.`);
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`::error title=Agent readiness failed::${message}\n`);
  process.exitCode = 1;
});
