const debug = require('debug')('backend:routes:restaurant')
const express = require('express')
const wrapper = require('express-debug-async-wrap')(debug)

const { Restaurante } = require(`${process.cwd()}/src/db`)

const router = express.Router()

router.get('/',  wrapper (async(req, res) => {
  const allRestaurants = await Restaurante.findAll()
  res.status(200).send(allRestaurants)
}))

router.post('/', wrapper (async(req, res) => {
  const newRestaurant = await Restaurante.create(req.body)
  res.status(200).send(newRestaurant)
}))

module.exports = router
