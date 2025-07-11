const express = require('express');
const app = express();
const sequelize = require('./sequelize');
const Usuario = require('./model/Usuario');
const cors = require('cors');

app.use(express.static('public'));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Ruta de login
app.get('/login', async (req, res) => {

  // Extrae el nombre de usuario y la contraseña desde los parámetros de la URL (query string)
  const { User: user, password } = req.query;
  try {
    // Busca en la base de datos un usuario que coincida exactamente con el nombre de usuario y contraseña proporcionados
    const usuario = await Usuario.findOne({
      where: {
        USERNAME: user,
        PASSWORD: password
      }
    });
    // Si encuentra un usuario válido
    if (usuario) {
      // Devuelve una respuesta con estado "yes" y algunos datos clave del usuario
      res.json({
        status: 'yes',                // Indica que el login fue exitoso
        idUsuario: usuario.idUsuario, // ID del usuario en la base de datos
        tipo: usuario.TIPOUSUARIO,    // Tipo de usuario (por ejemplo, administrador o normal)
        user: usuario.USERNAME        // Nombre de usuario
      });
    } else {
      // Si no se encuentra un usuario con esas credenciales, se devuelve un estado negativo
      res.json({
        status: 'no',     // Login fallido
        tipo: 'none',     // Sin tipo de usuario
        user: 'none'      // Usuario no identificado
      });
    }
  } catch (error) {
    // Si ocurre algún error durante la consulta, se captura y se muestra en consola
    console.error('Error en la consulta:', error);

    // Se devuelve un error 500 indicando un problema en el servidor
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
    console.log(' Preguntas obtenidas correctamente: ' + preguntas);//Devuelve las preguntas por separado como objeto
    preguntas.forEach(pregunta => {
      console.log(`ID: ${pregunta.idPregunta}, Pregunta: ${pregunta.pregunta}, Respuesta: ${pregunta.idFigura}`);
    }
    );
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

app.get('/Ejercicios', async (req, res) => {
  try {
    const ejercicios = await sequelize.query(`
      SELECT idEjercicio, nombre, descripcion
      FROM EJERCICIOS
      ORDER BY idEjercicio DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(ejercicios);
    console.log(' Ejercicios obtenidas correctamente: ' + ejercicios);
    ejercicios.forEach(ejercicio => {
      console.log(`ID: ${ejercicio.idEjercicio}, Nombre: ${ejercicio.nombre}, Descripción: ${ejercicio.descripcion}`);
    });

  } catch (error) {
    console.error('Error al obtener ejercicios:', error);
    res.status(500).json({ error: 'Error al obtener ejercicios' });
    
  }
});
app.get('/Ejercicios/:id/preguntas', async (req, res) => {
  const { id } = req.params;

  try {
    const preguntas = await sequelize.query(`
      SELECT p.idPregunta, p.pregunta, f.nombre AS nombreFigura
      FROM EJERCICIO_PREGUNTA ep
      JOIN PREGUNTAS p ON ep.idPregunta = p.idPregunta
      JOIN FIGURAS f ON p.idFigura = f.idFigura
      WHERE ep.idEjercicio = ?
      ORDER BY ep.orden ASC
    `, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT
    });

    res.json(preguntas);
  } catch (error) {
    console.error('Error al obtener preguntas del ejercicio:', error);
    res.status(500).json({ error: 'Error al obtener preguntas del ejercicio' });
  }
});


// Agregar un nuevo ejercicio
app.post('/Ejercicios', async (req, res) => {
  const { nombre, descripcion, creadoPor, preguntas } = req.body;
  if (!nombre || !Array.isArray(preguntas) || preguntas.length === 0) {
    return res.status(400).json({ error: 'Nombre y preguntas son requeridos' });
  }
  try {
    const [result] = await sequelize.query(
      'INSERT INTO EJERCICIOS (nombre, descripcion, creadoPor) VALUES (?, ?, ?)',
      { replacements: [nombre, descripcion || '', creadoPor], type: sequelize.QueryTypes.INSERT }
    );
    const idEjercicio = result;
    for (let i = 0; i < preguntas.length; i++) {
      await sequelize.query(
        'INSERT INTO EJERCICIO_PREGUNTA (idEjercicio, idPregunta, orden) VALUES (?, ?, ?)',
        { replacements: [idEjercicio, preguntas[i], i + 1], type: sequelize.QueryTypes.INSERT }
      );
    }
    res.status(201).json({ message: 'Ejercicio creado correctamente' });
  } catch (error) {
    console.error('Error al crear ejercicio:', error);
    res.status(500).json({ error: 'Error interno al crear ejercicio' });
  }
});

// Eliminar un ejercicio
app.delete('/Ejercicios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sequelize.query('DELETE FROM EJERCICIO_PREGUNTA WHERE idEjercicio = ?', {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE
    });
    await sequelize.query('DELETE FROM EJERCICIOS WHERE idEjercicio = ?', {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE
    });
    res.json({ message: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar ejercicio:', error);
    res.status(500).json({ error: 'Error interno al eliminar ejercicio' });
  }
});


// Obtener un ejercicio específico con sus preguntas
app.get('/Ejercicios/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Obtener información del ejercicio
    const [ejercicio] = await sequelize.query(`
      SELECT idEjercicio, nombre, descripcion, creadoPor
      FROM EJERCICIOS
      WHERE idEjercicio = ?
    `, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT
    });

    if (!ejercicio) {
      return res.status(404).json({ error: 'Ejercicio no encontrado' });
    }

    // Obtener preguntas del ejercicio
    const preguntas = await sequelize.query(`
      SELECT p.idPregunta, p.pregunta, ep.orden
      FROM EJERCICIO_PREGUNTA ep
      JOIN PREGUNTAS p ON ep.idPregunta = p.idPregunta
      WHERE ep.idEjercicio = ?
      ORDER BY ep.orden ASC
    `, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      ...ejercicio,
      preguntas: preguntas.map(p => p.idPregunta)
    });

  } catch (error) {
    console.error('Error al obtener ejercicio:', error);
    res.status(500).json({ error: 'Error al obtener ejercicio' });
  }
});

// Actualizar un ejercicio
app.put('/Ejercicios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, preguntas } = req.body;

  if (!nombre || !Array.isArray(preguntas) || preguntas.length === 0) {
    return res.status(400).json({ error: 'Nombre y preguntas son requeridos' });
  }

  try {
    // Actualizar información del ejercicio
    await sequelize.query(
      'UPDATE EJERCICIOS SET nombre = ?, descripcion = ? WHERE idEjercicio = ?',
      { 
        replacements: [nombre, descripcion || '', id], 
        type: sequelize.QueryTypes.UPDATE 
      }
    );

    // Eliminar preguntas existentes del ejercicio
    await sequelize.query(
      'DELETE FROM EJERCICIO_PREGUNTA WHERE idEjercicio = ?',
      { 
        replacements: [id], 
        type: sequelize.QueryTypes.DELETE 
      }
    );

    // Insertar las nuevas preguntas
    for (let i = 0; i < preguntas.length; i++) {
      await sequelize.query(
        'INSERT INTO EJERCICIO_PREGUNTA (idEjercicio, idPregunta, orden) VALUES (?, ?, ?)',
        { 
          replacements: [id, preguntas[i], i + 1], 
          type: sequelize.QueryTypes.INSERT 
        }
      );
    }

    res.json({ message: 'Ejercicio actualizado correctamente' });

  } catch (error) {
    console.error('Error al actualizar ejercicio:', error);
    res.status(500).json({ error: 'Error interno al actualizar ejercicio' });
  }
});



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
