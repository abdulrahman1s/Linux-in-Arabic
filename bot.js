require('http').createServer((_req, res) => {
    res.write('Linux in Arabic!')
    res.end()
}).listen(process.env.PORT || 8080)


require('./extensions/Message')
require('./extensions/User')

const Client = require('./structures/Client')
const client = new Client({
    presence: {
        activity: {
            type: 'WATCHING',
            name: 'Linux in Arabic'
        }
    },
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
    restTimeOffset: 0
});

(async (startAt) => {
    try {
        client.logger.log('Starting...')
        await client.load()
        client.logger.log(`Loaded in ${Date.now() - startAt}ms`)
    } catch (error) {
        client.logger.error(error)
        process.exit(1)
    }
})(Date.now())

process
    .on('uncaughtException', (error) => client.logger.error(error))
    .on('unhandledRejection', (error) => client.logger.error(error))
    .on('warning', (info) => client.logger.warn(info))