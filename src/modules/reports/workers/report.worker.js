
import "dotenv/config";
import { Worker } from "bullmq";

import {
    findReportById,
    updateReportStatus,
    findAllUsers,
    updateReportS3Key,
} from "../repositories/report.repository.js";

import generateCSV from "../generators/csv.generator.js";
import { uploadReportToS3 } from "../services/reportStorage.service.js";

// Process report generation jobs asynchronously using BullMQ and Redis.
const reportWorker = new Worker(
    "report-generation",

    async (job) => {
        const { reportId } = job.data;

        console.log(`0. Processing report job: ${job.id}`);
        console.log("1. Report ID:", reportId);

        try {
            // Retrieve the report configuration and validate supported report types.
            const report = await findReportById(reportId);
            console.log("2. Report Details:", report);

            if (report.report_type !== "users" || report.format !== "csv") {
                throw new Error("Unsupported report type or format");
            }

            // Mark the report as PROCESSING before starting generation.
            const updateStatus = await updateReportStatus(
                reportId,
                "PROCESSING"
            );
            console.log("3. Report Status:", updateStatus.status);

            // Fetch report data from PostgreSQL and convert it to CSV format.
            const allUsersReport = await findAllUsers();
            console.log("4. Total users fetched:", allUsersReport.length);

            const csvData = await generateCSV(allUsersReport);
            console.log("5. CSV Data:", csvData);

            // Generate a unique S3 object key to avoid filename conflicts.
            const s3Key = `reports/users-${reportId}.csv`;

            // Upload the generated report to the private S3 bucket.
            await uploadReportToS3(csvData, s3Key);

            // Save the S3 object key in PostgreSQL for future downloads.
            await updateReportS3Key(reportId, s3Key);

            // Mark the report COMPLETED only after upload and database updates succeed.
            const completedReport = await updateReportStatus(
                reportId,
                "COMPLETED"
            );

            console.log("6. Report Status:", completedReport.status);

        } catch (error) {
            // Mark failed jobs in PostgreSQL and propagate the error to BullMQ.
            console.error("Report generation failed:", error);

            await updateReportStatus(reportId, "FAILED");

            throw error;
        }
    },

    // Connect to the same Redis instance used by the report queue.
    {
        connection: {
            host: "localhost",
            port: 6379,
        },
    },
);

export default reportWorker;
