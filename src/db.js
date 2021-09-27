const debug = require('debug')('BackEnd:DB')
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const env = process.env.NODE_ENV || 'development'
const config = require('./db/config')[env]

const db = {}
const sequelize = new Sequelize(config.database, config.username, config.password, config)

fs
  .readFileSync('./src/db/models')
  .filter(file => {
    return (file.indexOf('.js')>0)
  })
  .forEach(file => {
    const modelPath = path.resolve('./src/db/models', file)
    let model = require(modelPath)
    db[model.name] = model.init(sequelize)
    debug(`Loaded ${model.name} model`)
  })

Objects.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
    debug(`Associated ${modelName}`)
  }
})

db.Sequelize = Sequelize
db.sequelize = sequelize
db._dbConfig = config

module.exports = db