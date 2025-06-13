import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pregunta from "../Preguntas/pregunta.jsx";

import {
  MDBContainer,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBAlert
} from "mdb-react-ui-kit";

const Administrador = () => {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

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
    <MDBContainer className="py-4">
      <h1 className="text-center mb-3">CREAR, ALTAS, BAJAS Y CAMBIOS</h1>
      <hr className="w-75 mx-auto" />

      {showAlert && (
        <MDBAlert color="danger" className="text-center">
          {alertText}
        </MDBAlert>
      )}

      <MDBBtn color="info" className="mb-3">
        <Link to="/formulario" className="text-white text-decoration-none">
          NUEVA PREGUNTA
        </Link>
      </MDBBtn>

      <MDBTable striped bordered>
        <MDBTableHead>
          <tr>
            <th>Pregunta</th>
            <th className="text-center">Acciones</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {data.map((pregunta, index) => (
            <Pregunta key={index} {...pregunta} />
          ))}
        </MDBTableBody>
      </MDBTable>
    </MDBContainer>
  );
};

export default Administrador;
