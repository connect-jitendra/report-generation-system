
import pg from "pg";

const { Pool } = pg;

// Create a reusable PostgreSQL connection pool using environment configuration.
// The pool manages database connections for queries across the application.
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

export default pool;
