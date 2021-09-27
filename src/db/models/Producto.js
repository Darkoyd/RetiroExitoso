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
    }, {
      sequelize,
      paranoid: true,
      timestamps: true,
      hooks: {}
    })
  }

  static associate (models) {
    this.belongsTo(models.Restaurante, {
      onDelete: 'restrict'
    })
  }
}

module.exports = Producto