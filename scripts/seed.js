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
            import.meta.url,
        );

        const sql = await readFile(fileUrl, "utf8");
        await pool.query(sql);
        console.log("[Seed] Users seeded successfully");

        // Seed department records after users.
        const departmentFileUrl = new URL(
            "../database/seeds/departments.seed.sql",
            import.meta.url,
        );

        const departmentSql = await readFile(departmentFileUrl, "utf8");

        await pool.query(departmentSql);

        console.log("[Seed] Departments seeded successfully");

        // Assign departments to existing users.
        const userDepartmentFileUrl = new URL(
            "../database/seeds/user_departments.seed.sql",
            import.meta.url
        );

        const userDepartmentSql = await readFile(userDepartmentFileUrl, "utf8");

        await pool.query(userDepartmentSql);

        console.log("[Seed] User departments assigned successfully");

        // Seed sample categories.
        const categoryFileUrl = new URL(
            "../database/seeds/categories.seed.sql",
            import.meta.url
        );

        const categorySql = await readFile(categoryFileUrl, "utf8");

        await pool.query(categorySql);

        console.log("[Seed] Categories seeded successfully");
    } catch (error) {
        console.error("[Seed] Seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
        console.log("[Seed] Database pool closed");
    }
}

await seedDatabase();
