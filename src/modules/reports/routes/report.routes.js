import { Router } from "express";
import mockAuth from "../../../middlewares/mockAuth.js";
import authorize from "../../../middlewares/authorize.js";

import {
  createReport,
  downloadReportController,
  getAllReportController,
  getReportByIdController,
} from "../controllers/report.controller.js";
import validate from "../../../middlewares/validate.js";
import { createReportSchema, reportIdSchema } from "../validators/report.schema.js";

const router = Router();

// Create a report request after authentication and permission validation.
// Report generation is processed asynchronously by the BullMQ worker.
router.post(
  "/",
  mockAuth,
  authorize("report:create"),
  validate(createReportSchema),
  createReport,
);

//Get all report
router.get("/",mockAuth,getAllReportController);

// Retrieve report details and current processing status.
// The controller verifies that the requesting user owns the report.
router.get("/:reportId", mockAuth, validate(reportIdSchema, "params"), getReportByIdController);

// Generate a temporary S3 download URL for a completed report.
// The controller checks ownership and report availability before granting access.
router.get("/:reportId/download", mockAuth,validate(reportIdSchema, "params"), downloadReportController);



export default router;
