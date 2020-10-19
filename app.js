const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


//ids is to collect all the id inputs for validation against duplication
let ids = [];
//employees array is to save all the staff objects and pass it to render 
let employees = [];
console.log("Welcome to the Team Page app! Let's start with the Boss...");
managerInput();

function managerInput() {
    inquirer.prompt([
        { 
            type: "input",
            name: "name",
            message: "What is the manager name?",
            validate: answer => {
                if(answer === "") {
                    return "invalid name";
                }
                return true;
            }
        },
        { 
            type: "input",
            name: "id",
            message: "What is the manager id number?",
            validate: answer => {
                if(answer === "" || ids.includes(answer) || isNaN(answer)) {
                    return "invalid id";
                }
                return true;
            }
        },
        {
            type: "input",
            name: "email",
            message: "What is the manager email?",
            validate: answer => {
                const emailSyntax = answer.match(
                    /\S+@\S+\.\S+/
                )
             if(emailSyntax) {
                 return true;
             }   
             return "invalid email";
            }
        },
        {
            type: "input",
            name: "officeNumber",
            message: "What is the manager's office number?"
        }]).then(function(data){
            ids.push(data.id);
        let managerData = [data.name,data.id,data.email,data.officeNumber];
        let manager = new Manager(...managerData);
        employees.push(manager);
        console.log(`OK ${data.name}.. let's enter your team members!`);
        employeeEntry();
        });
}

function employeeEntry() {
    inquirer.prompt([
        { 
            type: "input",
            name: "name",
            message: "What is the employee name?",
            validate: answer => {
                if(answer === "") {
                    return "invalid name";
                }
                return true;
            }
        },
        { 
            type: "input",
            name: "id",
            message: "What is the employee id number?",
            validate: answer => {
                if(answer === "" || ids.includes(answer) || isNaN(answer)) {
                    return "invalid id";
                }
                return true;
            }
        },
        {
            type: "input",
            name: "email",
            message: "What is the employee email?",
            validate: answer => {
                const emailSyntax = answer.match(
                    /\S+@\S+\.\S+/
                )
             if(emailSyntax) {
                 return true;
             }   
             return "invalid email";
            }
        },
        {
            type: "list",
            message: "What is the employee role?",
            name: "role",
            choices: [
            "Engineer",
            "Intern"
            ]
        }
    ]).then(function(data){
        ids.push(data.id);
        let mainEmployeeData = [data.name,data.id,data.email]
        switch (data.role) {
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
            default: break;
        }
    });
    
    //ask the user if there are more employees to enter. 
    //if not, send the employees array to render() and generate the html file
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
                fs.writeFile(outputPath, teamHTML, (err)=> (err) ? console.log(err) : console.log("Done! Your page is ready in output folder."));
            };
        });
    }
    
}