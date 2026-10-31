
-- Define the supported lifecycle states of a report.
CREATE TYPE report_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
    'EXPIRED'
);

-- Store report requests and track their generation status.
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    format VARCHAR(15) NOT NULL,
    status report_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Restrict report generation to supported report types.
    CONSTRAINT chk_report_type
    CHECK (report_type IN ('users', 'departments', 'categories')),

    -- Restrict output formats to CSV and Excel.
    CONSTRAINT chk_report_format
    CHECK (format IN ('csv', 'xlsx'))
);
