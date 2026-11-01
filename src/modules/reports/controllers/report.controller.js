import AppError from "../../../utils/AppError.js";

import {
    createReportService,
    getReportByIdService,
} from "../services/report.service.js";

import { generateReportDownloadUrl } from "../services/reportStorage.service.js";

// Handle report creation requests after authentication and authorization.
const createReport = async (req, res, next) => {
    try {
        const { reportType, format } = req.body ?? {};

        // Delegate report creation and background job scheduling to the service layer.
        const report = await createReportService(req.user.id, reportType, format);

        return res.status(201).json({
            success: true,
            message: "Report request created successfully",
            data: report,
        });
    } catch (error) {
        return next(error);
    }
};

// Retrieve a report while ensuring users can access only their own reports.
const getReportByIdController = async (req, res, next) => {
    try {
        const { reportId } = req.params;

        if (!reportId) {
            throw new AppError("reportId is required", 400);
        }

        const report = await getReportByIdService(reportId);

        // Prevent users from accessing reports owned by other users.
        if (report.user_id !== req.user.id) {
            throw new AppError("Access denied", 403);
        }

        return res.status(200).json({
            success: true,
            message: "Report retrieved successfully",
            data: report,
        });
    } catch (error) {
        return next(error);
    }
};

// Generate a temporary S3 download URL for an authorized report owner.
const downloadReportController = async (req, res, next) => {
    try {
        const { reportId } = req.params;
        const userId = req.user.id;

        const report = await getReportByIdService(reportId);

        // Verify ownership before granting access to the report file.
        if (report.user_id !== userId) {
            throw new AppError("Access denied", 403);
        }

        // Only completed reports with an S3 key can be downloaded.
        if (report.status !== "COMPLETED" || !report.s3_key) {
            throw new AppError("Report is not ready for download", 409);
        }

        // Generate a time-limited URL for direct download from the private S3 bucket.
        const downloadUrl = await generateReportDownloadUrl(report.s3_key);

        return res.status(200).json({
            success: true,
            message: "Download URL generated successfully",
            data: downloadUrl,
        });
    } catch (error) {
        return next(error);
    }
};

export { createReport, getReportByIdController, downloadReportController };
