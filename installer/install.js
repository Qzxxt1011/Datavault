const fs = require('fs')
const os = require('os')
const unzipper = require('unzipper')
const { exec } = require('child_process')

const files = os.homedir() + '\\AppData\\Roaming\\Datavault'
fs.mkdirSync(files)

fs.createReadStream(__dirname + '\\datavault.zip')
.pipe(unzipper.Extract({ path: `${files}` }));

exec(`cd ${files} && npm link`)