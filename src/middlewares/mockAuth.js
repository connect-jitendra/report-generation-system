
import pool from "../config/db.js";

// Development-only middleware that simulates authentication using a user ID.
// This must be replaced with real authentication before production deployment.
async function mockAuth(req, res, next) {
    try {
        // Prevent mock authentication from being used outside development.
        if (process.env.NODE_ENV !== "development") {
            return res.status(403).json({
                success: false,
                message: "Mock authentication is disabled"
            });
        }

        // Read the user ID from the request body or X-User-Id header.
        const userId = req.body?.userId ?? Number(req.headers["x-user-id"]);

        if (!Number.isSafeInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid userId is required"
            });
        }

        // Fetch the user from PostgreSQL to simulate an authenticated session.
        const result = await pool.query(
            "SELECT id, name, email, role FROM users WHERE id = $1",
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "User does not exist"
            });
        }

        // Attach the user to the request for authorization and ownership checks.
        req.user = result.rows[0];

        console.log("[MockAuth] User:", req.user);

        next();
    } catch (error) {
        // Forward unexpected errors to Express error-handling middleware.
        console.error("[MockAuth] Error:", error.message);
        next(error);
    }
}

export default mockAuth;
