const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
let employees = [];
console.log("Welcome to the greatest app ever created!");
employeeEntry();

function employeeEntry() {
    inquirer.prompt([
        { 
            type: "input",
            name: "name",
            message: "What is the employee name?"
        },
        { 
            type: "input",
            name: "id",
            message: "What is the employee id number?"
        },
        {
            type: "input",
            name: "email",
            message: "What is the employee email?"
        },
        {
            type: "list",
            message: "What is the employee role?",
            name: "role",
            choices: [
            "Manager",
            "Engineer",
            "Intern"
            ]
        }
    ]).then(function(data){
        let mainEmployeeData = [data.name,data.id,data.email]
        switch (data.role) {
            case "Manager":
                inquirer.prompt(
                    {
                        type: "input",
                        name: "officeNumber",
                        message: "What is the manager's office number?"
                    }
                ).then(function(data2){
                    mainEmployeeData.push(data2.officeNumber);
                    let newEmployee = new Manager(...mainEmployeeData);
                    employees.push(newEmployee);
                    addMore();
                });
                break;
            case "Engineer":
                inquirer.prompt([
                    {
                        type: "input",
                        name: "github",
                        message: "What is the engineer's Github username?"
                    }
                ]).then(function(data2){
                    mainEmployeeData.push(data2.github);
                    let newEmployee = new Engineer(...mainEmployeeData);
                    employees.push(newEmployee);
                    addMore();
                });
                break;
            case "Intern":
                inquirer.prompt([
                    {
                        type: "input",
                        name: "school",
                        message: "What is the intern's school name?"
                    }
                ]).then(function(data2){
                    mainEmployeeData.push(data2.school);
                    let newEmployee = new Intern(...mainEmployeeData);
                    employees.push(newEmployee);
                    addMore()
                });
                break;
        }
    });
    //make it a function and put it in each case of the Switch statement
    function addMore(){
        inquirer.prompt([
            {
                type: "confirm",
                name: "add",
                message: "Add more employees?"
            }
        ]).then(function(data){
            if(data.add === true) {
                employeeEntry();
            } else {
                let teamHTML = render(employees);
                fs.writeFile(outputPath, teamHTML, (err)=> (err) ? console.log(err) : console.log("Done!"));
            };
        });
    }
    
}



// After the user has input all employees desired, call the `render` function (required
// above and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
