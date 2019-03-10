const { Command } = require('@oclif/command')
const fs = require('fs');
const path = require('path');
const basename = path.resolve('./');

class SequenceCommand extends Command {
  async run() {

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

  }
}

SequenceCommand.description = `List available sequences
...

`

module.exports = SequenceCommand
