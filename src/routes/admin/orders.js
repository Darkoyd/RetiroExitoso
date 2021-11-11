const debug = require('debug')('backend:routes:user')
const express = require('express')
const wrapper = require('express-debug-async-wrap')(debug)

const { Producto, Pedido, sequelize } = require(`${process.cwd()}/src/db`)

const router = express.Router()

 router.get('/', wrapper(async (req, res) => {
   const allOrders = await Pedido.findAll()
   res.status(200).send(allOrders)
}))

router.get(':/id', wrapper(async (req, res) => {
  const order = await Pedido.find({
    where: { id: req.params.id }
  })
  res.status(200).send(order)
}))

router.post('/', wrapper(async (req, res) => {
  const t = sequelize.transaction()
  try {
    let subTotal = 0
    const products = req.body.products
    const newOrder = await Pedido.create({
      tarifa: req.body.tarifa,
      usuarioId: req.body.usuarioId
    }, { transaction: t })
    products.forEach(async product => {
      const producto = await Producto.find({ where: { id: product } })
      newOrder.addProducto(producto, { transaction: t })
      subTotal += producto.getValor()
    })
    newOrder.addSubTotal(subTotal, { transaction: t })
    t.commit()
    res.status(200).send(newOrder)
  } catch (error) {
    t.rollback()
    res.status(400).send('Error de productos')
  }
}))
module.exports = router
