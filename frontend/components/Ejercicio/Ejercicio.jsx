import React from 'react';
import { useState, useEffect, useRef} from 'react';
import { useNavigate, useParams,  } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';

import loginweb from "../../src/assets/loginweb.png";
import geometrydash from "../../src/assets/geometrydash.png";
import * as tmImage from "@teachablemachine/image";



function Ejercicio() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ejercicios, setEjercicios] = useState([]);
  const [numero, setNumero] = useState(0);
  const idEjercicio=useParams().idEjercicio;
  const [respuestas, setRepuestas] = useState([]);
  const navigate = useNavigate();
  const usuario = sessionStorage.getItem("usuario");
    
  useEffect(() => {
    fetch("http://localhost:9999/Ejercicios/" + idEjercicio + "/preguntas")
      .then((response) => response.json())
      .then((data) => {
        console.log("ESTO ES DATA" +data);
        console.log("ESTO ES RESPUESTA" +data[0].respuesta);
        
        setEjercicios(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
    const webcamRef = useRef(null);
    const containerRef = useRef(null);
    const [figura, setFigura] = useState("Inicializando...");
    const modelRef = useRef(null);
    const rafIdRef = useRef(null);
    let figurap ="";
    let respuestap="";
    const MODEL_URL = "/model_figuras/";
    const handleAumentar = () => {
        setNumero(numero + 1);
    }
    ;
    useEffect(() => {
      let isMounted = true;
  
      const loadModelAndWebcam = async () => {
        try {
          const modelURL = MODEL_URL + "model.json";
          const metadataURL = MODEL_URL + "metadata.json";
  
          // Cargar modelo
          const model = await tmImage.load(modelURL, metadataURL);
          modelRef.current = model;
  
          // Inicializar webcam
          const webcam = new tmImage.Webcam(224, 224, true);
          await webcam.setup();
          await webcam.play();
          webcamRef.current = webcam;
  
          // Mostrar canvas en contenedor
          if (isMounted && containerRef.current) {
            containerRef.current.innerHTML = "";
            containerRef.current.appendChild(webcam.canvas);
          }
  
          // Iniciar loop de predicción
          
          detectLoop();
        } catch (err) {
          console.error("Error inicializando modelo o cámara:", err);
          setFigura("Error al cargar modelo");
        }
      };
      const detectarRespuesta = async (figura, respuesta) => {
          console.log("Figura actual:", figura + " | Respuesta esperada:", respuestap);
        if (figura == respuestap) {
            setNumero(numero + 1);
            
        }
    }
      const detectLoop = async () => {
        if (!modelRef.current || !webcamRef.current) return;
        webcamRef.current.update();
        
        const predictions = await modelRef.current.predict(webcamRef.current.canvas);
        
        if (predictions.length > 0) {
            const mejor = predictions.reduce((a, b) =>
                a.probability > b.probability ? a : b
        );
          //setFigura(`${mejor.className} (${(mejor.probability * 100).toFixed(1)}%)`);
          setFigura(`${mejor.className}`);
          figurap= mejor.className;
          respuestap=ejercicios[numero]?.nombreFigura
        }
        
        rafIdRef.current = requestAnimationFrame(detectLoop);
        detectarRespuesta(figurap, respuestap);
      };
  
      loadModelAndWebcam();
  
      return () => {
        isMounted = false;
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        if (webcamRef.current) webcamRef.current.stop();
      };
    }, []);
  
  
    console.log(ejercicios);
    console.log("respuesta " +ejercicios[numero]?.nombreFigura);
     


  return (
    <MDBContainer className="my-5">

      <MDBCard className="rounded-3 ">
        <MDBRow className='g-0'>
          <MDBCol md='6' sm='12' className='d-flex align-items-center'>
            <MDBCardBody className='d-flex flex-column'>
                
              <div className='d-flex flex-row mt-2 mb-4'>

                    <div style={{ textAlign: "center", padding: "1rem" }}>
                    <span className="h1 fw-bold mb-0">{usuario}</span><br/>
                    
                    <div ref={containerRef} style={{ marginBottom: "1rem" }} />
                    <div
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            color: "#1e88e5"
                        }}
                    >
                        {figura}
                    </div>
                    </div>
              </div>

            </MDBCardBody>
          </MDBCol>
        </MDBRow>
        <MDBRow className='g-0'>
            <MDBCol md='6' className="d-none d-md-block">
            <p>Ejercicio {numero}</p>
            <p>{ejercicios[numero]?.pregunta}</p>
                    <MDBBtn
                    color="danger"
                    onClick={handleAumentar}
                    className="mt-4 d-block mx-auto"
                    >
                    <MDBIcon fas icon="sign-out-alt" className="me-2" />
                    Siguiente
                    </MDBBtn>
                {console.log("figura actual", figura)};
            </MDBCol>
        </MDBRow>
      </MDBCard>

    </MDBContainer>
  );
}

export default Ejercicio;
