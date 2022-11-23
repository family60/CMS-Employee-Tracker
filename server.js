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

};

