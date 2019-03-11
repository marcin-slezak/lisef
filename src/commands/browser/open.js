const { Command, flags } = require('@oclif/command')
const { getDriver } = require('../../services/chromedriver')

class BrowserOpenCommand extends Command {
  async run() {
    const { flags } = this.parse(BrowserOpenCommand)

    try {
      await getDriver(flags.freshSession)
      
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
