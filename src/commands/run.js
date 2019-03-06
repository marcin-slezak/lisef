const { Command, flags } = require('@oclif/command')
var fs = require('fs');
var path = require('path');
const basename = path.resolve('./');
const util = require('util')
const fileExist = util.promisify(fs.exists)
const storage = require('../services/storage')
const {getDriver} = require('../services/chromedriver')
const getConfig = require('../services/config')

class RunCommand extends Command {
  async run() {
    const { args, flags } = this.parse(RunCommand)

    const methodId = args.methodId.split('/').map(e => e)
    if (methodId.length !== 2) {
      return this.log('methodId should be like objectName/methodname')
    }

    const filePath = path.resolve(`./lisef/page_objects/${methodId[0]}.js`)
    const ctx = await getConfig(flags.config);
    console.log(ctx, flags.config)

    if (!await fileExist(filePath)) {
      return this.log(`File ${filePath} not found`)
    }

    const driver = await getDriver(storage)
    try{
      const pageObjectClass = require(filePath)
      const pageObject = new pageObjectClass(driver, ctx)
      if (!pageObject[methodId[1]]) {
        return this.log(`Method ${methodId[1]} not found in ${filePath}`);
      }
  
      this.log(`Requested function executed, result: ${await pageObject[methodId[1]]()}`) 
    }catch(e){
      this.log('Error when executed page object', e)
    }
  }
}

RunCommand.description = `Describe the command here
...
Extra documentation goes here
`

RunCommand.flags={
  config: flags.string()
}

RunCommand.args = [
  { name: 'methodId', required: true },
]
module.exports = RunCommand
