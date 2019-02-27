const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('.lisef.tmp.json')
const db = low(adapter)

db.defaults({settings: {}})
  .write()

module.exports = db