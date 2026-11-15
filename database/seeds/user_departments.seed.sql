
UPDATE users AS u
SET department_id = d.id
FROM (
    VALUES
        (1, 'Engineering'),
        (2, 'Human Resources'),
        (3, 'Finance'),
        (4, 'Engineering'),
        (5, 'Marketing'),
        (6, 'Sales'),
        (7, 'IT'),
        (8, 'Design'),
        (9, 'Operations'),
        (10, 'Data Analytics'),
        (101, 'Engineering'),
        (102, 'Human Resources'),
        (103, 'Finance'),
        (104, 'Marketing'),
        (105, 'Customer Support')
) AS mapping(user_id, department_name)
JOIN departments AS d
    ON d.name = mapping.department_name
WHERE u.id = mapping.user_id;

