import React from "react";
import {
  MDBModal, MDBModalDialog, MDBModalContent,
  MDBModalHeader, MDBModalTitle, MDBModalBody, MDBBtn
} from "mdb-react-ui-kit";

const InfoModal = ({ show, toggle, pregunta, respuesta }) => {
  return (
    <MDBModal open={show} onClose={toggle} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Detalle de la Pregunta</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={toggle}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <p><strong>Pregunta:</strong> {pregunta}</p>
            <p><strong>Respuesta:</strong> {respuesta}</p>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default InfoModal;