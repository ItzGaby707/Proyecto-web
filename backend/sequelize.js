const { Sequelize } = require('sequelize'); 
const config = require('./config/config'); 
const sequelize = new Sequelize(config.development);

async function testConnection() {   
try { 
sequelize.query('DROP DATABASE IF EXISTS usuarios;')
.then(() => {
console.log('BASE DE DATOS BORRADA CORRECTAMENTE');
});  
sequelize.query('CREATE DATABASE usuarios;')
.then(() => {
console.log('BASE DE DATOS CREADA CORRECTAMENTE');
});
sequelize.query('use usuarios;')
.then(() => {
console.log('BASE DE DATOS SELECCIONADA CORRECTAMENTE');
});
      await sequelize.authenticate();
      console.log('CONEXION EXITOSA BD');
} catch (error) {
      console.error('CONEXION FALLIDA BASE DE DATOS', error);
   }
}
testConnection();
  
module.exports = sequelize;