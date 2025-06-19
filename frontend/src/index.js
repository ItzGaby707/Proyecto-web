import React from "react";
import {
    Routes,
    Route,
} from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

import Login from "../components/Login/login.jsx";
import Administrador from "../components/Administrador/administrador.jsx";
import Usuario from "../components/Usuario/usuario.jsx";
import PreguntasDeEjercicio from "../components/PreguntasEjercicio/PreguntasDeEjercicio.jsx";
import CrearEjercicio from '../components/CrearEjercicio/crearEjercicio.jsx'; // Ajuste la ruta según su estructura
import Ejercicio from "../components/Ejercicio/Ejercicio.jsx"; 
const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/proyecto/administrador" element={<Administrador/>} />
                <Route path="/proyecto/usuario" element={<Usuario/>}/>
                <Route path="/proyecto/ejercicio/:idEjercicio" element={<PreguntasDeEjercicio />} />
                <Route path="/proyecto/hacerEjercicio/:idEjercicio" element={<Ejercicio />} />
                
                <Route path="/proyecto/crear-ejercicio" element={<CrearEjercicio />} />
                
                <Route path="*" element={<h1>RECURSO NO ENCONTRADO</h1>} />
            </Routes>
        </div>
    );
}

export default App;
