import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCheckbox,
  MDBIcon,
  MDBAlert
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

const CrearEjercicio = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [preguntasDisponibles, setPreguntasDisponibles] = useState([]);
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();
    const creadoPor = localStorage.getItem("idUsuario"); // Debe guardarse al iniciar sesión

  useEffect(() => {
    fetch("http://localhost:9999/Preguntas")
      .then((res) => res.json())
      .then((data) => setPreguntasDisponibles(data))
      .catch((err) => {
        console.error("Error al obtener preguntas:", err);
        setMensaje({ tipo: "danger", texto: "Error al cargar preguntas" });
      });
  }, []);

  const handleCheckboxChange = (idPregunta) => {
    if (preguntasSeleccionadas.includes(idPregunta)) {
      setPreguntasSeleccionadas(preguntasSeleccionadas.filter((id) => id !== idPregunta));
    } else {
      if (preguntasSeleccionadas.length < 5) {
        setPreguntasSeleccionadas([...preguntasSeleccionadas, idPregunta]);
      } else {
        setMensaje({ tipo: "warning", texto: "Solo puede seleccionar hasta 5 preguntas" });
      }
    }
  };

  const handleCrearEjercicio = () => {
    if (!nombre || preguntasSeleccionadas.length === 0) {
      setMensaje({ tipo: "danger", texto: "Complete todos los campos y seleccione preguntas" });
      return;
    }

    fetch("http://localhost:9999/Ejercicios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        descripcion,
        creadoPor: creadoPor,
        preguntas: preguntasSeleccionadas,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMensaje({ tipo: "success", texto: data.message });
        setTimeout(() => navigate("/proyecto/administrador"), 1500);
      })
      .catch((err) => {
        console.error("Error al crear ejercicio:", err);
        setMensaje({ tipo: "danger", texto: "Error al crear ejercicio" });
      });
  };

  return (
    <MDBContainer className="mt-5">
      <MDBCard alignment="center">
        <MDBCardHeader className="text-white bg-success">
          <h5 className="fw-bold">CREAR NUEVO EJERCICIO</h5>
        </MDBCardHeader>
        <MDBCardBody>
          {mensaje && (
            <MDBAlert color={mensaje.tipo || "info"} dismiss>
              {mensaje.texto || "Ya quedó"}
            </MDBAlert>
          )}

          <MDBInput
            label="Nombre del Ejercicio"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mb-3"
          />
          <MDBInput
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mb-4"
          />

          <h6 className="mb-3 fw-bold text-start">Seleccione hasta 5 preguntas:</h6>
          <MDBTable striped bordered>
            <MDBTableHead>
              <tr>
                <th>Seleccionar</th>
                <th>Pregunta</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {preguntasDisponibles.map((p) => (
                <tr key={p.idPregunta}>
                  <td className="text-center">
                    <MDBCheckbox
                    checked={preguntasSeleccionadas.includes(p.idPregunta)}
                    onChange={() => handleCheckboxChange(p.idPregunta)}
                    disabled={
                        !preguntasSeleccionadas.includes(p.idPregunta) &&
                        preguntasSeleccionadas.length >= 5
                    }
                    />
                  </td>
                  <td>{p.pregunta}</td>
                  <td>{p.nombreFigura}</td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>

          <MDBBtn className="mt-3" color="success" onClick={handleCrearEjercicio}>
            <MDBIcon fas icon="plus" className="me-2" />
            Crear Ejercicio
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default CrearEjercicio;
