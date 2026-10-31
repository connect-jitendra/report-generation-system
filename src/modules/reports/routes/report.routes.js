
import { Router } from "express";
import mockAuth from "../../../middlewares/mockAuth.js";
import authorize from "../../../middlewares/authorize.js";

import {
  createReport,
  downloadReportController,
  getReportByIdController,
} from "../controllers/report.controller.js";

const router = Router();

// Create a report request after authentication and permission validation.
// Report generation is processed asynchronously by the BullMQ worker.
router.post("/", mockAuth, authorize("report:create"), createReport);

// Retrieve report details and current processing status.
// The controller verifies that the requesting user owns the report.
router.get("/:reportId", mockAuth, getReportByIdController);

// Generate a temporary S3 download URL for a completed report.
// The controller checks ownership and report availability before granting access.
router.get("/:reportId/download", mockAuth, downloadReportController);

export default router;
