DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department(
	id INT AUTO_INCREMENT, 
    name VARCHAR(30),
    PRIMARY KEY (id)
);


CREATE TABLE role(
	id INT AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(9,2),
    department_id INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT dep_fk FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);


CREATE TABLE employee(
	id INT AUTO_INCREMENT,
	first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id),
    CONSTRAINT role_fk FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    CONSTRAINT manager_fk FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
