import insertReport from "../repositories/report.repository.js";

const createReportService = async (userId, reportType, format) => {

    const report = await insertReport(userId, reportType, format);
    return report;
};

export default createReportService;
