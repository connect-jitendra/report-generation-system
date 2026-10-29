import { insertReport } from "../repositories/report.repository.js";
import reportQueue from "../queues/report.queue.js";

const createReportService = async (userId, reportType, format) => {

    const report = await insertReport(userId, reportType, format);

    await reportQueue.add("generate-report", {
        reportId: report.id
    })

    return report;
};

export default createReportService;
