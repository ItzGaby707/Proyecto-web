import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pregunta from "../Preguntas/pregunta.jsx";
import AgregarModal from "../Preguntas/agregarModal.jsx";
import {
  MDBContainer,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBAlert
} from "mdb-react-ui-kit";
import "./administrador.css";


const Administrador = () => {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [showAgregar, setShowAgregar] = useState(false);

  useEffect(() => {
    fetch("http://localhost:9999/Preguntas")
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.info(error);
        setShowAlert(true);
        setAlertText("ERROR EN LA OBTENCIÓN DE DATOS");
      });
  }, []);

  return (
    <MDBContainer className="my-5 py-4 bg-white rounded">
      <h1 className="text-center mb-3 fw-bold">CREAR, ALTAS, BAJAS Y CAMBIOS</h1>
      <hr className="w-75 mx-auto" />

      {showAlert && (
        <MDBAlert color="danger" className="text-center">
          {alertText}
        </MDBAlert>
      )}

      <MDBBtn color="info" className="mb-3 d-block mx-auto" onClick={() => setShowAgregar(true)}>
        CREAR UNA NUEVA PREGUNTA
      <AgregarModal
        show={showAgregar}
        toggle={() => setShowAgregar(!showAgregar)}
         />      

        </MDBBtn>


      <MDBTable striped bordered className="bg-white text-secondary">
        <MDBTableHead>
          <tr className="text-dark bg-white">
            <th className="text-center fw-bold">Pregunta</th>
            <th className="text-center fw-bold">Respuesta</th>
            <th className="text-center fw-bold">Acciones</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {data.map((pregunta, id) => (
            <Pregunta id={id} {...pregunta} />
          ))}
        </MDBTableBody>
      </MDBTable>
    </MDBContainer>
  );
};

export default Administrador;
