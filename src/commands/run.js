const { Command, flags } = require('@oclif/command')
var fs = require('fs');
var path = require('path');
const basename = path.resolve('./');
const util = require('util')
const fileExist = util.promisify(fs.exists)
const storage = require('../services/storage')
const {buildDriverUsingSession} = require('../services/chromedriver')



class RunCommand extends Command {
  async run() {
    const { args } = this.parse(RunCommand)

    const methodId = args.methodId.split('/').map(e => e)
    if (methodId.length !== 2) {
      return this.log('methodId should be like objectName/methodname')
    }

    const filePath = path.resolve(`./page_objects/${methodId[0]}.js`)

    if (!await fileExist(filePath)) {
      return this.log(`File ${filePath} not found`)
    }

    const driver = buildDriverUsingSession(storage.get('settings.sessionId').value())
    const pageObject = require(filePath)
    const pageObjectInstance = new pageObject(driver)
    if (!pageObjectInstance[methodId[1]]) {
      return this.log(`Method ${methodId[1]} not found in ${filePath}`);
    }

    this.log(`Requested function executed, result: ${await pageObjectInstance[methodId[1]]()}`) 



  }
}

RunCommand.description = `Describe the command here
...
Extra documentation goes here
`

RunCommand.args = [
  { name: 'methodId', required: true },

]
module.exports = RunCommand
