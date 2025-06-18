import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import Pregunta from "../Preguntas/pregunta.jsx"; 

const PreguntasDeEjercicio = () => {
  const { idEjercicio } = useParams();
  const [preguntas, setPreguntas] = useState([]);
  const [nombreEjercicio, setNombreEjercicio] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:9999/Ejercicios/${idEjercicio}/preguntas`)
      .then((res) => res.json())
      .then((data) => setPreguntas(data))
      .catch((err) => console.error("Error cargando preguntas:", err));

    fetch("http://localhost:9999/Ejercicios")
      .then((res) => res.json())
      .then((data) => {
        const ejercicio = data.find(e => e.idEjercicio.toString() === idEjercicio);
        if (ejercicio) setNombreEjercicio(ejercicio.nombre);
      });
  }, [idEjercicio]);

  return (
    <MDBContainer className="mt-5">
      <MDBCard>
        <MDBCardHeader className="text-white bg-primary text-center">
          <h5 className="fw-bold">Preguntas del Ejercicio: {nombreEjercicio}</h5>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBTable striped bordered>
            <MDBTableHead>
              <tr>
                <th>Pregunta</th>
                <th>Figura</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {preguntas.map((p) => (
                <Pregunta
                  key={p.idPregunta}
                  id={p.idPregunta}
                  pregunta={p.pregunta}
                  nombreFigura={p.nombreFigura}
                />
              ))}
            </MDBTableBody>
          </MDBTable>
          <MDBBtn color="secondary" onClick={() => navigate(-1)}>
            <MDBIcon fas icon="arrow-left" className="me-2" />
            Volver
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default PreguntasDeEjercicio;
