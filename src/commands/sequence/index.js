const { Command } = require('@oclif/command')

class SequenceCommand extends Command {
  async run() {

    this.log(SequenceCommand.description)

  }
}

SequenceCommand.description = `Manage sequences
...
lisef sequence:list
lisef sequence:run
`

module.exports = SequenceCommand
