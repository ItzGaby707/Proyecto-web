import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";

const Pregunta = ({ id, pregunta }) => {
  return (
    <tr>
      <td>{pregunta}</td>
      <td className="text-center">
        <MDBBtn color="success" className="me-2">
          <Link to={`/info?id=${id}`} className="text-white text-decoration-none">
            Ver pregunta
          </Link>
        </MDBBtn>
        <MDBBtn color="warning" className="me-2">
          <Link to={`/editar?id=${id}`} className="text-dark text-decoration-none">
            Editar pregunta
          </Link>
        </MDBBtn>
        <MDBBtn color="danger">
          <Link to={`/eliminar?id=${id}`} className="text-white text-decoration-none">
            Eliminar pregunta
          </Link>
        </MDBBtn>
      </td>
    </tr>
  );
};

export default Pregunta;
