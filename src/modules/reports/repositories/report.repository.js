import pool from "../../../config/db.js";

const insertReport = async (userId, reportType, format) => {
  const result = await pool.query(
    `
    INSERT INTO reports(user_id, report_type, format)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [userId, reportType, format],
  );

  return result.rows[0];
};

const findReportById = async (reportId) => {
  const result = await pool.query("SELECT * from reports WHERE id =$1", [
    reportId,
  ]);
  return result.rows[0];
};

const updateReportStatus = async (reportId, status) => {
  const result = await pool.query(
    `UPDATE reports 
        SET status =$2
        WHERE id=$1
        RETURNING *
        `,
    [reportId, status],
  );

  return result.rows[0];
};

export { insertReport, findReportById, updateReportStatus };
