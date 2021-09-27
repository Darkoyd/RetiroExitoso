const debug = require('debug')('backend:routes:health')
const express = require('express')
const wrapper = require('express-debug-async-wrap')(debug)

const { Test } = require(`${process.cwd()}/src/db`)

const router = express.Router()

router.get('/', wrapper(async (req, res) => {
	const test = await Test.create({
    atribute0: 'String1',
    atribute1: 1
  })
  res.status(200).send(test)
}))



module.exports = router