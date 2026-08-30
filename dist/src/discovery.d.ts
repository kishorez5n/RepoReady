import type { ScanContext } from "./types.js";
export declare function discoverRepository(root: string, explicitConfigPath?: string): Promise<ScanContext>;
export declare function readRepositoryFile(context: ScanContext, relative: string): Promise<string>;
