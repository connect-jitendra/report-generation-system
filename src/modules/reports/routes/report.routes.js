import { Router } from "express";
import mockAuth from "../../../middlewares/mockAuth.js";
import authorize from "../../../middlewares/authorize.js";
import {
    createReport,
    getReportByIdController,
} from "../controllers/report.controller.js";

const router = Router();

router.post("/", mockAuth, authorize("report:create"), createReport);
router.get("/:reportId", mockAuth, getReportByIdController);

export default router;
