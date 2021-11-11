const debug = require('debug')('Backend:DB')
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const config = require('./db/config')

const db = {}
const sequelize = new Sequelize(config.database, config.username, config.password, config)

fs
  .readdirSync('./src/db/models')
  .filter(file => {
    return (file.indexOf('.js') > 0)
  })
  .forEach(file => {
    const modelPath = path.resolve('./src/db/models', file)
    const model = require(modelPath)
    db[model.name] = model.init(sequelize)
    debug(`Loaded ${model.name} model`)
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
    debug(`Associated ${modelName}`)
  }
})

db.Sequelize = Sequelize
db.sequelize = sequelize
db._dbConfig = config

module.exports = db
