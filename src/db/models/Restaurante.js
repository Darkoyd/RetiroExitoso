const Sequelize = require('sequelize')

class Restaurante extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ubicacion: {
        type: Sequelize.STRING,
        allowNull: true
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      horario: {
        type: Sequelize.STRING,
        allowNull: true
      },
      calificacion: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    }, {
      sequelize,
      paranoid: true,
      hooks: {},
    })
  }

  static associate (models) {
    this.hasMany(models.Producto, {
      foreignKey: {
        name:"id",
        allowNull: false
      },
      onDelete: 'restrict'
    })
    models.Producto.belongsTo(this)
  }
}

module.exports = Restaurante