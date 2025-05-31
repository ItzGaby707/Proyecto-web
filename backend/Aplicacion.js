let http = require('http');
let url = require('url');
let mysql = require('mysql');

const {Sequelize, DataTypes}= require('sequelize');
const Usuario = require('./model/Usuario.js');

const sequelize = new Sequelize('usuarios', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
});


http.createServer(async function (request, response) 
{
  response.setHeader('Access-Control-Allow-Origin','*');
  response.writeHead(200, {'Content-Type': 'text/html'});
  let q = url.parse(request.url, true).query;
  let user=q.User;
  console.log("user:"+user);
  let password=q.password;
  console.log("password:"+password);
  let tipousuario; 
  let respuesta;
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    const usuario=await Usuario.findOne({
      where: {
        USERNAME: user,
        PASSWORD: password
      }
    });
    if (usuario) {
      console.log('Usuario encontrado:', usuario);
      tipousuario = usuario.TIPOUSUARIO;
      username=usuario.USERNAME;
      const respuesta = { status:"yes", tipo: tipousuario, user: username};
      response.end(JSON.stringify(respuesta));
    } else {
      const respuesta = { status: "no", tipo: "none", user: "none" };
      response.end(JSON.stringify(respuesta));
    }

  } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    response.end(JSON.stringify({
      status: "error",
      message: "Error en el servidor"
    })); 
  }

}).listen(9999, () => {
  console.log("backend corriendo en el 9999");
});
