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
} from "mdb-react-ui-kit";
import Swal from "sweetalert2"; // Librería para los alerts
import "./administrador.css";

const Administrador = () => {
  const [ejercicios, setEjercicios] = useState([]);
  //const [showAlert, setShowAlert] = useState(false);
  //const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();

  const usuario = sessionStorage.getItem("usuario");
  if (!usuario) {
    navigate("/");
  }

  useEffect(() => {
    fetch("http://localhost:9999/Ejercicios")
      .then((response) => response.json())
      .then((data) => {
        setEjercicios(data);
      })
      .catch((error) => {
        console.error(error);
        // alert con Sweetalert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los ejercicios',
          confirmButtonColor: '#ff00ff'
        });
      });
  }, []);

  const handleCerrarSesion = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¿Estás seguro de que quieres salir?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#D1485F',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Sesión terminada");
        sessionStorage.removeItem("idUsuario");
        sessionStorage.removeItem("usuario");
        sessionStorage.removeItem("tipo");
        navigate("/");
      }
    });
  };

const handleEliminar = async (idEjercicio) => {
    const result = await Swal.fire({
      title: '¿Eliminar ejercicio?',
      text: "¡Esta acción no se puede deshacer!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FD76D1',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      backdrop: `
        rgba(255, 0, 255, 0.1)
        left top
        no-repeat
      `
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:9999/Ejercicios/${idEjercicio}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          setEjercicios(ejercicios.filter(ej => ej.idEjercicio !== idEjercicio));
          await Swal.fire({
            title: '¡Eliminado!',
            text: 'El ejercicio ha sido eliminado',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true
          });
        } else {
          throw new Error("Error al eliminar");
        }
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el ejercicio',
          confirmButtonColor: '#ff00ff'
        });
      }
    }
  };

  return (
    <MDBContainer className="mt-3 mt-md-5 px-2 px-md-3" style={{ maxWidth: '99%' }}>
      <MDBCard alignment="center" className="mx-0">
        <MDBCardHeader className="text-center text-white bg-primary py-2 py-md-3">
          <h5 className="fw-bold mb-0" style={{ fontSize: 'clamp(0.9rem, 4vw, 1.2rem)' }}>
            EJERCICIOS DISPONIBLES
          </h5>
        </MDBCardHeader>
        <MDBCardBody>
        
        <MDBBtn
          color="primary"
          className="mb-4"
          onClick={() => navigate("/proyecto/crear-ejercicio")}
        >
        
        <MDBIcon fas icon="plus" className="me-2 mdb-icon-fix"/>
          Crear Nuevo Ejercicio
        </MDBBtn>

        <div className="table-container">
          <MDBTable striped bordered className="bg-white text-secondary responsive-table mb-1">
            <MDBTableHead>
              <tr className="text-dark bg-white">
                <th className="text-center fw-bold table-cell">Nombre del Ejercicio</th>
                <th className="text-center fw-bold table-cell">Descripción</th>
                <th className="text-center fw-bold table-cell">Acciones</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {ejercicios.map((ejercicio) => (
                <tr key={ejercicio.idEjercicio}>
                  <td className="text-center table-cell">{ejercicio.nombre}</td>
                  <td className="text-center table-cell">{ejercicio.descripcion}</td>
                  <td className="text-center table-cell">
                    <Link to={`/proyecto/ejercicio/${ejercicio.idEjercicio}`}>
                      <MDBBtn     
                        size="sm" 
                        color="info" 
                        className="btn-action btn-responsive"
                      >
                        <MDBIcon fas icon="eye" className="me-2" />
                        Ver Preguntas
                      </MDBBtn>
                    </Link>
                    
                    <MDBBtn
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none'
                      }}
                      size="sm"
                      className="btn-action btn-responsive me-1 mb-1"
                      onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                      onClick={() => navigate(`/proyecto/editar-ejercicio/${ejercicio.idEjercicio}`)}
                    >
                      <MDBIcon fas icon="edit" className="me-2 mdb-icon-fix" />
                      Editar
                    </MDBBtn>
                    
                    <MDBBtn
                      style={{
                        backgroundColor: '#FD76D1',
                        color: 'white',
                        border: 'none'
                      }}
                      className="btn-action btn-responsive"
                      onMouseOver={(e) => e.target.style.backgroundColor = '#DE5F9D'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#FD76D1'}
                      onClick={()=>handleEliminar(ejercicio.idEjercicio)}
                    >
                      <MDBIcon fas icon="trash" className="me-2 mdb-icon-fix" />
                      Eliminar
                    </MDBBtn>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </div>
        
          <MDBBtn
            color="danger"
            onClick={handleCerrarSesion}
            className="mt-2 mt-md-3 d-block mx-auto"
            size="sm"
          >
            <MDBIcon fas icon="sign-out-alt" className="me-2  " />
            CERRAR SESIÓN
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Administrador;
