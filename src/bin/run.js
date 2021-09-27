const app = require('../app')
const db = require('../db')
const debug = require('debug')('BackEnd:Starter')
const http = require('http')

function normalizePort (val) {
  const port = parseInt(val, 10)
  if (isNaN(port)) return val
  if (port >= 0) return port
  return false
}

const port = normalizePort(process.env.PORT || '4000')
app.set('port', port)

const server = http.createServer(app)

db.sequelize.sync({ force: process.env.RESET_TABLES || false }).then(() => {
  server.on('error', onError)
  server.on('listening', onListening)
  server.on('close', onClose)
  server.listen(port)
}).catch(e => {
  debug(e)
  process.exit(1)
})

function onError (err) {
  if (error.syscall !== 'listen') {
    throw err
  }
  const bind = typeof port === 'string'
  ? 'Pipe ' + port
  : 'Port ' + port

  switch (err.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privilege')
      setTimeout(() => process.exit(1))
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      setTimeout(() => process.exit(1))
      break
    default:
      throw err
  }
}

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('listening on ' + bind)
}

function onClose () {
  db.sequelize.close()
}

module.exports = server