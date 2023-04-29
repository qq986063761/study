const fs = require('fs')

const read = fs.createReadStream('./content.txt')
const write = fs.createWriteStream('./contentCopy.txt')
read.pipe(write)