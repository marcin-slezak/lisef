const { Command} = require('@oclif/command')

class BrowserCommand extends Command {
  async run() {

    this.log(BrowserCommand.description)

  }
}

BrowserCommand.description = `Manage browser sessions
...
lisef browser:open
lisef browser:close
`

module.exports = BrowserCommand
