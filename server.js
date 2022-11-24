const inquirer = require("inquirer");
const mySqlTwo = require("mysql2");
const consoleDotTable = require("console.table");
require("dotenv").config();



//creating a connection and then testing it, if it connects, the program starts
const connection = mySqlTwo.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "employee_db"
});

connection.connect((err) =>{
    if(err){
        throw err;
    }
    console.log("connected");
    console.log("============================");
    console.log("=     EMPLOYEE MANAGER     =");
    console.log("============================");
    askUser();
});


//askUser will be the function that is called to promp the default options after making any choices successfully
const askUser = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Please select an option from below",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee's role", "Exit"]
        }
    ]).then((selection) => {
        const {options} = selection;
        
        switch(options){
            case "View all departments":
                viewAllDepartments();
                break;
            case "View all roles":
                viewAllRoles();
                break;
            case "View all employees":
                viewAllEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee's role":
                updateEmployeeRole();
                break;
            case "Exit":
                console.log("Thank you for your time, have a good day");
                connection.end();
        }

        
    })
};

//function that handles logic to view all departments in the departments table
viewAllDepartments = () => {
    connection.query("select departments.id, departments.name from departments", (err, result) => {
        if(err){
            throw err;
        }
        console.table(result);
        askUser();
    });
}
//function that handles logic to view all roles in the roles table
viewAllRoles = () => {
    connection.query("select roles.id, roles.job_title, roles.salary, departments.name as department from roles inner join departments on roles.department_id = departments.id;", (err, result) => {
        if(err){
            throw err;
        }
        console.table(result);
        askUser();
    });
}
//function that handles logic to view all employees in the employees table
viewAllEmployees = () => {
    connection.query("select employees.id, employees.first_name, employees.last_name, roles.job_title, departments.name as department, roles.salary, CONCAT (manager.first_name, ' ', manager.last_name) as manager from employees left join roles on employees.role_id = roles.id left join departments on roles.department_id = departments.id left join employees manager on employees.manager_id = manager.id;", (err, result) => {
        if(err){
            throw err;
        }
        console.table(result);
        askUser();
    });
}
//function that handles logic to add a new department in the departments table
addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "Please enter the name of the department you wish to add",
            //making sure that the entered department name is not null/invalid
            validate: departmentName =>{
                if(departmentName){
                    return true;
                } else{
                    console.log("Please enter a department name");
                    return false;
                }
            }
        }
    ]).then(input => {
        connection.query("insert into departments (name) values (?)", input.departmentName, (err, result) =>{
            if(err){
                throw err;
            }
            console.log("Success! " + input.departmentName + " was inserted into departments table! Look for yourself!");
            viewAllDepartments();
        })
    })
}
//function that handles logic to add a new role in the roles table
addRole = () => {
    inquirer.prompt([
        {
            type: "imput",
            name: "role",
            message: "Please enter the name of the role you would like to add",
            validate: role =>{
                if(role){
                    return true;
                }else{
                    console.log("Please enter a role");
                    return false;
                }
            }
        },
        {

            type: "input",
            name: "salary",
            message: "Please enter the salary of this role",
            validate: salary => {
                if(!isNaN(salary)){
                    return true;
                }else{
                    console.log("Please enter a valid salary");
                    return false;
                }
            }
        }
    ]).then(input => {
        //saving role and salary as they are required for the final query
        let queryParameters = [input.role, input.salary];
        /*must first grab dept, easier to ask the user after querying
        rather than trying to handle the mess that would be made if the user was allowed 
        to input department in anything other than a list*/
        connection.query("select name, id from departments", (err, result) =>{
            if(err){
                throw err;
            }
            //mapping result data so inquirer can use it properly as a list input
            const dep = result.map(({name, id}) => ({name: name, value: id}));
            inquirer.prompt([
                {
                    type: "list",
                    name: "departmentInput",
                    message: "Please choose the department this role will be in",
                    choices: dep
                }
            ]).then(input2 =>{
                //this var will be pushed to the parameters array so that the final query can finally be ran (with little wiggle room for error)
                const d = input2.departmentInput;
                queryParameters.push(d);

                //final query that will insert role into roles table
                connection.query("insert into roles (job_title, salary, department_id) values (?, ?, ?)", queryParameters, (err, result) => {
                    if(err){
                        throw err;
                    }
                    console.log("Success! " + input.role + " was inserted into the roles table! See for yourself!");
                    viewAllRoles();
                })
            })
        })
    })
    
}
//function that handles logic to add a new employee in the employees table
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Please enter the employee's first name",
            validate: firstName => {
                if (firstName) {
                    return true;
                } else {
                    console.log('Please enter a valid first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Please enter the employee's last name",
            validate: lastName => {
                if (lastName) {
                    return true;
                } else {
                    console.log('Please enter a valid last name');
                    return false;
                }
            }
        }
    ]).then(input => {
        //saving first name and last name as they are required in the final query
        const queryParameters = [input.firstName, input.lastName]
        /*must first grab role, easier to ask the user after querying
        rather than trying to handle the mess that would be made if the user was allowed 
        to input role in anything other than a list*/
        connection.query("select roles.id, roles.job_title from roles", (err, result) => {
            if (err) {
                throw err;
            }
            //map the result so that inquirer can use it properly as a list input
            const rolesList = result.map(({ id, job_title }) => ({ name: job_title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'roleInput',
                    message: "Please enter the employee's role",
                    choices: rolesList
                }
            ]).then(selection => {
                //save and push to query parameters array
                const role = selection.roleInput;
                queryParameters.push(role);

                //now the same with manager (can't let the user input manager as string, must give clear list input options)
                connection.query("select * from employees", (err, result) => {
                    if (err) {
                        throw err;
                    }
                    const managerList = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                    //now with the set list of managers, we can ask for the final query parameter (manager)
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Please enter this employee's manager",
                            choices: managerList
                        }
                    ]).then(selection2 => {
                        //saving and pushing to query parameters array
                        const m = selection2.manager;
                        queryParameters.push(m);

                        connection.query("insert into employees (first_name, last_name, role_id, manager_id) values (?, ?, ?, ?)", queryParameters, (err, result) => {
                            if (err) {
                                throw err;
                            }
                            console.log("Success! Your employee has been added! See for yourself!")
                            viewAllEmployees();
                        });
                    });
                });
            });
        });
    });
}
//function that handles logic to update an employee's role
updateEmployeeRole = () => {
     /*must first grab employees, easier to ask the user after querying
        rather than trying to handle the mess that would be made if the user was allowed 
        to input employee they wish to edit in anything other than a list*/
    connection.query("select * from employees", (err, result) => {
        if (err){
            throw err;
        } 
        //mapping data so inquirer can use it properly as a list input
        const employeeList = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Please select the employee you would like to update",
                choices: employeeList
            }
        ]).then(selection => {
            //saving selection for final query
            const e = selection.name;
            const queryParameters = [];
            queryParameters.push(e);
            //restricting the updated role to one that exists already rather than allowing
            //the user to input any new role. (messes up the database)
            connection.query("select * from roles", (err, result) => {
                if (err){
                    throw err;
                }
                //map the result so that inquirer can use it properly as a list input
                const roleList = result.map(({ id, job_title }) => ({ name: job_title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "Please select this employee's new role",
                        choices: roleList
                    }
                ]).then(selection => {
                    //saving and pushing to query params array for final query
                    const r = selection.role;
                    queryParameters.push(r);
                    //swapping elements to make query run correctly (the array is in the wrong order)
                    let temp = queryParameters[0];
                    queryParameters[0] = r;
                    queryParameters[1] = temp;
                    //final query that will update employee in the database
                    connection.query("update employees set role_id = ? where id = ?", queryParameters, (err, result) => {
                        if (err){
                            throw err;
                        }
                        console.log("Success! The employee has been updated! See for yourself!");
                        viewAllEmployees();
                    });
                });
            });
        });
    });
}