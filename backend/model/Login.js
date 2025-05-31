const sequelize = require('../sequelize.js');
const { DataTypes } = require('sequelize');

// MODELO DEL USUARIO
const Usuario = sequelize.define('Login', {
  idLOGIN:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true},
  USERNAME: {
    type: DataTypes.STRING
  },
  PASSWORD: {
    type: DataTypes.STRING
  },
  TIPOUSUARIO: {
    type: DataTypes.STRING
  },
}, { tableName: 'usuario' });

module.exports=Login;