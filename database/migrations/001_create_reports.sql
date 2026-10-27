
CREATE TYPE report_status AS ENUM (
'PENDING',
'PROCESSING',
'COMPLETED',
'FAILED',
'CANCELLED',
'EXPIRED'
);




CREATE TABLE reports (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id INTEGER NOT NULL,
report_type VARCHAR(100) NOT NULL,
format VARCHAR(15) NOT NULL,
status report_status NOT NULL DEFAULT 'PENDING',
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

CONSTRAINT chk_report_type
CHECK (report_type IN ('users', 'departments', 'categories')),

CONSTRAINT chk_report_format
CHECK (format IN ('csv', 'xlsx'))


);