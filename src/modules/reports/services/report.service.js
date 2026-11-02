import {
    insertReport,
    findReportById,
    findAllReportByUserId,
} from "../repositories/report.repository.js";
import reportQueue from "../queues/report.queue.js";
import AppError from "../../../utils/AppError.js";

// Create a report record and enqueue a background job for report generation.
// The API can respond immediately without waiting for the report to be generated.
const createReportService = async (userId, reportType, format) => {
    const report = await insertReport(userId, reportType, format);

    // Add the report ID to the BullMQ queue for asynchronous processing.
    // The worker uses this ID to fetch report details from PostgreSQL.
    await reportQueue.add("generate-report", {
        reportId: report.id,
    });

    return report;
};

// Retrieve a report from PostgreSQL and handle missing report records.
const getReportByIdService = async (reportId) => {
    const result = await findReportById(reportId);

    // Throw an error so the controller can return HTTP 404.
    if (!result) {
        throw new AppError("Report not found", 404);
    }

    return result;
};

const getAllReportByUser = async (userId) => {
    const result = await findAllReportByUserId(userId);

    const updatedReport = result.map((report) => ({
        ...report,
        is_downloadable: !!report.s3_key && report.status === 'COMPLETED',
    }));

    return updatedReport;
};


export { createReportService, getReportByIdService, getAllReportByUser };
