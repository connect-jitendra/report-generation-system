
import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import express from "express";

import validate from "../src/middlewares/validate.js";
import errorHandler from "../src/middlewares/errorHandler.js";

import {
    createReportSchema,
    reportIdSchema,
} from "../src/modules/reports/validators/report.schema.js";

// Create a small Express application specifically for validation tests.
const app = express();
app.use(express.json());

// Test the actual report creation validation middleware.
// This handler simulates success without writing to the database.
app.post(
    "/api/reports",
    validate(createReportSchema),
    (req, res) => {
        res.status(201).json({
            success: true,
            message: "Validation passed",
        });
    }
);

// Test the actual UUID validation middleware.
app.get(
    "/api/reports/:reportId",
    validate(reportIdSchema, "params"),
    (req, res) => {
        res.status(200).json({
            success: true,
            reportId: req.params.reportId,
        });
    }
);

// Handle validation errors using our existing global error handler.
app.use(errorHandler);

// Test 1: Reject an unsupported report format.
test("POST /api/reports should reject invalid format", async () => {
    const response = await request(app)
        .post("/api/reports")
        .send({
            reportType: "users",
            format: "pdf",
        });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
});

// Test 2: Reject an unsupported report type.
test("POST /api/reports should reject invalid report type", async () => {
    const response = await request(app)
        .post("/api/reports")
        .send({
            reportType: "departments",
            format: "csv",
        });

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
});

// Test 3: Accept valid report creation input.
test("POST /api/reports should accept valid input", async () => {
    const response = await request(app)
        .post("/api/reports")
        .send({
            reportType: "users",
            format: "csv",
        });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);
});

// Test 4: Reject an invalid report UUID.
test("GET /api/reports/:reportId should reject invalid UUID", async () => {
    const response = await request(app)
        .get("/api/reports/abc");

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
});

// Test 5: Accept a valid report UUID.
test("GET /api/reports/:reportId should accept valid UUID", async () => {
    const reportId = "78b4189f-f099-4590-8fd6-5157cb5149ee";

    const response = await request(app)
        .get(`/api/reports/${reportId}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.reportId, reportId);
});
