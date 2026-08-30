import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import { truncate } from "./utils.js";
const execFileAsync = promisify(execFile);
function packageManagerCommand(context, script) {
    const declared = context.packageManifest?.packageManager?.split("@")[0];
    const manager = declared && ["npm", "pnpm", "yarn", "bun"].includes(declared) ? declared : "npm";
    return manager === "npm" ? `npm run ${script}` : `${manager} run ${script}`;
}
function selectCommands(context) {
    const entries = Object.entries(context.commandCatalog);
    const byName = new Map(entries);
    const preferred = ["agent:verify", "verify", "validate", "ci"].find((name) => byName.has(name));
    if (preferred) {
        const configured = context.config.commands?.[preferred];
        return [{ name: preferred, command: configured ?? packageManagerCommand(context, preferred) }];
    }
    const selected = [];
    for (const candidates of [
        ["build", "compile", "check"],
        ["lint", "typecheck"],
        ["test:unit", "test:ci", "test"],
    ]) {
        const name = candidates.find((candidate) => byName.has(candidate));
        if (!name || selected.some((item) => item.name === name))
            continue;
        const configured = context.config.commands?.[name];
        selected.push({ name, command: configured ?? packageManagerCommand(context, name) });
    }
    return selected;
}
async function gitStatus(root) {
    try {
        const { stdout } = await execFileAsync("git", ["status", "--porcelain=v1", "-uall"], {
            cwd: root,
            windowsHide: true,
            maxBuffer: 2 * 1024 * 1024,
        });
        return stdout;
    }
    catch {
        return undefined;
    }
}
async function executeCommand(root, name, command, timeoutSeconds) {
    const started = Date.now();
    return new Promise((resolve) => {
        const child = spawn(command, {
            cwd: root,
            shell: true,
            windowsHide: true,
            env: { ...process.env, CI: "true", REPO_READY_VERIFY: "1" },
        });
        let stdout = "";
        let stderr = "";
        let timedOut = false;
        child.stdout.on("data", (chunk) => {
            stdout += chunk.toString();
            if (stdout.length > 128_000)
                stdout = truncate(stdout);
        });
        child.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
            if (stderr.length > 128_000)
                stderr = truncate(stderr);
        });
        const timer = setTimeout(() => {
            timedOut = true;
            child.kill("SIGTERM");
        }, timeoutSeconds * 1000);
        child.on("error", (error) => {
            clearTimeout(timer);
            resolve({
                name,
                command,
                status: "failed",
                exitCode: null,
                durationMs: Date.now() - started,
                stdout: truncate(stdout),
                stderr: truncate(`${stderr}\n${error.message}`.trim()),
            });
        });
        child.on("close", (code) => {
            clearTimeout(timer);
            resolve({
                name,
                command,
                status: timedOut ? "timed-out" : code === 0 ? "passed" : "failed",
                exitCode: code,
                durationMs: Date.now() - started,
                stdout: truncate(stdout),
                stderr: truncate(stderr),
            });
        });
    });
}
export async function verifyRepository(context, timeoutSeconds, executor = executeCommand) {
    const selected = selectCommands(context);
    if (selected.length === 0) {
        return {
            commands: [],
            results: [
                {
                    ruleId: "RR-DYN-001",
                    title: "Declared validation executes successfully",
                    category: "validation",
                    status: "fail",
                    severity: "critical",
                    deduction: 45,
                    scoreCap: 59,
                    summary: "Verification mode could not discover a command to execute.",
                    evidence: [],
                    remediation: "Declare verify, validate, build, check, lint, or test commands.",
                },
            ],
        };
    }
    const beforeStatus = await gitStatus(context.root);
    const commands = [];
    for (const item of selected) {
        commands.push(await executor(context.root, item.name, item.command, timeoutSeconds));
    }
    const afterStatus = await gitStatus(context.root);
    const results = commands.map((command, index) => command.status === "passed"
        ? {
            ruleId: `RR-DYN-${String(index + 1).padStart(3, "0")}`,
            title: `Validation command succeeds: ${command.name}`,
            category: "validation",
            status: "pass",
            severity: "info",
            deduction: 0,
            summary: `${command.command} completed in ${(command.durationMs / 1000).toFixed(1)}s.`,
            evidence: [{ message: "Command", value: command.command }],
        }
        : {
            ruleId: `RR-DYN-${String(index + 1).padStart(3, "0")}`,
            title: `Validation command succeeds: ${command.name}`,
            category: "validation",
            status: "fail",
            severity: "critical",
            deduction: 40,
            scoreCap: 59,
            summary: command.status === "timed-out"
                ? `${command.command} exceeded the ${timeoutSeconds}s timeout.`
                : `${command.command} exited with code ${command.exitCode ?? "unknown"}.`,
            evidence: [
                { message: "Command", value: command.command },
                ...(command.stderr ? [{ message: "Standard error", value: truncate(command.stderr, 2_000) }] : []),
            ],
            remediation: "Make the documented validation command deterministic and non-interactive in a clean environment.",
        });
    if (beforeStatus !== undefined && afterStatus !== undefined) {
        results.push(beforeStatus === afterStatus
            ? {
                ruleId: "RR-DYN-900",
                title: "Validation leaves the working tree unchanged",
                category: "isolation",
                status: "pass",
                severity: "info",
                deduction: 0,
                summary: "The selected validation commands did not introduce additional working-tree changes.",
                evidence: [],
            }
            : {
                ruleId: "RR-DYN-900",
                title: "Validation leaves the working tree unchanged",
                category: "isolation",
                status: "fail",
                severity: "high",
                deduction: 30,
                summary: "Validation commands changed the Git working tree.",
                evidence: [{ message: "Working tree after validation", value: afterStatus || "clean" }],
                remediation: "Ensure validation does not rewrite tracked or untracked source artifacts unexpectedly.",
            });
    }
    return { commands, results };
}
//# sourceMappingURL=verification.js.map