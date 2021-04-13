const { Structures } = require('discord.js')

class Args extends Array {
    first() {
        return this[0]
    }
    last() {
        return this[this.length - 1]
    }
    toQuery() {
        return encodeURIComponent(this.toString())
    }
    toString() {
        return this.join(' ')
    }
}

Structures.extend('Message', M => class Message extends M {
    get prefix() {
        return this.client.config.prefix
    }
    get args() {
        const args = this.content.slice(this.prefix.length).trim().split(/ +/)
        args.shift()
        return new Args(...args)
    }
    getCommand(commandName_) {
        const { commands, aliases } = this.client
        const commandName = commandName_ || this.content.slice(this.client.config.prefix.length).trim().split(/ +/).shift().toLowerCase()
        return (
            commands.get(commandName) || 
            commands.get(aliases.get(commandName))
        )
    }
    isGoodMessage() {
        return !!(
            this.content.startsWith(this.client.config.prefix) &&
            this.guild &&
            !this.author.bot
        )
    }
    say(...args) {
        return this.channel.send(...args)
    }
})