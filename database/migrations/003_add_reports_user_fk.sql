
-- Enforce referential integrity by ensuring every report belongs to an existing user.
ALTER TABLE reports
ADD CONSTRAINT fk_reports_user
FOREIGN KEY (user_id)
REFERENCES users(id);
