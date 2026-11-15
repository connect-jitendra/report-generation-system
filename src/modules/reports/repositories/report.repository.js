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

// Retrieve a report by its unique ID for status checks and ownership validation.
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

//=================================Find ALL users=======================
const findAllUsers = async () => {
  const result = await pool.query("SELECT id,name,email,role FROM users;");

  return result.rows;
};

//==================================FIND ALL DEPARTMENTS=========================
const findAllDepartments = async () => {
  const result = await pool.query(
    `SELECT id, name, description, created_at
       FROM departments
      ORDER BY id;`,
  );
  return result.rows;
};

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

//==========================FIND ALL DEPARTMENTS===========================

const findAllEmployeesWithDepartments = async () => {
  const result = await pool.query(`
    SELECT u.name as employee_name, u.email as employee_email, d.name as department_name FROM users u
    LEFT JOIN departments d
    ON u.department_id = d.id
    ORDER BY u.id;
    `);
  return result.rows;
};

export {
  insertReport,
  findReportById,
  updateReportStatus,
  findAllUsers,
  findAllDepartments,
  findAllEmployeesWithDepartments,
  updateReportS3Key,
  findAllReportByUserId,
};
