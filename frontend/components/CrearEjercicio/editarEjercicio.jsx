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
  MDBSpinner
} from "mdb-react-ui-kit";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditarEjercicio = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [preguntasDisponibles, setPreguntasDisponibles] = useState([]);
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Cargar datos del ejercicio a editar
  useEffect(() => {
    const cargarEjercicio = async () => {
      try {
        const response = await fetch(`http://localhost:9999/Ejercicios/${id}`);
        if (response.ok) {
          const ejercicio = await response.json();
          setNombre(ejercicio.nombre);
          setDescripcion(ejercicio.descripcion || "");
          setPreguntasSeleccionadas(ejercicio.preguntas || []);
        } else {
          throw new Error("Ejercicio no encontrado");
        }
      } catch (error) {
        console.error("Error al cargar ejercicio:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el ejercicio',
          confirmButtonColor: '#ff00ff'
        }).then(() => {
          navigate("/proyecto/administrador");
        });
      }
    };

    cargarEjercicio();
  }, [id, navigate]);

  // Cargar preguntas disponibles
  useEffect(() => {
    fetch("http://localhost:9999/Preguntas")
      .then((res) => res.json())
      .then((data) => {
        setPreguntasDisponibles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener preguntas:", err);
        setMensaje({ tipo: "danger", texto: "Error al cargar preguntas" });
        setLoading(false);
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
          text: 'Solo puede seleccionar hasta 5 preguntas',
          confirmButtonColor: '#ff00ff'
        });
      }
    }
  };

  const handleActualizarEjercicio = async () => {
    if (!nombre || preguntasSeleccionadas.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Complete todos los campos y seleccione al menos una pregunta',
        confirmButtonColor: '#ff00ff'
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Actualizar ejercicio?',
      text: "Se guardarán los cambios realizados",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:9999/Ejercicios/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            descripcion,
            preguntas: preguntasSeleccionadas,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: data.message,
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true
          });
          navigate("/proyecto/administrador");
        } else {
          throw new Error(data.error || "Error al actualizar");
        }
      } catch (error) {
        console.error("Error al actualizar ejercicio:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el ejercicio',
          confirmButtonColor: '#ff00ff'
        });
      }
    }
  };

  const handleCancelar = () => {
    Swal.fire({
      title: '¿Cancelar edición?',
      text: "Se perderán los cambios no guardados",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Continuar editando'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/proyecto/administrador");
      }
    });
  };

  if (loading) {
    return (
      <MDBContainer className="mt-5 text-center">
        <MDBSpinner role="status">
          <span className="visually-hidden">Cargando...</span>
        </MDBSpinner>
        <p className="mt-2">Cargando ejercicio...</p>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer className="mt-5">
      <MDBCard alignment="center">
        <MDBCardHeader className="text-white bg-warning">
          <h5 className="fw-bold">EDITAR EJERCICIO</h5>
        </MDBCardHeader>
        <MDBCardBody>
          {mensaje && (
            <div className={`alert alert-${mensaje.tipo} mb-3`} role="alert">
              {mensaje.texto}
            </div>
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

          <h6 className="mb-3 fw-bold text-start">
            Seleccione hasta 5 preguntas ({preguntasSeleccionadas.length}/5):
          </h6>
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
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>

          <div className="mt-4 d-flex justify-content-between">
            <MDBBtn color="secondary" onClick={handleCancelar}>
              <MDBIcon fas icon="times" className="me-2" />
              Cancelar
            </MDBBtn>
            
            <MDBBtn color="warning" onClick={handleActualizarEjercicio}>
              <MDBIcon fas icon="save" className="me-2" />
              Actualizar Ejercicio
            </MDBBtn>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default EditarEjercicio;