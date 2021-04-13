const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const { capitalize } = require('../../utils')

const SEARCH_URL = 'https://archlinux.org/packages/search/json/?limit=1&q='

module.exports = class extends require('../../structures/Command') {
    constructor() {
        super(__filename, {
            description: 'Search for a program/package for linux',
            typing: true,
            args: {
                name: 'query',
                required: true
            }
        })
    }
    async run(message) {
        const query = message.args.toQuery()
        
        try {
            const data = await fetch(SEARCH_URL + query).then((data) => data.json())

            if (!data?.results[0]) throw 'Not Found!'

            const app = formatPkg(data.results[0])

            const fields = [{
                name: 'Version:',
                value: `\`${app.version}\``
            }, {
                name: 'Installed size:',
                value: app.installedSize
            }, {
                name: 'Compressed size:',
                value: app.compressedSize
            }]

            const embed = new MessageEmbed()
                .setTitle(capitalize(app.name))
                .setURL(app.url)
                .setDescription(app.description.substr(0, 2000))
                .setColor('BLUE')
                .addFields(fields.map((field) => Object.assign(field, { inline: true })))
                .setFooter('Last Update at')
                .setTimestamp(app.lastUpdate)

            return embed
        } catch {
            return 'I couldn\'t find anything 😔'
        }
    }
}

function formatPkg(data) {
    return {
        name: data.pkgname,
        description: data.pkgdesc,
        version: data.pkgver,
        url: data.url,
        lastUpdate: new Date(data.last_update),
        installedSize: formatBytes(data.installed_size ?? 0),
        compressedSize: formatBytes(data.compressed_size ?? 0)
    }
}

function formatBytes(bytes, decimals = 2) {
    if (typeof bytes !== 'number') return 'None Bytes'
    if (!bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}