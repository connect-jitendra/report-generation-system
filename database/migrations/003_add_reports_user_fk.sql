ALTER TABLE reports
ADD CONSTRAINT fk_reports_user
FOREIGN KEY (user_id)
REFERENCES users(id);