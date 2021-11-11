const debug = require('debug')('backend:services:cognitoService')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const AWS = require('aws-sdk')
const jwkToPem = require('jwk-to-pem')
const jwt = require('jsonwebtoken')
const axios = require('axios')

async function validToken(token) {
  debug(process.env.COGNITO_POOL_REGION)
  try {
    const result = await axios.get(
      `https://cognito-idp.${process.env.COGNITO_POOL_REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}/.well-known/jwks.json`
    );
    debug(result)
    if (result.status === 200) {
      const pems = {};
      const keys = result.data.keys;
      for (let i = 0; i < keys.length; i++) {
        pems[result.data.keys[i].kid] = jwkToPem(result.data.keys[i]);
      }
      const decodedJwt = jwt.decode(token, { complete: true });
      if (!decodedJwt) {
        debug("Not a valid JWT token");
        return { status: false };
      }
      const kid = decodedJwt.header.kid;
      const pem = pems[kid];
      if (!pem) {
        debug("Invalid token");
        return { status: false };
      }
      return jwt.verify(token, pem, function (err, payload) {
        if (err) {
          debug(err.message);
          return { status: false };
        } else {
          // debug('Valid Token.')
          return { status: true, decodedJwt };
        }
      });
    } else {
      debug("Error! Unable to download JWKs");
      return { status: false };
    }
  } catch (e) {
    debug(e);
    return { status: false };
  }
}

module.exports = {
  validToken
}