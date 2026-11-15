ALTER TABLE reports
DROP CONSTRAINT chk_report_type;

ALTER TABLE reports
ADD CONSTRAINT chk_report_type
CHECK (
    report_type IN (
        'users',
        'departments',
        'categories',
        'employee_departments'
    )
);