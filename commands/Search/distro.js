const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const utils = require('../../utils')
const toDistroWatchURL = (url) => 'https://distrowatch.com/' + url.replace(/ /g, '+')

module.exports = class extends require('../../structures/Command') {
    constructor() {
        super(__filename, {
            description: 'Search for a linux distro on distrowatch.com',
            typing: true,
            args: {
                name: 'distro',
                required: true
            }
        })
    }
    async run(message) {
        const query = message.args.toQuery()
        const info = await this.distrowatchDetails(query).catch(() => null)

        if (!info?.name) return 'I couldn\'t find anything 😔'

        const embed = new MessageEmbed().setColor('BLUE')

        const fields = [{
            name: 'Based on:',
            value: info.based_on.join(', ') || 'Independent'
        }, {
            name: 'Desktop:',
            value: utils.trimArray(info.desktop).join(', ')
        }, {
            name: 'Architecture:',
            value: utils.trimArray(info.architecture).join(', ')
        }, {
            name: 'Popularity:',
            value: info.popularity
        }, {
            name: 'Status:',
            value: info.status
        }, {
            name: 'Package Management:',
            value: info.package.join(', ')
        }]

        embed
            .setAuthor(info.name, info.icon)
            .setDescription(info.description)
            .addFields(fields.map((field) => Object.assign(field, { inline: true })))
            .setFooter(`Rating: ${info.rating} • Last Update`)
            .setTimestamp(info.last_update)

        if (info.url) embed.setTitle('Official Website').setURL(info.url)
        if (info.screenshot) {
            embed
                .attachFiles([{ attachment: info.screenshot, name: 'screenshot.png' }])
                .setImage('attachment://screenshot.png')
        }

        return embed
    }

    async distrowatchDetails(distroName) {
        const HTML = await fetch(`https://distrowatch.com/table.php?distribution=${distroName}`).then((page) => page.text())
        const $ = cheerio.load(HTML)

        function prop(label) {
            const el = $($('b').filter((_, el) => $(el).text() === label)[0])
            const siblings = el.siblings(':not(b)').toArray()
            return siblings.map((s) => {
                if (s.attribs.href) return `[${$(s).text()}](${toDistroWatchURL(s.attribs.href)})`
                return $(s).text()
            }).filter(Boolean)
        }

        function feature(label) {
            const el = $($('th').filter((_, el) => $(el).text() === label)[0])
            const siblings = el.next('td').text()
            return siblings.split(', ')
        }

        const screenshot = $('td[class="TablesTitle"]').find('img').filter((_, el) => el.attribs?.align === 'right')[0].attribs.src
        const icon = $('td[class="TablesTitle"]').find('img').filter((_, el) => el.attribs?.align === 'left')[0].attribs.src

        return {
            name: $('h1').text(),
            rating: $('div[style="font-size: 64px; text-align: left"]').text() || 'None',
            description: $('td[class="TablesTitle"]').text().replace('    ', '').replace(/^\s+|\s+$/g, '').split('\n\n')[1],
            os_type: prop('OS Type:')[0],
            last_update: new Date($('td[class="TablesTitle"]').find('div').text()),
            category: prop('Category:'),
            origin: prop('Origin:')[0],
            based_on: prop('Based on:'),
            desktop: prop('Desktop:'),
            architecture: prop('Architecture:'),
            package: feature('Package Management'),
            status: prop('Status:')[0],
            popularity: prop('Popularity:')[0],
            screenshot: toDistroWatchURL(screenshot),
            icon: toDistroWatchURL(icon)
        }
    }
}