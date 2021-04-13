const YouTube = require('youtube-sr').default

const LINUX_IN_ARABIC_CHANNEL_ID = 'UCZHCavD3aWDs2yMhxaxEHiA'
const REACTIONS = ['◀️', '⏹️', '▶️']

module.exports = class extends require('../../structures/Command') {
    constructor() {
        super(__filename, {
            description: 'Search for videos in Linux in Arabic channel!',
            aliases: ['youtube', 'yt', 'videos'],
            args: {
                name: 'query',
                required: true
            },
            typing: true
        })
    }
    async run(message) {
        const query = `"Linux in Arabic - لينكس بالعربي" ${message.args}`

        let results
        
        results = await YouTube.search(query, { type: 'video', safeSearch: true, limit: 10 })
        results = results.filter((video) => {
            return video.channel.id === LINUX_IN_ARABIC_CHANNEL_ID
        })

        if (!results.length) return 'I couldn\'t find anything 😔'

        const max = results.length - 1
        let i = 0, video = results[0]

        const msg = await message.reply(`Page: \`1/${max + 1}\`\nhttps://youtu.be/${video.id}`)

        for (const emoji of REACTIONS) await msg.react(emoji).catch(() => null)

        const filter = (reaction, user) => REACTIONS.includes(reaction.emoji.name) && user.id === message.author.id

        const collector = msg.createReactionCollector(filter, {
            time: 60000 * 1,
            idle: 30000
        })

        collector.on('collect', async ({ users, emoji }) => {
            users.remove(message.author).catch(() => null)
            switch (emoji.name) {
            case '◀️':
                if (i === 0) return
                i--
                break
            case '⏹️':
                collector.stop()
                return
            case '▶️':
                if (i === max) return
                i++
                break
            }
            video = results[i]
            if (msg.editable) await msg.edit(`Page: \`${i + 1}/${max + 1}\`\nhttps://youtu.be/${video.id}`).catch(() => null)
        }).on('end', () => msg.reactions.removeAll().catch(() => null))
    }
}