import { discoverRepository } from "./discovery.js";
import { runStaticRules } from "./rules.js";
import { scoreResults } from "./scoring.js";
import type { ReadinessReport, ScanOptions } from "./types.js";
import { resolveDirectory } from "./utils.js";
import { verifyRepository } from "./verification.js";

export async function scanRepository(
  target: string,
  options: ScanOptions,
): Promise<ReadinessReport> {
  const root = await resolveDirectory(target);
  const context = await discoverRepository(root, options.configPath);
  const staticResults = await runStaticRules(context);
  if (options.mode === "scan") {
    return scoreResults(root, context.profile, options.mode, staticResults);
  }

  const timeoutSeconds = options.timeoutSeconds ?? context.config.timeoutSeconds ?? 120;
  const dynamic = await verifyRepository(context, timeoutSeconds);
  return scoreResults(
    root,
    context.profile,
    options.mode,
    [...staticResults, ...dynamic.results],
    dynamic.commands,
  );
}
