import {
    createReportService,
    getReportByIdService,
} from "../services/report.service.js";

const createReport = async (req, res) => {
    const { reportType, format } = req.body;
    if (!reportType || !format) {
        return res.status(400).json({
            message: "reportType and format are required",
        });
    }

    // Validate format
    if (!["csv", "xlsx"].includes(format)) {
        return res.status(400).json({
            success: false,
            message: "Invalid format. Allowed formats: csv, xlsx",
        });
    }

    // Validate reportType
    if (!["users", "departments", "categories"].includes(reportType)) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid report type. Allowed types: users, departments, categories",
        });
    }
    try {
        const report = await createReportService(req.user.id, reportType, format);
        return res.status(201).json({
            success: true,
            message: "Report request created successfully",
            data: report,
        });
    } catch (error) {
        console.error("Something went wrong", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

const getReportByIdController = async (req, res) => {
    const { reportId } = req.params;
    if (!reportId) {
        return res.status(400).json({
            message: "reportId is required",
        });
    }

    try {
        const report = await getReportByIdService(reportId);
        if (report.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Report retrieved successfully",
            data: report,
        });

    } catch (error) {
        if (error.message === "Report not found") {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        console.error("Failed to fetch report:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export { createReport, getReportByIdController };
