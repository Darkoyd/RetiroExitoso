const debug = require('debug')('backend:routes:user')
const express = require('express')
const wrapper = require('express-debug-async-wrap')(debug)

const { Usuario } = require(`${process.cwd()}/src/db`)

const router = express.Router()

// TODO: Implementar AWS Cognito
router.post('/', wrapper(async (req, res) => {
  const user = await Usuario.create(req.body)
  res.status(200).send(user)
}))

module.exports = router
