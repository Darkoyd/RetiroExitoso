const Sequelize = require('sequelize')

class Pedido extends Sequelize.Model {
  static init (sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      subtotal: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      tarifa: {
        type: Sequelize.FLOAT,
        allowNull: true
      }
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      hooks: {}
    })
  }
}

module.exports = Pedido
