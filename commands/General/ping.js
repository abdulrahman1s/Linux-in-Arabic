module.exports = class extends require('../../structures/Command') {
    constructor() {
        super(__filename, {
            aliases: ['pong']
        })
    }
    async run(message) {
        const m = await message.say('Ping...')
        const ping = Math.abs((m.createdTimestamp - message.createdTimestamp) - message.client.ws.ping)
        return m.edit(`Pong: \`${ping}ms\``)
    }
}