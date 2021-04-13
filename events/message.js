const { MessageEmbed } = require('discord.js')

const isFriendlyResponse = (res) => (res && (typeof res === 'string' || res instanceof MessageEmbed))
const getMessageOptions = (res) => ({
    [typeof res === 'string' ? 'content' : 'embed']: res,
    allowedMentions: { repliedUser: false }
})

async function runCommand(message, command) {
    if (command.typing) message.channel.startTyping()

    try {
        const response = await command?.run(message)
        if (isFriendlyResponse(response)) message.reply(getMessageOptions(response))
    } catch (error) {
        if (isFriendlyResponse(error)) {
            message.reply(getMessageOptions(error))
        } else {
            message.client.logger.error(error)
            message.say('Something wrong! sorry!')
        }
    } finally {
        if (command.typing) message.channel.stopTyping()
    }

}

function invalidUsage(message, command) {
    const args = message.args
    return command.args.some((arg, index) => {
        if (arg.required && typeof args[index] === 'undefined') {
            message.reply(new MessageEmbed()
                .setTitle('Invalid Usage')
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor('DARK_RED')
                .setDescription(command.getMissing(index)))
            return true
        }
    })
}

module.exports = async (message) => {
    if (!message.isGoodMessage()) return

    const command = message.getCommand()

    if (!command) return

    if (command.ownerOnly && !message.author.isOwner())
        return message.reply('Only for bot owner')

    if (!invalidUsage(message, command)) {
        await runCommand(message, command)
    }
}
