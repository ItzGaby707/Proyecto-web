const express = require('express');
const app = express();
const sequelize = require('./sequelize');
const Usuario = require('./model/Usuario');

// Middleware para CORS y JSON
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Ruta de login
app.get('/login', async (req, res) => {
  const { User: user, password } = req.query;

  try {
    const usuario = await Usuario.findOne({
      where: { USERNAME: user, PASSWORD: password }
    });

    if (usuario) {
      res.json({
        status: 'yes',
        tipo: usuario.TIPOUSUARIO,
        user: usuario.USERNAME
      });
    } else {
      res.json({
        status: 'no',
        tipo: 'none',
        user: 'none'
      });
    }
  } catch (error) {
    console.error('❌ Error en la consulta:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error en el servidor'
    });
  }
});

// Ruta para obtener preguntas
app.get('/Preguntas', async (req, res) => {
  try {
    const preguntas = await sequelize.query('SELECT * FROM PREGUNTAS', {
      type: sequelize.QueryTypes.SELECT
    });
    res.json(preguntas);
  } catch (error) {
    console.error('❌ Error al obtener preguntas:', error);
    res.status(500).json({ error: 'Error al obtener preguntas' });
  }
});

// Verificar conexión y levantar servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión exitosa a la base de datos');
    const PORT = 9999;
    app.listen(PORT, () => {
      console.log(`🚀 Backend corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
    process.exit(1);
  });
