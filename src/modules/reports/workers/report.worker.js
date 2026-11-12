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
import generateXLSX from "../generators/xlsx.generator.js";

// Process report generation jobs asynchronously using BullMQ and Redis.
const reportWorker = new Worker(
    "report-generation",

    async (job) => {
        const { reportId } = job.data;

        console.log(`0. Processing report job: ${job.id}`);
        console.log("1. Report ID:", reportId);

        try {
            const report = await findReportById(reportId);
            console.log("2. Report Details:", report);

            if (
                report.report_type !== "users" ||
                !["csv", "xlsx"].includes(report.format)
            ) {
                throw new Error("Unsupported report type or format");
            }

            const updateStatus = await updateReportStatus(reportId, "PROCESSING");
            console.log("3. Report Status:", updateStatus.status);

            const allUsersReport = await findAllUsers();
            console.log("4. Total users fetched:", allUsersReport.length);

            let fileData;

            if (report.format === "csv") {
                fileData = await generateCSV(allUsersReport);
                console.log("5. CSV Data:", fileData);
            } else {
                fileData = await generateXLSX(allUsersReport);
                console.log("6. XLSX generated successfully");
            }

            const s3Key = `reports/${report.format}/users-${reportId}.${report.format}`;

            await uploadReportToS3(fileData, s3Key, report.format);

            await updateReportS3Key(reportId, s3Key);

            const completedReport = await updateReportStatus(reportId, "COMPLETED");

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
