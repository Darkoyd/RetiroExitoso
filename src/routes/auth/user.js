const AmazonCognitoIdentity = require('amazon-cognito-identity-js')

const debug = require('debug')('backend:routes:user')
const express = require('express')
const wrapper = require('express-debug-async-wrap')(debug)

const { Usuario } = require(`${process.cwd()}/src/db`)

const router = express.Router()

const poolData = {
  UserPoolId: process.env.COGNITO_POOL_ID,
  ClientId: process.env.COGNITO_APP_CLIENT_ID
}

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)

router.post('/signup', wrapper(async (req, res) => {
  const attrList = []
  const dataEmail = {
    Name: 'email',
    Value: req.body.email
  }
  const dataPhoneNumber = {
    Name: 'phone_number',
    Value: req.body.phoneNumber
  }
  const dataBirthdate = {
    Name: 'birthdate',
    Value: req.body.birthdate
  }
  const dataName = {
    Name: 'name',
    Value: req.body.name
  }

  const attrEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)
  const attrName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName)
  const attrBirthdate = new AmazonCognitoIdentity.CognitoUserAttribute(dataBirthdate)
  const attrPhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber)

  attrList.push(attrEmail)
  attrList.push(attrName)
  attrList.push(attrBirthdate)
  attrList.push(attrPhoneNumber)

  userPool.signUp(req.body.email, req.body.password, attrList, null, function (err, result) {
    if (err) {
      res.status(400).send(err.message)
      return
    }
    let cognitoUser = result.user
    res.status(200).send('Usuario : ' + cognitoUser.getUsername() + ' creado')
  })
}))

router.get('/login', wrapper( async (req, res) => {
  const authData = {
    Username: req.body.email,
    Password: req.body.password
  }
  const authDetails = new AmazonCognitoIdentity.AuthenticationDetails(authData)
  const userData = {
    Username: req.body.email,
    Pool: userPool
  }
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
  cognitoUser.authenticateUser(authDetails, {
    onSuccess: function(result) {
      const accessToken = result.getAccessToken().getJwtToken()
      res.status(200).send(accessToken)
    },
    onFailure: function(err) {
      res.status(401).send(err.message)
    }
  })
}))

module.exports = router