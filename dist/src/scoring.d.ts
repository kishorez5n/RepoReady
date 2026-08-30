import type { ReadinessReport, RuleResult, ScanMode, RepositoryProfile, CommandResult } from "./types.js";
export declare function gradeFor(score: number): string;
export declare function scoreResults(root: string, profile: RepositoryProfile, mode: ScanMode, results: RuleResult[], commands?: CommandResult[]): ReadinessReport;
