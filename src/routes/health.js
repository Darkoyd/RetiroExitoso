const debug = require('debug')('backend:routes:health')
const express = require('express')
const wrapper = require('express-debug-async-wrap')(debug)

const router = express.Router()

router.get('/', wrapper(async (req, res) => {
  res.status(200).send('ok')
}))



module.exports = router