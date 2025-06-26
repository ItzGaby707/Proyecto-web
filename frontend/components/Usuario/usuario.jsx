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
  MDBCardHeader
} from "mdb-react-ui-kit";
import "./usuario.css"; // Asegúrate de importar el CSS
import PreguntaGeometrica from "../Preguntas/preguntaGeometrica.jsx"; 

const Usuario = () => {
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
    <MDBContainer className="mt-3 mt-md-5 px-2 px-md-3" style={{ maxWidth: '95%' }}>
      <MDBCard alignment="center" className="mx-0">
        <MDBCardHeader className="text-center text-white bg-primary py-2 py-md-3">
          <h5 className="fw-bold mb-0" style={{ fontSize: 'clamp(0.9rem, 4vw, 1.2rem)' }}>
            EJERCICIOS DISPONIBLES PARA {usuario}
          </h5>
        </MDBCardHeader>
        <MDBCardBody className="p-2 p-md-3">
          {showAlert && (
              {alertText}
          )}

          <div className="table-container"> 
            <MDBTable striped bordered className="bg-white text-secondary responsive-table mb-1">
              <MDBTableHead style={{ maxWidth: '95%' }}>
                <tr className="text-dark bg-white">
                  <th className="text-center fw-bold" table-cell>Nombre del Ejercicio</th>
                  <th className="text-center fw-bold" table-cell>Descripción</th>
                  <th className="text-center fw-bold table-cell">Acción</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody style={{ maxWidth: '95%' }}>
                {ejercicios.map((ejercicio) => (
                  <tr key={ejercicio.idEjercicio}>
                    <td className="text-center table-cell">{ejercicio.nombre}</td>
                    <td className="text-center table-cell">{ejercicio.descripcion}</td>
                    <td className="text-center table-cell">
                      <Link to={`/proyecto/hacerEjercicio/${ejercicio.idEjercicio}`}>
                        <MDBBtn 
                          color="primary"
                          className="mb-4">
                          Resolver Ejercicio
                        </MDBBtn>
                        
                      </Link>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </div>
            <MDBBtn
              color="danger"
              onClick={handleCerrarSesion}
              className="mt-2 mt-md-3 d-block mx-auto" /* Margen superior reducido */
              size="sm"
            >
              <MDBIcon fas icon="sign-out-alt" className="me-1" />
              CERRAR SESIÓN
            </MDBBtn>
        
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
    
  );
};

export default Usuario;
