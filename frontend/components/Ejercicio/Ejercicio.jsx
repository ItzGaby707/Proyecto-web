import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBTypography
} from 'mdb-react-ui-kit';
import * as tmImage from '@teachablemachine/image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

function Ejercicio() {
  // Estados para manejar la lógica del ejercicio
  const [ejercicios, setEjercicios] = useState([]);
  const [numero, setNumero] = useState(0);
  const [figura, setFigura] = useState('Inicializando...');
  // Estado para manejar el temporizador y tiempos
  const [countdown, setCountdown] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  
  // Nuevos estados para rastrear tiempos por pregunta
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionTimes, setQuestionTimes] = useState([]);
  // Referencias para manejar la webcam y el modelo
  const webcamRef = useRef(null);
  const containerRef = useRef(null);
  const modelRef = useRef(null);
  const rafIdRef = useRef(null);
  const timeoutRef = useRef(null);
  // Hook de React Router para navegar entre rutas
  const navigate = useNavigate();
  const { idEjercicio } = useParams();
  const usuario = sessionStorage.getItem('usuario');
  const MODEL_URL = '/model_figuras/';

  useEffect(() => {
    const now = Date.now();
    setStartTime(now);
    setQuestionStartTime(now);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:9999/Ejercicios/${idEjercicio}/preguntas`)
      .then((res) => res.json())
      .then((data) => setEjercicios(data))
      .catch((err) => console.error(err));
  }, [idEjercicio]);

// Hook useEffect que se ejecuta una vez al montar el componente
useEffect(() => {
  let isMounted = true; // Bandera para evitar actualizar el estado si el componente ya se desmontó

  // Función asincrónica que carga el modelo de Teachable Machine y la cámara
  const loadModelAndWebcam = async () => {
    try {
      // Carga del modelo y los metadatos desde la carpeta "public/model_figuras"
      const model = await tmImage.load(
        MODEL_URL + 'model.json',
        MODEL_URL + 'metadata.json'
      );

      // Se guarda el modelo cargado en una referencia para usarlo después
      modelRef.current = model;

      // Se inicializa la cámara usando Teachable Machine
      const webcam = new tmImage.Webcam(224, 224, true); // ancho, alto, espejo activado
      await webcam.setup(); // Solicita permisos para acceder a la cámara
      await webcam.play();  // Comienza a capturar video

      // Se guarda la webcam en la referencia para mantenerla activa
      webcamRef.current = webcam;

      // Si el componente sigue montado, se añade el canvas de la cámara al DOM
      if (isMounted && containerRef.current) {
        containerRef.current.innerHTML = ''; // Limpia el contenedor
        containerRef.current.appendChild(webcam.canvas); // Agrega la vista de la cámara
      }

      // Comienza el ciclo de detección continua
      detectLoop();

    } catch (err) {
      // En caso de error, se muestra en consola y en pantalla
      console.error('Error inicializando modelo o cámara:', err);
      setFigura('Error al cargar modelo');
    }
  };

  // Función que detecta en bucle la figura frente a la cámara
  const detectLoop = async () => {
    // Si no hay modelo o webcam, no hace nada
    if (!modelRef.current || !webcamRef.current) return;

    // Actualiza el frame actual de la webcam
    webcamRef.current.update();

    // Ejecuta el modelo sobre el canvas de la webcam y obtiene predicciones
    const predictions = await modelRef.current.predict(
      webcamRef.current.canvas
    );

    // Si hay predicciones, elige la de mayor probabilidad
    if (predictions.length > 0) {
      const mejor = predictions.reduce((a, b) =>
        a.probability > b.probability ? a : b
      );
      // Actualiza el estado con la clase detectada (nombre de la figura)
      setFigura(mejor.className);
    }

    // Continúa la detección con el siguiente frame (recursivamente)
    rafIdRef.current = requestAnimationFrame(detectLoop);
  };
  // Se ejecuta la carga del modelo y cámara
  loadModelAndWebcam();

  // Función de limpieza que se ejecuta al desmontar el componente
  return () => {
    isMounted = false; // Evita que se intente actualizar estado si ya no está montado
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current); // Detiene el bucle
    if (webcamRef.current) webcamRef.current.stop(); // Apaga la cámara
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Limpia cualquier temporizador pendiente
  };
}, []); // El arreglo vacío indica que se ejecuta solo una vez al montar


  // Función para registrar tiempo de pregunta y avanzar
  const avanzarPregunta = () => {
    const now = Date.now();
    const questionTime = now - questionStartTime;
    
    // Registrar tiempo de la pregunta actual
    const newQuestionTime = {
      pregunta: numero + 1,
      nombre: ejercicios[numero]?.pregunta || `Pregunta ${numero + 1}`,
      tiempo: Math.round(questionTime / 1000), // en segundos
      tiempoMs: questionTime
    };
    
    setQuestionTimes(prev => [...prev, newQuestionTime]);
    
    const next = numero + 1;
    if (next >= ejercicios.length) {
      // Finalizado: calcular tiempo total
      setEndTime(now);
      setElapsedTime(now - startTime);
    } else {
      // Iniciar tiempo para la siguiente pregunta
      setQuestionStartTime(now);
    }
    setNumero(next);
  };

  // Avanzar con retraso y al finalizar calcular tiempo
  // Hook que se ejecuta cada vez que cambia la figura detectada, el ejercicio actual o el tiempo de la pregunta
useEffect(() => {
  // Se obtiene el nombre de la figura que se espera en la pregunta actual
  const expected = ejercicios[numero]?.nombreFigura;
  // Si existe una figura esperada y la figura detectada es igual a la esperada
  if (expected && figura === expected) {
    // Si ya había un temporizador activo, lo limpia para evitar duplicaciones
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Inicia una cuenta regresiva visual de 3 segundos antes de avanzar
    setCountdown(3);
    // Disminuye el contador en pantalla cada segundo
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval); // Detiene la cuenta atrás
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    // Después de 3 segundos, avanza automáticamente a la siguiente pregunta
    timeoutRef.current = setTimeout(() => {
      avanzarPregunta();           // Guarda el tiempo y avanza
      setCountdown(null);         // Oculta el contador
      clearInterval(countdownInterval); // Limpia intervalo
    }, 3000);
  } else {
    // Si la figura no coincide o aún no hay figura, se detiene cualquier conteo anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setCountdown(null); // Reinicia el contador
  }
  // Limpieza al desmontar o antes de ejecutar de nuevo
  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
}, [figura, ejercicios, numero, questionStartTime]);


  const handleAumentar = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setCountdown(null);
    avanzarPregunta();
  };

  // Mostrar pantalla final con tiempo y gráfica
  if (elapsedTime != null) {
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    // Preparar datos para la gráfica
    const chartData = questionTimes.map(qt => ({
      pregunta: `P${qt.pregunta}`,
      tiempo: qt.tiempo,
      nombre: qt.nombre.substring(0, 30) + (qt.nombre.length > 30 ? '...' : '')
    }));

    const tiempoPromedio = questionTimes.length > 0 
      ? Math.round(questionTimes.reduce((sum, qt) => sum + qt.tiempo, 0) / questionTimes.length)
      : 0;

    return (
      <MDBContainer className="my-5">
        <MDBRow className="justify-content-center">
          <MDBCol lg="10" md="12">
            <MDBCard className="p-4">
              <MDBTypography tag="h2" className="mb-4 text-center">
                ¡Ejercicio completado!
              </MDBTypography>
              
              {/* Resumen de tiempos */}
              <MDBRow className="mb-4">
                <MDBCol md="4" className="text-center">
                  <MDBCard className="p-3 bg-primary text-white">
                    <MDBTypography tag="h5">Tiempo Total</MDBTypography>
                    <MDBTypography tag="h3">{minutes}:{secs.toString().padStart(2, '0')}</MDBTypography>
                  </MDBCard>
                </MDBCol>
                <MDBCol md="4" className="text-center">
                  <MDBCard className="p-3 bg-success text-white">
                    <MDBTypography tag="h5">Preguntas</MDBTypography>
                    <MDBTypography tag="h3">{questionTimes.length}</MDBTypography>
                  </MDBCard>
                </MDBCol>
                <MDBCol md="4" className="text-center">
                  <MDBCard className="p-3 bg-info text-white">
                    <MDBTypography tag="h5">Promedio</MDBTypography>
                    <MDBTypography tag="h3">{tiempoPromedio}s</MDBTypography>
                  </MDBCard>
                </MDBCol>
              </MDBRow>

              {/* Gráfica de barras */}
              <MDBCard className="p-3 mb-4">
                <MDBTypography tag="h4" className="mb-3 text-center">
                  Tiempo por Pregunta
                </MDBTypography>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pregunta" />
                      <YAxis label={{ value: 'Segundos', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value, name) => [`${value}s`, 'Tiempo']}
                        labelFormatter={(label) => {
                          const item = chartData.find(d => d.pregunta === label);
                          return item ? item.nombre : label;
                        }}
                      />
                      <Bar dataKey="tiempo" fill="#1e88e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MDBCard>

              {/* Gráfica de línea */}
              <MDBCard className="p-3 mb-4">
                <MDBTypography tag="h4" className="mb-3 text-center">
                  Progreso del Tiempo
                </MDBTypography>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pregunta" />
                      <YAxis label={{ value: 'Segundos', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value, name) => [`${value}s`, 'Tiempo']}
                        labelFormatter={(label) => {
                          const item = chartData.find(d => d.pregunta === label);
                          return item ? item.nombre : label;
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="tiempo" 
                        stroke="#4caf50" 
                        strokeWidth={3}
                        dot={{ fill: '#4caf50', strokeWidth: 2, r: 6 }}
                        name="Tiempo por pregunta"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </MDBCard>

              {/* Tabla detallada */}
              <MDBCard className="p-3 mb-4">
                <MDBTypography tag="h4" className="mb-3 text-center">
                  Detalle por Pregunta
                </MDBTypography>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Pregunta</th>
                        <th>Descripción</th>
                        <th>Tiempo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questionTimes.map((qt, index) => (
                        <tr key={index}>
                          <td>#{qt.pregunta}</td>
                          <td>{qt.nombre}</td>
                          <td>
                            <span className={`badge ${qt.tiempo > tiempoPromedio ? 'bg-warning' : 'bg-success'}`}>
                              {qt.tiempo}s
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </MDBCard>

              <div className="text-center">
                <MDBBtn color="primary" onClick={() => navigate('/proyecto/usuario')}>
                  Volver al menú
                </MDBBtn>
              </div>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer className="my-5">
      <MDBRow className="justify-content-center">
        <MDBCol lg="8" md="10">
          <MDBCard className="rounded-3">
            <MDBRow className="g-0">
              <MDBCol
                md="6"
                sm="12"
                className="d-flex justify-content-center align-items-center"
              >
                <MDBCardBody className="d-flex flex-column align-items-center">
                  <span className="h1 fw-bold mb-3 text-center">
                    {usuario}
                  </span>
                  <div
                    ref={containerRef}
                    style={{ marginBottom: '1rem' }}
                  />
                  <div className="text-center" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e88e5' }}>
                    {figura}
                  </div>
                  {countdown && (
                    <div className="text-center mt-3" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>
                      ¡Correcto! Siguiente en {countdown}...
                    </div>
                  )}
                </MDBCardBody>
              </MDBCol>
              <MDBCol
                md="6"
                className="d-flex justify-content-center align-items-center"
              >
                <div className="text-center">
                  <p>Ejercicio {numero + 1} de {ejercicios.length}</p>
                  <p>{ejercicios[numero]?.pregunta}</p>
                  <MDBBtn
                    color="danger"
                    onClick={handleAumentar}
                    className="mt-4 mb-3"
                  >
                    <MDBIcon fas icon="sign-out-alt" className="me-2" />
                      Siguiente
                  </MDBBtn>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Ejercicio;