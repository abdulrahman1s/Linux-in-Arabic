const colors = require('colors/safe')
const cleanStack = require('clean-stack')
const time = () => new Date().toLocaleTimeString('en-US')
const toColorString = {
    log: colors.green.bold('LOG'),
    warn: colors.yellow.bold('WARN'),
    error: colors.red.bold('ERROR'),
    debug: colors.white.bold('DEBUG'),
    info: colors.cyan.bold('INFO')
}

class Logger {
    _log(type = 'log', message = '') {
        console[type](`[${colors.grey.bold(time())}] [${toColorString[type]}] ${message}`)
        return this
    }
    log(message) {
        return this._log('log', message)
    }
    debug(message) {
        return this._log('debug', message)
    }
    info(message) {
        return this._log('info', message)
    }
    warn(message) {
        return this._log('warn', message)
    }
    error(message) {
        if (typeof message === 'object' && 'stack' in message) {
            message = cleanStack(message.stack, {
                pretty: true,
                basePath: process.cwd()
            })
        }
        return this._log('error', message)
    }
}

module.exports = Logger