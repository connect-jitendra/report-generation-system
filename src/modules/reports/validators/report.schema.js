import { z } from "zod";

// Validate the supported report type and output format.
const createReportSchema = z.object({
    reportType: z.enum(["users","departments","employee_departments"]),
   format: z.enum(["csv","xlsx"])
});

const reportIdSchema = z.object({
    reportId: z.uuid(),
});

export { createReportSchema, reportIdSchema };
