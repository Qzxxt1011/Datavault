#!/usr/bin/env node
const figlet = require('figlet').textSync
const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs')
inquirer.registerPrompt('fileselect', require('inquirer-file-tree-selection-prompt'))

function userdata(fileName) {
    return __dirname + '\\userdata\\' + fileName
}

function rootDir() {
    return __dirname + '\\files\\'
}

const setup = fs.readFileSync(userdata('setup'), 'utf-8', () => {})

const title = () => {
    console.log('\n' + chalk.greenBright(figlet('Datavault', {
        font: 'Computer'
    })))
}

const fileSystem = () => {
    const name = fs.readFileSync(userdata('name'), 'utf-8')
    console.clear()
    title()
    console.log(chalk.yellowBright('Welcome back to your vault, ') + chalk.redBright(name) + chalk.yellowBright('.'))
    inquirer.prompt({
        name: 'wn',
        message: 'What next?',
        type: 'list',
        choices: ['Read a file', 'Create a file', 'Edit a file', 'Make a directory', new inquirer.Separator, 'Abort']
    })
    .then(answers => {
        switch (answers.wn) {
            case 'Read a file':
                inquirer.prompt({
                    name: 'path',
                    message: 'What file to read?',
                    type: 'fileselect',
                    root: rootDir()
                })
                .then(answers => {
                    const contents = fs.readFileSync(answers.path, 'utf-8')
                    console.log(chalk.redBright('Contents of file:\n') + chalk.greenBright(contents))
                })
                break
            case 'Create a file':
                console.clear()
                title()
                inquirer.prompt([{
                    name: 'nf',
                    message: 'Where will the new file be located?',
                    type: 'fileselect',
                    root: rootDir()
                },
                {
                    name: 'name',
                    message: 'What is the new file name?',
                    type: 'input'
                }])
                .then(answers => {
                    fs.writeFileSync(`${answers.nf}\\${answers.name}`, '')
                    console.clear()
                    console.log('Loading...')
                    setTimeout(() => {
                        fileSystem()
                    }, 2000)
                })
                break
            case 'Edit a file':
                inquirer.prompt([{
                    name: 'path',
                    message: 'Choose a file to edit:',
                    type: 'fileselect',
                    root: rootDir()
                },
                {
                    name: 'edit',
                    message: 'Text:',
                    type: 'editor'
                }])
                .then(answers => {
                    fs.writeFileSync(answers.path, answers.edit)
                    console.clear()
                    console.log('Loading...')
                    setTimeout(() => {
                        fileSystem()
                    }, 2000)
                })
                break
            case 'Make a directory':
                inquirer.prompt([{
                    name: 'nd',
                    message: 'Where will the new directory be located?',
                    type: 'fileselect',
                    root: rootDir()
                },
                {
                    name: 'name',
                    message: 'New directory name:',
                    type: 'input'
                }])
                .then(answers => {
                    fs.mkdirSync(`${answers.nd}\\${answers.name}`)
                    console.clear()
                    console.log('Loading...')
                    setTimeout(() => {
                        fileSystem()
                    }, 2000)
                })
                break
            case 'Abort':
                console.clear()
                console.log('Loading...')
                setTimeout(() => {
                    process.abort()
                }, 2000)
                break
        }
    })
}

function datavault() {
    const name = fs.readFileSync(userdata('name'), 'utf-8', () => {})
    const pass = fs.readFileSync(userdata('pass'), 'utf-8', () => {})
    console.log(chalk.yellowBright('Welcome back, ') + chalk.redBright(name) + chalk.yellowBright('.'))
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
        fileSystem()
    })
}

const startSetup = () => {
    console.log(chalk.yellowBright('Welcome to Datavault!'))

    inquirer.prompt([{
        name: 'setup1',
        message: 'What is your name?',
        type: 'input'
    },
    {
        name: 'setup2',
        message: 'Enter a password:',
        type: 'password',
    },
    {
        name: 'setup3',
        message: 'What next?',
        type: 'list',
        choices: ['Restart and save', 'Abort and save', new inquirer.Separator, 'Restart', 'Abort']
    }])
    .then(answers => {
        const load = (whenDone) => {
            console.clear()
            console.log('Loading...')
            setTimeout(() => {
                whenDone()
            }, 2000)
        }
        const abort = () => {
            load(() => {
                process.abort()
            })
        }
        const restart = () => {
            load(() => {
                const newSetup = fs.readFileSync(userdata('setup'), 'utf-8', () => {})
                console.clear()
                title()
                if (newSetup == 'true') {
                    startSetup()
                } else if (newSetup == 'false') {
                    datavault()
                }
            })
        }
        const save = () => {
            fs.writeFileSync(userdata('name'), answers.setup1)
            fs.writeFileSync(userdata('pass'), answers.setup2)
            fs.writeFileSync(userdata('setup'), 'false')
        }
        switch (answers.setup3) {
            case 'Restart and save':
                save()
                restart()
                break
            case 'Abort and save':
                save()
                abort()
                break
            case 'Restart':
                restart()
                break
            case 'Abort':
                abort()
                break
        }
    })
}

const start = () => {
    title()
    if (setup == 'true') {
        startSetup()
    } else if (setup == 'false') {
        datavault()
    }
}

console.clear()

start()