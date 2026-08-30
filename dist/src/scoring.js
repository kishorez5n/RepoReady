const DIMENSIONS = [
    { category: "environment", label: "Environment reproducibility", weight: 15 },
    { category: "commands", label: "Build and test discovery", weight: 15 },
    { category: "validation", label: "Validation quality", weight: 20 },
    { category: "context", label: "Agent context", weight: 15 },
    { category: "safety", label: "Safety and permissions", weight: 15 },
    { category: "feedback", label: "Feedback speed", weight: 10 },
    { category: "isolation", label: "Change isolation", weight: 5 },
    { category: "observability", label: "Observability and recovery", weight: 5 },
];
export function gradeFor(score) {
    if (score >= 95)
        return "A+";
    if (score >= 90)
        return "A";
    if (score >= 85)
        return "A-";
    if (score >= 80)
        return "B+";
    if (score >= 75)
        return "B";
    if (score >= 70)
        return "B-";
    if (score >= 65)
        return "C+";
    if (score >= 60)
        return "C";
    if (score >= 55)
        return "C-";
    if (score >= 40)
        return "D";
    return "F";
}
export function scoreResults(root, profile, mode, results, commands = []) {
    const dimensions = DIMENSIONS.map((dimension) => {
        const applicable = results.filter((item) => item.category === dimension.category && item.status !== "skip");
        const deductions = applicable
            .filter((item) => item.status === "fail")
            .reduce((total, item) => total + item.deduction, 0);
        return {
            ...dimension,
            score: Math.max(0, 100 - deductions),
            deductions,
            failed: applicable.filter((item) => item.status === "fail").length,
            passed: applicable.filter((item) => item.status === "pass").length,
        };
    });
    const rawScore = Math.round(dimensions.reduce((total, dimension) => total + dimension.score * dimension.weight, 0) / 100);
    const caps = results
        .filter((item) => item.status === "fail" && item.scoreCap !== undefined)
        .map((item) => item.scoreCap);
    const scoreCap = caps.length > 0 ? Math.min(...caps) : null;
    const score = scoreCap === null ? rawScore : Math.min(rawScore, scoreCap);
    return {
        schemaVersion: "1.0",
        generatedAt: new Date().toISOString(),
        scannerVersion: "0.1.0",
        root,
        profile,
        mode,
        score,
        rawScore,
        grade: gradeFor(score),
        scoreCap,
        dimensions,
        results,
        commands,
        summary: {
            passed: results.filter((item) => item.status === "pass").length,
            failed: results.filter((item) => item.status === "fail").length,
            skipped: results.filter((item) => item.status === "skip").length,
            critical: results.filter((item) => item.status === "fail" && item.severity === "critical").length,
            high: results.filter((item) => item.status === "fail" && item.severity === "high").length,
        },
    };
}
//# sourceMappingURL=scoring.js.map