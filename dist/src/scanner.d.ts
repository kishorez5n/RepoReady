import type { ReadinessReport, ScanOptions } from "./types.js";
export declare function scanRepository(target: string, options: ScanOptions): Promise<ReadinessReport>;
