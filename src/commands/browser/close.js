const { Command, flags } = require('@oclif/command')
const { stopChromeDriver } = require('../../services/chromedriver')

class BrowserCloseCommand extends Command {
  async run() {
    this.log('close', await stopChromeDriver())
  }
}

BrowserCloseCommand.description = `Close browser session
...

`


module.exports = BrowserCloseCommand
