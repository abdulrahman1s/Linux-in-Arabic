const { MessageEmbed } = require('discord.js')
const DeGoogle = require('../../assets/JSON/degoogle.json')

const CATEGORIES = Object.keys(DeGoogle)
const DE_GOOGLE_ICON = 'https://repository-images.githubusercontent.com/191201679/10394d00-968c-11ea-8879-4f06b3e59af5'

const createFilter = (message, array) => {
    return ((m) =>
        m.author.id === message.author.id &&
        !isNaN(m.content) &&
        m.content > 0 &&
        m.content <= array.length
    )
}

module.exports = class extends require('../../structures/Command') {
    constructor() {
        super(__filename, {
            description: 'A huge list of alternatives to Google products.'
        })
    }
    async run(message) {
        try {
            const msg = await message.reply(new MessageEmbed()
                .setColor('BLUE')
                .setDescription(CATEGORIES.map((cat, i) => `\`${i + 1}\`. **${cat}**`))
                .setFooter(`Send number between 1 to ${CATEGORIES.length}`)
                .setImage(DE_GOOGLE_ICON))

            const category_key = CATEGORIES[(await msg.channel.awaitMessages(createFilter(message, CATEGORIES), { max: 1, time: 30000, errors: ['time'] })).first().content - 1]
            const category = DeGoogle[category_key]

            msg.edit(new MessageEmbed()
                .setThumbnail(DE_GOOGLE_ICON)
                .setColor('BLUE')
                .setDescription(Object.keys(category).map((sec, i) => `\`${i + 1}\`. **${sec}**`))
                .setFooter(`Send number between 1 to ${Object.keys(category).length}`))

            const section_key = Object.keys(category)[(await msg.channel.awaitMessages(createFilter(message, Object.keys(DeGoogle[category_key])), { max: 1, time: 30000, errors: ['time'] })).first().content - 1]

            msg.edit(new MessageEmbed()
                .setTitle(`Google ${section_key} Alternatives`)
                .setColor('BLUE')
                .setDescription(DeGoogle[category_key][section_key].filter((v) => v.url).map((x) => `[**${x.name}**](${x.url}) ${x.repo ? `([Source Code](${x.repo}))` : ''}`)))
        } catch {
            throw 'Timeout!'
        }
    }
}

