import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';
import "../Login/login.css";

import loginweb from "../../src/assets/loginweb.png"; 
import geometrydash from "../../src/assets/geometrydash.png"; 


function Usuario() { 
    
  const usuario = sessionStorage.getItem('usuario');
  return (
    <MDBContainer className="my-5">

      <MDBCard className="rounded-3">
        <MDBRow className='g-0'>

          <MDBCol md='6' className="d-none d-md-block">
            <MDBCardImage 
              src={loginweb} 
              alt="login form" 
              className='rounded-start w-100 h-100'
              style={{ objectFit: 'cover' }}
            />
          </MDBCol>

          <MDBCol md='6' sm='12' className='d-flex align-items-center'>
            <MDBCardBody className='d-flex flex-column'>

              <div className='d-flex flex-row mt-2 mb-4'>
                <img 
                  src={geometrydash}
                  alt="Logo Geometry Flash" 
                  style={{ width: '80px', height: 'auto' }} 
                  className="me-3"
                />
                <span className="h1 fw-bold mb-0">¡Bienvenido {usuario} a Geometry Flash!</span>
              </div>

              <h5 className="fw-normal mb-4 pb-3" style={{ letterSpacing: '1px' }}>
                {}
              </h5>

            </MDBCardBody>
          </MDBCol>

        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Usuario;
