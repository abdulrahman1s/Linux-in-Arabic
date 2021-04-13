module.exports = class extends require('../../structures/Command') {
    constructor() {
        super(__filename, {
            ownerOnly: true,
            args: {
                name: 'text',
                required: true
            }
        })
    }
    run(message) {
        return message.say(message.args.toString())
    }
}