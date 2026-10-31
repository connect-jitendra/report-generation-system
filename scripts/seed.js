
import "dotenv/config";
import { readFile } from "node:fs/promises";
import pool from "../src/config/db.js";

// Execute the SQL seed file to populate the database with sample users.
async function seedDatabase() {
    try {
        console.log("[Seed] Starting database seeding...");

        // Resolve the seed file path relative to this script.
        // This avoids dependency on the terminal's working directory.
        const fileUrl = new URL(
            "../database/seeds/users.seed.sql",
            import.meta.url
        );

        // Read and execute the SQL seed script using the PostgreSQL pool.
        const sql = await readFile(fileUrl, "utf8");

        await pool.query(sql);

        console.log("[Seed] Users seeded successfully");
    } catch (error) {
        // Report seeding failures and mark the process as unsuccessful.
        console.error("[Seed] Seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        // Close database connections even if seeding fails.
        await pool.end();
        console.log("[Seed] Database pool closed");
    }
}

await seedDatabase();
