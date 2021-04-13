const { Structures } = require('discord.js')


Structures.extend('User', U => class User extends U {
    isOwner() {
        return this.client.config.owners.includes(this.id)
    }
})