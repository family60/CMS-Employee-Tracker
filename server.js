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
        
        switch(selection){
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

}
//function that handles logic to view all roles in the roles table
viewAllRoles = () => {
    
}
//function that handles logic to view all employees in the employees table
viewAllEmployees = () => {
    
}
//function that handles logic to add a new department in the departments table
addDepartment = () => {
    
}
//function that handles logic to add a new role in the roles table
addRole = () => {
    
}
//function that handles logic to add a new employee in the employees table
addEmployee = () => {
    
}
//function that handles logic to update an employee's role
updateEmployeeRole = () => {
    
}