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
  const usuario = sessionStorage.getItem("usuario")

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

  return (
    <MDBContainer className="mt-5">
      <MDBCard alignment="center">
        <MDBCardHeader className="text-center text-white bg-primary">
          <h5 className="fw-bold">EJERCICIOS DISPONIBLES PARA {usuario}</h5>
        </MDBCardHeader>
        <MDBCardBody>
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
