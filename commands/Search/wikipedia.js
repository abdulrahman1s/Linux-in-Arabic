const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const html2md = require('html-to-md')

const isArabic = (str) => /^[\u0621-\u064A0-9 ]+$/.test(str)

module.exports = class extends require('../../structures/Command') {
    constructor() {
        super(__filename, {
            description: 'Searches on wikipedia',
            aliases: ['wiki'],
            args: {
                name: 'query',
                required: true
            },
            typing: true
        })
    }
    async run(message) {
        const query = message.args.toString()
        const search = new URLSearchParams({
            action: 'query',
            prop: 'extracts|pageimages|info',
            format: 'json',
            titles: query,
            exintro: '',
            explaintext: '',
            redirects: '',
            formatversion: 2,
        })

        const language = isArabic(query) ? 'ar' : 'en'
        const body = await fetch(`https://${language}.wikipedia.org/w/api.php?` + search).then((page) => page.json())

        const page = body?.query?.pages?.[0]

        if (!page || page?.missing || !page.extract) return 'I couldn\'t find anything 😔'

        const content = html2md(page.extract)
        
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(page.title)
            .setAuthor('Wikipedia', 'https://i.imgur.com/a4eeEhh.png')
            .setDescription(content.substr(0, 2000).replace(/[\n]/g, '\n\n'))
            .setFooter('Last Update at')
            .setTimestamp(new Date(page.touched))

        if (page?.thumbnail?.source) {
            embed.setThumbnail(page?.thumbnail?.source)
        }

        return embed
    }
}