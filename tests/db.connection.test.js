import "dotenv/config";
import pool from "../src/config/db.js";

async function checkDBConnection() {
    try {
        await pool.query("SELECT 1");
        console.log("PostgreSQL connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
}

try {
    await checkDBConnection();
    console.log("Database test passed");
} catch (error) {
    console.error("Database test failed:", error.message);
    process.exitCode = 1;
} finally {
    await pool.end();
    console.log("Database connection pool closed");
}