import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".hg",
  ".svn",
  ".repo-ready",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".turbo",
  ".venv",
  "venv",
  "target",
]);

export function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

export function matchesGlob(value: string, pattern: string): boolean {
  const normalizedValue = toPosix(value);
  const normalizedPattern = toPosix(pattern);
  let source = "";
  for (let index = 0; index < normalizedPattern.length; index += 1) {
    const character = normalizedPattern[index];
    if (character === "*" && normalizedPattern[index + 1] === "*") {
      source += ".*";
      index += 1;
    } else if (character === "*") {
      source += "[^/]*";
    } else if (character === "?") {
      source += "[^/]";
    } else {
      source += character?.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&") ?? "";
    }
  }
  return new RegExp(`^${source}$`).test(normalizedValue);
}

export async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readText(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

export async function readJson<T>(filePath: string): Promise<T | undefined> {
  const raw = await readText(filePath);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export async function walkFiles(root: string, limit = 20_000): Promise<string[]> {
  const files: string[] = [];

  async function visit(directory: string): Promise<void> {
    if (files.length >= limit) return;
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (files.length >= limit) break;
      if (entry.isSymbolicLink()) continue;
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORIES.has(entry.name)) await visit(absolute);
      } else if (entry.isFile()) {
        files.push(toPosix(path.relative(root, absolute)));
      }
    }
  }

  await visit(root);
  return files.sort();
}

export async function resolveDirectory(value: string): Promise<string> {
  const resolved = path.resolve(value);
  const metadata = await stat(resolved).catch(() => undefined);
  if (!metadata?.isDirectory()) {
    throw new Error(`Repository path is not a directory: ${resolved}`);
  }
  return resolved;
}

export function truncate(value: string, max = 64_000): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}\n... output truncated ...`;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
