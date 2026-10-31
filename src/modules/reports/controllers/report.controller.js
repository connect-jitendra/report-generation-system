
import {
    createReportService,
    getReportByIdService,
} from "../services/report.service.js";

import { generateReportDownloadUrl } from "../services/reportStorage.service.js";

// Handle report creation requests after authentication and authorization.
const createReport = async (req, res) => {
    const { reportType, format } = req.body;

    // Validate required fields before creating a report request.
    if (!reportType || !format) {
        return res.status(400).json({
            message: "reportType and format are required",
        });
    }

    // Restrict requests to supported report formats.
    if (!["csv", "xlsx"].includes(format)) {
        return res.status(400).json({
            success: false,
            message: "Invalid format. Allowed formats: csv, xlsx",
        });
    }

    // Restrict requests to supported report types.
    if (!["users", "departments", "categories"].includes(reportType)) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid report type. Allowed types: users, departments, categories",
        });
    }

    try {
        // Delegate report creation and background job scheduling to the service layer.
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

// Retrieve a report while ensuring users can access only their own reports.
const getReportByIdController = async (req, res) => {
    const { reportId } = req.params;

    if (!reportId) {
        return res.status(400).json({
            message: "reportId is required",
        });
    }

    try {
        const report = await getReportByIdService(reportId);

        // Prevent users from accessing reports owned by other users.
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
        // Return 404 when the requested report does not exist.
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

// Generate a temporary S3 download URL for an authorized report owner.
const downloadReportController = async (req, res) => {
    const { reportId } = req.params;
    const userId = req.user.id;

    try {
        const report = await getReportByIdService(reportId);

        // Verify ownership before granting access to the report file.
        if (report.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        // Only completed reports with a stored S3 object key can be downloaded.
        if (report.status !== "COMPLETED" || !report.s3_key) {
            return res.status(409).json({
                success: false,
                message: "Report is not ready for download",
            });
        }

        // Generate a time-limited presigned URL without exposing AWS credentials.
        // The client downloads the file directly from the private S3 bucket.
        const downloadUrl = await generateReportDownloadUrl(report.s3_key);

        return res.status(200).json({
            success: true,
            message: "Download URL generated successfully",
            data: downloadUrl,
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

export { createReport, getReportByIdController, downloadReportController };
