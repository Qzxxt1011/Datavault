const inquirer = require('inquirer')
const fs = require('fs')
const figlet = require('figlet')
const chalk = require('chalk')

const title = () => {
    console.log('\n' + chalk.greenBright(figlet('Datavault', {
        font: 'Computer'
    })))
}

const sdo = (callback) => {
    console.clear()
    title()
    
    const pass = fs.readFileSync('../userdata/pass', 'utf-8', () => {})
    console.log(chalk.redBright('This action needs confirmation.'))
    inquirer.prompt([{
        name: 'pass',
        message: 'Enter password:',
        type: 'password',
        validate: function (input) {
            var done = this.async()

            if (input != pass) {
                done('Password incorrect.')
            } else if (input == pass) {
                done(true)
            }
        }
    }])
    .then(answers => {
        callback()
    })
}