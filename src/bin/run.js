require('dotenv').config(__dirname + '.env')

const app = require('../app')
const db = require('../db')
const debug = require('debug')('backend:starter')
const http = require('http')

/**
 * Get port from environment and store in Express.
 */
// eslint-disable-next-line no-undef
const port = normalizePort(process.env.PORT || '4000')
app.set('port', port)

/**
 * This is the HTTP Server
 */
const server = http.createServer(app)

/**
 * Synchronize database and listen on provided port, on all network interfaces.
 */
// eslint-disable-next-line no-undef
db.sequelize.sync({ force: process.env.RESET_TABLES === 'true' }).then(() => {
  server.on('error', onError)
  server.on('listening', onListening)
  server.on('close', onClose)
  server.listen(port)
}).catch(e => {
  debug(e)
  // eslint-disable-next-line no-undef
  process.exit(1)
})

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      // eslint-disable-next-line no-undef
      setTimeout(() => process.exit(1))
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      // eslint-disable-next-line no-undef
      setTimeout(() => process.exit(1))
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}

/**
 * Event listener for HTTP server "close" event.
 */
function onClose () {
  db.sequelize.close()
}

module.exports = server
