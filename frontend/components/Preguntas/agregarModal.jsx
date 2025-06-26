import React, { useState } from "react";
import {
  MDBModal, MDBModalDialog, MDBModalContent,
  MDBModalHeader, MDBModalTitle, MDBModalBody,
  MDBModalFooter, MDBBtn, MDBInput
} from "mdb-react-ui-kit";
import Swal from "sweetalert2";

const AgregarModal = ({ show, toggle }) => {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");

  const handleAgregar = async () => {
    if (pregunta.trim() && respuesta.trim()) { //verificar que no estén vacíos
       try {
        const response=await fetch("http://localhost:9999/Preguntas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ pregunta, respuesta })
        });
        if (!response.ok) {
          throw new Error('Error al actualizar la pregunta');
        }
        
    } catch (error) {
        console.log("error al actualizar la pregunta:", error)
        //alert("Error al actualizar la pregunta");
        // alert con Sweetalert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar la pregunta',
          confirmButtonColor: '#ff00ff'
        });
    }

      toggle();
      window.location.reload(); 
    }
  };

  return (
    <MDBModal open={show} onClose={toggle} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Nueva Pregunta</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={toggle}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <MDBInput
              label="Pregunta"
              className="mb-3"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
            />
            <MDBInput
              label="Respuesta"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
            />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={toggle}>Cancelar</MDBBtn>
            <MDBBtn color="primary" onClick={handleAgregar}>Agregar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default AgregarModal;
