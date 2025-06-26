// Importa el tipo de datos de Sequelize (por ejemplo STRING, INTEGER, etc.)
const { DataTypes } = require('sequelize');
// Importa la instancia de Sequelize configurada para conectarse a la base de datos
const sequelize = require('../sequelize'); // aquí estaba el posible error si la ruta era incorrecta
// Define el modelo "Usuario" vinculado a la tabla 'usuario' en la base de datos
const Usuario = sequelize.define('usuario', {
  // Campo ID del usuario, entero, auto incrementable, clave primaria
  idUsuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  // Campo para el nombre de usuario, tipo texto, no puede ser nulo
  USERNAME: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Campo para la contraseña, tipo texto, no puede ser nulo
  PASSWORD: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Campo que indica el tipo de usuario (por ejemplo: admin, usuario)
  TIPOUSUARIO: {
    type: DataTypes.STRING
  }
}, {
  // Indica que el modelo corresponde a la tabla llamada exactamente 'usuario'
  tableName: 'usuario',
  // Desactiva los campos automáticos createdAt y updatedAt
  timestamps: false
});
// Exporta el modelo para que pueda ser utilizado en otros archivos
module.exports = Usuario;
