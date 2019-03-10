const { Command,} = require('@oclif/command')

class PageCommand extends Command {
  async run() {
    this.log(PageCommand.description)
  }
}

PageCommand.description = `Manage page objects
...
lisef page:list  // List available page objects
lisef page:run  // Run method from page object
`


module.exports = PageCommand
