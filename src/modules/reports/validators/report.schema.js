import { z } from "zod";

// Validate the supported report type and output format.
const createReportSchema = z.object({
    reportType: z.literal("users"),
    format: z.literal("csv"),
});

const reportIdSchema = z.object({
    reportId: z.uuid(),
});

export { createReportSchema, reportIdSchema };
