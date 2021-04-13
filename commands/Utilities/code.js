/* eslint-disable no-useless-escape */
const languages = [
    'asm',
    'asm64',
    'awk',
    'bash',
    'bf',
    'brainfuck',
    'csharp',
    'c#',
    'c++',
    'cpp',
    'cs',
    'c',
    'deno',
    'denojs',
    'denots',
    'duby',
    'el',
    'elisp',
    'emacs',
    'elixir',
    'haskell',
    'hs',
    'go',
    'java',
    'javascript',
    'jelly',
    'jl',
    'julia',
    'js',
    'kotlin',
    'lua',
    'nasm',
    'nasm64',
    'nim',
    'node',
    'paradoc',
    'perl',
    'php',
    'php3',
    'php4',
    'php5',
    'py',
    'py3',
    'python',
    'python2',
    'python3',
    'r',
    'rb',
    'ruby',
    'rs',
    'rust',
    'sage',
    'swift',
    'ts',
    'typescript'
]

const fetch = require('node-fetch')

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const isInvite = /(https?:\/\/)?(www\.)?(disco|discord(app)?)\.(com|gg|io|li|me|net|org)(\/invite)?\/[a-z0-9-.]+/i
const regex = new RegExp('^```(' + languages.map(escapeRegex).join('|') + ')([\\s\\S]*)```$')
const USAGE = '\\\`\\\`\\\`<language>\n\n< - Your Code! - >\n\n\\\`\\\`\\\`\n\n**Example:** https://i.ibb.co/x3XLJ71/code-command-example.png'

module.exports = class extends require('../../structures/Command')  {
    constructor() {
        super(__filename, {
            description: 'Code Evaluation (API)',
            typing: true,
            args: {
                name: 'codeblock', 
                required: true
            }
        })
    }
    async run(message) {
        const code = message.args.toString()

        if (!regex.test(code)) return USAGE

        const [, language, source] = code.match(regex)

        if (!source.length) return 'Please include a code to eval!'
        if (!language.length) return 'Please include a language to eval!'

        const { output } = await this.evalCode(language, source)

        if (isInvite.test(output)) throw 'NO INVITES!'

        if (typeof output !== 'string' || !output.trim() || !output.length) return '```Empty output```'

        if (output.length >= 1900) {
            return message.say(`${message.author}, Time Taken: \`${Math.floor(Date.now() - message.createdTimestamp)}ms\``, {
                files: [{
                    name: `log-${output.length}.txt`,
                    attachment: Buffer.from(output)
                }]
            })
        }

        return message.say(`${message.author}, Time Taken: \`${Math.floor(Date.now() - message.createdTimestamp)}ms\`` + '\n```xl\n' + output.replace(/`/g, '`' + String.fromCharCode(8203)) + '```', {
            allowedMentions: {
                users: [message.author.id]
            }
        })
    }

    async evalCode(language, source, args = []) {
        try {
            const response = await fetch('https://emkc.org/api/v1/piston/execute', {
                method: 'POST',
                body: JSON.stringify({ language, source, args })
            })
            if (response.status !== 200) return { output: 'The api returned an invalid response, try again later' }
            return await response.json()
        } catch {
            return { output: 'The api returned an invalid response, try again later' }
        }
    }
}