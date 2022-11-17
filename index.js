const inquirer = require('inquirer');
const mysql = require('mysql');
// const consoleTable = require('console.table').default;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    database: 'employee_db',
    password: 'aram',
},
    console.log(`Connected to employee_db`)
);

connection.connect(function(err) {
    if(err) throw err;
    employeeView();
});

function employeeView() {
    inquirer.prompt ({
        name: 'action',
        type: 'list',
        message: 'Please Select One',
        choices: [
            'Add Department',
            'Add Role',
            'Add Employee',
            'Update Employee',
            'View Departments',
            'View Roles',
            'View Employees',
            'Delete Employee',
            'Exit'
        ]
    })

    .then(function(input) {
        switch(input.action) {
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee':
                updateEmployee();
                break;
            case 'View Departments':
                viewDepartments();
                break;
            case 'View Roles':
                viewRoles();
                break;
            case 'View Employees':
                viewEmployees();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
}

const addDepartment = () => {
    inquirer.prompt({
        name: 'newDepartment',
        type: 'input',
        message: 'Please Enter Department Name',
        validate: (input) => {
            if(!input) {return 'Error - Please Enter Valid Department Name';}
            return true;
        },
    })
    .then(response => {
        connection.query(`INSERT INTO department SET ?`,
        {name: response.newDepartment},
        (err, res) => {
            if(err) throw err;
            console.log(`Successfully Added ${response.newDepartment} Department`);
            employeeView();
        });
    });
};

const addRole = () => {
    inquirer.prompt ([{
        name: 'roleTitle',
        type: 'input',
        message: 'Please Enter Role Title'
},
{    name: 'roleSalary',
    type: 'input',
    message: 'Please Enter Role Salary'
},
{
    name: 'departmentId',
    type: 'input',
    message: 'Please Enter Department ID For Role'
},
])
.then(response => {
    connection.query(`INSERT INTO roles SET ?`,
    {
        title: response.roleTitle,
        salary: parseInt(response.roleSalary),
        department_id: parseInt(response.departmentId)
    },
    (err, res) => {
        if(err) throw err;
        console.log(`Successfully Added ${response.roleTitle} Role`);
        employeeView();
    });
});
};

const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'fullName',
            type: 'input',
            message: 'Please Enter Employee Name'
        },
        {
            name: 'roleId',
            type: 'input',
            message: 'Please Enter Role ID'
        },
    ])
    .then(response => {
        connection.query(`INSERT INTO employee SET ?`,
        {full_name: response.fullName,
        role_id: parseInt(response.roleId)},
        (err, res) => {
            if(err) {
                console.log('Error - Please Enter Valid Role ID');
                addEmployee();
                return;
            }
            console.log(`Successfully Added ${response.fullName}`);
            employeeView();
        });
    });
};

const viewDepartments = () => {
    connection.query(`SELECT * FROM department`, (err, res) => {
        if(err) throw err; 
        console.table(res); 
        employeeView();
    });
};

const viewRoles = () => {
    connection.query(`SELECT * FROM roles`, (err, res) => {
        if(err) throw err;
        console.table(res);
        employeeView();
    });
};

const viewEmployees = () => {
    connection.query (`SELECT distinct (e.id),
    CONCAT (e.full_name) AS employee_name,
    r.title as role_title,
    d.name,
    r.salary,
    e.manager_id FROM employee e INNER JOIN roles r 
    ON e.role_id = r.id INNER JOIN department d 
    ON r.department_id = d.id ORDER BY e.id ASC LIMIT 100`,
    (err, res) => {
        if(err) throw err;
        console.table(res);
        employeeView();
    })
};

const updateEmployee = () => {
    connection.query(`SELECT id, full_name FROM employee`,
    (err, res) => {
        if(err) throw err;
        inquirer.prompt ([
            {
                name: 'employeeId',
                type: 'input',
                message: 'Enter New Employee ID'
            },
            {
                name: 'updatedRoleId',
                type: 'input',
                message: 'Enter New Department ID'
            },
        ])
        .then(response => {
            let updatedEmployee = parseInt(response.employeeId);
            let updatedRoleId = parseInt(response.updatedRoleId);
            connection.query(`UPDATE employee SET role_id = ${updatedRoleId} WHERE id = ${updatedEmployee}`,
            (err, res) => {
                if(err) {
                    console.log('Error');
                    updateEmployee();
                    return;
                }
                console.log(`Successfully Updated Role`);
                employeeView();
            });
        });
    });
};

const deleteEmployee = () => {
    let employees = [];
    connection.query(`SELECT id, full_name FROM employee`,
    (err, res) => {
        res.forEach(element => {
            employees.push(`${element.id} ${element.full_name}`);
        });
        inquirer.prompt({
            name: 'deletedEmployee',
            type: 'list',
            message: 'Please Select Employee To Delete',
            choices: employees
        })
        .then(response => {
            let deletedEmployeeId = parseInt(response.deletedEmployee)
            connection.query(`DELETE FROM employee WHERE id = ${deletedEmployeeId}`,
            (err, res) => {
                console.table(response);
                console.log('Employee Deleted')
                employeeView();
            });
        });
    })
};

