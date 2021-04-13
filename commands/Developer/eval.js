const { inspect } = require('util')
const cleanStack = require('clean-stack')

module.exports = class extends require('../../structures/Command') {
    constructor() {
        super(__filename, {
            ownerOnly: true,
            args: {
                name: 'code',
                required: true
            }
        })
    }
    run(message) {
        const code = message.args.toString()
        const result = new Promise((resolve) => resolve(eval(code)))
        return result.then((output) => {
            if (typeof output !== 'string') output = inspect(output, { depth: 0 })
            return message.say(output, { code: 'js', split: true })
        }).catch((err) => {
            if (typeof err === 'object' && 'stack' in err) {
                err = cleanStack(err.stack, {
                    pretty: true,
                    basePath: process.cwd()
                })
            }
            err = err.toString().replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
            return message.say(err, { code: 'fix', split: true })
        })
    }
}