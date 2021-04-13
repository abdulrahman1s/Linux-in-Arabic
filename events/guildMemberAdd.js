const LINUX_IN_ARABIC = '**Linux in Arabic**'
const findWelcomeChannel = (member) => {
    return member.guild.channels.cache.find((c) => c.name.includes('welcome') && c.isText())
}

module.exports = async (member) => {
    const channel = findWelcomeChannel(member)
    await channel?.send(`Hello ${member}, Welcome to ${LINUX_IN_ARABIC}!`)
}