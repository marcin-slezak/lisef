const { Command, flags } = require('@oclif/command')
const fs = require('fs');
const path = require('path');

const util = require('util')
const fileExist = util.promisify(fs.exists)
const { getDriver } = require('../../services/chromedriver')
const _ = require('lodash')
const getConfig = require('../../services/config')
const Listr = require('listr');

class SequenceRunCommand extends Command {
  async run() {
    const { args, flags } = this.parse(SequenceRunCommand)

    if (!args.sequenceName) {
      return this.log('Sequence name required')
    }
    const filePath = path.resolve(`./lisef/sequences/${args.sequenceName}.js`)

    if (!await fileExist(filePath)) {
      return this.log(`File ${filePath} not found`)
    }

    const ctx = await getConfig(flags.config);

    const driver = await getDriver()

    const sequenceClass = require(filePath)
    const sequence = new sequenceClass(driver, ctx)

    if (!sequence.getSequenceDefinition) {
      return this.log(`getSequenceDefinition not found in ${filePath}`)
    }
    let lastReturnValue;
    const sequenceDef = sequence.getSequenceDefinition()
    let sequenceToRun;
    if (flags.start) {
      const startIndex = sequenceDef.findIndex(i => i === flags.start)
      if (startIndex < 0) {
        throw new Error(`Start sequence key ${flags.start} not found in ${filePath}`)
      }
      sequenceToRun = sequenceDef.splice(startIndex)
    } else {
      sequenceToRun = sequenceDef
    }

    const tasks = new Listr(sequenceToRun.map(step => {
      return {
        title: step,
        task: async () => {
          lastReturnValue = await sequence[step](lastReturnValue)
          return lastReturnValue
        }
      }
    }));

    await tasks.run()
  }
}

SequenceRunCommand.description = `Run sequence
...
lisef sequence:run <sequenceName> --config <configName> --start <startStep>
`

SequenceRunCommand.flags = {
  config: flags.string(),
  start: flags.string()
}

SequenceRunCommand.aliases = ['sequence:list']

SequenceRunCommand.args = [
  { name: 'sequenceName', required: false },
]

module.exports = SequenceRunCommand
