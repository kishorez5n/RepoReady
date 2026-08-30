import path from "node:path";
import { exists, matchesGlob, readJson, readText, toPosix, walkFiles } from "./utils.js";
const INSTRUCTION_NAMES = new Set([
    "AGENTS.md",
    "CLAUDE.md",
    "copilot-instructions.md",
]);
function parseStringArray(value, field) {
    if (value === undefined)
        return undefined;
    if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
        throw new Error(`Invalid Repo Ready configuration: ${field} must be an array of strings.`);
    }
    return value;
}
function validateConfig(value, configPath) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error(`Invalid JSON object in Repo Ready configuration: ${configPath}`);
    }
    const raw = value;
    const validProfiles = ["docs", "node", "python", "monorepo", "generic"];
    if (raw.profile !== undefined && !validProfiles.includes(raw.profile)) {
        throw new Error(`Invalid Repo Ready profile in ${configPath}: ${String(raw.profile)}`);
    }
    if (raw.commands !== undefined && (!raw.commands || typeof raw.commands !== "object" || Array.isArray(raw.commands))) {
        throw new Error(`Invalid Repo Ready configuration: commands must be an object.`);
    }
    const commandEntries = raw.commands ? Object.entries(raw.commands) : [];
    if (commandEntries.some(([, command]) => typeof command !== "string")) {
        throw new Error(`Invalid Repo Ready configuration: every command must be a string.`);
    }
    if (raw.timeoutSeconds !== undefined && (typeof raw.timeoutSeconds !== "number" || raw.timeoutSeconds <= 0)) {
        throw new Error(`Invalid Repo Ready configuration: timeoutSeconds must be a positive number.`);
    }
    const protectedPaths = parseStringArray(raw.protectedPaths, "protectedPaths");
    const excludePaths = parseStringArray(raw.excludePaths, "excludePaths");
    const ignoreRules = parseStringArray(raw.ignoreRules, "ignoreRules");
    return {
        ...(raw.profile ? { profile: raw.profile } : {}),
        ...(commandEntries.length > 0 ? { commands: Object.fromEntries(commandEntries) } : {}),
        ...(protectedPaths ? { protectedPaths } : {}),
        ...(excludePaths ? { excludePaths } : {}),
        ...(ignoreRules ? { ignoreRules } : {}),
        ...(typeof raw.timeoutSeconds === "number" ? { timeoutSeconds: raw.timeoutSeconds } : {}),
    };
}
function detectProfile(files, manifest) {
    const fileSet = new Set(files);
    const isMonorepo = Boolean(manifest?.workspaces) ||
        fileSet.has("pnpm-workspace.yaml") ||
        fileSet.has("lerna.json") ||
        fileSet.has("nx.json") ||
        fileSet.has("turbo.json");
    if (isMonorepo)
        return "monorepo";
    if (manifest)
        return "node";
    if (fileSet.has("pyproject.toml") || fileSet.has("requirements.txt"))
        return "python";
    const sourceFiles = files.filter((file) => /\.(?:[cm]?[jt]sx?|py|go|rs|java|cs)$/.test(file));
    const markdownFiles = files.filter((file) => file.endsWith(".md"));
    if (sourceFiles.length === 0 && markdownFiles.length > 0)
        return "docs";
    return "generic";
}
function makeCommandCatalog(manifest, config) {
    return { ...(manifest?.scripts ?? {}), ...(config.commands ?? {}) };
}
export async function discoverRepository(root, explicitConfigPath) {
    const defaultConfigPath = path.join(root, ".repo-ready.json");
    const configPath = explicitConfigPath
        ? path.resolve(explicitConfigPath)
        : defaultConfigPath;
    let config = {};
    if (await exists(configPath)) {
        const rawConfig = await readJson(configPath);
        if (rawConfig === undefined)
            throw new Error(`Invalid JSON in Repo Ready configuration: ${configPath}`);
        config = validateConfig(rawConfig, configPath);
    }
    const discoveredFiles = await walkFiles(root);
    const files = discoveredFiles.filter((file) => !(config.excludePaths ?? []).some((pattern) => matchesGlob(file, pattern)));
    const fileSet = new Set(files);
    const packagePath = path.join(root, "package.json");
    const rawManifest = await readJson(packagePath);
    let packageManifest;
    if ((await exists(packagePath)) && rawManifest === undefined) {
        throw new Error(`Invalid JSON in package manifest: ${packagePath}`);
    }
    if (rawManifest) {
        const rawScripts = rawManifest.scripts && typeof rawManifest.scripts === "object"
            ? Object.entries(rawManifest.scripts)
            : [];
        packageManifest = {
            scripts: Object.fromEntries(rawScripts.filter((entry) => typeof entry[1] === "string")),
            ...(typeof rawManifest.name === "string" ? { name: rawManifest.name } : {}),
            ...(typeof rawManifest.private === "boolean" ? { private: rawManifest.private } : {}),
            ...(typeof rawManifest.packageManager === "string"
                ? { packageManager: rawManifest.packageManager }
                : {}),
            ...(rawManifest.workspaces !== undefined ? { workspaces: rawManifest.workspaces } : {}),
            ...(rawManifest.engines && typeof rawManifest.engines === "object"
                ? { engines: rawManifest.engines }
                : {}),
        };
    }
    const profile = config.profile ?? detectProfile(files, packageManifest);
    const instructionFiles = files.filter((file) => {
        const name = file.split("/").at(-1) ?? file;
        return INSTRUCTION_NAMES.has(name);
    });
    const workflowFiles = files.filter((file) => /^\.github\/workflows\/[^/]+\.(?:ya?ml)$/i.test(file));
    const testFiles = files.filter((file) => /(^|\/)(?:test|tests|__tests__|spec)(\/|$)|\.(?:test|spec)\.[^/]+$/i.test(file));
    return {
        root,
        files,
        fileSet,
        profile,
        config,
        ...(packageManifest ? { packageManifest } : {}),
        commandCatalog: makeCommandCatalog(packageManifest, config),
        instructionFiles,
        workflowFiles,
        testFiles,
    };
}
export async function readRepositoryFile(context, relative) {
    return readText(path.join(context.root, ...toPosix(relative).split("/")));
}
//# sourceMappingURL=discovery.js.map