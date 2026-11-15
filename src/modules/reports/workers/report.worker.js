import "dotenv/config";
import { Worker } from "bullmq";

import {
    findReportById,
    updateReportStatus,
    findAllUsers,
    findAllDepartments,
    findAllEmployeesWithDepartments,
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
                !["users", "departments", "employee_departments"].includes(report.report_type) ||
                !["csv", "xlsx"].includes(report.format)
            ) {
                throw new Error("Unsupported report type or format");
            }

            const updateStatus = await updateReportStatus(reportId, "PROCESSING");
            console.log("3. Report Status:", updateStatus.status);


            let reportData;

            if (report.report_type === "users") {
                reportData = await findAllUsers();
                console.log("4. Total users fetched:", reportData.length);

            } else if (report.report_type === "departments") {
                reportData = await findAllDepartments();
                console.log("4.1. Total departments fetched:", reportData.length);
            } else if (report.report_type === "employee_departments") {
                reportData = await findAllEmployeesWithDepartments();
                console.log("4.2 Total Employees with Departments :", reportData.length);
            }

            let fileData;

            if (report.format === "csv") {
                fileData = await generateCSV(reportData);
                console.log("5. CSV Data:", fileData);
            } else {
                fileData = await generateXLSX(reportData, report.report_type);
                console.log("6. XLSX generated successfully");
            }

            const s3Key = `reports/${report.format}/${report.report_type}-${reportId}.${report.format}`;

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
