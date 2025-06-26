import React, { useState } from "react";
import { MDBBtn } from "mdb-react-ui-kit";

const Pregunta = ({id, pregunta, nombreFigura }) => {
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  
  

  return (
    <>
      <tr>
        <td>{pregunta}</td>
        <td>{nombreFigura}</td>
      </tr>

    </>
  );
};

export default Pregunta;
