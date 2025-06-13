const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // aquí estaba el posible error

const Usuario = sequelize.define('usuario', {
  idUsuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  USERNAME: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PASSWORD: {
    type: DataTypes.STRING,
    allowNull: false
  },
  TIPOUSUARIO: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'usuario',
  timestamps: false
});

module.exports = Usuario;
