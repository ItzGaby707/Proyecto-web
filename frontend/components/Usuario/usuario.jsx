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
import PreguntaGeometrica from "../Preguntas/preguntaGeometrica.jsx"; 

const Usuario = () => {
  // Estado para almacenar los ejercicios que se obtienen del servidor
const [ejercicios, setEjercicios] = useState([]);
// Estado para mostrar o no una alerta en caso de error
const [showAlert, setShowAlert] = useState(false);
// Texto que se mostrará en la alerta si ocurre un error
const [alertText, setAlertText] = useState("");


// Hook de React Router para navegar entre rutas
const navigate = useNavigate();
// Se obtiene el nombre de usuario almacenado en la sesión (sessionStorage)
const usuario = sessionStorage.getItem("usuario");
// Hook useEffect que se ejecuta una sola vez cuando el componente se monta
useEffect(() => {
  // Se realiza una petición GET al servidor para obtener la lista de ejercicios
  fetch("http://localhost:9999/Ejercicios")
    .then((response) => response.json()) // Se convierte la respuesta a JSON
    .then((data) => {
      setEjercicios(data); // Se guarda la lista de ejercicios en el estado
    })
    .catch((error) => {
      // En caso de error, se muestra una alerta personalizada
      console.error(error);
      setShowAlert(true);
      setAlertText("ERROR EN LA OBTENCIÓN DE EJERCICIOS");
    });
}, []); // El arreglo vacío indica que solo se ejecuta una vez (cuando se monta el componente)

// Función para cerrar sesión y redirigir al usuario a la página de inicio
const handleCerrarSesion = () => {
  localStorage.clear();   // Limpia datos persistentes
  sessionStorage.clear(); // Limpia datos de sesión actual
  navigate("/");          // Redirige a la página principal
};


  return (
    <MDBContainer className="mt-5">
      <MDBCard alignment="center">
        <MDBCardHeader className="text-center text-white bg-primary">
          <h5 className="fw-bold">EJERCICIOS DISPONIBLES PARA {usuario}</h5>
        </MDBCardHeader>
        <MDBCardBody>
          {showAlert && (
              {alertText}
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

export default Usuario;
