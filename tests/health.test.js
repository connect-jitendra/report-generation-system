
import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import { after } from "node:test";
import reportQueue from "../src/modules/reports/queues/report.queue.js";

// Test 1: Verify that the health API is working correctly.
test("GET /health should return 200 and a healthy status", async () => {
    const response = await request(app).get("/health");

    // Verify the HTTP status code.
    assert.equal(response.status, 200);

    // Verify the complete JSON response.
    assert.deepEqual(response.body, {
        status: "success",
        message: "Server is healthy",
    });
});

// Test 2: Verify that an unknown API route returns 404.
test("GET /does-not-exist should return 404", async () => {
    const response = await request(app).get("/does-not-exist");

    // Verify that the requested endpoint does not exist.
    assert.equal(response.status, 404);
});

// Close the Redis-backed queue when the tests finish.
after(async () => {
    await reportQueue.close();
});