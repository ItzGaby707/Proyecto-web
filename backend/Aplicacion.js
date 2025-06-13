const express = require('express');
const app = express();
const sequelize = require('./sequelize');
const Usuario = require('./model/Usuario');
const cors = require('cors');


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

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
    console.error(' Error en la consulta:', error);
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
    //console.log(' Preguntas obtenidas correctamente: ' + preguntas);Devuelve las preguntas por separado como objeto
    
  } catch (error) {
    console.error(' Error al obtener preguntas:', error);
    res.status(500).json({ error: 'Error al obtener preguntas' });
  }
});

app.put('/Preguntas/:id', async (req, res) => {
  const { id } = req.params;
  const { pregunta, respuesta } = req.body;

  try {
    await sequelize.query('UPDATE PREGUNTAS SET pregunta = ?, respuesta = ? WHERE idPregunta = ?', {
      replacements: [pregunta, respuesta, id],
      type: sequelize.QueryTypes.UPDATE
    });
    res.json({ message: 'Pregunta actualizada correctamente' });
  } catch (error) {
    console.error(' Error al actualizar pregunta:', error);
    res.status(500).json({ error: 'Error al actualizar pregunta' });
  }
});
app.delete('/Preguntas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sequelize.query('DELETE FROM PREGUNTAS WHERE idPregunta = ?', {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE
    });
    res.json({ message: 'Pregunta eliminada correctamente' });
  } catch (error) {
    console.error(' Error al eliminar pregunta:', error);
    res.status(500).json({ error: 'Error al eliminar pregunta' });
  }
});

app.post('/Preguntas', async (req, res) => {
  const { pregunta, respuesta } = req.body;

  if (!pregunta || !respuesta) {
    return res.status(400).json({ error: 'Pregunta y respuesta son requeridas' });
  }

  try {
    await sequelize.query(
      'INSERT INTO PREGUNTAS (PREGUNTA, RESPUESTA) VALUES (?, ?)',
      {
        replacements: [pregunta, respuesta],
        type: sequelize.QueryTypes.INSERT
      }
    );
    res.status(201).json({ message: 'Pregunta agregada correctamente' });
  } catch (error) {
    console.error('Error al agregar pregunta:', error);
    res.status(500).json({ error: 'Error interno al agregar pregunta' });
  }
});

// Verificar conexión y levantar servidor
sequelize.authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
    const PORT = 9999;
    app.listen(PORT, () => {
      console.log(`Backend corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
    process.exit(1);
  });
