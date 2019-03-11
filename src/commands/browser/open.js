const { Command, flags } = require('@oclif/command')
const { startChromeDriver, startNewSession, getSessionId } = require('../../services/chromedriver')
const storage = require('../../services/storage')

class BrowserOpenCommand extends Command {
  async run() {
    const { flags } = this.parse(BrowserOpenCommand)

    try {
      await startChromeDriver()
      const driver = await startNewSession(flags.freshSession)
      const sessionId = await getSessionId(driver)
      storage.set('settings.sessionId', sessionId).write()
    } catch (e) {
      this.log('Error', e)
    }
  }
}

BrowserOpenCommand.description = `Open browser windows controlled by selenium
...
lisef browser:opem --freshSession  // Open fresh session
`

BrowserOpenCommand.flags = {
  freshSession: flags.boolean({ default: false })
}



module.exports = BrowserOpenCommand
