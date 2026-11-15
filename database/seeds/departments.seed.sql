INSERT INTO departments (name, description)
VALUES
    ('Engineering', 'Software development and technical operations'),
    ('Human Resources', 'Employee recruitment, management, and workplace relations'),
    ('Finance', 'Financial planning, accounting, budgeting, and reporting'),
    ('Marketing', 'Brand promotion, advertising, and marketing campaigns'),
    ('Sales', 'Customer acquisition, sales operations, and revenue generation'),
    ('Operations', 'Daily business operations and process management'),
    ('IT', 'Information technology infrastructure and technical support'),
    ('Customer Support', 'Customer assistance, issue resolution, and service management'),
    ('Administration', 'Office administration and general organizational management'),
    ('Research and Development', 'Product innovation, research, and development'),
    ('Legal', 'Legal compliance, contracts, and regulatory affairs'),
    ('Quality Assurance', 'Software testing, quality control, and process improvement'),
    ('Product Management', 'Product strategy, planning, and lifecycle management'),
    ('Design', 'UI/UX design, graphic design, and creative services'),
    ('Security', 'Information security and organizational safety'),
    ('Procurement', 'Purchasing, vendor management, and supply chain coordination'),
    ('Logistics', 'Transportation, distribution, and inventory management'),
    ('Training and Development', 'Employee training and professional development'),
    ('Business Development', 'Strategic partnerships and business growth'),
    ('Data Analytics', 'Data analysis, reporting, and business intelligence')
    ON CONFLICT (name) DO NOTHING;