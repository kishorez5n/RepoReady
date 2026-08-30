export declare function toPosix(value: string): string;
export declare function matchesGlob(value: string, pattern: string): boolean;
export declare function exists(filePath: string): Promise<boolean>;
export declare function readText(filePath: string): Promise<string>;
export declare function readJson<T>(filePath: string): Promise<T | undefined>;
export declare function walkFiles(root: string, limit?: number): Promise<string[]>;
export declare function resolveDirectory(value: string): Promise<string>;
export declare function truncate(value: string, max?: number): string;
export declare function escapeHtml(value: string): string;
