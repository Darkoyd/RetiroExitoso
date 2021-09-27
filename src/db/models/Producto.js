const Sequelize = require('sequelize')

class Producto extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      valor: {
        type: Sequelize.REAL,
        allowNull: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: true
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: true
      },
      imagen: {
        type: Sequelize.STRING,
        allowNull: true
      }
    })
  }

  static associate (models) {
    this.hasOne(models.Restaurante, {
      foreignKey: {
        name:"id",
        allowNull: false
      },
      onDelete: 'restrict'
    })
    this.belongsTo(models.Producto)
  }
}

module.exports = Producto