USE employee_db;

INSERT INTO department(name)
VALUES
    ('Management'),
    ('Sales'),
    ('Accounting'),
    ('Human Resources'),
    ('Marketing');

INSERT INTO roles(title, salary, department_id)
VALUES
    ('General Manager', 240000, 1),
    ('Chief Financial Officer', 180000, 2),
    ('Marketing Director', 160000, 3),
    ('Chief Sales Executive', 120000, 4),
    ('Chief HR Officer', 120000, 5),
    ('Accountant', 100000, 6),
    ('Salesman', 80000, 7),
    ('Analyst', 75000, 8),
    ('Clerk', 50000, 9);

INSERT INTO employee(full_name, role_id, manager_id)
VALUES
    ('John Doe', 1, null),
    ('Mike Money', 2, 1),
    ('Sam Smiles', 2, 1),
    ('Derek David', 1, null),
    ('Paul Pebbles', 3, 6),
    ('Bruce Wayne', 3, 6),
    ('Kyle Crow', 5, null),
    ('Quin Mathis', 6, null),
    ('Nick Dames', 7, null),
    ('George Jungle', 8, 6),
    ('Aaron Andrews', 8, 6),
    ('Jeff Howard', 9, 7),


