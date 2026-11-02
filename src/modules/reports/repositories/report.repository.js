import pool from "../../../config/db.js";

// Create a new report request and return the inserted record.
// PostgreSQL applies the default PENDING status and generates the report UUID.
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

// Retrieve a report by its unique ID for status checks and ownership validation.
const findReportById = async (reportId) => {
  const result = await pool.query("SELECT * from reports WHERE id =$1", [
    reportId,
  ]);

  return result.rows[0];
};

// Update the report's processing status during its lifecycle.
// This is used by the background worker for PROCESSING, COMPLETED, and FAILED states.
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

// Fetch user records used as the data source for CSV report generation.
const findAllUsers = async () => {
  const result = await pool.query("SELECT id,name,email,role FROM users;");

  return result.rows;
};

// Persist the S3 object key after a report file has been uploaded successfully.
// The stored key is later used to generate a secure presigned download URL.
const updateReportS3Key = async (reportId, s3Key) => {
  const result = await pool.query(
    `UPDATE reports
    SET s3_key = $2
    WHERE id   =$1
    RETURNING *
    `,
    [reportId, s3Key],
  );

  return result.rows[0];
};

//==========================find all report by user================================

const findAllReportByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM reports WHERE user_id= $1 ORDER BY created_at DESC ",
    [userId],
  );

  return result.rows;
};

export {
  insertReport,
  findReportById,
  updateReportStatus,
  findAllUsers,
  updateReportS3Key,
  findAllReportByUserId,
};
