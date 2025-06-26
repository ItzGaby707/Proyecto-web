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
  MDBIcon
} from "mdb-react-ui-kit";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CrearEjercicio = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [preguntasDisponibles, setPreguntasDisponibles] = useState([]);
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();
  const [creadoPor, setCreadoPor] = useState("");
useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const idUsuario = sessionStorage.getItem("idUsuario");
        setCreadoPor(idUsuario);
      }
    } catch (error) {
      console.warn("SessionStorage no disponible:", error);
      Swal.fire({
        icon: 'warning',
        title: 'Problema de autenticación',
        text: 'No se pudo verificar tu sesión',
        confirmButtonColor: '#FD76D1',
        background: '#2d2d2d',
        color: 'white'
      });
    }
  }, []);
  useEffect(() => {
    fetch("http://localhost:9999/Preguntas")
      .then((res) => res.json())
      .then((data) => setPreguntasDisponibles(data))
      .catch((err) => {
        console.error("Error al obtener preguntas:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las preguntas disponibles',
          confirmButtonColor: '#FD76D1',
        });
      });
  }, []);

  const handleCheckboxChange = (idPregunta) => {
    if (preguntasSeleccionadas.includes(idPregunta)) {
      setPreguntasSeleccionadas(preguntasSeleccionadas.filter((id) => id !== idPregunta));
    } else {
      if (preguntasSeleccionadas.length < 5) {
        setPreguntasSeleccionadas([...preguntasSeleccionadas, idPregunta]);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Límite alcanzado',
          text: 'Solo puedes seleccionar hasta 5 preguntas',
          confirmButtonColor: '#FD76D1',
          color: 'white',
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  };

  const handleCrearEjercicio = () => {
    if (!nombre || preguntasSeleccionadas.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Selección requerida',
        text: 'Debes seleccionar al menos una pregunta',
        confirmButtonColor: '#FD76D1',
        background: '#2d2d2d',
        color: 'white'
      });
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
        Swal.fire({
          icon: 'success',
          title: '¡Ejercicio creado!',
          text: data.message || 'El ejercicio se ha creado correctamente',
          confirmButtonColor: '#FD76D1',
        });
        setTimeout(() => navigate("/proyecto/administrador"));
      })
      .catch((err) => {
        console.error("Error al crear ejercicio:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Ocurrió un error al crear el ejercicio',
          confirmButtonColor: '#FD76D1',
        });
      });
  };

  return (
    <MDBContainer className="mt-5">
      <MDBCard alignment="center">
        <MDBCardHeader className="text-white bg-success">
          <h5 className="fw-bold">CREAR NUEVO EJERCICIO</h5>
        </MDBCardHeader>
        <MDBCardBody>

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
