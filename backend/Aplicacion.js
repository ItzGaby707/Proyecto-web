const http = require('http');
const url = require('url');
const sequelize = require('./sequelize');
const Usuario = require('./model/Usuario');

async function inicializarBaseDeDatos() {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa a la base de datos');

    await Usuario.bulkCreate([
      { USERNAME: 'admin', PASSWORD: '1234', TIPOUSUARIO: 'administrador' },
      { USERNAME: 'usuario', PASSWORD: '123456', TIPOUSUARIO: 'usuario' }
    ]);

    console.log(' Usuarios insertados');
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
    process.exit(1);
  }
}

async function iniciarServidor() {
  http.createServer(async function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.writeHead(200, { 'Content-Type': 'application/json' });

    const q = url.parse(request.url, true).query;
    const user = q.User;
    const password = q.password;

    try {
      const usuario = await Usuario.findOne({
        where: {
          USERNAME: user,
          PASSWORD: password
        }
      });

      if (usuario) {
        response.end(JSON.stringify({
          status: "yes",
          tipo: usuario.TIPOUSUARIO,
          user: usuario.USERNAME
        }));
      } else {
        response.end(JSON.stringify({
          status: "no",
          tipo: "none",
          user: "none"
        }));
      }

    } catch (error) {
      console.error(' Error en la consulta:', error);
      response.end(JSON.stringify({
        status: "error",
        message: "Error en el servidor"
      }));
    }

  }).listen(9999, () => {
    console.log("Backend corriendo en el puerto 9999");
  });
}

// Ejecutar todo junto
(async () => {
  await inicializarBaseDeDatos();
  await iniciarServidor();
})();
