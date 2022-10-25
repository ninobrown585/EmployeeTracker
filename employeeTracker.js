const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'SnowPlants45',
    database: 'employee_trackerdb'
  });
  
  connection.connect((err) => {
    if (err) {
      console.error(`error connecting: ${err.stack}`);
      return;
    }
    questions(); //Prompt for user questions
  });

const questions = () => {
    inquirer.prompt([{
      name: 'questionList',
      type: 'list',
      message: 'What would you like to do?',
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update Employee Role'],
    }]).then((answer) =>{

        switch(answer.questionList)
        {
            case 'View All Departments':
                viewAllDepartments();
                break;
            
            case 'View All Roles':
                viewAllRoles();
                break;
            
            case 'View All Employees':
                viewAllEmployees();
                break;
            
            case 'Add A Department':
                addADepartment();
                break;
            
            case 'Add A Role':
                addARole();
                break;            
        
            case 'Add An Employee':
                addAnEmployee();
                break;            
        
            case 'Update Employee Role':
                updateEmployeeRole();
                break;     

            default:
                break;
        }
    });
    }

const viewAllDepartments = () => {
    connection.query(`SELECT * FROM department`, (err, res) => {
        console.table(res); 
        questions();
    });
};

const viewAllRoles = () => {
    connection.query(`SELECT * FROM role`,(err, res) => {
        console.table(res); 
        questions();
    }); 
};

const viewAllEmployees = () => {
    connection.query(`SELECT employee.id, employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title as Title, department.name AS Department, 
    CONCAT('$', format(role.salary,0)) AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager 
    FROM employee 
    JOIN role ON employee.role_id = role.id 
    JOIN department ON role.department_id = department.id 
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id ORDER BY employee.id ASC;`,(err, res) => {
        console.table(res); 
        questions();
    }); 
};

const addADepartment = () => {
    inquirer
    .prompt([
        {
        name: 'addDepartment',
        type: 'input',
        message: 'Enter the name of the new Department?',
        }
    ])
    .then((answer) => {
        let sql = `INSERT INTO department (name) VALUES (?)`;
        connection.query(sql, answer.addDepartment, (err, res) => {
        viewAllDepartments();
        });
    });
}

const addARole = () => {
    let departments = [];

    connection.query(`SELECT * FROM department`, (err, res) => {
        res.forEach((department) => {
            departments.push ({
            "value": department.id,
            "name": department.name
            });
        });
    });

    inquirer
    .prompt([
        {
        name: 'roleTitle',
        type: 'input',
        message: 'Enter the title of the new Role?',
        },
        {
            name: 'roleSalary',
            type: 'input',
            message: 'Enter the salary for the new Role?',
        },
        {
            type:"list",
            name:"departmentId",
            message:"What department does the role belong too?",
            choices: departments,
          }
    ])
    .then((answer) => {

        departments.forEach((department) => {
            if (department.value === answer.departmentId) 
            {
                let sql = `INSERT INTO role (title, salary, department_id) VALUES ('${answer.roleTitle}', ${parseInt(answer.roleSalary)}, ${parseInt(answer.departmentId)})`;
                connection.query(sql, (err, res) => {
                    viewAllRoles();
                });
            }
          });
    });
}

const addAnEmployee = () => {
    let roles = [];
    let managers = [];
//when user selects add employee 
//query for an array of roles and managers
//then use inquirer to ask the user for:
//FirstName
//LaseName
//Role
//Who is the manager
connection.query(`SELECT * FROM role`, (err, res) => {
    res.forEach((role) => {
        roles.push ({
        "value": role.id,
        "name": role.title
        });
    });

    connection.query(`SELECT * FROM employee`, (err, res) => {
        res.forEach((employee) => {
            managers.push ({
            "value": employee.id,
            "name": employee.first_name + " " + employee.last_name
            });
        });

            inquirer
            .prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'Enter the new employee\'s first name.',
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'Enter the new employee\'s last name.',
                },
                {
                    type:"list",
                    name:"role",
                    message:"Choose a role for this employee.",
                    choices: roles,
                },
                {
                    type:"list",
                    name:"manager",
                    message:"Does this employee have a manager?",
                    choices: managers,
                }
            ])
        .then((answer) => {
//Then INSERT INTO the employee table
            // departments.forEach((department) => {
            //     if (department.value === answer.departmentId) 
            //     {
                    let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id ) VALUES ('${answer.firstName}', '${answer.lastName}', ${parseInt(answer.role)}, ${parseInt(answer.manager)})`;
                    connection.query(sql, (err, res) => {
                        viewAllEmployees();
                    });
            //     }
            // });
        });
    });
});
}

const updateEmployeeRole = () => {
//query database for employee list       
    let employees = [];
    let roles = [];

    connection.query(`SELECT * FROM employee`, (err, res) => {
        res.forEach((employee) => {
            employees.push ({
            "value": employee.id,
            "name": employee.first_name + " " + employee.last_name
            });
        });

        //query database for role list
        connection.query(`SELECT * FROM role`, (err, res) => {
            res.forEach((role) => {
                roles.push ({
                "value": role.id,
                "name": role.title
                });
            });

            //inquirer for which employee would you like to update
            inquirer
            .prompt([
                {
                    type:"list",
                    name:"employee",
                    message:"choose an employee you would like to update thier role for?",
                    choices: employees,
                },
                {
                    type:"list",
                    name:"role",
                    message:"Choose a new role for this employee.",
                    choices: roles,
                }
            ])

            .then((answer) => {

                employees.forEach((employee) => {
                    if (employee.value === answer.employee) 
                    {
                        let sql = `UPDATE employee Set employee.role_id = ? WHERE employee.id = ?`;
                        connection.query(sql, [answer.role, answer.employee], (err, res) => {
                            viewAllEmployees();
                        });
                        //call view all employees
                    }
                });
            });
        });    
    });
}