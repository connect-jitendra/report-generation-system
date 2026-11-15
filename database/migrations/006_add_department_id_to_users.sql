ALTER TABLE users
ADD COLUMN department_id INTEGER
REFERENCES departments(id);