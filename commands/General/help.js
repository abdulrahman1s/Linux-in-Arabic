const { MessageEmbed } = require('discord.js')
const SOURCE_CODE_URL = 'https://github.com/TheMaestro0/Linux-in-Arabic'

module.exports = class extends require('../../structures/Command') {
    constructor() {
        super(__filename, {
            description: 'Show Help menu!',
            aliases: ['h'],
            args: {
                name: 'command'
            }
        })
    }
    run(message) {
        if (!message.args.first()) {
            return this.generateHelp(message)
        } else {
            const commandName = message.args.first().toLowerCase()
            const command = message.getCommand(commandName)

            if (!command) throw 'I couldn\'t find anything 😔'

            return new MessageEmbed()
                .setTitle(`${message.prefix}${command.name} ${command.args.map((arg) => arg.review).join(' ')}`)
                .setDescription(command.description)
                .setColor('BLUE')
        }
    }

    generateHelp(message) {
        const { prefix } = message
        const embed = new MessageEmbed()
            .setTitle('Help Menu!')
            .setDescription(`To view details for a command, do \`${prefix}help <command>\``)
            .setThumbnail(message.client.user.displayAvatarURL())
            .setColor('BLUE')

        let categories = []

        for (const category of new Set(message.client.commands.map((c) => c.category))) {
            const commands = message.client.commands.filter((c) => c.category === category && !c.ownerOnly)
            if (commands.size) categories.push({ category, commands })
        }

        categories = categories.sort((a, b) => b.commands.size - a.commands.size)
        categories.forEach(({ category, commands }) => {
            embed.addField(category, commands.map((cmd) => `\`${prefix}${cmd.name}\``).join('\n'), true)
        })

        embed.addField('\u200B', `[Source Code](${SOURCE_CODE_URL})`)

        return embed
    }
}