
import "dotenv/config";
import { readFile } from "node:fs/promises";
import pool from "../src/config/db.js";

async function seedDatabase() {
    try {
        console.log("[Seed] Starting database seeding...");

        const fileUrl = new URL(
            "../database/seeds/users.seed.sql",
            import.meta.url
        );

        const sql = await readFile(fileUrl, "utf8");

        await pool.query(sql);

        console.log("[Seed] Users seeded successfully");
    } catch (error) {
        console.error("[Seed] Seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
        console.log("[Seed] Database pool closed");
    }
}

await seedDatabase();
