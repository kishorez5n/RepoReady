#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { scanRepository } from "./scanner.js";
import { htmlReport } from "./reporters/html.js";
import { terminalReport } from "./reporters/terminal.js";
const HELP = `repo-ready — evidence-backed readiness scoring for coding-agent repositories

Usage:
  repo-ready scan [path] [options]
  repo-ready verify [path] [options]

Commands:
  scan      Perform deterministic, read-only repository analysis (default)
  verify    Also execute already-declared validation commands; never installs dependencies

Options:
  --format <terminal|json|html>  Output format (default: terminal)
  --output <file>                Write the report to a file
  --config <file>                Use an explicit .repo-ready.json configuration
  --min-score <0-100>            Exit with code 2 when the score is lower
  --timeout <seconds>            Per-command timeout in verify mode
  --version                      Print the version
  --help                         Show this help

Examples:
  repo-ready scan .
  repo-ready scan --format html --output readiness.html
  repo-ready verify . --timeout 180 --min-score 75
`;
function requireValue(args, index, option) {
    const value = args[index + 1];
    if (!value || value.startsWith("--"))
        throw new Error(`${option} requires a value.`);
    return value;
}
function parseArguments(args) {
    let mode = "scan";
    let target = ".";
    let format = "terminal";
    let output;
    let configPath;
    let minScore;
    let timeoutSeconds;
    let positionalSeen = false;
    if (args[0] === "scan" || args[0] === "verify")
        mode = args.shift();
    for (let index = 0; index < args.length; index += 1) {
        const argument = args[index];
        if (!argument)
            continue;
        if (argument === "--help" || argument === "-h") {
            process.stdout.write(HELP);
            process.exit(0);
        }
        if (argument === "--version" || argument === "-v") {
            process.stdout.write("0.1.0\n");
            process.exit(0);
        }
        if (argument === "--format") {
            const value = requireValue(args, index, argument);
            if (!["terminal", "json", "html"].includes(value))
                throw new Error(`Unsupported format: ${value}`);
            format = value;
            index += 1;
            continue;
        }
        if (argument === "--output") {
            output = requireValue(args, index, argument);
            index += 1;
            continue;
        }
        if (argument === "--config") {
            configPath = requireValue(args, index, argument);
            index += 1;
            continue;
        }
        if (argument === "--min-score") {
            minScore = Number(requireValue(args, index, argument));
            if (!Number.isFinite(minScore) || minScore < 0 || minScore > 100)
                throw new Error("--min-score must be a number from 0 through 100.");
            index += 1;
            continue;
        }
        if (argument === "--timeout") {
            timeoutSeconds = Number(requireValue(args, index, argument));
            if (!Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0)
                throw new Error("--timeout must be a positive number of seconds.");
            index += 1;
            continue;
        }
        if (argument.startsWith("-"))
            throw new Error(`Unknown option: ${argument}`);
        if (positionalSeen)
            throw new Error(`Unexpected positional argument: ${argument}`);
        target = argument;
        positionalSeen = true;
    }
    return {
        mode,
        target,
        format,
        ...(output ? { output } : {}),
        ...(configPath ? { configPath } : {}),
        ...(minScore !== undefined ? { minScore } : {}),
        ...(timeoutSeconds !== undefined ? { timeoutSeconds } : {}),
    };
}
async function main() {
    const parsed = parseArguments(process.argv.slice(2));
    const report = await scanRepository(parsed.target, {
        mode: parsed.mode,
        ...(parsed.configPath ? { configPath: parsed.configPath } : {}),
        ...(parsed.timeoutSeconds !== undefined ? { timeoutSeconds: parsed.timeoutSeconds } : {}),
    });
    const rendered = parsed.format === "json"
        ? `${JSON.stringify(report, null, 2)}\n`
        : parsed.format === "html"
            ? htmlReport(report)
            : terminalReport(report);
    if (parsed.output) {
        const outputPath = path.resolve(parsed.output);
        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, rendered, "utf8");
        process.stdout.write(`Wrote ${parsed.format} report to ${outputPath}\n`);
    }
    else {
        process.stdout.write(rendered);
    }
    if (parsed.minScore !== undefined && report.score < parsed.minScore)
        process.exitCode = 2;
}
main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`repo-ready: ${message}\n`);
    process.exitCode = 1;
});
//# sourceMappingURL=cli.js.map