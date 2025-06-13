import React, { useState } from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import InfoModal from "./infoModal.jsx";
import EditarModal from "./editarModal.jsx";
import EliminarModal from "./eliminarModal.jsx";

const Pregunta = ({ id, pregunta, respuesta }) => {
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  


  return (
    <>
      <tr>
        <td>{pregunta}</td>
        <td>{respuesta}</td>
        
        <td className="text-center">
          <MDBBtn color="success" className="me-2" onClick={() => setMostrarInfo(true)}>
            Ver
          </MDBBtn>
          <MDBBtn color="warning" className="me-2" onClick={() => setMostrarEditar(true)}>
            Editar
          </MDBBtn>
          <MDBBtn color="danger" onClick={() => setMostrarEliminar(true)}>
            Eliminar
          </MDBBtn>
        </td>
      </tr>

      <InfoModal
        show={mostrarInfo}
        toggle={() => setMostrarInfo(!mostrarInfo)}
        pregunta={pregunta}
        respuesta={respuesta}
      />

      <EditarModal
        show={mostrarEditar}
        toggle={() => setMostrarEditar(!mostrarEditar)}
        id={id}
        preguntaInicial={pregunta}
        respuestaInicial={respuesta}
      />

      <EliminarModal
        show={mostrarEliminar}
        id={id}
        toggle={() => setMostrarEliminar(!mostrarEliminar)}
        pregunta={pregunta}
      />
    </>
  );
};

export default Pregunta;
