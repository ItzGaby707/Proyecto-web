import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import "./login.css";

import loginweb from "../../src/assets/loginweb.png";
import geometrydash from "../../src/assets/geometrydash.png";



function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Función que maneja el evento de inicio de sesión del formulario
    const handleLogin = async (e) => {
      // Evita que el formulario recargue la página al enviarse
      e.preventDefault();

      // Verifica si ya hay una sesión activa
      if (sessionStorage.getItem('idUsuario')) {
        alert("Ya has iniciado sesión");

        // Si el tipo de usuario en sesión es 'administrador', lo redirige a su vista
        if (sessionStorage.getItem('tipo') === "administrador") {
          navigate('/proyecto/administrador');
        }

        // Si es un usuario normal, lo redirige a su vista correspondiente
        if (sessionStorage.getItem('tipo') === "usuario") {
          navigate('/proyecto/usuario');
        }

        return; // Termina la función si ya había sesión activa
      }

      try {
        // Realiza una petición GET al backend enviando usuario y contraseña por query
        const response = await fetch(`http://localhost:9999/login?User=${username}&password=${password}`);

        // Convierte la respuesta en formato JSON
        const usuario = await response.json();

        // Si el servidor confirma que las credenciales son correctas
        if (usuario.status === "yes") {
          // Almacena los datos de sesión en sessionStorage
          sessionStorage.setItem('idUsuario', usuario.idUsuario);
          sessionStorage.setItem('usuario', usuario.user);
          sessionStorage.setItem('tipo', usuario.tipo);

          // Redirige según el tipo de usuario
          if (usuario.tipo === "administrador") {
            navigate('/proyecto/administrador');
          } else if (usuario.tipo === "usuario") {
            navigate('/proyecto/usuario');
          }

        } else {
          // Si el login falla, muestra una alerta y limpia los campos
          alert("Credenciales incorrectas o inexistentes");
          setUsername('');
          setPassword('');
        }

      } catch (error) {
        // Si ocurre un error en la conexión, lo muestra en consola y alerta al usuario
        console.error('Error en la conexión:', error);
        alert('Error en el servidor');
      }
    };


  return (
    <MDBContainer className="my-5">

      <MDBCard className="rounded-3 ">
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
                <span className="h1 fw-bold mb-0">Geometry Flash</span>

              </div>

              <h5 className="fw-normal mb-4 pb-3" style={{ letterSpacing: '1px' }}>
                Ingresa con tu cuenta
              </h5>
              <form onSubmit={handleLogin}>
                <MDBInput wrapperClass='mb-4' label='Usuario' id='formEmail' type='text' size="lg" placeholder='Usuario' required value={username} onChange={(e)=>setUsername(e.target.value)} />
                <MDBInput wrapperClass='mb-4' label='Contraseña' id='formPassword' type='password' size="lg" required value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className="custom-btn gradient-custom-2"><span>Entrar</span></button>
                
              </form>
            </MDBCardBody>
          </MDBCol>

        </MDBRow>
      </MDBCard>

    </MDBContainer>
  );
}

export default App;
