
import "dotenv/config";
import { runner } from "node-pg-migrate";

const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

async function runMigrations() {
    try {
        const isDryRun = process.argv.includes("--dry-run");

        console.log("Starting database migrations...");
        console.log("Target database:", dbConfig.database);
        console.log("Dry run:", isDryRun);

        await runner({
            databaseUrl: dbConfig,
            dir: "database/migrations",
            migrationsTable: "pgmigrations",
            direction: "up",
            singleTransaction: true,
            dryRun: isDryRun,
            verbose: true,
        });

        console.log(
            isDryRun
                ? "Migration preview completed"
                : "Database migrations completed successfully"
        );
    } catch (error) {
        console.error("Migration failed:", error.message);
        process.exitCode = 1;
    }
}

await runMigrations();
