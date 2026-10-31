
-- Insert sample users with different roles for development and RBAC testing.
INSERT INTO users (id, name, email, role)
VALUES
    (101, 'Rahul', 'rahul@example.com', 'admin'),
    (102, 'Priya', 'priya@example.com', 'manager'),
    (103, 'Amit', 'amit@example.com', 'user'),
    (104, 'Neha', 'neha@example.com', 'manager'),
    (105, 'Rohit', 'rohit@example.com', 'user')

-- Prevent duplicate primary key errors when the seed script is executed again.
ON CONFLICT (id) DO NOTHING;
