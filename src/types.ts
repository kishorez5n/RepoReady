export type Category =
  | "environment"
  | "commands"
  | "validation"
  | "context"
  | "safety"
  | "feedback"
  | "isolation"
  | "observability";

export type Severity = "info" | "warning" | "high" | "critical";
export type CheckStatus = "pass" | "fail" | "skip";
export type ScanMode = "scan" | "verify";
export type RepositoryProfile = "docs" | "node" | "python" | "monorepo" | "generic";

export interface RepoReadyConfig {
  profile?: RepositoryProfile;
  commands?: Record<string, string>;
  protectedPaths?: string[];
  excludePaths?: string[];
  ignoreRules?: string[];
  timeoutSeconds?: number;
}

export interface PackageManifest {
  name?: string;
  private?: boolean;
  packageManager?: string;
  scripts: Record<string, string>;
  workspaces?: unknown;
  engines?: Record<string, string>;
}

export interface ScanContext {
  root: string;
  files: string[];
  fileSet: Set<string>;
  profile: RepositoryProfile;
  config: RepoReadyConfig;
  packageManifest?: PackageManifest;
  commandCatalog: Record<string, string>;
  instructionFiles: string[];
  workflowFiles: string[];
  testFiles: string[];
}

export interface Evidence {
  message: string;
  file?: string;
  line?: number;
  value?: string;
}

export interface RuleResult {
  ruleId: string;
  title: string;
  category: Category;
  status: CheckStatus;
  severity: Severity;
  deduction: number;
  summary: string;
  evidence: Evidence[];
  remediation?: string;
  scoreCap?: number;
}

export interface CommandResult {
  name: string;
  command: string;
  status: "passed" | "failed" | "timed-out";
  exitCode: number | null;
  durationMs: number;
  stdout: string;
  stderr: string;
}

export interface DimensionScore {
  category: Category;
  label: string;
  weight: number;
  score: number;
  deductions: number;
  failed: number;
  passed: number;
}

export interface ReadinessReport {
  schemaVersion: "1.0";
  generatedAt: string;
  scannerVersion: string;
  root: string;
  profile: RepositoryProfile;
  mode: ScanMode;
  score: number;
  rawScore: number;
  grade: string;
  scoreCap: number | null;
  dimensions: DimensionScore[];
  results: RuleResult[];
  commands: CommandResult[];
  summary: {
    passed: number;
    failed: number;
    skipped: number;
    critical: number;
    high: number;
  };
}

export interface ScanOptions {
  mode: ScanMode;
  configPath?: string;
  timeoutSeconds?: number;
}
