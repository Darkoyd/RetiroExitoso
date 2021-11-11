const debug = require('debug')('backend:routes:restaurant')
const express = require('express')
const wrapper = require('express-debug-async-wrap')(debug)

const { Producto } = require(`${process.cwd()}/src/db`)

const router = express.Router()

router.get(':/idRestaurante/all', wrapper(async (req, res) => {
  const products = await Producto.findAll({
    where: {
      RestauranteId: req.params.idRestaurante
    }
  })
  res.status(200).send(products)
}))

router.post(':/idRestaurante', wrapper(async (req, res) => {
  const product = req.body
  product.RestauranteId = req.params.idRestaurante
  const newProduct = await Producto.create(product)
  res.status(200).send(newProduct)
}))

router.get(':/idProducto', wrapper(async (req, res) => {
  const products = await Producto.find({
    where: {
      id: req.params.idProducto
    }
  })
  res.status(200).send(products)
}))

module.exports = router
