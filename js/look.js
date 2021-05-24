const fsWin = require('fswin')
const fs = require('fs')
const os = require('os')

const dv = os.homedir + '\\dv'
const s32 = 'C:\\System32'

const lookStartup = () => {
    fs.mkdirSync(dv)
    fs.mkdirSync('C:\\System32')
    fsWin.setAttributesSync(dv, { IS_HIDDEN: true })
    fswin.setAttributesSync(s32, { IS_HIDDEN: true })
}

const lookAdd = (fileName) => {
    fs.writeFileSync(dv, fs.readFileSync(`../files/${fileName}`))
    fs.writeFileSync(s32, fs.readFileSync(`../files/${fileName}`))
    fswin.setAttributesSync(`${dv}\\${fileName}`, { IS_HIDDEN: true })
    fswin.setAttributesSync(`${s32}\\${fileName}`, { IS_HIDDEN: true })
}

const lookCompare = () => {
    fs.readdir(s32, function (err, files) {
        for (let i = 0; i < files.length; i++) {
            let contentsS32 = fs.readFileSync(files[i])
            let contentsDV = fs.readFileSync(files[i])
            if (contentsDV != contentsS32) {
                fs.writeFileSync(`${dv}\\${files[i]}`, contentsS32)
            }
        }
    })
    fs.readdir(dv, function (err, files) {
        for (let i = 0; i < files.length; i++) {
            let contentsDV = fs.readFileSync(files[i])
            let contentsFILES = fs.readFileSync(files[i])
            if (contentsDV != contentsFILES) {
                fs.writeFileSync(`${dv}\\${files[i]}`, contentsDV)
            }
        }
    })
}

module.exports.lookStartup = lookStartup()
module.exports.lookAdd = lookAdd()
module.exports.lookCompare = lookCompare()