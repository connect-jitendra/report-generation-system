import "dotenv/config";
import { Worker } from "bullmq";
import { findReportById, updateReportStatus } from "../repositories/report.repository.js";

const reportWorker = new Worker(
    "report-generation",
    async (job) => {
        const { reportId } = job.data;
        const report = await findReportById(reportId);
        const updateStatus = await updateReportStatus(reportId,"PROCESSING")
        console.log("Report_status", updateStatus);
        console.log("Report Details :", report);
        console.log("Report Id :", reportId);
        console.log(`Processing report job: ${job.id}`);
    },
    {
        connection: {
            host: "localhost",
            port: 6379,
        },
    },
);

export default reportWorker;
