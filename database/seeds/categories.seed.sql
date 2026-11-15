INSERT INTO categories (name, description)
VALUES
    ('Electronics', 'Mobiles, laptops and electronic devices'),
    ('Clothing', 'Shirts, jeans and fashion products'),
    ('Furniture', 'Home and office furniture'),
    ('Books', 'Educational and general books'),
    ('Groceries', 'Food and household essentials')
ON CONFLICT (name) DO NOTHING;