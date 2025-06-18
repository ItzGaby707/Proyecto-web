import React from "react";
import {
  MDBModal, MDBModalDialog, MDBModalContent,
  MDBModalHeader, MDBModalTitle, MDBModalBody,
  MDBModalFooter, MDBBtn
} from "mdb-react-ui-kit";

const EliminarModal = ({ show, toggle,id, pregunta }) => {
  
  const handleEliminar = async() => {
    try {
        const response = await fetch(`http://localhost:9999/Preguntas/${id}`, { //Se inicio el id en 0, por lo que se le suma 1 jeje
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        });
        if (!response.ok) {
          throw new Error('Error al actualizar la pregunta');
        }
        
    } catch (error) {
        console.log("error al actualizar la pregunta:", error)
        alert("Error al actualizar la pregunta");
        
    }
    toggle();
    window.location.reload(); 

  };

  return (
    <MDBModal open={show} onClose={toggle} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Confirmar Eliminación</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={toggle}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            ¿Está seguro que desea eliminar la pregunta: <strong>{pregunta}</strong>?
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={toggle}>Cancelar</MDBBtn>
            <MDBBtn color="danger" onClick={()=>handleEliminar(id)}>Eliminar</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default EliminarModal;