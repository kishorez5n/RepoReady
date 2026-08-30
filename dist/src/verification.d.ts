import type { CommandResult, RuleResult, ScanContext } from "./types.js";
export type CommandExecutor = (root: string, name: string, command: string, timeoutSeconds: number) => Promise<CommandResult>;
export declare function verifyRepository(context: ScanContext, timeoutSeconds: number, executor?: CommandExecutor): Promise<{
    commands: CommandResult[];
    results: RuleResult[];
}>;
