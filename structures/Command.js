const config = require('../config')

class Command {
    constructor(path, {
        aliases = [],
        args = [],
        ownerOnly = false,
        typing = false,
        description = 'No description'
    } = {}) {
        if (!Array.isArray(args) && typeof args === 'object') args = [args]
        const file = path.split(/[\\/]/)
        this.name = file.pop().slice(0, -3)
        this.category = file.pop()
        this.description = description
        this.aliases = aliases
        this.args = args.map((arg) => Object.assign(arg, { review: arg.required === true ? `<${arg.name}>` : `[${arg.name}]` }))
        this.ownerOnly = ownerOnly
        this.typing = typing
    }
    getMissing(index) {
        const command = config.prefix + this.name + ' '
        const body = command +
			this.args.map((arg) => arg.review).join(' ') + '\n' + ' '.repeat(command.length) +
			this.args.map((arg, i) => (i === index ? '^' : ' ').repeat(arg.name.length + 2)).join(' ')
        
        return '```fix\n' + `${body}\n${this.args[index].name} is a required argument that is missing.` + '```'
    }
}

module.exports = Command