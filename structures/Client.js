const { Client: DiscordClient, Collection } = require('discord.js')
const { readdir } = require('../utils')
const Logger = require('./Logger')
const config = require('../config')

class Client extends DiscordClient {
    constructor(options) {
        super(options)
        this.config = config
        this.commands = new Collection()
        this.aliases = new Collection()
        this.logger = new Logger()
    }
    load() {
        for (const filePath of readdir(__dirname, '../commands')) {
            const command = new (require(filePath))()
            this.commands.set(command.name, command)
            command.aliases.forEach((alias) => this.aliases.set(alias, command.name))
        }

        for (const filePath of readdir(__dirname, '../events')) {
            const event = require(filePath)
            this.on(filePath.split(/[\\/]/).pop().slice(0, -3), (...args) => event(...args, this))
            delete require.cache[require.resolve(filePath)]
        }

        this
            .on('disconnect', () => this.logger.warn('Bot is disconnecting...'))
            .on('reconnecting', () => this.logger.log('Bot is reconnecting...'))
            .on('error', (err) => this.logger.error(err))
            .on('warn', (info) => this.logger.warn(info))

        return super.login(config.token)
    }
}

module.exports = Client