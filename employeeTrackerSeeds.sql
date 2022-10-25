USE employee_trackerDB;

INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 250000, 1),
       ("Sales Person", 198000, 1),
       ("Lead Engineer", 180000, 2),
       ("Software Engineer", 116000, 2),
	   ("Accountant", 98000, 3),
       ("Legal Team Lead", 150000, 4),
       ("Lawyer", 98000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Vince", "Neil", 1, 3),
       ("Axl", "Rose", 1, 1),
       ("Bret", "Michaels", 3, null),
       ("James", "Hetfield", 2, 3),
       ("Brian", "Johnson", 3, null),
       ("Robert", "Plant", 4, null),
       ("David", "Coverdale", 4, 6),
       ("Eddie", "Van Halen", 2, 2);