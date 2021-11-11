//                        ______
//                      /   _    \
//    ().()   Z        /   |_|    \
//    [o__o]  |        |    __    |
//  --[    ]--|        |   |  |   |
//    I    I  |        |   |  |   | 
//









const debug = require('debug')('backend:middleware')
const cognitoService = require('../services/cognitoService')

module.exports = async function (req, res, next) {
  if (req.path.includes('/health')) return next()
  if (req.path.includes('/auth')) return next()
  if (process.env.COGNITO_ACTIVE !== 'true') return next()

  if (req.headers['x-auth-token']) {
    const token = req.headers['x-auth-token']
    const validToken = await cognitoService.validToken(token)
    if (validToken.status) {
      req.cognito = validToken.decodedJwt.payload
      return next()
    } else {
      res.status(401).send('Invalid token')
    }
  } else {
    res.status(401).send('Unauthorized')
  }
}