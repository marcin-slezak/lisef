const { Command, flags } = require('@oclif/command')
var fs = require('fs');
var path = require('path');
const basename = path.resolve('./');
const storage = require('../services/storage')



class PageCommand extends Command {
  async run() {
    const { args } = this.parse(PageCommand)

    switch (args.operation) {
      case 'list':
        let pageObjects = []
        fs
          .readdirSync(path.resolve('./lisef/page_objects/'))
          .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
          })
          .forEach(file => {
            pageObjects.push(path.resolve('./page_objects/', file))
          });
        console.log(pageObjects)
        break;

      default:
        this.log(PageCommand.description)

    }

  }
}

PageCommand.description = `Describe the command here
...
Extra documentation goes here
`

PageCommand.args = [
  { name: 'operation', required: false },

]
module.exports = PageCommand
