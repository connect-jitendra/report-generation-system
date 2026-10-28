
import pool from "../config/db.js";

async function mockAuth(req, res, next) {
    try {
        if (process.env.NODE_ENV !== "development") {
            return res.status(403).json({
                success: false,
                message: "Mock authentication is disabled"
            });
        }

        const { userId } = req.body;

        if (!Number.isSafeInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid userId is required"
            });
        }

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

        req.user = result.rows[0];

        console.log("[MockAuth] User:", req.user);

        next();
    } catch (error) {
        console.error("[MockAuth] Error:", error.message);
        next(error);
    }
}

export default mockAuth;
