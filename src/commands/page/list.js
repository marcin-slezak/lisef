const { Command } = require('@oclif/command')
var fs = require('fs');
var path = require('path');
const basename = path.resolve('./');

class PageListCommand extends Command {
  async run() {

    let pageObjects = []
    fs
      .readdirSync(path.resolve('./lisef/page_objects/'))
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
      })
      .forEach(file => {
        pageObjects.push(path.resolve('./page_objects/', file))
      });
    this.log(pageObjects)

  }
}

PageListCommand.description = `List page objects`

module.exports = PageListCommand
