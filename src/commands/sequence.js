const { Command, flags } = require('@oclif/command')
var fs = require('fs');
var path = require('path');
const basename = path.resolve('./');
const storage = require('../services/storage')
const util = require('util')
const fileExist = util.promisify(fs.exists)
const {getDriver} = require('../services/chromedriver')
const _ = require('lodash')


class SequenceCommand extends Command {
  async run() {
    const { args } = this.parse(SequenceCommand)

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

        const driver = await getDriver(storage)
        const ctx = {}

        const sequenceClass = require(filePath)
        const sequence = new sequenceClass(driver, ctx)
    
        if(!sequence.getSequenceDefinition){
          return this.log(`getSequenceDefinition not found in ${filePath}`)
        }
        let lastReturnValue;
        for(let step of sequence.getSequenceDefinition()){
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

SequenceCommand.args = [
  { name: 'operation', required: false },
  { name: 'sequenceName', required: false },
]
module.exports = SequenceCommand
