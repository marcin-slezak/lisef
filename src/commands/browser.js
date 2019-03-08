const { Command, flags } = require('@oclif/command')
const { startChromeDriver, stopChromeDriver, startNewSession, getSessionId } = require('../services/chromedriver')
const storage = require('../services/storage')
var path = require('path');



class BrowserCommand extends Command {
  async run() {
    const { args, flags } = this.parse(BrowserCommand)

    switch (args.operation) {
      case 'open':
        try {
          this.log('open', await startChromeDriver())
          const driver = await startNewSession(flags.freshSession)
          const sessionId = await getSessionId(driver)
          console.log('session', sessionId)
          storage.set('settings.sessionId', sessionId).write()
        } catch (e) {
          this.log('Error',e )
        }
        break;
      case 'close':
        this.log('close', await stopChromeDriver())
        break;
      default:
        this.log(path.resolve('./'))
        this.log(BrowserCommand.description)

    }

  }
}

BrowserCommand.description = `Describe the command here
...
Extra documentation goes here
`

BrowserCommand.flags = {
  freshSession: flags.boolean({default: false})
}

BrowserCommand.args = [
  { name: 'operation', required: false },

]
module.exports = BrowserCommand
