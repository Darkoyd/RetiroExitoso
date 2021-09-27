const Sequelize = require('sequelize')

class Test extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      atribute0: {
        type: Sequelize.STRING,
        allowNull: false
      },
      atribute1: {
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
    this.belongsTo(models.Test, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: 'restrict'
    })
  }
}

module.exports = Test