const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

const BASE_URL = 'https://raw.githubusercontent.com/jamezrin/distrowatch-data/master/rankings.json'
const A_WEEK = 604800000

let lastUpdate, data

module.exports = class extends require('../../structures/Command') {
    constructor() {
        super(__filename, {
            description: 'Show trending distros on Distrowatch.com',
            aliases: ['trending']
        })
    }
    async run() {
        
        if (!data || (Date.now() - lastUpdate) >= A_WEEK) {
            data = await fetch(BASE_URL).then((page) => page.json())
            data = data.pop()
            data.distributionsRanking = data.distributionsRanking.slice(0, 10)
            lastUpdate = Date.now()
        }

        const formattedRanks = data.distributionsRanking.map((distro, index) => {
            return `**${index + 1}**. [**${distro.name}**](${distro.url}) *^*\`${distro.value}\``
        })

        const embed = new MessageEmbed()
            .setTitle('Trending on Distrowatch.com')
            .setColor('BLUE')
            .setDescription(formattedRanks)
            .setFooter(data.dataSpanName)

        return embed
    }
}