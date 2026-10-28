import pool from "../../../config/db.js";

const insertReport = async (userId, reportType, format) => {
    const result = await pool.query(
        `
    INSERT INTO reports(user_id, report_type, format)
    VALUES ($1, $2, $3)
    RETURNING *
    `, [userId, reportType, format]
    );

    return result.rows[0];
};



export default insertReport;