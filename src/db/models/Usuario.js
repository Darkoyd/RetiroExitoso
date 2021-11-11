const Sequelize = require('sequelize')

class Usuario extends Sequelize.Model {
  static init (sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      cognitoId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      }
    }, {
      sequelize,
      paranoid: true,
      hooks: {},
      timestamps: true
    })
  }

  static associate (models) {
    this.hasMany(models.Pedido, {
      foreignKey: {
        allowNull: false
      }
    })
  }
}

module.exports = Usuario
