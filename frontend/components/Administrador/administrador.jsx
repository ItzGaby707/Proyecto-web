import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBContainer,
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBAlert,
} from "mdb-react-ui-kit";

const Administrador = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9999/Ejercicios")
      .then((response) => response.json())
      .then((data) => {
        setEjercicios(data);
      })
      .catch((error) => {
        console.error(error);
        setShowAlert(true);
        setAlertText("ERROR EN LA OBTENCIÓN DE EJERCICIOS");
      });
  }, []);

  const handleCerrarSesion = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const handleEliminar = async (idEjercicio) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este ejercicio?")) {
      try {
        const response = await fetch(`http://localhost:9999/Ejercicios/${idEjercicio}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setEjercicios(ejercicios.filter((ejercicio) => ejercicio.idEjercicio !== idEjercicio));
          setShowAlert(true);
          setAlertText("Ejercicio eliminado correctamente");
        } else {
          throw new Error("Error al eliminar el ejercicio");
        }
      } catch (error) {
        console.error(error);
        setShowAlert(true);
        setAlertText("ERROR AL ELIMINAR EL EJERCICIO");
      }
    }
  }

  return (
    <MDBContainer className="mt-5">
      <MDBCard alignment="center">
        <MDBCardHeader className="text-center text-white bg-primary">
          <h5 className="fw-bold">EJERCICIOS DISPONIBLES</h5>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBBtn
          color="primary"
          className="mb-4"
          onClick={() => navigate("/proyecto/crear-ejercicio")}
        >
          <MDBIcon fas icon="plus" className="me-2" />
          Crear Nuevo Ejercicio
        </MDBBtn>
          {showAlert && (
            <MDBAlert color="danger" dismiss>
              {alertText}
            </MDBAlert>
          )}

          <MDBTable striped bordered className="bg-white text-secondary">
            <MDBTableHead>
              <tr className="text-dark bg-white">
                <th className="text-center fw-bold">Nombre del Ejercicio</th>
                <th className="text-center fw-bold">Descripción</th>
                <th className="text-center fw-bold">Acciones</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {ejercicios.map((ejercicio) => (
                <tr key={ejercicio.idEjercicio}>
                  <td className="text-center">{ejercicio.nombre}</td>
                  <td className="text-center">{ejercicio.descripcion}</td>
                  <td className="text-center">
                    <Link to={`/proyecto/ejercicio/${ejercicio.idEjercicio}`}>
                      <MDBBtn size="sm" color="info">
                        Ver Preguntas
                      </MDBBtn>
                    </Link>
                      <MDBBtn
                    color="primary"
                    className="mb-4"
                    onClick={()=>handleEliminar(ejercicio.idEjercicio)}
                  >Eliminar ejercicio</MDBBtn>


                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>

          <MDBBtn
            color="danger"
            onClick={handleCerrarSesion}
            className="mt-4 d-block mx-auto"
          >
            <MDBIcon fas icon="sign-out-alt" className="me-2" />
            CERRAR SESIÓN
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Administrador;
