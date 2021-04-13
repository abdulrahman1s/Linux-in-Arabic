const { join } = require('path')
const { readdirSync, statSync } = require('fs')

module.exports = {
    readdir(...directory) {
        const result = [];
        (function read(dir) {
            const files = readdirSync(dir)
            for (const file of files) {
                const filepath = join(dir, file)
                if (statSync(filepath).isDirectory()) read(filepath)
                else result.push(filepath)
            }
        }(join(...directory)))
        return result
    },
    capitalize(string) {
        return string.split(' ').map((str) => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ')
    },
    trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen
            arr = arr.slice(0, maxLen)
            arr.push(len + ' more...')
        }
        return arr
    }
}