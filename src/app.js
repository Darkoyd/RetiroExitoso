const blocked = require('blocked-at')
const compression = require('compression')
const axios = require('axios')
const rax = require('axios-retry')
const cors = require('cors')
const express = require('express')
const logger = require('morgan-debug')
const debug = require('debug')('BackEnd:Server')

const routeLoader = require('express-route-autoloader')

blocked((time, stack) => {
  debug(`Blocked for ${time}ms, operation called at: `, stack)
}, { threshold: 1000 })

const app = express()

app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])
app.set('x-powered-by', false)
app.use(compression())
app.use(cors({maxAge: 2592000}))
app.use(logger('BackEnd:Requests', 'START : :urmethodl', {
  immediate: true,
  skip (req, res) {
    return req.path === '/health'
  }
}))
app.use(logger('BackEnd:Requests', 'DONE :method :url :status :res[content-length] - :response-time ms', {
  skip (req, res) {
    return req.originalUrl === '/health'
  }
}))
app.get('/health', (req, res) => {
  res.sendStatus(200)
})
app.use(express.json({strict: false, type: '*/json', limit: 1024*50*1024}))

routeLoader(app)

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((req, res, next) => {
  err.status = err.status || 500
  const betterDebug = err.debug ? err.debug : debug
  delete err.debug
  if (err.status < 500 ) delete err.stack
  betterDebug(err)
  const jsonToSend = {error:err.message}
  if (err.errors) jsonToSend.errors = err.errors.map(er => er.message || er)
  res.status(err.status)
  res.json(jsonToSend)
})

rax(axios, {
  retryDelay: (retryCount) => {
    return 1000*2**retryCount
  },
  retries: 10
})

module.exports = app