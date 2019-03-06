const { Command, flags } = require('@oclif/command')
const fs = require('fs');
const path = require('path');
const basename = path.resolve('./');
const storage = require('../services/storage')
const util = require('util')
const fileExist = util.promisify(fs.exists)
const {getDriver} = require('../services/chromedriver')
const _ = require('lodash')
const getConfig = require('../services/config')

class SequenceCommand extends Command {
  async run() {
    const { args, flags } = this.parse(SequenceCommand)

    switch (args.operation) {
      case 'list':
        let sequences = []
        fs
          .readdirSync(path.resolve('./lisef/sequences/'))
          .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
          })
          .forEach(file => {
            sequences.push(path.resolve('./sequences/page_objects/', file))
          });
        console.log(sequences)
        break;
      case 'run':
        if (!args.sequenceName) {
          return this.log('Sequence name required')
        }
        const filePath = path.resolve(`./lisef/sequences/${args.sequenceName}.js`)

        if (!await fileExist(filePath)) {
          return this.log(`File ${filePath} not found`)
        }

        const ctx = await getConfig(flags.config);

        const driver = await getDriver(storage)

        const sequenceClass = require(filePath)
        const sequence = new sequenceClass(driver, ctx)
    
        if(!sequence.getSequenceDefinition){
          return this.log(`getSequenceDefinition not found in ${filePath}`)
        }
        let lastReturnValue;
        const sequenceDef = sequence.getSequenceDefinition()
        let sequenceToRun;
        if(flags.start){
          const startIndex = sequenceDef.findIndex(i => i === flags.start)
          if(startIndex < 0){
            throw new Error(`Start sequence key ${flags.start} not found in ${filePath}`)
          }
          sequenceToRun = sequenceDef.splice(startIndex)
        }else{
          sequenceToRun = sequenceDef
        }
        for(let step of sequenceToRun){
          if(! _.isFunction(sequence[step]) ){
            return this.log(`${step} is not function in ${filePath}`)
          }
          this.log(`Attempt to executed: ${step}`)
          lastReturnValue = await sequence[step](lastReturnValue)
          this.log(`Executed: ${step}`)
        }

        this.log('Sequence completed')

        break;
      default:
        this.log(SequenceCommand.description)

    }

  }
}

SequenceCommand.description = `Describe the command here
...
Extra documentation goes here
`

SequenceCommand.flags={
  config: flags.string(),
  start: flags.string()
}

SequenceCommand.args = [
  { name: 'operation', required: false },
  { name: 'sequenceName', required: false },
]
module.exports = SequenceCommand
