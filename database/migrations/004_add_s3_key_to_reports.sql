
-- Store the S3 object key to locate and securely download generated reports.
ALTER TABLE reports
ADD COLUMN s3_key TEXT;
