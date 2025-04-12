-- Insert roles
INSERT INTO "Role" (id, name)
VALUES (1, 'farmer'),
    (2, 'customer'),
    (3, 'admin');
-- Insert admin user and connect to the admin role
INSERT INTO "User" (id, username, email, password, "roleId")
VALUES (
        1,
        'admin',
        'admin@example.com',
        'adminPassword',
        3
    );