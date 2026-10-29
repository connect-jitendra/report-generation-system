import "dotenv/config";
import { Worker } from "bullmq";
import {
    findReportById,
    updateReportStatus,
    findAllUsers,
} from "../repositories/report.repository.js";
import generateCSV from "../generators/csv.generator.js";
import { writeFile } from "node:fs/promises";

const reportWorker = new Worker(
    "report-generation",

    async (job) => {
        const { reportId } = job.data;

        console.log(`0.Processing report job: ${job.id}`);
        console.log("1. Report Id:", reportId);


        try {
            const report = await findReportById(reportId);
            console.log("2.Report Details:", report);
            if (report.report_type !== "users" || report.format !== "csv") {
                throw new Error("Unsupported report type of format");
            }

            const updateStatus = await updateReportStatus(reportId, "PROCESSING");
            console.log("3. Report Status:", updateStatus.status);

            const allUsersReport = await findAllUsers();
            console.log("4.Total users fetched:", allUsersReport.length);

            const csvData = await generateCSV(allUsersReport);
            console.log("5.CSV Data:", csvData);

            const filePath = `generated-reports/users-${reportId}.csv`;
            await writeFile(filePath, csvData, "utf8");

            const completedReport = await updateReportStatus(reportId, "COMPLETED");
            console.log("6. Report Status:", completedReport.status);
        } catch (error) {
            console.error("Report generation failed", error);
            await updateReportStatus(reportId, "FAILED");
            throw error;
        }
    },
    {
        connection: {
            host: "localhost",
            port: 6379,
        },
    },
);

export default reportWorker;
